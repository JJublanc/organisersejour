<script lang="ts">
  import type { LayoutData } from './$types';

  export let data: LayoutData;
  const { user, authEnabled } = data;
  
  // State to control form visibility
  let showTripForm = false;
  
  // Function to toggle form visibility
  function toggleTripForm() {
    showTripForm = !showTripForm;
  }
  
  // Helper function to get today's date in YYYY-MM-DD format
  function getTodayDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  let startDate = getTodayDateString();
  let endDate = getTodayDateString();
</script>

<div class="app-container">
  <aside class="sidebar">
    <nav>
      <form action="/" method="GET" style="margin: 0; padding: 0;">
        <button type="submit" class="sidebar-button">
          <span class="link-icon">🏠</span>
          <span class="link-text">Home</span>
        </button>
      </form>
      {#if user}
        <form action="/protected" method="GET" style="margin: 0; padding: 0;">
          <button type="submit" class="sidebar-button">
            <span class="link-icon">🔒</span>
            <span class="link-text">Protected Page</span>
          </button>
        </form>
        <!-- Replace link with a form button for more reliable navigation -->
        <form action="/trips" method="GET" style="margin: 0; padding: 0;">
          <button type="submit" class="sidebar-button">
            <span class="link-icon">🗺️</span>
            <span class="link-text">My Trips</span>
          </button>
        </form>
        <!-- Button to toggle trip form visibility -->
        <button on:click|preventDefault={toggleTripForm} class="sidebar-button">
          <span class="link-icon">➕</span>
          <span class="link-text">New Trip</span>
        </button>
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
      {#if showTripForm && user}
        <div class="trip-form-container">
          <h2>Créer un nouveau séjour</h2>
          
          <form method="POST" action="?/createTrip">
            <div class="form-group">
              <label for="name">Nom du séjour:</label>
              <input type="text" id="name" name="name" required>
            </div>

            <div class="form-group">
              <label for="start_date">Date de début:</label>
              <input type="date" id="start_date" name="start_date" required bind:value={startDate}>
            </div>

            <div class="form-group">
              <label for="end_date">Date de fin:</label>
              <input type="date" id="end_date" name="end_date" required bind:value={endDate} min={startDate}>
            </div>

            <div class="form-group">
              <label for="location">Lieu (Optionnel):</label>
              <input type="text" id="location" name="location">
            </div>

            <div class="form-group">
              <label for="num_people">Nombre de personnes:</label>
              <input type="number" id="num_people" name="num_people" required min="1" value="1">
            </div>

            <div class="form-actions">
              <button type="submit" class="submit-button">Créer le séjour</button>
              <button type="button" class="cancel-button" on:click={toggleTripForm}>Annuler</button>
            </div>
          </form>
        </div>
      {/if}
      
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
  
  /* Style for the sidebar button to match links */
  .sidebar-button {
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
  
  .sidebar-button:hover {
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
  
 /* Trip form styles */
 .trip-form-container {
   margin: 1rem 0 2rem 0;
   padding: 1.5rem;
   border: 1px solid #ddd;
   border-radius: 8px;
   background-color: #f9f9f9;
   max-width: 600px;
 }
 
 .form-group {
   margin-bottom: 1rem;
 }
 
 .form-group label {
   display: block;
   margin-bottom: 0.25rem;
   font-weight: 500;
 }
 
 .form-group input {
   padding: 0.5rem;
   border: 1px solid #ccc;
   border-radius: 4px;
   width: 100%;
   box-sizing: border-box;
 }
 
 .form-actions {
   display: flex;
   gap: 1rem;
   margin-top: 1.5rem;
 }
 
 .submit-button {
   padding: 0.75rem 1.5rem;
   background-color: #007bff;
   color: white;
   border: none;
   border-radius: 4px;
   cursor: pointer;
   font-size: 1rem;
 }
 
 .submit-button:hover {
   background-color: #0056b3;
 }
 
 .cancel-button {
   padding: 0.75rem 1.5rem;
   background-color: #6c757d;
   color: white;
   border: none;
   border-radius: 4px;
   cursor: pointer;
   font-size: 1rem;
 }
 
 .cancel-button:hover {
   background-color: #5a6268;
 }
</style>