<script lang="ts">
  import { redirectToSignIn, redirectToSignUp, openSignIn, openSignUp, signOut, getClerk, type User } from '$lib/clerk-auth';

  export let user: User | null = null;

  let isLoading = false;

  async function handleSignOut() {
    if (isLoading) return;
    
    isLoading = true;
    try {
      console.log('🔐 Signing out...');
      await signOut();
      // Reload the page to update the user state
      window.location.reload();
    } catch (error) {
      console.error('❌ Error signing out:', error);
      alert('Erreur lors de la déconnexion. Veuillez réessayer.');
    } finally {
      isLoading = false;
    }
  }

  function handleSignIn() {
    if (isLoading) return;
    
    console.log('🔐 Sign in button clicked');
    isLoading = true;
    
    try {
      const clerk = getClerk();
      if (clerk && clerk.loaded) {
        // Préférer le modal si Clerk est chargé
        openSignIn();
      } else {
        // Fallback vers la redirection
        redirectToSignIn();
      }
    } catch (error) {
      console.error('❌ Error opening sign in:', error);
      // Fallback final
      window.location.href = '/sign-in';
    } finally {
      // Reset loading after a delay to prevent rapid clicks
      setTimeout(() => {
        isLoading = false;
      }, 1000);
    }
  }

  function handleSignUp() {
    if (isLoading) return;
    
    console.log('🔐 Sign up button clicked');
    isLoading = true;
    
    try {
      const clerk = getClerk();
      if (clerk && clerk.loaded) {
        // Préférer le modal si Clerk est chargé
        openSignUp();
      } else {
        // Fallback vers la redirection
        redirectToSignUp();
      }
    } catch (error) {
      console.error('❌ Error opening sign up:', error);
      // Fallback final
      window.location.href = '/sign-up';
    } finally {
      // Reset loading after a delay to prevent rapid clicks
      setTimeout(() => {
        isLoading = false;
      }, 1000);
    }
  }
</script>

<div class="clerk-auth">
  {#if user && user.authenticated}
    <div class="user-info">
      <span class="user-name">Bonjour, {user.name}</span>
      <span class="user-email">({user.email})</span>
      <button
        class="sign-out-btn"
        class:loading={isLoading}
        disabled={isLoading}
        on:click={handleSignOut}
      >
        {#if isLoading}
          <span class="spinner"></span>
          Déconnexion...
        {:else}
          Se déconnecter
        {/if}
      </button>
    </div>
  {:else}
    <div class="auth-buttons">
      <button
        class="sign-in-btn"
        class:loading={isLoading}
        disabled={isLoading}
        on:click={handleSignIn}
      >
        {#if isLoading}
          <span class="spinner"></span>
          Connexion...
        {:else}
          Se connecter
        {/if}
      </button>
      <button
        class="sign-up-btn"
        class:loading={isLoading}
        disabled={isLoading}
        on:click={handleSignUp}
      >
        {#if isLoading}
          <span class="spinner"></span>
          Inscription...
        {:else}
          S'inscrire
        {/if}
      </button>
    </div>
  {/if}
</div>

<style>
  .clerk-auth {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .user-name {
    font-weight: 600;
    color: #333;
  }

  .user-email {
    color: #666;
    font-size: 0.9em;
  }

  .auth-buttons {
    display: flex;
    gap: 0.5rem;
  }

  button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
  }

  .sign-in-btn {
    background-color: #007bff;
    color: white;
  }

  .sign-in-btn:hover {
    background-color: #0056b3;
  }

  .sign-up-btn {
    background-color: #28a745;
    color: white;
  }

  .sign-up-btn:hover {
    background-color: #1e7e34;
  }

  .sign-out-btn {
    background-color: #dc3545;
    color: white;
  }

  .sign-out-btn:hover {
    background-color: #c82333;
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  button.loading {
    position: relative;
  }

  .spinner {
    display: inline-block;
    width: 12px;
    height: 12px;
    border: 2px solid transparent;
    border-top: 2px solid currentColor;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-right: 0.5rem;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>