<script lang="ts">
  // Data is now loaded by +page.server.ts and passed in automatically
  export let data;
  export let form: Record<string, any> | undefined | null;

  // Helper function to get today's date in YYYY-MM-DD format
  function getTodayDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  let startDate = form?.startDate ?? getTodayDateString();
  let endDate = form?.endDate ?? getTodayDateString();
</script>

<main>
  <h1>Bienvenue !</h1>
  
  {#if data.message}
    <p>Message from DB: {data.message}</p>
  {:else}
    <p>Loading message...</p>
  {/if}
  
  <!-- Show trip creation form if user is logged in -->
  {#if data.user?.authenticated}
    <div class="trip-form-container">
      <h2>Créer un nouveau séjour</h2>
      
      {#if form?.error}
        <p class="error-message">Erreur: {form.error}</p>
      {/if}
      {#if form?.message}
        <p class="success-message">{form.message}</p>
      {/if}

      <form method="POST" action="?/createTrip">
        <div class="form-group">
          <label for="name">Nom du séjour:</label>
          <input type="text" id="name" name="name" required value={form?.name ?? ''}>
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
          <input type="text" id="location" name="location" value={form?.location ?? ''}>
        </div>

        <div class="form-group">
          <label for="num_people">Nombre de personnes:</label>
          <input type="number" id="num_people" name="num_people" required min="1" value={form?.num_people ?? 1}>
        </div>

        <button type="submit">Créer le séjour</button>
      </form>
    </div>
  {/if}
</main>

<style>
  .trip-form-container {
    margin-top: 2rem;
    padding: 1.5rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
    max-width: 600px;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.25rem;
    font-weight: 500;
  }
  
  input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;
  }
  
  button {
    padding: 0.75rem 1.5rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  .error-message {
    color: #d9534f;
    font-weight: 500;
  }
  
  .success-message {
    color: #5cb85c;
    font-weight: 500;
  }
</style>
