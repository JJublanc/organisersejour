<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { getClerk } from '$lib/clerk-auth';

  let signInElement;
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      // Utiliser l'instance Clerk déjà initialisée dans le layout
      const clerk = getClerk();
      
      if (!clerk) {
        throw new Error('Clerk n\'est pas initialisé. Veuillez recharger la page.');
      }

      // Attendre que Clerk soit complètement chargé
      await clerk.load();

      if (signInElement) {
        // Monter le composant de connexion Clerk avec la bonne méthode
        const signInComponent = clerk.mountSignIn(signInElement, {
          afterSignInUrl: '/',
          redirectUrl: '/',
          appearance: {
            elements: {
              rootBox: 'w-full',
              card: 'shadow-none border-0'
            }
          }
        });
        
        console.log('Composant de connexion monté:', signInComponent);
      }
      
      loading = false;
    } catch (err) {
      console.error('Erreur lors du montage du composant de connexion:', err);
      error = err.message;
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Connexion - Organisateur de Séjour</title>
</svelte:head>

<div class="sign-in-container">
  <div class="sign-in-header">
    <h1>Connexion</h1>
    <p>Connectez-vous à votre compte Organisateur de Séjour</p>
  </div>

  {#if loading}
    <div class="loading">
      <p>Chargement...</p>
    </div>
  {:else if error}
    <div class="error">
      <p>Erreur: {error}</p>
      <button on:click={() => window.location.reload()}>Réessayer</button>
    </div>
  {:else}
    <div class="sign-in-form" bind:this={signInElement}>
      <!-- Le composant Clerk sera monté ici -->
    </div>
  {/if}

  <div class="sign-in-footer">
    <p>Pas encore de compte ? <a href="/sign-up">Créer un compte</a></p>
    <p><a href="/">Retour à l'accueil</a></p>
  </div>
</div>

<style>
  .sign-in-container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .sign-in-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .sign-in-header h1 {
    color: #333;
    margin-bottom: 0.5rem;
  }

  .sign-in-header p {
    color: #666;
    font-size: 0.9rem;
  }

  .loading, .error {
    text-align: center;
    padding: 2rem;
  }

  .error {
    color: #d32f2f;
  }

  .error button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    background: #1976d2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .error button:hover {
    background: #1565c0;
  }

  .sign-in-form {
    margin: 2rem 0;
  }

  .sign-in-footer {
    text-align: center;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
  }

  .sign-in-footer p {
    margin: 0.5rem 0;
    font-size: 0.9rem;
  }

  .sign-in-footer a {
    color: #1976d2;
    text-decoration: none;
  }

  .sign-in-footer a:hover {
    text-decoration: underline;
  }
</style>