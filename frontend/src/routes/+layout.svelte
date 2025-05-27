<script lang="ts">
  import ClerkProvider from '$lib/components/ClerkProvider.svelte';
  import ClerkAuth from '$lib/components/ClerkAuth.svelte';

  export let data: any;

  $: ({ user, authEnabled, clerkPublishableKey } = data);
</script>

<svelte:head>
  <title>Organisateur de Séjour</title>
  <meta name="description" content="Application pour organiser vos séjours et repas" />
</svelte:head>

<div class="app">
  {#if authEnabled && clerkPublishableKey}
    <!-- Mode Clerk activé -->
    <ClerkProvider publishableKey={clerkPublishableKey} {user} let:user={currentUser}>
      <header class="app-header">
        <div class="header-content">
          <h1><a href="/">Organisateur de Séjour</a></h1>
          <nav class="main-nav">
            <a href="/trips">Séjours</a>
            <a href="/recipes">Recettes</a>
            <a href="/ingredients">Ingrédients</a>
          </nav>
          <ClerkAuth user={currentUser} />
        </div>
      </header>

      <main class="app-main">
        <slot />
      </main>
    </ClerkProvider>
  {:else}
    <!-- Mode sans authentification -->
    <header class="app-header">
      <div class="header-content">
        <h1><a href="/">Organisateur de Séjour</a></h1>
        <nav class="main-nav">
          <a href="/trips">Séjours</a>
          <a href="/recipes">Recettes</a>
          <a href="/ingredients">Ingrédients</a>
        </nav>
        <div class="user-info">
          <span>Mode développement</span>
        </div>
      </div>
    </header>

    <main class="app-main">
      <slot />
    </main>
  {/if}
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #f8f9fa;
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .app-header {
    background-color: #fff;
    border-bottom: 1px solid #e9ecef;
    padding: 1rem 0;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  h1 {
    margin: 0;
    font-size: 1.5rem;
  }

  h1 a {
    color: #333;
    text-decoration: none;
  }

  h1 a:hover {
    color: #007bff;
  }

  .main-nav {
    display: flex;
    gap: 2rem;
  }

  .main-nav a {
    color: #666;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
  }

  .main-nav a:hover {
    color: #007bff;
  }

  .app-main {
    flex: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
    width: 100%;
    box-sizing: border-box;
  }

  .user-info {
    color: #666;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
      gap: 1rem;
    }

    .main-nav {
      gap: 1rem;
    }

    .app-main {
      padding: 1rem;
    }
  }
</style>