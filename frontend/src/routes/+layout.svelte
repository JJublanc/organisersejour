<script lang="ts">
  import type { LayoutData } from './$types';
  // Remove unused import
  // import { page } from '$app/stores';

  export let data: LayoutData;
  const { user, authEnabled } = data;
  
  // Remove unused helper function and state
</script>

<div class="app-container">
  <aside class="sidebar">
    <nav>
      <!-- Use standard links for navigation -->
      <a href="/" class="sidebar-link">
         <span class="link-icon">🏠</span>
         <span class="link-text">Home</span>
      </a>
      {#if user}
        <a href="/protected" class="sidebar-link">
           <span class="link-icon">🔒</span>
           <span class="link-text">Protected Page</span>
        </a>
        <a href="/trips" class="sidebar-link">
           <span class="link-icon">🗺️</span>
           <span class="link-text">My Trips</span>
        </a>
        <!-- Removed "New Trip" link from sidebar as we now have a button on the My Trips page -->
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
  /* Apply border-box sizing globally */
  *, *::before, *::after {
    box-sizing: border-box;
  }

  .app-container {
    display: flex;
    min-height: 100vh;
  }

  .sidebar {
    width: 50px; /* Reduced collapsed width */
    background-color: #e0e0e0;
    padding: 1rem;
    transition: width 0.3s ease;
    overflow: hidden; /* Hide text when collapsed */
    white-space: nowrap; /* Prevent text wrapping */
    position: fixed; /* Keep sidebar fixed */
    height: 100%;
    z-index: 10; /* Ensure sidebar is above content */
  }

  .sidebar:hover {
    width: 200px; /* Expanded width on hover */
  }

  .sidebar nav {
    display: flex;
    flex-direction: column;
  }

  .sidebar nav a {
    display: flex; /* Align icon and text */
    align-items: center; /* Vertically center icon and text */
    margin-bottom: 1rem;
    text-decoration: none;
    color: #333;
    /* display: block; - Replaced by flex */
    overflow: hidden; /* Prevent content overflow */
    white-space: nowrap; /* Keep text on one line */
  }

  .sidebar nav a .link-icon {
    display: inline-block;
    min-width: 20px; /* Ensure icon has space */
    text-align: center;
    margin-right: 10px; /* Space between icon and text */
    font-size: 1.2em; /* Slightly larger icon */
  }

  .sidebar nav a .link-text {
    display: none; /* Hide text by default */
    opacity: 0; /* Start hidden for transition */
    transition: opacity 0.2s ease-in-out;
  }

  .sidebar:hover nav a .link-text {
    display: inline; /* Show text on hover */
    opacity: 1; /* Fade in text */
  }

  .sidebar nav a:hover {
    color: #007bff;
    background-color: rgba(0, 0, 0, 0.05); /* Subtle hover background */
    border-radius: 4px;
  }
  
  /* Adjust styles for links instead of buttons if needed, rename class */
  .sidebar-link { /* Renamed from sidebar-button */
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    text-decoration: none;
    color: #333;
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    text-align: left;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
  }
  
  .sidebar-link:hover { /* Renamed from sidebar-button */
    color: #007bff;
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }

  .main-content {
    flex-grow: 1;
    margin-left: 50px; /* Match updated sidebar width */
    transition: margin-left 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  .sidebar:hover + .main-content {
     margin-left: 200px; /* Adjust margin when sidebar expands */
  }


  header {
    display: flex;
    justify-content: flex-end; /* Align auth status to the right */
    align-items: center;
    padding: 1rem;
    background-color: #f0f0f0;
    border-bottom: 1px solid #ccc;
    /* Removed width: 100% as it's handled by flex-grow on main-content */
  }

  .auth-status {
     /* Styles remain similar, just aligned right by header's justify-content */
  }

  .auth-status span {
    margin-right: 0.5rem;
  }

  main {
    padding: 1rem;
    flex-grow: 1; /* Allow main content to fill remaining space */
  }

  /* Basic responsiveness: Hide sidebar on smaller screens */
  @media (max-width: 768px) {
    .sidebar {
      display: none; /* Hide sidebar */
    }

    .main-content {
      margin-left: 0; /* Remove margin when sidebar is hidden */
    }

     header {
       justify-content: space-between; /* Adjust header content spacing */
     }
     /* Consider adding a hamburger menu toggle here in the future */
  }
  
  /* Ensure no leftover form styles */
</style>