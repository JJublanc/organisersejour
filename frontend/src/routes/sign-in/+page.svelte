<script lang="ts">
  import { onMount } from 'svelte';
  import { getClerk } from '$lib/clerk-auth';

  let clerkContainer: HTMLDivElement;
  let clerkLoaded = false;
  let error: string | null = null;

  onMount(async () => {
    try {
      // Attendre que Clerk soit disponible
      const clerk = getClerk();
      if (clerk) {
        // Monter le composant de connexion Clerk
        clerk.mountSignIn(clerkContainer);
        clerkLoaded = true;
      } else {
        // Fallback si Clerk n'est pas disponible
        error = 'Service d\'authentification non disponible';
      }
    } catch (err) {
      console.error('Error mounting Clerk sign-in:', err);
      error = 'Erreur lors du chargement de la connexion';
    }
  });
</script>

<svelte:head>
  <title>Connexion - Organisateur de Séjour</title>
</svelte:head>

<div class="sign-in-page">
  <div class="sign-in-container">
    <h1>Connexion</h1>
    
    {#if error}
      <div class="error-message">
        <p>{error}</p>
        <div class="fallback-actions">
          <button on:click={() => window.location.href = '/'}>
            Retour à l'accueil
          </button>
          <button on:click={() => window.location.reload()}>
            Réessayer
          </button>
        </div>
      </div>
    {:else if !clerkLoaded}
      <div class="loading">
        <div class="spinner"></div>
        <p>Chargement de la connexion...</p>
      </div>
    {/if}
    
    <!-- Container pour le composant Clerk -->
    <div bind:this={clerkContainer} class="clerk-container"></div>
    
    <div class="navigation-links">
      <a href="/">← Retour à l'accueil</a>
      <a href="/sign-up">Pas de compte ? S'inscrire</a>
    </div>
  </div>
</div>

<style>
  .sign-in-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f8fafc;
    padding: 2rem;
  }

  .sign-in-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    width: 100%;
    max-width: 400px;
    text-align: center;
  }

  h1 {
    color: #1e293b;
    margin-bottom: 2rem;
    font-size: 1.8rem;
  }

  .loading {
    padding: 2rem;
    color: #64748b;
  }

  .spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #e2e8f0;
    border-top: 3px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-message {
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    color: #dc2626;
  }

  .fallback-actions {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 1rem;
  }

  .fallback-actions button {
    padding: 0.5rem 1rem;
    border: 1px solid #dc2626;
    background: white;
    color: #dc2626;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .fallback-actions button:hover {
    background-color: #dc2626;
    color: white;
  }

  .clerk-container {
    margin: 1rem 0;
  }

  .navigation-links {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .navigation-links a {
    color: #3b82f6;
    text-decoration: none;
    font-size: 0.9rem;
  }

  .navigation-links a:hover {
    text-decoration: underline;
  }
</style>