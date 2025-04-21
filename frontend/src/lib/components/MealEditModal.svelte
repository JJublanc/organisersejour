<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import type { Meal, MealRecipe } from '../../routes/trips/[tripId]/+page.server'; // Import Meal structure
  import type { Recipe as FullRecipe } from '../../routes/api/recipes/+server'; // Import full Recipe structure for available recipes
  import RecipeCreateModal from './RecipeCreateModal.svelte'; // Import the new modal

  export let showModal: boolean = false;
  export let mealData: Meal | null = null; // The meal being edited

  let availableRecipes: FullRecipe[] = []; // All recipes fetched from API
  let selectedRecipeIds: Set<number> = new Set();
  let drinks: string = '';
  let bread: boolean = false;
  let isLoadingRecipes = false;
  let errorLoadingRecipes: string | null = null;
  let isSaving = false;
  let saveError: string | null = null;

  // State for Recipe Create Modal
  let showRecipeCreateModal = false;

  const dispatch = createEventDispatcher();

  // Fetch available recipes when the component mounts or becomes visible
  onMount(() => {
      if (showModal) {
          fetchAvailableRecipes();
      }
  });

  // Watch for showModal changes to fetch recipes if needed
  $: if (showModal && availableRecipes.length === 0 && !isLoadingRecipes) {
      fetchAvailableRecipes();
  }

  // Update local state when mealData changes (when modal opens for a new meal)
  $: if (mealData && showModal) {
      selectedRecipeIds = new Set(mealData.recipes.map(r => r.id));
      drinks = mealData.drinks || '';
      bread = mealData.bread;
      saveError = null; // Reset save error when opening
  } else if (!showModal) {
      // Reset when modal closes
      selectedRecipeIds = new Set();
      drinks = '';
      bread = false;
      saveError = null;
      showRecipeCreateModal = false; // Ensure create modal is also closed
  }

  async function fetchAvailableRecipes() {
      isLoadingRecipes = true;
      errorLoadingRecipes = null;
      console.log("Fetching available recipes...");
      try {
          const response = await fetch('/api/recipes');
          if (!response.ok) {
              throw new Error(`Failed to fetch recipes: ${response.statusText}`);
          }
          const data = await response.json();
          availableRecipes = data.recipes || [];
          console.log(`Fetched ${availableRecipes.length} recipes.`);
      } catch (err: any) {
          console.error("Error fetching recipes:", err);
          errorLoadingRecipes = err.message || "Could not load recipes.";
      } finally {
          isLoadingRecipes = false;
      }
  }

  function closeModal() {
    dispatch('close');
  }

  async function saveChanges() {
      if (!mealData) return;

      isSaving = true;
      saveError = null;
      console.log(`Saving changes for meal ID: ${mealData.id}`);

      const payload = {
          recipeIds: Array.from(selectedRecipeIds),
          drinks: drinks || null, // Send null if empty
          bread: bread
      };

      try {
          const response = await fetch(`/api/meals/${mealData.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });

          if (!response.ok) {
              const errorData = await response.json().catch(() => ({})); // Try to parse error
              throw new Error(errorData.error || `Failed to update meal: ${response.statusText}`);
          }

          console.log(`Meal ${mealData.id} updated successfully.`);
          dispatch('mealUpdated'); // Notify parent to potentially refresh data
          closeModal(); // Close modal on success

      } catch (err: any) {
          console.error("Error saving meal:", err);
          saveError = err.message || "Could not save changes.";
      } finally {
          isSaving = false;
      }
  }

  // Handle checkbox changes for recipes
  function handleRecipeToggle(recipeId: number, checked: boolean) {
      if (checked) {
          selectedRecipeIds.add(recipeId);
      } else {
          selectedRecipeIds.delete(recipeId);
      }
      selectedRecipeIds = selectedRecipeIds; // Trigger reactivity
  }

  // --- Recipe Creation Modal Logic ---
  function openRecipeCreateModal() {
      showRecipeCreateModal = true;
  }

  function closeRecipeCreateModal() {
      showRecipeCreateModal = false;
  }

  function handleRecipeCreated(event: CustomEvent<FullRecipe>) {
      const newRecipe = event.detail;
      console.log("New recipe created:", newRecipe);
      // Add to available list
      availableRecipes = [...availableRecipes, newRecipe];
      // Optionally auto-select the new recipe
      selectedRecipeIds.add(newRecipe.id);
      selectedRecipeIds = selectedRecipeIds; // Trigger reactivity
      closeRecipeCreateModal(); // Close the create modal
  }

</script>

{#if showModal}
  <div class="modal-backdrop" on:click={closeModal}>
    <div class="modal-content" on:click|stopPropagation>
      {#if mealData}
        <h3>Modifier le repas : {mealData.type}</h3>

        <div class="form-section">
            <div class="recipe-header">
                <h4>Recettes</h4>
                <button type="button" class="create-recipe-btn" on:click={openRecipeCreateModal}>
                    + Créer Recette
                </button>
            </div>
            {#if isLoadingRecipes}
                <p>Chargement des recettes...</p>
            {:else if errorLoadingRecipes}
                <p class="error">Erreur : {errorLoadingRecipes}</p>
            {:else if availableRecipes.length === 0}
                <p>Aucune recette disponible. <button type="button" class="link-button" on:click={openRecipeCreateModal}>Créer une recette ?</button></p>
            {:else}
                <ul class="recipe-list">
                    {#each availableRecipes as recipe (recipe.id)}
                        <li>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedRecipeIds.has(recipe.id)}
                                    on:change={(e) => handleRecipeToggle(recipe.id, e.currentTarget.checked)}
                                />
                                {recipe.name}
                                {#if recipe.description}
                                    <small>({recipe.description})</small>
                                {/if}
                            </label>
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>

        <div class="form-section">
            <label for="drinks">Boissons :</label>
            <input type="text" id="drinks" bind:value={drinks} placeholder="Ex: Eau, Jus d'orange" />
        </div>

        <div class="form-section">
            <label>
                <input type="checkbox" bind:checked={bread} />
                Pain inclus ?
            </label>
        </div>

        {#if saveError}
            <p class="error save-error">Erreur lors de la sauvegarde : {saveError}</p>
        {/if}

        <div class="modal-actions">
          <button on:click={closeModal} disabled={isSaving}>Annuler</button>
          <button class="save-button" on:click={saveChanges} disabled={isSaving}>
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </button>
        </div>

      {:else}
        <p>Aucune donnée de repas à modifier.</p>
         <div class="modal-actions">
             <button on:click={closeModal}>Fermer</button>
         </div>
      {/if}
    </div>
  </div>
{/if}

<!-- Render the Recipe Create Modal (controlled by showRecipeCreateModal) -->
<RecipeCreateModal bind:showModal={showRecipeCreateModal} on:close={closeRecipeCreateModal} on:recipeCreated={handleRecipeCreated} />


<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* Ensure it's above main content */
  }

  .modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 600px; /* Limit max width */
    max-height: 80vh; /* Limit max height */
    overflow-y: auto; /* Allow scrolling if content overflows */
  }

  h3 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #333;
  }

  .form-section {
      margin-bottom: 1.5rem;
  }

  .recipe-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
      border-bottom: 1px solid #eee;
      padding-bottom: 0.3rem;
  }

  .recipe-header h4 {
      margin: 0;
      color: #555;
  }

  .create-recipe-btn {
      padding: 0.3rem 0.8rem;
      font-size: 0.85em;
      background-color: #6c757d;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
  }
  .create-recipe-btn:hover {
      background-color: #5a6268;
  }

  .link-button { /* Style like a link */
      background: none;
      border: none;
      color: #007bff;
      padding: 0;
      cursor: pointer;
      text-decoration: underline;
  }
  .link-button:hover {
      color: #0056b3;
  }


  label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
      color: #444;
  }

  input[type="text"] {
      width: 100%;
      padding: 0.6rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box; /* Include padding in width */
  }

  input[type="checkbox"] {
      margin-right: 0.5rem;
      vertical-align: middle;
  }

  /* Style for the recipe list */
  .recipe-list {
      list-style: none;
      padding: 0;
      max-height: 200px; /* Limit height and allow scroll */
      overflow-y: auto;
      border: 1px solid #eee;
      border-radius: 4px;
      padding: 0.5rem;
  }

  .recipe-list li {
      padding: 0.3rem 0;
  }
   .recipe-list label {
       font-weight: normal; /* Normal weight for list items */
       display: flex; /* Align checkbox and text */
       align-items: center;
   }
   .recipe-list small {
       margin-left: 0.5rem;
       color: #777;
       font-size: 0.85em;
   }


  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
    border-top: 1px solid #eee;
    padding-top: 1rem;
  }

  button {
    padding: 0.6rem 1.2rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    background-color: #f0f0f0;
  }
  button:hover {
      background-color: #e0e0e0;
  }
  button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
  }

  .save-button {
    background-color: #28a745;
    color: white;
    border-color: #28a745;
  }
  .save-button:hover {
    background-color: #218838;
    border-color: #1e7e34;
  }
   .save-button:disabled {
       background-color: #5cb85c; /* Lighter green when disabled */
       border-color: #5cb85c;
   }

  .error {
      color: #dc3545; /* Red color for errors */
      font-size: 0.9rem;
      margin-top: 0.5rem;
  }
  .save-error {
      text-align: right;
      margin-top: -1rem; /* Position near buttons */
      margin-bottom: 1rem;
  }

</style>