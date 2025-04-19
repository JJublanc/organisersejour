<script lang="ts">
  import type { LayoutData } from './$types';

  export let data: LayoutData;
  const { user, authEnabled } = data;
</script>

<header>
  <nav>
    <a href="/">Home</a>
    {#if user}
      <a href="/protected">Protected Page</a>
    {/if}
  </nav>
  
  <div class="auth-status">
    {#if user}
      <span>Logged in as: {user.name} ({user.email})</span>
      {#if authEnabled}
        <!-- Cloudflare Access handles logout via a specific path -->
        <a href="/cdn-cgi/access/logout">Logout</a>
      {/if}
    {:else if authEnabled}
      <span>Please log in to access protected content.</span>
      <!-- Cloudflare Access handles login automatically -->
    {:else}
      <span>Authentication is disabled (dev mode).</span>
    {/if}
  </div>
</header>

<main>
  <slot />
</main>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ccc;
  }
  nav a {
    margin-right: 1rem;
  }
  .auth-status span {
    margin-right: 0.5rem;
  }
  main {
    padding: 1rem;
  }
</style>