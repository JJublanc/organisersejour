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
      await initializeClerk(publishableKey);
      clerkLoaded = true;
      
      // Update user store with current user
      currentUser = getUserFromClerk();
      userStore.set(currentUser);
      
      console.log('Clerk initialized successfully', currentUser);
    } catch (error) {
      console.error('Failed to initialize Clerk:', error);
      clerkError = 'Failed to initialize authentication';
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
  </div>
{:else if !clerkLoaded}
  <div class="clerk-loading">
    <p>Chargement de l'authentification...</p>
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

  .clerk-loading {
    background-color: #f0f8ff;
    border: 1px solid #cce;
    color: #336;
    padding: 1rem;
    border-radius: 4px;
    margin: 1rem 0;
  }
</style>