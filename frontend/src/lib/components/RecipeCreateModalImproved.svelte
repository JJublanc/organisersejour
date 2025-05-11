<script lang="ts">
  import { createEventDispatcher, onMount, tick } from 'svelte';
  import type { Ingredient, KitchenTool } from '$lib/types';
  import { Button, Card, Input } from '$lib/components/ui';

  // Define the structure for the new recipe data being built
  interface NewRecipeData {
    name: string;
    description: string;
    prep_time_minutes: number | null;
    cook_time_minutes: number | null;
    instructions: string;
    servings: number;
    season: 'spring' | 'summer' | 'autumn' | 'winter' | null;
    ingredients: { ingredient_id: number; quantity: number; unit: string; name: string }[];
    kitchen_tool_ids: number[];
  }

  export let showModal: boolean = false;

  // State for the form
  let recipe: NewRecipeData = resetRecipeData();
  
  // Variables intermédiaires pour les champs numériques
  let servingsStr: string = "1";
  let prepTimeStr: string = "";
  let cookTimeStr: string = "";

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
      season: null,
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
    // Reset string values
    servingsStr = "1";
    prepTimeStr = "";
    cookTimeStr = "";
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
  
  // Synchroniser les valeurs string et number
  $: recipe.servings = parseInt(servingsStr) || 1;
  $: recipe.prep_time_minutes = prepTimeStr ? parseInt(prepTimeStr) : null;
  $: recipe.cook_time_minutes = cookTimeStr ? parseInt(cookTimeStr) : null;

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
      season: recipe.season,
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
  <div class="modal-backdrop" on:click|self={closeModal}>
    <div class="modal-content" on:click|stopPropagation>
      <Card variant="elevated" padding="lg" className="recipe-create-modal">
        <div slot="header" class="flex justify-between items-center">
          <h3 class="text-xl font-semibold text-neutral-800">Créer une nouvelle recette</h3>
        </div>

        {#if loadingError}
          <div class="alert alert-danger">
            <p>Erreur de chargement des données : {loadingError}</p>
          </div>
          <div class="flex justify-end mt-4">
            <Button on:click={closeModal}>Fermer</Button>
          </div>
        {:else if isLoadingData}
          <div class="flex justify-center items-center py-8">
            <div class="loading-spinner"></div>
            <p class="ml-4 text-neutral-600">Chargement des ingrédients et ustensiles...</p>
          </div>
        {:else}
          <form on:submit|preventDefault={saveRecipe}>
            <div class="grid grid-cols-2 gap-4">
              <!-- Basic Info -->
              <div class="col-span-2">
                <Input 
                  label="Nom de la recette *" 
                  id="recipe-name" 
                  bind:value={recipe.name} 
                  required 
                  error={!recipe.name && saveError ? "Le nom est requis" : ""}
                />
              </div>
              
              <div>
                <Input
                  label="Portions *"
                  type="number"
                  id="recipe-servings"
                  bind:value={servingsStr}
                  min="1"
                  required
                />
              </div>
              
              <div>
                <Input
                  label="Temps prép. (min)"
                  type="number"
                  id="recipe-prep-time"
                  bind:value={prepTimeStr}
                  min="0"
                />
              </div>
              
              <div>
                <Input
                  label="Temps cuisson (min)"
                  type="number"
                  id="recipe-cook-time"
                  bind:value={cookTimeStr}
                  min="0"
                />
              </div>
              
              <div>
                <label for="recipe-season" class="block mb-1 font-medium text-neutral-700">Saison</label>
                <select 
                  id="recipe-season" 
                  bind:value={recipe.season}
                  class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value={null}>Toutes saisons</option>
                  <option value="spring">Printemps</option>
                  <option value="summer">Été</option>
                  <option value="autumn">Automne</option>
                  <option value="winter">Hiver</option>
                </select>
              </div>

              <div class="col-span-2">
                <label for="recipe-description" class="block mb-1 font-medium text-neutral-700">Description</label>
                <textarea 
                  id="recipe-description" 
                  bind:value={recipe.description} 
                  rows="3"
                  class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                ></textarea>
              </div>
              
              <div class="col-span-2">
                <label for="recipe-instructions" class="block mb-1 font-medium text-neutral-700">Instructions</label>
                <textarea 
                  id="recipe-instructions" 
                  bind:value={recipe.instructions} 
                  rows="6"
                  class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                ></textarea>
              </div>

              <!-- Ingredients -->
              <div class="col-span-2 mt-4">
                <Card variant="outlined" padding="md">
                  <div slot="header" class="flex justify-between items-center">
                    <h4 class="text-lg font-medium text-neutral-700">Ingrédients *</h4>
                    <Button 
                      variant={showNewIngredientForm ? "danger" : "secondary"} 
                      size="sm" 
                      on:click={() => showNewIngredientForm = !showNewIngredientForm}
                    >
                      {showNewIngredientForm ? 'Annuler' : '+ Nouvel Ingrédient'}
                    </Button>
                  </div>

                  {#if showNewIngredientForm}
                    <div class="bg-neutral-50 p-4 rounded-md mb-4 border border-neutral-200">
                      <div class="grid grid-cols-3 gap-3">
                        <Input 
                          placeholder="Nom ingrédient" 
                          bind:value={newIngredientName} 
                          error={addIngredientError && !newIngredientName ? "Le nom est requis" : ""}
                        />
                        <Input 
                          placeholder="Unité (g, ml, pcs...)" 
                          bind:value={newIngredientUnit} 
                          error={addIngredientError && !newIngredientUnit ? "L'unité est requise" : ""}
                        />
                        <div>
                          <select 
                            bind:value={newIngredientType}
                            class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="boisson">Boisson</option>
                            <option value="pain">Pain</option>
                            <option value="condiment">Condiment</option>
                            <option value="légume">Légume</option>
                            <option value="fruit">Fruit</option>
                            <option value="viande">Viande</option>
                            <option value="poisson">Poisson</option>
                            <option value="autre">Autre</option>
                          </select>
                        </div>
                      </div>
                      <div class="flex justify-end mt-3">
                        <Button 
                          variant="primary" 
                          on:click={saveNewIngredient} 
                          disabled={isAddingIngredient}
                        >
                          {isAddingIngredient ? 'Ajout...' : 'Ajouter'}
                        </Button>
                      </div>
                      {#if addIngredientError}
                        <p class="text-danger-500 text-sm mt-2">{addIngredientError}</p>
                      {/if}
                    </div>
                  {/if}

                  {#each recipe.ingredients as ingredient, i (i)}
                    <div class="flex items-center mb-3 gap-2">
                      <div class="flex-1">
                        <select
                          required
                          bind:value={ingredient.ingredient_id}
                          on:change={(e) => handleIngredientSelect(e, i)}
                          class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          <option value={0} disabled>-- Sélectionner --</option>
                          {#each availableIngredients as availIng (availIng.id)}
                            <option value={availIng.id}>{availIng.name}</option>
                          {/each}
                        </select>
                      </div>
                      <div class="w-24 flex-shrink-0">
                        <input
                          type="number"
                          step="any"
                          min="0.01"
                          placeholder="Qté"
                          bind:value={ingredient.quantity}
                          required
                          class="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div class="w-16 flex-shrink-0 text-neutral-600">
                        {ingredient.unit || 'Unité'}
                      </div>
                      <div class="w-10 flex-shrink-0">
                        <button
                          type="button"
                          class="bg-danger-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-danger-600 transition-colors"
                          on:click={() => removeIngredientField(i)}
                          title="Supprimer ingrédient"
                        >
                          &times;
                        </button>
                      </div>
                    </div>
                  {/each}
                  
                  <div class="mt-3">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      on:click={addIngredientField}
                      className="w-full"
                    >
                      + Ajouter ligne ingrédient
                    </Button>
                  </div>
                </Card>
              </div>

              <!-- Kitchen Tools -->
              <div class="col-span-2 mt-4">
                <Card variant="outlined" padding="md">
                  <div slot="header" class="flex justify-between items-center">
                    <h4 class="text-lg font-medium text-neutral-700">Ustensiles (Optionnel)</h4>
                    <Button 
                      variant={showNewToolForm ? "danger" : "secondary"} 
                      size="sm" 
                      on:click={() => showNewToolForm = !showNewToolForm}
                    >
                      {showNewToolForm ? 'Annuler' : '+ Nouvel Ustensile'}
                    </Button>
                  </div>

                  {#if showNewToolForm}
                    <div class="bg-neutral-50 p-4 rounded-md mb-4 border border-neutral-200">
                      <div class="flex gap-3">
                        <div class="flex-1">
                          <Input 
                            placeholder="Nom ustensile" 
                            bind:value={newToolName} 
                            error={addToolError && !newToolName ? "Le nom est requis" : ""}
                          />
                        </div>
                        <Button 
                          variant="primary" 
                          on:click={saveNewTool} 
                          disabled={isAddingTool}
                        >
                          {isAddingTool ? 'Ajout...' : 'Ajouter'}
                        </Button>
                      </div>
                      {#if addToolError}
                        <p class="text-danger-500 text-sm mt-2">{addToolError}</p>
                      {/if}
                    </div>
                  {/if}

                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 border border-neutral-200 rounded-md">
                    {#each availableTools as tool (tool.id)}
                      <label class="flex items-center py-2 px-3 hover:bg-primary-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          bind:group={recipe.kitchen_tool_ids}
                          value={tool.id}
                          class="text-primary-500 focus:ring-primary-500 h-5 w-5 rounded"
                        />
                        <span class="text-sm ml-2">{tool.name}</span>
                      </label>
                    {/each}
                  </div>
                </Card>
              </div>
            </div>

            {#if saveError}
              <div class="alert alert-danger mt-4">
                <p>{saveError}</p>
              </div>
            {/if}

            <div class="flex justify-end gap-4 mt-6 pt-4 border-t border-neutral-200">
              <Button variant="secondary" size="lg" on:click={closeModal} disabled={isSaving}>
                Annuler
              </Button>
              <Button variant="primary" size="lg" type="submit" disabled={isSaving}>
                {isSaving ? 'Sauvegarde...' : 'Créer la recette'}
              </Button>
            </div>
          </form>
        {/if}
      </Card>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.75);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: var(--z-index-modal);
    backdrop-filter: blur(3px);
  }

  .modal-content {
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: var(--shadow-2xl);
    border-radius: var(--border-radius-lg);
  }

  .recipe-create-modal {
    width: 100%;
  }

  /* Styles pour les alertes */
  .alert {
    padding: var(--spacing-3) var(--spacing-4);
    border-radius: var(--border-radius-md);
    margin-bottom: var(--spacing-4);
  }

  .alert-danger {
    background-color: var(--color-danger-50);
    border-left: 4px solid var(--color-danger-500);
    color: var(--color-danger-700);
  }

  /* Animation de chargement */
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--color-neutral-200);
    border-top: 4px solid var(--color-primary-500);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>