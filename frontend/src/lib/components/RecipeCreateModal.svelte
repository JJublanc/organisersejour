<script lang="ts">
  import { createEventDispatcher, onMount, tick } from 'svelte'; // Import tick
  import type { Ingredient, KitchenTool } from '$lib/types'; // Import base types

  // Define the structure for the new recipe data being built
  interface NewRecipeData {
    name: string;
    description: string;
    prep_time_minutes: number | null;
    cook_time_minutes: number | null;
    instructions: string;
    servings: number;
    ingredients: { ingredient_id: number; quantity: number; unit: string; name: string }[]; // Include unit/name for display
    kitchen_tool_ids: number[];
  }

  export let showModal: boolean = false;

  // State for the form
  let recipe: NewRecipeData = resetRecipeData();

  // State for available ingredients and tools
  let availableIngredients: Ingredient[] = [];
  let availableTools: KitchenTool[] = [];
  let isLoadingData = false;
  let loadingError: string | null = null;

  // State for inline ingredient/tool creation
  let showNewIngredientForm = false;
  let newIngredientName = '';
  let newIngredientUnit = '';
  let newIngredientType: 'boisson' | 'pain' | 'condiment' | 'légume' | 'fruit' | 'viande' | 'poisson' | 'autre' = 'autre';
  let isAddingIngredient = false;
  let addIngredientError: string | null = null;

  let showNewToolForm = false;
  let newToolName = '';
  let isAddingTool = false;
  let addToolError: string | null = null;


  // State for saving recipe
  let isSaving = false;
  let saveError: string | null = null;

  const dispatch = createEventDispatcher();

  function resetRecipeData(): NewRecipeData {
      return {
          name: '',
          description: '',
          prep_time_minutes: null,
          cook_time_minutes: null,
          instructions: '',
          servings: 1,
          ingredients: [],
          kitchen_tool_ids: [],
      };
  }

  // Fetch ingredients and tools when modal becomes visible
  $: if (showModal && availableIngredients.length === 0 && availableTools.length === 0 && !isLoadingData) {
      fetchPrerequisites();
  }

  // Reset form when modal is hidden
  $: if (!showModal) {
      recipe = resetRecipeData();
      saveError = null;
      loadingError = null;
      isSaving = false;
      // Reset inline forms too
      showNewIngredientForm = false;
      newIngredientName = '';
      newIngredientUnit = '';
      isAddingIngredient = false;
      addIngredientError = null;
      showNewToolForm = false;
      newToolName = '';
      isAddingTool = false;
      addToolError = null;
  }


  async function fetchPrerequisites() {
      isLoadingData = true;
      loadingError = null;
      console.log("Fetching ingredients and tools for recipe creation...");
      try {
          const [ingResponse, toolResponse] = await Promise.all([
              fetch('/api/ingredients'),
              fetch('/api/kitchen_tools')
          ]);

          if (!ingResponse.ok) throw new Error(`Failed to fetch ingredients: ${ingResponse.statusText}`);
          if (!toolResponse.ok) throw new Error(`Failed to fetch kitchen tools: ${toolResponse.statusText}`);

          const ingData = await ingResponse.json();
          const toolData = await toolResponse.json();

          availableIngredients = ingData.ingredients || [];
          availableTools = toolData.kitchen_tools || [];
          console.log(`Fetched ${availableIngredients.length} ingredients and ${availableTools.length} tools.`);

      } catch (err: any) {
          console.error("Error fetching prerequisites:", err);
          loadingError = err.message || "Could not load required data.";
      } finally {
          isLoadingData = false;
      }
  }

  function addIngredientField() {
      // Add a placeholder, user will select via dropdown
      recipe.ingredients = [...recipe.ingredients, { ingredient_id: 0, quantity: 1, unit: '', name: '' }];
  }

  function removeIngredientField(index: number) {
      recipe.ingredients.splice(index, 1);
      recipe.ingredients = recipe.ingredients; // Trigger reactivity
  }

  // Update ingredient details when dropdown selection changes
  function handleIngredientSelect(event: Event, index: number) {
      const selectedId = parseInt((event.target as HTMLSelectElement).value);
      const selectedIngredient = availableIngredients.find(ing => ing.id === selectedId);
      if (selectedIngredient) {
          recipe.ingredients[index].ingredient_id = selectedId;
          recipe.ingredients[index].unit = selectedIngredient.unit;
          recipe.ingredients[index].name = selectedIngredient.name;
          recipe.ingredients = recipe.ingredients; // Trigger reactivity
      }
  }

  // --- Inline Ingredient/Tool Creation ---

  async function saveNewIngredient() {
      if (!newIngredientName.trim() || !newIngredientUnit.trim()) {
          addIngredientError = "Le nom et l'unité sont requis.";
          return;
      }
      isAddingIngredient = true;
      addIngredientError = null;
      try {
          const response = await fetch('/api/ingredients', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: newIngredientName.trim(),
                unit: newIngredientUnit.trim(),
                type: newIngredientType
              })
          });
          const data = await response.json();
          if (!response.ok) {
              throw new Error(data.error || `HTTP error ${response.status}`);
          }
          const createdIngredient: Ingredient = data.ingredient;
          console.log("New ingredient created:", createdIngredient);
          availableIngredients = [...availableIngredients, createdIngredient].sort((a, b) => a.name.localeCompare(b.name)); // Add and sort
          // Reset form and hide
          newIngredientName = '';
          newIngredientUnit = '';
          newIngredientType = 'autre';
          showNewIngredientForm = false;
      } catch (err: any) {
          console.error("Error adding ingredient:", err);
          addIngredientError = err.message || "Impossible d'ajouter l'ingrédient.";
      } finally {
          isAddingIngredient = false;
      }
  }

  async function saveNewTool() {
      if (!newToolName.trim()) {
          addToolError = "Le nom de l'ustensile est requis.";
          return;
      }
      isAddingTool = true;
      addToolError = null;
      try {
          const response = await fetch('/api/kitchen_tools', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ name: newToolName.trim() })
          });
           const data = await response.json();
           if (!response.ok) {
               throw new Error(data.error || `HTTP error ${response.status}`);
           }
           const createdTool: KitchenTool = data.kitchen_tool;
           console.log("New tool created:", createdTool);
           availableTools = [...availableTools, createdTool].sort((a, b) => a.name.localeCompare(b.name)); // Add and sort
           // Reset form and hide
           newToolName = '';
           showNewToolForm = false;
           // Optionally check the box for the new tool
           await tick(); // Wait for DOM update
           if (!recipe.kitchen_tool_ids.includes(createdTool.id)) {
                recipe.kitchen_tool_ids = [...recipe.kitchen_tool_ids, createdTool.id];
           }
      } catch (err: any) {
          console.error("Error adding tool:", err);
          addToolError = err.message || "Impossible d'ajouter l'ustensile.";
      } finally {
          isAddingTool = false;
      }
  }


  // --- Recipe Saving ---

  function closeModal() {
    dispatch('close');
  }

  async function saveRecipe() {
      isSaving = true;
      saveError = null;
      console.log("Attempting to save new recipe:", recipe);

      // Basic client-side validation (more robust validation on server)
      if (!recipe.name.trim()) {
          saveError = "Le nom de la recette est requis.";
          isSaving = false;
          return;
      }
       if (recipe.servings < 1) {
           saveError = "Le nombre de portions doit être au moins 1.";
           isSaving = false;
           return;
       }
       if (recipe.ingredients.length === 0 || recipe.ingredients.some(ing => ing.ingredient_id === 0 || ing.quantity <= 0)) {
           saveError = "Veuillez sélectionner au moins un ingrédient valide avec une quantité positive.";
           isSaving = false;
           return;
       }

      // Prepare payload for API (only send necessary ingredient data)
      const payload = {
          name: recipe.name.trim(),
          description: recipe.description.trim() || null,
          prep_time_minutes: recipe.prep_time_minutes,
          cook_time_minutes: recipe.cook_time_minutes,
          instructions: recipe.instructions.trim() || null,
          servings: recipe.servings,
          ingredients: recipe.ingredients.map(ing => ({
              ingredient_id: ing.ingredient_id,
              quantity: ing.quantity
          })),
          kitchen_tool_ids: recipe.kitchen_tool_ids
      };

      try {
          const response = await fetch('/api/recipes', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
          });

          const responseData = await response.json();

          if (!response.ok) {
              throw new Error(responseData.error || `Failed to create recipe: ${response.statusText}`);
          }

          console.log("Recipe created successfully:", responseData.recipe);
          dispatch('recipeCreated', responseData.recipe); // Dispatch event with new recipe data
          closeModal();

      } catch (err: any) {
          console.error("Error saving recipe:", err);
          saveError = err.message || "Could not save recipe.";
      } finally {
          isSaving = false;
      }
  }

</script>

{#if showModal}
  <div class="modal-backdrop" on:click|self={closeModal}> <!-- Close on backdrop click -->
    <div class="modal-content recipe-create-modal" on:click|stopPropagation>
      <h3>Créer une nouvelle recette</h3>

      {#if loadingError}
          <p class="error">Erreur de chargement des données : {loadingError}</p>
          <div class="modal-actions">
              <button on:click={closeModal}>Fermer</button>
          </div>
      {:else if isLoadingData}
          <p>Chargement des ingrédients et ustensiles...</p>
      {:else}
          <form on:submit|preventDefault={saveRecipe}>
              <div class="form-grid">
                  <!-- Basic Info -->
                  <div class="form-group span-2">
                      <label for="recipe-name">Nom de la recette *</label>
                      <input type="text" id="recipe-name" bind:value={recipe.name} required />
                  </div>
                   <div class="form-group">
                       <label for="recipe-servings">Portions *</label>
                       <input type="number" id="recipe-servings" bind:value={recipe.servings} min="1" required />
                   </div>
                   <div class="form-group">
                       <label for="recipe-prep-time">Temps prép. (min)</label>
                       <input type="number" id="recipe-prep-time" bind:value={recipe.prep_time_minutes} min="0" />
                   </div>
                   <div class="form-group">
                       <label for="recipe-cook-time">Temps cuisson (min)</label>
                       <input type="number" id="recipe-cook-time" bind:value={recipe.cook_time_minutes} min="0" />
                   </div>

                  <div class="form-group span-2">
                      <label for="recipe-description">Description</label>
                      <textarea id="recipe-description" bind:value={recipe.description} rows="3"></textarea>
                  </div>
                   <div class="form-group span-2">
                       <label for="recipe-instructions">Instructions</label>
                       <textarea id="recipe-instructions" bind:value={recipe.instructions} rows="6"></textarea>
                   </div>

                  <!-- Ingredients -->
                  <div class="form-group span-2">
                      <div class="section-header">
                          <h4>Ingrédients *</h4>
                          <button type="button" class="inline-add-btn" on:click={() => showNewIngredientForm = !showNewIngredientForm} title="Ajouter un nouvel ingrédient à la base de données">
                              {showNewIngredientForm ? 'Annuler' : '+ Nouvel Ingrédient'}
                          </button>
                      </div>

                      {#if showNewIngredientForm}
                          <div class="inline-form">
                              <input type="text" placeholder="Nom ingrédient" bind:value={newIngredientName} />
                              <input type="text" placeholder="Unité (g, ml, pcs...)" bind:value={newIngredientUnit} />
                              <select bind:value={newIngredientType}>
                                  <option value="boisson">Boisson</option>
                                  <option value="pain">Pain</option>
                                  <option value="condiment">Condiment</option>
                                  <option value="légume">Légume</option>
                                  <option value="fruit">Fruit</option>
                                  <option value="viande">Viande</option>
                                  <option value="poisson">Poisson</option>
                                  <option value="autre">Autre</option>
                              </select>
                              <button type="button" on:click={saveNewIngredient} disabled={isAddingIngredient}>
                                  {isAddingIngredient ? 'Ajout...' : 'Ajouter'}
                              </button>
                              {#if addIngredientError}<p class="inline-error">{addIngredientError}</p>{/if}
                          </div>
                      {/if}

                      {#each recipe.ingredients as ingredient, i (i)}
                          <div class="ingredient-row">
                              <select required bind:value={ingredient.ingredient_id} on:change={(e) => handleIngredientSelect(e, i)}>
                                  <option value={0} disabled>-- Sélectionner --</option>
                                  {#each availableIngredients as availIng (availIng.id)}
                                      <option value={availIng.id}>{availIng.name}</option>
                                  {/each}
                              </select>
                              <input type="number" step="any" min="0.01" placeholder="Qté" bind:value={ingredient.quantity} required />
                              <span>{ingredient.unit || 'Unité'}</span>
                              <button type="button" class="remove-btn" on:click={() => removeIngredientField(i)} title="Supprimer ingrédient">&times;</button>
                          </div>
                      {/each}
                      <button type="button" class="add-btn" on:click={addIngredientField}>+ Ajouter ligne ingrédient</button>
                  </div>

                  <!-- Kitchen Tools -->
                  <div class="form-group span-2">
                       <div class="section-header">
                           <h4>Ustensiles (Optionnel)</h4>
                           <button type="button" class="inline-add-btn" on:click={() => showNewToolForm = !showNewToolForm} title="Ajouter un nouvel ustensile à la base de données">
                               {showNewToolForm ? 'Annuler' : '+ Nouvel Ustensile'}
                           </button>
                       </div>

                       {#if showNewToolForm}
                           <div class="inline-form">
                               <input type="text" placeholder="Nom ustensile" bind:value={newToolName} />
                               <button type="button" on:click={saveNewTool} disabled={isAddingTool}>
                                   {isAddingTool ? 'Ajout...' : 'Ajouter'}
                               </button>
                               {#if addToolError}<p class="inline-error">{addToolError}</p>{/if}
                           </div>
                       {/if}

                       <div class="tools-checkbox-group">
                           {#each availableTools as tool (tool.id)}
                               <label class="tool-label">
                                   <input type="checkbox" bind:group={recipe.kitchen_tool_ids} value={tool.id} />
                                   {tool.name}
                               </label>
                           {/each}
                       </div>
                  </div>
              </div>

              {#if saveError}
                  <p class="error save-error">{saveError}</p>
              {/if}

              <div class="modal-actions">
                <button type="button" on:click={closeModal} disabled={isSaving}>Annuler</button>
                <button type="submit" class="save-button" disabled={isSaving}>
                  {isSaving ? 'Sauvegarde...' : 'Créer la recette'}
                </button>
              </div>
          </form>
      {/if}
    </div>
  </div>
{/if}

<style>
  /* Inherit modal backdrop styles or redefine if needed */
  .modal-backdrop {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background-color: rgba(0, 0, 0, 0.6); display: flex;
    justify-content: center; align-items: center; z-index: 1050; /* Higher z-index */
  }

  .recipe-create-modal {
    background-color: white; padding: 2rem; border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2); width: 90%;
    max-width: 750px; /* Wider for recipe form */
    max-height: 90vh; overflow-y: auto;
  }

  h3 { margin-top: 0; margin-bottom: 1.5rem; color: #333; }

  .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr; /* Two columns */
      gap: 1rem 1.5rem; /* Row and column gap */
  }

  .form-group {
      margin-bottom: 0.5rem; /* Reduced margin within grid */
  }
   .form-group.span-2 {
       grid-column: span 2; /* Make element span both columns */
   }

   .section-header {
       display: flex;
       justify-content: space-between;
       align-items: center;
       margin-top: 1rem;
       margin-bottom: 0.75rem;
       border-bottom: 1px solid #eee;
       padding-bottom: 0.3rem;
   }
   .section-header h4 {
       margin: 0;
       color: #555;
   }
   .inline-add-btn {
       padding: 0.2rem 0.5rem;
       font-size: 0.8em;
       background-color: #f0f0f0;
       border: 1px solid #ccc;
       border-radius: 3px;
       cursor: pointer;
   }
   .inline-add-btn:hover {
       background-color: #e0e0e0;
   }

   .inline-form {
       display: flex;
       gap: 0.5rem;
       padding: 0.5rem;
       margin-bottom: 0.75rem;
       background-color: #f8f9fa;
       border: 1px solid #eee;
       border-radius: 4px;
       align-items: center;
   }
   .inline-form input,
   .inline-form select {
       flex-grow: 1;
       padding: 0.4rem;
       font-size: 0.9em;
   }
   .inline-form button {
       padding: 0.4rem 0.8rem;
       font-size: 0.9em;
   }
   .inline-error {
       color: #dc3545;
       font-size: 0.8em;
       margin-left: 0.5rem;
   }


  label { display: block; margin-bottom: 0.4rem; font-weight: bold; color: #444; font-size: 0.95em;}

  input[type="text"],
  input[type="number"],
  textarea,
  select {
      width: 100%; padding: 0.6rem; border: 1px solid #ccc;
      border-radius: 4px; box-sizing: border-box; font-size: 1em;
  }
  textarea {
      resize: vertical;
  }

  .ingredient-row {
      display: grid;
      grid-template-columns: auto 1fr auto auto; /* Select, Qty, Unit, Remove */
      gap: 0.5rem;
      align-items: center;
      margin-bottom: 0.5rem;
  }
   .ingredient-row span {
       font-size: 0.9em;
       color: #666;
       white-space: nowrap;
   }

  .add-btn, .remove-btn {
      padding: 0.3rem 0.6rem;
      font-size: 0.9em;
      border-radius: 4px;
      cursor: pointer;
  }
  .add-btn {
      background-color: #e0e0e0; border: 1px solid #ccc; margin-top: 0.5rem;
  }
  .remove-btn {
      background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24;
      font-weight: bold; line-height: 1; padding: 0.4rem 0.6rem;
  }

   .tools-checkbox-group {
       display: flex;
       flex-wrap: wrap;
       gap: 0.5rem 1rem;
       max-height: 150px;
       overflow-y: auto;
       border: 1px solid #eee;
       padding: 0.5rem;
       border-radius: 4px;
   }
   .tool-label {
       font-weight: normal;
       display: flex;
       align-items: center;
       font-size: 0.9em;
   }
    .tool-label input[type="checkbox"] {
        margin-right: 0.4rem;
    }


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