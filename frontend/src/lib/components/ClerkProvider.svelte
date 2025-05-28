<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { initializeClerk, getUserFromClerk, type User } from '$lib/clerk-auth';
  import { writable } from 'svelte/store';

  export let publishableKey: string;
  export let user: User | null = null;
  export let requireAuth: boolean = false;

  // Create a reactive store for the user
  export const userStore = writable<User | null>(user);

  let clerkLoaded = false;
  let clerkError: string | null = null;
  let currentUser: User | null = null;
  let loadingProgress = 0;
  let loadingMessage = 'Initialisation...';

  // Optimized loading with progress
  onMount(async () => {
    if (!publishableKey) {
      clerkError = 'Clerk publishable key is required';
      return;
    }

    try {
      // Show immediate feedback
      loadingMessage = 'Chargement de l\'authentification...';
      loadingProgress = 20;
      await tick();

      // Start Clerk initialization with timeout
      const initPromise = initializeClerk(publishableKey);
      
      // Update progress during loading
      const progressInterval = setInterval(() => {
        if (loadingProgress < 80) {
          loadingProgress += 10;
          if (loadingProgress === 40) loadingMessage = 'Connexion au service...';
          if (loadingProgress === 60) loadingMessage = 'Vérification...';
        }
      }, 200);

      // Wait for initialization with timeout
      await Promise.race([
        initPromise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Timeout: Clerk took too long to load')), 8000)
        )
      ]);

      clearInterval(progressInterval);
      loadingProgress = 100;
      loadingMessage = 'Prêt !';
      
      // Small delay to show completion
      await new Promise(resolve => setTimeout(resolve, 300));
      
      clerkLoaded = true;
      
      // Update user store with current user
      currentUser = getUserFromClerk();
      userStore.set(currentUser);
      
      console.log('✅ Clerk initialized successfully', currentUser);
    } catch (error) {
      console.error('❌ Failed to initialize Clerk:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to initialize authentication';
      clerkError = errorMessage;
      
      // Fallback: continue without auth after timeout
      if (errorMessage.includes('timeout') || errorMessage.includes('Timeout')) {
        console.warn('⚠️ Clerk timeout - continuing without authentication');
        setTimeout(() => {
          clerkLoaded = true;
          clerkError = null;
        }, 1000);
      }
    }
  });

  // Update user prop when store changes
  userStore.subscribe(value => {
    currentUser = value;
    user = value;
  });

  $: isAuthenticated = currentUser && currentUser.authenticated;
</script>

{#if clerkError}
  <div class="clerk-error">
    <p>⚠️ Problème d'authentification: {clerkError}</p>
    <button on:click={() => window.location.reload()}>Réessayer</button>
  </div>
{:else if !clerkLoaded}
  <div class="clerk-loading">
    <div class="loading-container">
      <div class="loading-bar">
        <div class="loading-progress" style="width: {loadingProgress}%"></div>
      </div>
      <p class="loading-text">{loadingMessage}</p>
      <div class="loading-spinner"></div>
    </div>
  </div>
{:else if requireAuth && !isAuthenticated}
  <div class="auth-required">
    <h2>🔐 Authentification requise</h2>
    <p>Vous devez vous connecter pour accéder à cette page.</p>
    <div class="auth-actions">
      <button class="auth-btn primary" on:click={() => window.location.href = '/sign-in'}>
        Se connecter
      </button>
      <button class="auth-btn secondary" on:click={() => window.location.href = '/sign-up'}>
        Créer un compte
      </button>
    </div>
  </div>
{:else}
  <slot user={currentUser} />
{/if}

<style>
  .clerk-loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
    padding: 2rem;
  }

  .loading-container {
    text-align: center;
    max-width: 300px;
    width: 100%;
  }

  .loading-bar {
    width: 100%;
    height: 4px;
    background-color: #e5e7eb;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 1rem;
  }

  .loading-progress {
    height: 100%;
    background: linear-gradient(90deg, #3b82f6, #1d4ed8);
    border-radius: 2px;
    transition: width 0.3s ease;
  }

  .loading-text {
    color: #6b7280;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  .loading-spinner {
    width: 24px;
    height: 24px;
    border: 2px solid #e5e7eb;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .clerk-error {
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    padding: 1rem;
    margin: 1rem;
    text-align: center;
  }

  .clerk-error p {
    color: #dc2626;
    margin-bottom: 1rem;
  }

  .clerk-error button {
    background-color: #dc2626;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }

  .auth-required {
    text-align: center;
    padding: 3rem 2rem;
    background-color: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    margin: 2rem auto;
    max-width: 500px;
  }

  .auth-required h2 {
    color: #1e293b;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  .auth-required p {
    color: #64748b;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .auth-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .auth-btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .auth-btn.primary {
    background-color: #3b82f6;
    color: white;
  }

  .auth-btn.primary:hover {
    background-color: #2563eb;
  }

  .auth-btn.secondary {
    background-color: white;
    color: #3b82f6;
    border: 1px solid #3b82f6;
  }

  .auth-btn.secondary:hover {
    background-color: #eff6ff;
  }
</style>
