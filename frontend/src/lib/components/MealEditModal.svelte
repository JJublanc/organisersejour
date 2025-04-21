<script lang="ts">
  import { createEventDispatcher, onMount, tick } from 'svelte';
  import type { Meal, MealComponent } from '../../routes/trips/[tripId]/+page.server'; // Types defining fetched data structure
  import type { Recipe as FullRecipe } from '../../routes/api/recipes/+server'; // Type for full recipe details
  import type { Ingredient, UpdateMealRequestBody } from '$lib/types'; // Import shared types including the request body
  import RecipeCreateModal from './RecipeCreateModal.svelte';

  // --- Props & Dispatch ---
  export let showModal: boolean = false;
  export let mealData: Meal | null = null; // The meal being edited (contains grouped components)
  const dispatch = createEventDispatcher();

  // --- State ---
  let availableRecipes: FullRecipe[] = [];
  let availableIngredients: Ingredient[] = [];
  let editedComponents: MealComponent[] = []; // Flat list for easier editing
  let drinks: string = '';
  let bread: boolean = false;

  let isLoadingPrereqs = false;
  let loadingError: string | null = null;
  let isSaving = false;
  let saveError: string | null = null;

  let showRecipeCreateModal = false;

  // --- Lifecycle & Watchers ---
  onMount(() => {
      if (showModal) fetchPrerequisites();
  });

  $: if (showModal && availableRecipes.length === 0 && availableIngredients.length === 0 && !isLoadingPrereqs) {
      fetchPrerequisites();
  }

  // Initialize/reset state when modal opens or closes, or mealData changes
  $: if (showModal && mealData) {
      initializeEditorState(mealData);
      saveError = null; // Reset save error
  } else if (!showModal) {
      resetEditorState();
  }

  function initializeEditorState(currentMeal: Meal) {
      drinks = currentMeal.drinks || '';
      bread = currentMeal.bread;
      // Flatten the grouped components into a single list for editing
      editedComponents = Object.values(currentMeal.components).flat().sort((a, b) => a.display_order - b.display_order);
  }

  function resetEditorState() {
      editedComponents = [];
      drinks = '';
      bread = false;
      saveError = null;
      showRecipeCreateModal = false;
      // Don't reset availableRecipes/Ingredients unless necessary
  }

  // --- Data Fetching ---
  async function fetchPrerequisites() {
      isLoadingPrereqs = true;
      loadingError = null;
      console.log("Fetching recipes and ingredients...");
      try {
          const [recipeRes, ingredientRes] = await Promise.all([
              fetch('/api/recipes'),
              fetch('/api/ingredients')
          ]);
          if (!recipeRes.ok) throw new Error(`Failed to fetch recipes: ${recipeRes.statusText}`);
          if (!ingredientRes.ok) throw new Error(`Failed to fetch ingredients: ${ingredientRes.statusText}`);

          const recipeData = await recipeRes.json();
          const ingredientData = await ingredientRes.json();

          availableRecipes = recipeData.recipes || [];
          availableIngredients = ingredientData.ingredients || [];
          console.log(`Fetched ${availableRecipes.length} recipes and ${availableIngredients.length} ingredients.`);
      } catch (err: any) {
          console.error("Error fetching prerequisites:", err);
          loadingError = err.message || "Could not load data.";
      } finally {
          isLoadingPrereqs = false;
      }
  }

  // --- Component Logic ---
  function addComponent(course: MealComponent['course_type']) {
      // Add a placeholder component for the specified course
      const newComponent: MealComponent = {
          id: Date.now(), // Temporary ID for {#each} key, will be ignored by backend
          course_type: course,
          recipe_id: null,
          ingredient_id: null,
          quantity: null, // Will be set if ingredient is chosen
          notes: null,
          display_order: editedComponents.filter(c => c.course_type === course).length, // Basic ordering
          recipe_name: null,
          ingredient_name: null,
          ingredient_unit: null,
      };
      editedComponents = [...editedComponents, newComponent];
  }

  function removeComponent(tempId: number) {
      editedComponents = editedComponents.filter(c => c.id !== tempId);
      // Re-calculate display_order? Or handle on save? Let's handle on save for simplicity now.
  }

  function handleComponentTypeChange(event: Event, index: number) {
      const type = (event.target as HTMLSelectElement).value;
      // Reset related fields when type changes
      editedComponents[index].recipe_id = null;
      editedComponents[index].ingredient_id = null;
      editedComponents[index].quantity = null;
      editedComponents[index].recipe_name = null;
      editedComponents[index].ingredient_name = null;
      editedComponents[index].ingredient_unit = null;
      editedComponents = editedComponents; // Trigger reactivity
  }

   function handleRecipeSelect(event: Event, index: number) {
       const selectedId = parseInt((event.target as HTMLSelectElement).value);
       const recipe = availableRecipes.find(r => r.id === selectedId);
       if (recipe) {
           editedComponents[index].recipe_id = selectedId;
           editedComponents[index].recipe_name = recipe.name;
           editedComponents[index].ingredient_id = null; // Ensure ingredient is null
           editedComponents[index].quantity = null;
           editedComponents[index].ingredient_name = null;
           editedComponents[index].ingredient_unit = null;
           editedComponents = editedComponents;
       }
   }

   function handleIngredientSelect(event: Event, index: number) {
       const selectedId = parseInt((event.target as HTMLSelectElement).value);
       const ingredient = availableIngredients.find(i => i.id === selectedId);
       if (ingredient) {
           editedComponents[index].ingredient_id = selectedId;
           editedComponents[index].ingredient_name = ingredient.name;
           editedComponents[index].ingredient_unit = ingredient.unit;
           editedComponents[index].recipe_id = null; // Ensure recipe is null
           if (editedComponents[index].quantity === null) { // Set default quantity if not set
               editedComponents[index].quantity = 1;
           }
           editedComponents = editedComponents;
       }
   }


  // --- Recipe Creation Modal ---
  function openRecipeCreateModal() { showRecipeCreateModal = true; }
  function closeRecipeCreateModal() { showRecipeCreateModal = false; }
  function handleRecipeCreated(event: CustomEvent<FullRecipe>) {
      const newRecipe = event.detail;
      availableRecipes = [...availableRecipes, newRecipe].sort((a,b) => a.name.localeCompare(b.name));
      // Maybe add the new recipe automatically to the current course? Needs context.
      closeRecipeCreateModal();
  }

  // --- Save & Close ---
  function closeModal() { dispatch('close'); }

  async function saveChanges() {
      if (!mealData) return;
      isSaving = true;
      saveError = null;

      // Filter out invalid components and prepare payload
      const validComponents = editedComponents
          .filter(comp => (comp.recipe_id != null || (comp.ingredient_id != null && comp.quantity != null && comp.quantity > 0)))
          .map((comp, index) => ({ // Assign final display order here
              course_type: comp.course_type,
              recipe_id: comp.recipe_id,
              ingredient_id: comp.ingredient_id,
              quantity: comp.ingredient_id ? comp.quantity : null, // Only send quantity for ingredients
              notes: comp.notes,
              display_order: index // Simple sequential order for now
          }));

      const payload: UpdateMealRequestBody = {
          components: validComponents,
          drinks: drinks || null,
          bread: bread
      };

      console.log(`Saving changes for meal ID: ${mealData.id}`, payload);

      try {
          const response = await fetch(`/api/meals/${mealData.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });
          if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(errorData.error || `Failed to update meal: ${response.statusText}`);
          }
          console.log(`Meal ${mealData.id} updated successfully.`);
          dispatch('mealUpdated');
          closeModal();
      } catch (err: any) {
          console.error("Error saving meal:", err);
          saveError = err.message || "Could not save changes.";
      } finally {
          isSaving = false;
      }
  }

  // Helper to get components for a specific course
  function getComponentsForCourse(course: MealComponent['course_type']): MealComponent[] {
      return editedComponents.filter(c => c.course_type === course);
  }

  // Define courses based on meal type
  let courses: MealComponent['course_type'][] = [];
  $: courses = mealData?.type === 'breakfast'
      ? ['breakfast_item']
      : ['starter', 'main', 'dessert', 'side', 'extra']; // For lunch/dinner

  // Map course types to French labels
  const courseLabels: Record<MealComponent['course_type'], string> = {
      starter: 'Entrée',
      main: 'Plat Principal',
      dessert: 'Dessert',
      side: 'Accompagnement',
      extra: 'Extra / Divers',
      breakfast_item: 'Éléments du Petit Déjeuner'
  };

</script>

{#if showModal}
  <div class="modal-backdrop" on:click={closeModal}>
    <div class="modal-content meal-edit-modal" on:click|stopPropagation>
      {#if mealData}
        <h3>Modifier le repas : {mealData.type} ({courseLabels[courses[0]]})</h3>

        {#if loadingError}
            <p class="error">Erreur de chargement: {loadingError}</p>
        {:else if isLoadingPrereqs}
            <p>Chargement des recettes et ingrédients...</p>
        {:else}
            <div class="edit-form">
                <!-- Course Sections -->
                {#each courses as course (course)}
                    <section class="course-section">
                        <h4>{courseLabels[course]}</h4>
                        {#each getComponentsForCourse(course) as component, i (component.id)}
                            <div class="component-row">
                                <select class="component-type-select" on:change={(e) => handleComponentTypeChange(e, editedComponents.findIndex(c => c.id === component.id))}>
                                    <option value="recipe" selected={component.recipe_id != null}>Recette</option>
                                    <option value="ingredient" selected={component.ingredient_id != null}>Ingrédient Direct</option>
                                </select>

                                {#if component.recipe_id != null || (component.ingredient_id == null)}
                                    <!-- Recipe Selector -->
                                    <select class="item-select" required={component.ingredient_id == null} bind:value={component.recipe_id} on:change={(e) => handleRecipeSelect(e, editedComponents.findIndex(c => c.id === component.id))}>
                                        <option value={null} disabled={component.recipe_id != null}>-- Choisir Recette --</option>
                                        {#each availableRecipes as r (r.id)}
                                            <option value={r.id}>{r.name}</option>
                                        {/each}
                                    </select>
                                    <button type="button" class="inline-create-btn" on:click={openRecipeCreateModal} title="Créer une nouvelle recette">+</button>
                                {:else}
                                    <!-- Ingredient Selector -->
                                    <select class="item-select" required bind:value={component.ingredient_id} on:change={(e) => handleIngredientSelect(e, editedComponents.findIndex(c => c.id === component.id))}>
                                        <option value={null} disabled>-- Choisir Ingrédient --</option>
                                        {#each availableIngredients as ing (ing.id)}
                                            <option value={ing.id}>{ing.name}</option>
                                        {/each}
                                    </select>
                                    <input type="number" class="quantity-input" step="any" min="0.01" placeholder="Qté" bind:value={component.quantity} required />
                                    <span class="unit-span">{component.ingredient_unit || 'Unité'}</span>
                                {/if}

                                <input type="text" class="notes-input" placeholder="Notes (optionnel)" bind:value={component.notes} />
                                <button type="button" class="remove-btn" on:click={() => removeComponent(component.id)} title="Supprimer cet élément">&times;</button>
                            </div>
                        {/each}
                        <button type="button" class="add-btn" on:click={() => addComponent(course)}>+ Ajouter</button>
                    </section>
                {/each}

                <!-- Drinks and Bread -->
                 <section class="extras-section">
                      <h4>Autres</h4>
                      <div class="form-group">
                          <label for="drinks">Boissons :</label>
                          <input type="text" id="drinks" bind:value={drinks} placeholder="Ex: Eau, Jus d'orange" />
                      </div>
                      <div class="form-group">
                          <label class="checkbox-label">
                              <input type="checkbox" bind:checked={bread} />
                              Pain inclus ?
                          </label>
                      </div>
                 </section>

            </div>

            {#if saveError}
                <p class="error save-error">Erreur: {saveError}</p>
            {/if}

            <div class="modal-actions">
              <button type="button" on:click={closeModal} disabled={isSaving}>Annuler</button>
              <button type="button" class="save-button" on:click={saveChanges} disabled={isSaving}>
                {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
        {/if}

      {:else}
        <p>Aucune donnée de repas à modifier.</p>
         <div class="modal-actions">
             <button type="button" on:click={closeModal}>Fermer</button>
         </div>
      {/if}
    </div>
  </div>
{/if}

<!-- Render the Recipe Create Modal -->
<RecipeCreateModal bind:showModal={showRecipeCreateModal} on:close={closeRecipeCreateModal} on:recipeCreated={handleRecipeCreated} />


<style>
  .modal-backdrop {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background-color: rgba(0, 0, 0, 0.6); display: flex;
    justify-content: center; align-items: center; z-index: 1000;
  }

  .meal-edit-modal {
    background-color: white; padding: 1.5rem 2rem; border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2); width: 90%;
    max-width: 700px; max-height: 90vh; overflow-y: auto;
  }

  h3 { margin-top: 0; margin-bottom: 1.5rem; color: #333; }

  .edit-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
  }

  .course-section {
      border: 1px solid #eee;
      border-radius: 6px;
      padding: 1rem 1.5rem;
      background-color: #fdfdfd;
  }
  .course-section h4 {
      margin-top: 0;
      margin-bottom: 1rem;
      color: #444;
      border-bottom: 1px dashed #ddd;
      padding-bottom: 0.5rem;
  }

  .component-row {
      display: grid;
      grid-template-columns: auto 1fr auto auto auto auto; /* Type, ItemSelect, CreateBtn/Qty, Unit, Notes, Remove */
      gap: 0.5rem;
      align-items: center;
      margin-bottom: 0.75rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #f0f0f0;
  }
   .component-row:last-child {
       border-bottom: none;
       margin-bottom: 0;
   }

   select, input[type="text"], input[type="number"] {
       padding: 0.5rem;
       border: 1px solid #ccc;
       border-radius: 4px;
       font-size: 0.95em;
   }
   .component-type-select { width: auto; }
   .item-select { flex-grow: 1; }
   .quantity-input { width: 70px; text-align: right; }
   .unit-span { font-size: 0.9em; color: #666; white-space: nowrap; }
   .notes-input { width: 150px; } /* Adjust width as needed */

   .inline-create-btn {
       padding: 0.3rem 0.5rem; font-size: 0.8em; margin-left: -0.3rem; /* Overlap slightly */
   }

   .add-btn, .remove-btn {
       padding: 0.3rem 0.6rem; font-size: 0.9em; border-radius: 4px; cursor: pointer;
   }
   .add-btn { background-color: #e0e0e0; border: 1px solid #ccc; margin-top: 0.5rem; }
   .remove-btn { background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; font-weight: bold; line-height: 1; padding: 0.4rem 0.6rem; }

   .extras-section { margin-top: 1rem; padding-top: 1rem; border-top: 1px solid #eee; }
   .extras-section .form-group { margin-bottom: 0.75rem; }
   .checkbox-label { display: flex; align-items: center; font-weight: normal; }
   .checkbox-label input { margin-right: 0.5rem; }


  .modal-actions {
    display: flex; justify-content: flex-end; gap: 1rem;
    margin-top: 2rem; border-top: 1px solid #eee; padding-top: 1rem;
  }

  button { /* Base button styles */
    padding: 0.6rem 1.2rem; border: 1px solid #ccc; border-radius: 4px;
    cursor: pointer; background-color: #f0f0f0;
  }
  button:hover { background-color: #e0e0e0; }
  button:disabled { opacity: 0.6; cursor: not-allowed; }

  .save-button { /* Specific save button styles */
    background-color: #28a745; color: white; border-color: #28a745;
  }
  .save-button:hover { background-color: #218838; border-color: #1e7e34; }
  .save-button:disabled { background-color: #5cb85c; border-color: #5cb85c; }

  .error { color: #dc3545; font-size: 0.9rem; margin-top: 0.5rem; }
  .save-error { text-align: right; margin-top: -1rem; margin-bottom: 1rem; }

</style>