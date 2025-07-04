<script lang="ts">
  import { redirectToSignIn, redirectToSignUp, signOut, type User } from '$lib/clerk-auth';

  export let user: User | null = null;

  async function handleSignOut() {
    try {
      await signOut();
      // Reload the page to update the user state
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  function handleSignIn() {
    redirectToSignIn();
  }

  function handleSignUp() {
    redirectToSignUp();
  }
</script>

<div class="clerk-auth">
  {#if user && user.authenticated}
    <div class="user-info">
      <span class="user-name">Bonjour, {user.name}</span>
      <span class="user-email">({user.email})</span>
      <button class="sign-out-btn" on:click={handleSignOut}>
        Se déconnecter
      </button>
    </div>
  {:else}
    <div class="auth-buttons">
      <button class="sign-in-btn" on:click={handleSignIn}>
        Se connecter
      </button>
      <button class="sign-up-btn" on:click={handleSignUp}>
        S'inscrire
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
</style>