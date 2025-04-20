<script lang="ts">
  // We remove the explicit ActionData type here to avoid TS conflicts.
  // SvelteKit ensures 'form' receives the data from the action/fail calls at runtime.
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

<h1>Create a New Trip</h1>

{#if form?.error}
  <p style="color: red;">Error: {form.error}</p>
{/if}
{#if form?.message}
    <p style="color: green;">{form.message}</p>
{/if}

<form method="POST">
  <div>
    <label for="name">Trip Name:</label>
    <input type="text" id="name" name="name" required value={form?.name ?? ''}>
  </div>

  <div>
    <label for="start_date">Start Date:</label>
    <input type="date" id="start_date" name="start_date" required bind:value={startDate}>
  </div>

  <div>
    <label for="end_date">End Date:</label>
    <input type="date" id="end_date" name="end_date" required bind:value={endDate} min={startDate}>
  </div>

  <div>
    <label for="location">Location (Optional):</label>
    <input type="text" id="location" name="location" value={form?.location ?? ''}>
  </div>

  <div>
    <label for="num_people">Number of People:</label>
    <input type="number" id="num_people" name="num_people" required min="1" value={form?.num_people ?? 1}>
  </div>

  <button type="submit">Create Trip</button>
</form>

<style>
  div {
    margin-bottom: 1rem;
  }
  label {
    display: block;
    margin-bottom: 0.25rem;
  }
  input {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box; /* Include padding and border in the element's total width and height */
  }
  button {
    padding: 0.75rem 1.5rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  button:hover {
    background-color: #0056b3;
  }
</style>