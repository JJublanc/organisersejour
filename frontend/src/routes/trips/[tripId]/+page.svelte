<script lang="ts">
  import type { PageData } from './$types';
  import type { TripDay } from '$lib/types';
  import MealPlanner from '$lib/components/MealPlanner.svelte'; // Import the MealPlanner component
  import type { ShoppingListItem } from '$lib/types'; // Import ShoppingListItem from $lib/types

  export let data: PageData; // Data loaded from +page.server.ts

  let shoppingList: ShoppingListItem[] = [];
  let pdfData: string | null = null;
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
          pdfData = result.pdfData || null; // Store PDF data for download button
          console.log(`Fetched ${shoppingList.length} items for shopping list.`);
          console.log(`PDF data available: ${!!pdfData}`);
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

async function downloadShoppingListPdf() {
    console.log("Download PDF button clicked");
    try {
        if (!pdfData) {
            throw new Error("No PDF data available. Please generate the shopping list first.");
        }
        
        console.log("Creating download link...");
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${pdfData}`;
        link.download = `Liste_de_courses_${data.trip.name}.pdf`;
        document.body.appendChild(link); // Add to DOM
        link.click();
        document.body.removeChild(link); // Remove from DOM
        
        console.log("PDF download triggered successfully");
    } catch (err: any) {
        console.error("Error downloading PDF:", err);
        shoppingListError = err.message || "Could not download PDF.";
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
       <MealPlanner days={data.days as TripDay[]} />
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
      <button class="download-button" on:click={downloadShoppingListPdf} disabled={!pdfData}>
          Télécharger la Liste de Courses (PDF)
      </button>

      {#if isLoadingShoppingList}
          <p>Chargement de la liste de courses...</p>
      {:else if shoppingListError}
          <p class="error">{shoppingListError}</p>
      {:else if shoppingList.length > 0}
          <ul class="shopping-list">
              <!-- Group items by type -->
              {#each ['légume', 'fruit', 'viande', 'poisson', 'pain', 'condiment', 'boisson', 'autre'] as type}
                  {@const typeItems = shoppingList.filter(item => (item.type || 'autre') === type)}
                  {#if typeItems.length > 0}
                      <li class="type-header">
                          <h4>
                              {#if type === 'légume'}Légumes
                              {:else if type === 'fruit'}Fruits
                              {:else if type === 'viande'}Viandes
                              {:else if type === 'poisson'}Poissons
                              {:else if type === 'pain'}Pains
                              {:else if type === 'condiment'}Condiments
                              {:else if type === 'boisson'}Boissons
                              {:else}Autres
                              {/if}
                          </h4>
                      </li>
                      {#each typeItems as item (item.ingredient_id)}
                          <li>
                              <strong>{item.name} :</strong> {item.total_quantity} {item.unit}
                          </li>
                      {/each}
                  {/if}
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
   .shopping-list .type-header {
       background-color: #f0f0f0;
       margin-top: 1rem;
       padding: 0.5rem;
       border-radius: 4px;
       border-bottom: none;
   }
   .shopping-list .type-header h4 {
       margin: 0;
       font-size: 1.1rem;
       color: #333;
   }
   .shopping-list .type-header:first-child {
       margin-top: 0;
   }

   .error {
       color: #dc3545; /* Red color for errors */
       margin-top: 1rem;
   }

  /* Add more specific styles as components are added */
.download-button {
    padding: 0.75rem 1.5rem;
    background-color: #28a745; /* Green color */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    margin-bottom: 1rem;
    margin-left: 1rem;
}
.download-button:hover {
    background-color: #218838;
}
.download-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}
</style>