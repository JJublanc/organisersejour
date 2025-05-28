<script lang="ts">
  import { onMount } from 'svelte';
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
  let isInitializing = false;

  onMount(async () => {
    if (!publishableKey) {
      clerkError = 'Clerk publishable key is required';
      return;
    }

    if (isInitializing) {
      return; // Prevent multiple initializations
    }

    isInitializing = true;

    try {
      // Initialize Clerk with a timeout to avoid hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Clerk initialization timeout')), 10000)
      );
      
      await Promise.race([
        initializeClerk(publishableKey),
        timeoutPromise
      ]);
      
      clerkLoaded = true;
      
      // Update user store with current user
      currentUser = getUserFromClerk();
      userStore.set(currentUser);
      
      console.log('Clerk initialized successfully', currentUser);
    } catch (error) {
      console.error('Failed to initialize Clerk:', error);
      clerkError = 'Failed to initialize authentication';
      // Don't block the UI completely on auth failure
      clerkLoaded = true;
    } finally {
      isInitializing = false;
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
    <p>Authentication Error: {clerkError}</p>
    <!-- Still render content even with auth error -->
    <slot user={null} />
  </div>
{:else if !clerkLoaded}
  <!-- Show a minimal loading state that doesn't block the UI -->
  <div class="clerk-loading-minimal">
    <slot user={null} />
    <div class="loading-indicator">
      <span>Chargement de l'authentification...</span>
    </div>
  </div>
{:else if requireAuth && !isAuthenticated}
  <div class="auth-required">
    <h2>Authentification requise</h2>
    <p>Vous devez vous connecter pour accéder à cette page.</p>
  </div>
{:else}
  <slot user={currentUser} />
{/if}

<style>
  .clerk-error {
    background-color: #fee;
    border: 1px solid #fcc;
    color: #c33;
    padding: 1rem;
    border-radius: 4px;
    margin: 1rem 0;
  }

  .clerk-loading-minimal {
    position: relative;
  }

  .loading-indicator {
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #f0f8ff;
    border: 1px solid #cce;
    color: #336;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-size: 0.875rem;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  }

  .auth-required {
    text-align: center;
    padding: 2rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    margin: 2rem 0;
  }
</style>