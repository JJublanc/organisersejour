<script lang="ts">
  import ClerkProvider from './ClerkProvider.svelte';
  import type { User } from '$lib/clerk-auth';

  export let clerkPublishableKey: string | null;
  export let authEnabled: boolean;
  export let user: User | null = null;
</script>

{#if authEnabled && clerkPublishableKey}
  <ClerkProvider publishableKey={clerkPublishableKey} {user} requireAuth={true} let:user={currentUser}>
    <slot {user} />
  </ClerkProvider>
{:else}
  <!-- Mode développement sans authentification -->
  <slot {user} />
{/if}

<style>
  :global(.auth-required) {
    text-align: center;
    padding: 2rem;
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    margin: 2rem auto;
    max-width: 500px;
  }

  :global(.auth-required h2) {
    color: #495057;
    margin-bottom: 1rem;
  }

  :global(.auth-required p) {
    color: #6c757d;
    margin-bottom: 0;
  }
</style>