<script lang="ts">
  import type { PageData } from './$types';
  import MealPlanner from '$lib/components/MealPlanner.svelte'; // Import the MealPlanner component
  import type { ShoppingListItem } from '$lib/types'; // Import ShoppingListItem from $lib/types

  export let data: PageData; // Data loaded from +page.server.ts

  let shoppingList: ShoppingListItem[] = [];
  let isLoadingShoppingList = false;
  let shoppingListError: string | null = null;

  // Helper to format date strings (similar to the list page)
  function formatDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return dateString; // Return original if formatting fails
    }
  }

  async function generateShoppingList() {
      isLoadingShoppingList = true;
      shoppingListError = null;
      shoppingList = []; // Clear previous list
      console.log(`Fetching shopping list for trip ID: ${data.trip.id}`);

      try {
          const response = await fetch(`/api/trips/${data.trip.id}/shopping-list`);
          if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.error || `Failed to fetch shopping list: ${response.statusText}`);
          }
          const result = await response.json();
          shoppingList = result.shoppingList || [];
          console.log(`Fetched ${shoppingList.length} items for shopping list.`);
          if (shoppingList.length === 0) {
              shoppingListError = "Aucun ingrédient requis pour les repas planifiés."; // Informative message if empty
          }
      } catch (err: any) {
          console.error("Error fetching shopping list:", err);
          shoppingListError = err.message || "Could not generate shopping list.";
      } finally {
          isLoadingShoppingList = false;
      }
  }

</script>

<div class="trip-detail-container">
  <h1>{data.trip.name}</h1>

  <div class="trip-info">
    {#if data.trip.location}
      <p><strong>Lieu :</strong> {data.trip.location}</p>
    {/if}
    <p><strong>Dates :</strong> {formatDate(data.trip.start_date)} - {formatDate(data.trip.end_date)}</p>
    <p><strong>Participants :</strong> {data.trip.num_people}</p>
  </div>

  <hr class="separator"/>

  <section class="meal-planner-section">
    <h2>Planificateur de Repas</h2>
    {#if data.days && data.days.length > 0}
       <!-- Render the MealPlanner component -->
       <MealPlanner days={data.days} />
    {:else}
      <p>Les jours et repas pour ce séjour n'ont pas pu être chargés ou générés.</p>
      <!-- This might indicate an issue during trip creation -->
    {/if}
  </section>

  <hr class="separator"/>

  <section class="shopping-list-section">
      <h2>Liste de Courses</h2>
      <button class="generate-button" on:click={generateShoppingList} disabled={isLoadingShoppingList}>
          {isLoadingShoppingList ? 'Génération...' : 'Générer la Liste de Courses'}
      </button>

      {#if isLoadingShoppingList}
          <p>Chargement de la liste de courses...</p>
      {:else if shoppingListError}
          <p class="error">{shoppingListError}</p>
      {:else if shoppingList.length > 0}
          <ul class="shopping-list">
              {#each shoppingList as item (item.ingredient_id)}
                  <li>
                      <strong>{item.name} :</strong> {item.total_quantity} {item.unit}
                  </li>
              {/each}
          </ul>
      {/if}
  </section>

</div>

<style>
  .trip-detail-container {
    max-width: 900px;
    margin: 2rem auto;
    padding: 1.5rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  h1 {
    color: #333;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #eee;
    padding-bottom: 0.5rem;
  }

  .trip-info p {
    margin: 0.5rem 0;
    line-height: 1.6;
    color: #555;
  }

  .separator {
      border: none;
      border-top: 1px solid #eee;
      margin: 2rem 0;
  }

  .meal-planner-section h2,
  .shopping-list-section h2 {
      color: #444;
      margin-bottom: 1rem;
  }

  .generate-button {
      padding: 0.75rem 1.5rem;
      background-color: #17a2b8; /* Teal color */
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      margin-bottom: 1rem;
  }
  .generate-button:hover {
      background-color: #138496;
  }
   .generate-button:disabled {
       opacity: 0.7;
       cursor: not-allowed;
   }

   .shopping-list {
       list-style: none;
       padding: 0;
       margin-top: 1rem;
       border: 1px solid #eee;
       border-radius: 4px;
       padding: 1rem;
       background-color: #fdfdfd;
   }
   .shopping-list li {
       padding: 0.5rem 0;
       border-bottom: 1px dashed #eee;
   }
   .shopping-list li:last-child {
       border-bottom: none;
   }

   .error {
       color: #dc3545; /* Red color for errors */
       margin-top: 1rem;
   }

  /* Add more specific styles as components are added */
</style>