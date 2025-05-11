<script lang="ts">
  import type { LayoutData } from './$types';
  // Import our global CSS
  import '$lib/styles/index.css';

  export let data: LayoutData;
  const { user, authEnabled } = data;
</script>

<div class="app-container">
  <aside class="sidebar">
    <nav>
      {#if user}
        <a href="/trips" class="sidebar-link" data-sveltekit-reload>
           <span class="link-icon">🗺️</span>
           <span class="link-text">Mes Séjours</span>
        </a>
        <a href="/recipes" class="sidebar-link" data-sveltekit-reload>
           <span class="link-icon">📝</span>
           <span class="link-text">Mes Recettes</span>
        </a>
        <a href="/ingredients" class="sidebar-link" data-sveltekit-reload>
           <span class="link-icon">🥕</span>
           <span class="link-text">Mes Ingrédients</span>
        </a>
      {/if}
    </nav>
  </aside>

  <div class="main-content">
    <header>
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
  </div>
</div>

<style>
  .app-container {
    display: flex;
    min-height: 100vh;
  }

  .sidebar {
    width: 50px;
    background-color: var(--color-success-800); /* Changement de couleur pour un vert */
    padding: var(--spacing-3) 0;
    transition: width var(--transition-normal) var(--transition-timing);
    overflow: hidden;
    white-space: nowrap;
    position: fixed;
    left: 0;
    top: 0;
    height: 100%;
    z-index: 10;
  }

  .sidebar:hover {
    width: 220px;
  }

  .sidebar nav {
    display: flex;
    flex-direction: column;
  }

  .sidebar nav a {
    display: flex;
    align-items: center;
    margin-bottom: var(--spacing-2);
    padding: var(--spacing-3) var(--spacing-4);
    text-decoration: none;
    color: white;
    overflow: hidden;
    white-space: nowrap;
  }

  .sidebar nav a .link-icon {
    display: inline-block;
    min-width: 20px;
    text-align: center;
    margin-right: var(--spacing-2);
    font-size: 1.2em;
  }

  .sidebar nav a .link-text {
    display: none;
    opacity: 0;
    transition: opacity var(--transition-fast) var(--transition-timing);
  }

  .sidebar:hover nav a .link-text {
    display: inline;
    opacity: 1;
  }

  .sidebar nav a:hover {
    color: white;
    background-color: var(--color-success-700); /* Changement de couleur pour une nuance de vert */
  }
  
  .sidebar-link {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: white;
    background: none;
    border: none;
    padding: var(--spacing-3) var(--spacing-4);
    font: inherit;
    cursor: pointer;
    text-align: left;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
  }
  
  .sidebar-link:hover {
    color: white;
    background-color: var(--color-success-700); /* Changement de couleur pour une nuance de vert */
  }

  .main-content {
    flex-grow: 1;
    margin-left: 50px;
    transition: margin-left var(--transition-normal) var(--transition-timing);
    display: flex;
    flex-direction: column;
  }

  .sidebar:hover + .main-content {
     margin-left: 220px;
  }

  header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: var(--spacing-4);
    background-color: var(--color-primary-50);
    border-bottom: 1px solid var(--color-primary-200);
  }

  .auth-status span {
    margin-right: var(--spacing-2);
  }

  main {
    padding: var(--spacing-4);
    flex-grow: 1;
  }

  @media (max-width: 768px) {
    .sidebar {
      display: none;
    }

    .main-content {
      margin-left: 0;
    }

    header {
      justify-content: space-between;
    }
  }
</style>