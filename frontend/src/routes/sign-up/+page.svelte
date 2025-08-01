<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let signUpElement;
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      // Attendre que Clerk soit disponible globalement
      let attempts = 0;
      const maxAttempts = 50; // 5 secondes max
      
      while (!window.Clerk && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if (!window.Clerk) {
        throw new Error('Clerk n\'est pas disponible. Veuillez recharger la page.');
      }

      const clerk = window.Clerk;
      
      // Attendre que Clerk soit complètement chargé
      if (!clerk.loaded) {
        await clerk.load();
      }

      if (signUpElement) {
        // Monter le composant d'inscription Clerk
        clerk.mountSignUp(signUpElement, {
          afterSignUpUrl: '/',
          redirectUrl: '/',
          appearance: {
            elements: {
              rootBox: 'w-full',
              card: 'shadow-none border-0'
            }
          }
        });
        
        console.log('Composant d\'inscription monté avec succès');
      }
      
      loading = false;
    } catch (err) {
      console.error('Erreur lors du montage du composant d\'inscription:', err);
      error = err.message || 'Erreur inconnue';
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Inscription - Organisateur de Séjour</title>
</svelte:head>

<div class="sign-up-container">
  <div class="sign-up-header">
    <h1>Inscription</h1>
    <p>Créez votre compte Organisateur de Séjour</p>
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
    <div class="sign-up-form" bind:this={signUpElement}>
      <!-- Le composant Clerk sera monté ici -->
    </div>
  {/if}

  <div class="sign-up-footer">
    <p>Déjà un compte ? <a href="/sign-in">Se connecter</a></p>
    <p><a href="/">Retour à l'accueil</a></p>
  </div>
</div>

<style>
  .sign-up-container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .sign-up-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .sign-up-header h1 {
    color: #333;
    margin-bottom: 0.5rem;
  }

  .sign-up-header p {
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

  .sign-up-form {
    margin: 2rem 0;
  }

  .sign-up-footer {
    text-align: center;
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
  }

  .sign-up-footer p {
    margin: 0.5rem 0;
    font-size: 0.9rem;
  }

  .sign-up-footer a {
    color: #1976d2;
    text-decoration: none;
  }

  .sign-up-footer a:hover {
    text-decoration: underline;
  }
</style>