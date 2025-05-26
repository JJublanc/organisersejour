<script lang="ts">
  import { onMount } from 'svelte';
  import { initializeClerk, getUserFromClerk, type User } from '$lib/clerk-auth';
  import { writable } from 'svelte/store';

  export let publishableKey: string;
  export let user: User | null = null;

  // Create a reactive store for the user
  export const userStore = writable<User | null>(user);

  let clerkLoaded = false;
  let clerkError: string | null = null;

  onMount(async () => {
    if (!publishableKey) {
      clerkError = 'Clerk publishable key is required';
      return;
    }

    try {
      await initializeClerk(publishableKey);
      clerkLoaded = true;
      
      // Update user store with current user
      const currentUser = getUserFromClerk();
      userStore.set(currentUser);
      
      console.log('Clerk initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Clerk:', error);
      clerkError = 'Failed to initialize authentication';
    }
  });

  // Update user prop when store changes
  userStore.subscribe(value => {
    user = value;
  });
</script>

{#if clerkError}
  <div class="clerk-error">
    <p>Authentication Error: {clerkError}</p>
  </div>
{:else if !clerkLoaded}
  <div class="clerk-loading">
    <p>Loading authentication...</p>
  </div>
{:else}
  <slot {user} />
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