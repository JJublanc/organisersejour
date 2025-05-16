<script lang="ts">
  import type { Meal, MealComponent, Recipe, UpdateMealRequestBody } from '$lib/types';
  import { createEventDispatcher, onMount } from 'svelte';

  // Props
  export let showModal: boolean = false;
  export let mealData: Meal | null = null;
  
  // State
  let isSaving = false;
  let saveError: string | null = null;
  let editedAccompaniments: MealComponent[] = [];
  let editedRecipeComponents: MealComponent[] = []; // State for recipe components
  let availableRecipes: Recipe[] = []; // State for available recipes
  let isLoadingPrereqs = false;
  let loadingError: string | null = null;
  
  // Event dispatcher
  const dispatch = createEventDispatcher();
  
  // Fetch prerequisites when modal opens
  onMount(() => {
    if (showModal) fetchPrerequisites();
  });

  $: if (showModal && availableRecipes.length === 0 && !isLoadingPrereqs) {
    fetchPrerequisites();
  }

  // Initialize state when modal opens
  $: if (showModal && mealData) {
    initializeState();
  }
  
  function initializeState() {
    try {
      console.log("Initializing state with meal data:", mealData);
      
      if (!mealData) {
        throw new Error("No meal data provided");
      }
      
      // Make a deep copy of accompaniments
      editedAccompaniments = mealData.accompaniments 
        ? JSON.parse(JSON.stringify(mealData.accompaniments))
        : [];
        
      // Initialize recipe components (assuming they are grouped by course in mealData)
      editedRecipeComponents = mealData.recipe_components
        ? Object.values(mealData.recipe_components).flat().map(comp => JSON.parse(JSON.stringify(comp)))
        : [];

      console.log("Initialized accompaniments:", editedAccompaniments);
      console.log("Initialized recipe components:", editedRecipeComponents);

    } catch (err: any) {
      console.error("Error initializing state:", err);
      loadingError = err.message || "Failed to initialize state"; // Use loadingError here
      editedAccompaniments = []; // Reset on error
      editedRecipeComponents = []; // Reset on error
    }
  }


  // Add a new recipe component
  function addRecipeComponent() {
    const newRecipeComp: MealComponent = {
      id: Date.now(), // Temporary ID
      course_type: 'main', // Default to main course
      recipe_id: null, // Needs to be selected
      ingredient_id: null,
      total_quantity: null,
      unit: null,
      quantity_per_person: null,
      notes: null,
      display_order: editedRecipeComponents.length,
      recipe_name: null // Will be filled when selected
    };
    editedRecipeComponents = [...editedRecipeComponents, newRecipeComp];
  }

  // Remove a recipe component
  function removeRecipeComponent(index: number) {
    editedRecipeComponents = editedRecipeComponents.filter((_, i) => i !== index);
  }

  // Update recipe name when selected
  function handleRecipeSelect(event: Event, index: number) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedRecipeId = parseInt(selectElement.value);
    const selectedRecipe = availableRecipes.find(r => r.id === selectedRecipeId);
    if (selectedRecipe) {
      editedRecipeComponents[index].recipe_name = selectedRecipe.name;
      editedRecipeComponents = [...editedRecipeComponents]; // Trigger reactivity
    }
  }

  // Fetch available recipes
  async function fetchPrerequisites() {
    isLoadingPrereqs = true;
    loadingError = null;
    try {
      console.log("Fetching available recipes...");
      const response = await fetch('/api/recipes');
      if (!response.ok) {
        throw new Error(`Failed to fetch recipes: ${response.statusText}`);
      }
      const data = await response.json();
      availableRecipes = data.recipes || [];
      console.log(`Fetched ${availableRecipes.length} recipes.`);
    } catch (err: any) {
      console.error("Error fetching prerequisites:", err);
      loadingError = err.message || "Could not load recipe data.";
    } finally {
      isLoadingPrereqs = false;
    }
  }
  
  // Close modal
  function closeModal() {
    dispatch('close');
  }
  
  // Add a new accompaniment
  function addAccompaniment() {
    const newAccompaniment: MealComponent = {
      id: Date.now(), // Temporary ID
      course_type: 'extra',
      recipe_id: null,
      ingredient_id: 1, // Default to first ingredient (water)
      ingredient_name: "Eau",
      total_quantity: null,
      unit: "L",
      quantity_per_person: 1,
      notes: null,
      display_order: editedAccompaniments.length
    };
    
    editedAccompaniments = [...editedAccompaniments, newAccompaniment];
  }
  
  // Remove an accompaniment
  function removeAccompaniment(index: number) {
    editedAccompaniments = editedAccompaniments.filter((_, i) => i !== index);
  }
  
  // Save changes
  async function saveChanges() {
    if (!mealData) return;
    
    try {
      isSaving = true;
      saveError = null;
      
      console.log("Saving changes with accompaniments:", editedAccompaniments);
      
      // Prepare payload, combining recipes and accompaniments
      const validRecipeComponents = editedRecipeComponents
        .filter(comp => comp.recipe_id != null)
        .map((comp, index) => ({
          course_type: comp.course_type,
          recipe_id: comp.recipe_id,
          ingredient_id: null,
          total_quantity: null,
          unit: null,
          quantity_per_person: null,
          notes: comp.notes,
          display_order: index // Order within recipes
        }));

      const validAccompaniments = editedAccompaniments
        .filter(acc =>
          acc.ingredient_id != null &&
          acc.unit &&
          acc.unit.trim() !== '' &&
          acc.quantity_per_person != null &&
          acc.quantity_per_person > 0
        )
        .map((acc, index) => ({
          course_type: acc.course_type,
          recipe_id: null,
          ingredient_id: acc.ingredient_id,
          total_quantity: null,
          unit: acc.unit,
          quantity_per_person: acc.quantity_per_person,
          notes: acc.notes,
          display_order: validRecipeComponents.length + index // Order after recipes
        }));

      const payload: UpdateMealRequestBody = {
        components: [...validRecipeComponents, ...validAccompaniments]
      };
      
      console.log("Sending payload:", payload);
      
      // Send request
      const response = await fetch(`/api/meals/${mealData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to update meal: ${response.statusText}`);
      }
      
      console.log("Meal updated successfully");
      dispatch('mealUpdated');
      closeModal();
    } catch (err: any) {
      console.error("Error saving changes:", err);
      saveError = err.message || "Failed to save changes";
    } finally {
      isSaving = false;
    }
  }
</script>

{#if showModal}
  <div class="modal-backdrop" on:click={closeModal}>
    <div class="modal-content" on:click|stopPropagation>
      <h3>Modifier le repas</h3>

      {#if mealData}
        <div class="meal-info">
          <p><strong>Repas:</strong> {mealData.type} (ID: {mealData.id})</p>

          {#if isLoadingPrereqs}
            <p>Chargement des recettes...</p>
          {:else if loadingError}
            <p class="error">Erreur de chargement: {loadingError}</p>
          {/if}



          <!-- Accompaniments Section -->
          <div class="accompaniments-section">
            <h4>Accompagnements / Ingrédients directs</h4>

            {#if editedAccompaniments.length > 0}
              <div class="accompaniments-list">
                {#each editedAccompaniments as accompaniment, index}
                  <div class="accompaniment-row">
                    <input 
                      type="text" 
                      bind:value={accompaniment.ingredient_name} 
                      placeholder="Nom de l'ingrédient"
                      disabled
                    />
                    <input 
                      type="number" 
                      bind:value={accompaniment.quantity_per_person} 
                      min="0.01" 
                      step="0.01"
                      placeholder="Quantité/pers"
                    />
                    <input 
                      type="text" 
                      bind:value={accompaniment.unit} 
                      placeholder="Unité"
                    />
                    <button 
                      type="button" 
                      class="remove-btn" 
                      on:click={() => removeAccompaniment(index)}
                    >
                      &times;
                    </button>
                  </div>
                {/each}
              </div>
            {:else}
              <p>Aucun accompagnement ajouté.</p>
            {/if}

            <button type="button" class="add-btn" on:click={addAccompaniment}>
              + Ajouter un ingrédient direct
            </button>
          </div>
          
          {#if saveError}
            <p class="error">{saveError}</p>
          {/if}
          
          <div class="modal-actions">
            <button type="button" on:click={closeModal} disabled={isSaving}>
              Annuler
            </button>
            <button 
              type="button" 
              class="save-button" 
              on:click={saveChanges} 
              disabled={isSaving}
            >
              {isSaving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      {:else}
        <p>Aucune donnée de repas disponible.</p>
        <div class="modal-actions">
          <button on:click={closeModal}>Fermer</button>
        </div>
      {/if}
    </div>
  </div>
{/if}

<style>
  /* Existing styles */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 600px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  .meal-info {
    flex-grow: 1;
    overflow-y: auto; /* Allow content to scroll if needed */
  }
  
  h3 {
    margin-top: 0;
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
  }
  
  .meal-info {
    margin: 15px 0;
  }
  
  .accompaniments-section {
    margin: 20px 0;
  }

  .recipes-section {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px dashed #eee;
  }

  .recipes-list, .accompaniments-list {
    margin: 10px 0;
  }

  .recipe-row, .accompaniment-row {
    display: flex;
    margin-bottom: 8px;
    align-items: center;
    gap: 8px; /* Add gap between elements */
  }

  select, input {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  select {
    flex: 3; /* Give more space to recipe select */
  }

  /* Remove specific flex for text input if select needs more space */
  
  .accompaniments-list {
    margin: 10px 0;
  }
  
  .accompaniment-row {
    display: flex;
    margin-bottom: 8px;
    align-items: center;
  }
  
  input {
    padding: 8px;
    margin-right: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  input[type="text"] {
    flex: 2;
  }
  
  input[type="number"] {
    flex: 1;
    min-width: 80px;
  }
  
  .remove-btn {
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    width: 30px;
    height: 30px;
    cursor: pointer;
    font-size: 16px;
  }
  
  .add-btn {
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
    margin-top: 10px;
  }
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
  
  button {
    padding: 8px 16px;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 10px;
  }
  
  .save-button {
    background-color: #007bff;
  }
  
  button:hover {
    opacity: 0.9;
  }
  
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .error {
    color: #dc3545;
    margin-top: 10px;
  }
</style>