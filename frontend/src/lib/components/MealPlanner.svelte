<script lang="ts">
  import type { TripDay, Meal } from '../../routes/trips/[tripId]/+page.server'; // Import Meal type as well
  import MealEditModal from './MealEditModal.svelte'; // Import the modal
  import { invalidateAll } from '$app/navigation'; // Import invalidateAll for data refresh

  export let days: TripDay[];

  let showEditModal = false;
  let selectedMealData: Meal | null = null; // Use the imported Meal type

  function openEditModal(meal: Meal) { // Use Meal type
      console.log("Opening edit modal for meal:", meal);
      selectedMealData = meal;
      showEditModal = true;
  }

  function closeEditModal() {
      showEditModal = false;
      selectedMealData = null;
  }

  function handleMealUpdated() {
      console.log("Meal updated, refreshing data...");
      // Invalidate all data on the page to refresh the meal list
      invalidateAll();
      // Modal closes itself on successful save, but ensure state is reset here too
      closeEditModal();
  }

  // Helper to format date (could be moved to a shared utility)
  function formatDisplayDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        weekday: 'long', // e.g., Monday
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  }

  // Helper to capitalize meal type
  function capitalize(str: string): string {
      if (!str) return str;
      return str.charAt(0).toUpperCase() + str.slice(1);
  }
</script>

<div class="meal-planner">
  {#each days as day (day.id)}
    <div class="day-card">
      <h3>{formatDisplayDate(day.date)}</h3>
      <div class="meals-grid">
        {#each day.meals as meal (meal.id)}
          <div class="meal-slot">
            <h4>{capitalize(meal.type)}</h4>
            <div class="meal-content">
              {#if meal.recipes.length > 0}
                <ul>
                  {#each meal.recipes as recipe (recipe.id)}
                    <li>{recipe.name} (Serves {recipe.servings})</li>
                  {/each}
                </ul>
              {:else}
                <p class="no-recipe"><i>Aucune recette assignée</i></p>
              {/if}

              {#if meal.drinks}
                <p class="meal-extra"><strong>Boissons :</strong> {meal.drinks}</p>
              {/if}

              {#if meal.bread}
                <p class="meal-extra"><strong>Pain inclus</strong></p>
              {/if}
            </div>
            <button class="edit-meal-button" on:click={() => openEditModal(meal)}>
              Modifier
            </button>
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>

<!-- Render the MealEditModal -->
<MealEditModal bind:showModal={showEditModal} mealData={selectedMealData} on:close={closeEditModal} on:mealUpdated={handleMealUpdated} />


<style>
  .meal-planner {
    margin-top: 1rem;
  }

  .day-card {
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    margin-bottom: 1.5rem;
    padding: 1rem 1.5rem;
  }

  .day-card h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.5rem;
  }

  .meals-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); /* Responsive grid */
    gap: 1rem;
  }

  .meal-slot {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
  }

  .meal-slot h4 {
    margin-top: 0;
    margin-bottom: 0.75rem;
    color: #555;
    text-align: center;
    border-bottom: 1px dashed #eee;
    padding-bottom: 0.5rem;
  }

  .meal-content {
      flex-grow: 1; /* Pushes button to the bottom */
      margin-bottom: 1rem;
  }

  .meal-content ul {
    list-style: disc;
    padding-left: 20px;
    margin: 0 0 0.5rem 0;
    font-size: 0.95rem;
  }

   .meal-content li {
       margin-bottom: 0.3rem;
   }

  .no-recipe {
    font-style: italic;
    color: #888;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .meal-extra {
      font-size: 0.9rem;
      color: #666;
      margin-top: 0.5rem;
      margin-bottom: 0;
  }

  .edit-meal-button {
    padding: 0.5rem 1rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    align-self: center; /* Center button horizontally */
    margin-top: auto; /* Pushes button to bottom */
  }

  .edit-meal-button:hover {
    background-color: #0056b3;
  }
</style>