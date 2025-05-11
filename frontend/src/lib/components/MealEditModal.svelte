<script lang="ts">
  import { createEventDispatcher, onMount, tick } from 'svelte';
  import type { Meal, MealComponent, Ingredient } from '$lib/types';
  import type { Recipe as FullRecipe } from '../../routes/api/recipes/+server';
  import RecipeCreateModal from './RecipeCreateModal.svelte';
  import IngredientCreateModal from './IngredientCreateModal.svelte';

  // Props & Dispatch
  export let showModal: boolean = false;
  export let mealData: Meal | null = null;
  const dispatch = createEventDispatcher();

  // State
  let availableRecipes: FullRecipe[] = [];
  let availableIngredients: Ingredient[] = [];
  let editedComponents: MealComponent[] = [];
  let isLoading = false;
  let errorMessage: string | null = null;
  
  // Modal states
  let showRecipeCreateModal = false;
  let showIngredientCreateModal = false;
  let activeComponentIndexForCreate: number | null = null;

  // Lifecycle
  onMount(async () => {
    if (showModal) {
      await loadData();
    }
  });

  // Only load data once when the modal opens
  let hasLoaded = false;
  $: if (showModal && mealData && !hasLoaded) {
    hasLoaded = true;
    loadData();
  }

  // Functions
  async function loadData() {
    isLoading = true;
    errorMessage = null;
    
    try {
      // Initialize components from meal data
      if (mealData) {
        console.log("Loading meal data:", mealData);
        
        // Initialize recipe components and accompaniments
        const recipeComps = mealData.recipe_components ? 
          Object.values(mealData.recipe_components).flat() : [];
        const accompaniments = mealData.accompaniments || [];
        
        // Combine all components
        editedComponents = [...recipeComps, ...accompaniments];
        console.log("Initialized components:", editedComponents);
      }
      
      // Fetch recipes and ingredients
      console.log("Fetching recipes and ingredients...");
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
      console.log(`Loaded ${availableRecipes.length} recipes and ${availableIngredients.length} ingredients`);
      
    } catch (error: any) {
      console.error("Error loading data:", error);
      errorMessage = error.message || "Failed to load data";
    } finally {
      isLoading = false;
    }
  }

  function closeModal() {
    dispatch('close');
  }
  
  async function saveChanges() {
    if (!mealData) return;
    
    try {
      console.log("Saving changes to meal:", mealData.id);
      isLoading = true;
      errorMessage = null;
      
      // Prepare the payload for the API
      const payload = {
        components: editedComponents
          // Filter out invalid components (must have either recipe_id or ingredient_id)
          .filter(comp => (comp.recipe_id != null && comp.recipe_id > 0) ||
                          (comp.ingredient_id != null && comp.ingredient_id > 0))
          // Map to the format expected by the API
          .map((comp, index) => {
            const isIngredient = comp.ingredient_id != null && comp.ingredient_id > 0;
            
            return {
              course_type: comp.course_type,
              recipe_id: comp.recipe_id,
              ingredient_id: comp.ingredient_id,
              // Only include fields that are valid for the component type
              total_quantity: isIngredient ? null : comp.total_quantity,
              unit: isIngredient ? comp.unit : null,
              quantity_per_person: isIngredient ? comp.quantity_per_person : null,
              notes: comp.notes,
              display_order: index // Use index for consistent ordering
            };
          })
      };
      
      console.log("Saving payload:", payload);
      
      // Send the update to the server
      const response = await fetch(`/api/meals/${mealData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to update meal: ${response.statusText}`);
      }
      
      console.log("Meal updated successfully");
      dispatch('mealUpdated');
      closeModal();
      
    } catch (error: any) {
      console.error("Error saving meal:", error);
      errorMessage = error.message || "Failed to save changes";
    } finally {
      isLoading = false;
    }
  }

  function addRecipe(courseType: string) {
    const newId = Date.now();
    const newComponent = {
      id: newId,
      course_type: courseType as MealComponent['course_type'],
      recipe_id: null,
      ingredient_id: null,
      total_quantity: null,
      unit: null,
      quantity_per_person: null,
      notes: null,
      display_order: editedComponents.length,
      recipe_name: null,
      ingredient_name: null,
      ingredient_unit: null
    };
    
    editedComponents = [...editedComponents, newComponent];
    console.log(`Added new recipe component with ID ${newId} for course ${courseType}`);
  }

  function addIngredient() {
    const newId = Date.now();
    const newComponent = {
      id: newId,
      course_type: 'extra' as MealComponent['course_type'], // Ingredients are typically 'extra'
      recipe_id: null,
      ingredient_id: null,
      total_quantity: null,
      unit: null,
      quantity_per_person: 1, // Default to 1 per person
      notes: null,
      display_order: editedComponents.length,
      recipe_name: null,
      ingredient_name: null,
      ingredient_unit: null
    };
    
    editedComponents = [...editedComponents, newComponent];
    console.log(`Added new ingredient component with ID ${newId}`);
  }

  function selectRecipe(componentId: number, recipeId: number) {
    const recipe = availableRecipes.find(r => r.id === recipeId);
    if (!recipe) return;
    
    editedComponents = editedComponents.map(comp => {
      if (comp.id === componentId) {
        return {
          ...comp,
          recipe_id: recipeId,
          recipe_name: recipe.name,
          ingredient_id: null,
          ingredient_name: null,
          unit: null,
          quantity_per_person: null
        };
      }
      return comp;
    });
    
    console.log(`Selected recipe ${recipe.name} for component ${componentId}`);
  }

  function selectIngredient(componentId: number, ingredientId: number) {
    const ingredient = availableIngredients.find(i => i.id === ingredientId);
    if (!ingredient) return;
    
    editedComponents = editedComponents.map(comp => {
      if (comp.id === componentId) {
        return {
          ...comp,
          ingredient_id: ingredientId,
          ingredient_name: ingredient.name,
          unit: ingredient.unit,
          ingredient_unit: ingredient.unit,
          recipe_id: null,
          recipe_name: null,
          quantity_per_person: comp.quantity_per_person || 1
        };
      }
      return comp;
    });
    
    console.log(`Selected ingredient ${ingredient.name} for component ${componentId}`);
  }

  function updateIngredientQuantity(componentId: number, quantity: number) {
    editedComponents = editedComponents.map(comp => {
      if (comp.id === componentId) {
        return {
          ...comp,
          quantity_per_person: quantity
        };
      }
      return comp;
    });
  }

  function removeComponent(componentId: number) {
    editedComponents = editedComponents.filter(comp => comp.id !== componentId);
    console.log(`Removed component ${componentId}`);
  }
  
  // Recipe creation modal functions
  function openRecipeCreateModal() {
    showRecipeCreateModal = true;
  }
  
  function closeRecipeCreateModal() {
    showRecipeCreateModal = false;
  }
  
  async function handleRecipeCreated(event: CustomEvent<FullRecipe>) {
    const newRecipe = event.detail;
    
    // Add to available recipes list
    availableRecipes = [...availableRecipes, newRecipe].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    
    console.log(`New recipe created: ${newRecipe.name}`);
    closeRecipeCreateModal();
  }
  
  // Ingredient creation modal functions
  function openIngredientCreateModal(componentIndex: number | null = null) {
    activeComponentIndexForCreate = componentIndex;
    showIngredientCreateModal = true;
  }
  
  function closeIngredientCreateModal() {
    showIngredientCreateModal = false;
    activeComponentIndexForCreate = null;
  }
  
  async function handleIngredientCreated(event: CustomEvent<Ingredient>) {
    const newIngredient = event.detail;
    
    // Add to available ingredients list
    availableIngredients = [...availableIngredients, newIngredient].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    
    // If we have an active component, update it with the new ingredient
    if (activeComponentIndexForCreate !== null) {
      editedComponents = editedComponents.map((comp, index) => {
        if (index === activeComponentIndexForCreate) {
          return {
            ...comp,
            ingredient_id: newIngredient.id,
            ingredient_name: newIngredient.name,
            unit: newIngredient.unit,
            ingredient_unit: newIngredient.unit,
            recipe_id: null,
            recipe_name: null,
            quantity_per_person: comp.quantity_per_person || 1
          };
        }
        return comp;
      });
      
      await tick();
    }
    
    console.log(`New ingredient created: ${newIngredient.name}`);
    closeIngredientCreateModal();
  }

  // Define courses based on meal type
  $: courses = mealData?.type === 'breakfast'
    ? ['breakfast_item', 'extra'] as const
    : ['starter', 'main', 'dessert', 'side', 'extra'] as const;

  // Map course types to French labels
  const courseLabels: Record<string, string> = {
    starter: 'Entrée',
    main: 'Plat Principal',
    dessert: 'Dessert',
    side: 'Accompagnement',
    extra: 'Extra / Divers',
    breakfast_item: 'Éléments du Petit Déjeuner'
  };
  
  // Function to add a drink component
  function addDrink() {
    const newId = Date.now();
    const newComponent = {
      id: newId,
      course_type: 'extra' as MealComponent['course_type'],
      recipe_id: null,
      ingredient_id: null,
      total_quantity: null,
      unit: null,
      quantity_per_person: null,
      notes: 'Boisson',
      display_order: editedComponents.length,
      recipe_name: null,
      ingredient_name: null,
      ingredient_unit: null
    };
    
    editedComponents = [...editedComponents, newComponent];
    console.log(`Added new drink component with ID ${newId}`);
  }
  
  // Function to add a bread component
  function addBread() {
    const newId = Date.now();
    const newComponent = {
      id: newId,
      course_type: 'extra' as MealComponent['course_type'],
      recipe_id: null,
      ingredient_id: null,
      total_quantity: null,
      unit: null,
      quantity_per_person: null,
      notes: 'Pain',
      display_order: editedComponents.length,
      recipe_name: null,
      ingredient_name: null,
      ingredient_unit: null
    };
    
    editedComponents = [...editedComponents, newComponent];
    console.log(`Added new bread component with ID ${newId}`);
  }
</script>

{#if showModal}
  <div class="modal-backdrop" on:click|preventDefault={() => closeModal()}>
    <div class="modal-content" on:click|stopPropagation|preventDefault>
      <h3>Modifier le repas</h3>
      
      {#if isLoading}
        <p>Chargement...</p>
      {:else if errorMessage}
        <p class="error">{errorMessage}</p>
      {:else if mealData}
        <div class="edit-form">
          <!-- Recipe Sections -->
          {#each courses as course}
            <section class="course-section">
              <h4>{courseLabels[course]}</h4>
              
              <!-- Recipe components for this course (excluding drinks and bread in the 'extra' section) -->
              {#each editedComponents.filter(c => {
                // For the 'extra' course, exclude components with notes 'Boisson' or 'Pain'
                if (course === 'extra' && (c.notes === 'Boisson' || c.notes === 'Pain')) {
                  return false;
                }
                // Otherwise, include components for this course that don't have a recipe or ingredient selected yet
                return c.course_type === course && c.recipe_id === null && c.ingredient_id === null;
              }) as component (component.id)}
                <div class="component-row">
                  <div class="component-row-content">
                    <select
                      value={component.recipe_id || ''}
                      on:change={(e) => {
                        const target = e.target as HTMLSelectElement;
                        selectRecipe(component.id, parseInt(target.value));
                      }}
                    >
                      <option value="" disabled>-- Choisir une recette --</option>
                      {#each availableRecipes as recipe}
                        <option value={recipe.id}>{recipe.name}</option>
                      {/each}
                    </select>
                    
                    <button
                      type="button"
                      class="create-btn"
                      on:click|preventDefault={() => openRecipeCreateModal()}
                      title="Créer une nouvelle recette"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    type="button"
                    class="remove-btn"
                    on:click|preventDefault={() => removeComponent(component.id)}
                  >
                    &times;
                  </button>
                </div>
              {/each}
              
              <!-- Show selected recipes for this course (excluding drinks and bread in the 'extra' section) -->
              {#each editedComponents.filter(c => {
                // For the 'extra' course, exclude components with notes 'Boisson' or 'Pain'
                if (course === 'extra' && (c.notes === 'Boisson' || c.notes === 'Pain')) {
                  return false;
                }
                // Otherwise, include components for this course that have a recipe selected
                return c.course_type === course && c.recipe_id !== null;
              }) as component (component.id)}
                <div class="component-row selected-recipe">
                  <div class="component-row-content">
                    <span class="selected-item-name">{component.recipe_name}</span>
                  </div>
                  
                  <button
                    type="button"
                    class="remove-btn"
                    on:click|preventDefault={() => removeComponent(component.id)}
                  >
                    &times;
                  </button>
                </div>
              {/each}
              
              <button
                type="button"
                class="add-btn"
                on:click|preventDefault={() => addRecipe(course)}
              >
                + Ajouter Recette
              </button>
            </section>
          {/each}
          
          <!-- La section des ingrédients a été supprimée pour tous les types de repas -->
          
          <!-- Drinks Section -->
          <section class="course-section drinks-section">
            <h4>Boissons</h4>
            
            <!-- Unselected drink components -->
            {#each editedComponents.filter(c => c.notes === 'Boisson' && c.recipe_id === null && c.ingredient_id === null) as component (component.id)}
              <div class="component-row">
                <div class="component-row-content">
                  <select
                    value={component.ingredient_id || ''}
                    on:change={(e) => {
                      const target = e.target as HTMLSelectElement;
                      selectIngredient(component.id, parseInt(target.value));
                    }}
                  >
                    <option value="" disabled>-- Choisir une boisson --</option>
                    {#each availableIngredients.filter(ingredient =>
                      // Filtrer les ingrédients de type "boisson"
                      ingredient.type === 'boisson'
                    ) as ingredient}
                      <option value={ingredient.id}>{ingredient.name}</option>
                    {/each}
                  </select>
                  
                  <button
                    type="button"
                    class="create-btn"
                    on:click|preventDefault={() => openIngredientCreateModal(editedComponents.indexOf(component))}
                    title="Créer un nouvel ingrédient de type boisson"
                  >
                    +
                  </button>
                </div>
                
                <button
                  type="button"
                  class="remove-btn"
                  on:click|preventDefault={() => removeComponent(component.id)}
                >
                  &times;
                </button>
              </div>
            {/each}
            
            <!-- Selected drink components -->
            {#each editedComponents.filter(c => c.notes === 'Boisson' && c.ingredient_id !== null) as component (component.id)}
              <div class="component-row selected-recipe">
                <div class="component-row-content">
                  <span class="selected-item-name">{component.ingredient_name}</span>
                  
                  <div class="quantity-input-group">
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={component.quantity_per_person || 1}
                      on:input={(e) => {
                        const target = e.target as HTMLInputElement;
                        updateIngredientQuantity(component.id, parseFloat(target.value));
                      }}
                    />
                    <span class="unit">{component.unit}/pers</span>
                  </div>
                </div>
                
                <button
                  type="button"
                  class="remove-btn"
                  on:click|preventDefault={() => removeComponent(component.id)}
                >
                  &times;
                </button>
              </div>
            {/each}
            
            <button
              type="button"
              class="add-btn"
              on:click|preventDefault={() => addDrink()}
            >
              + Ajouter Boisson
            </button>
          </section>
          
          <!-- Bread Section -->
          <section class="course-section bread-section">
            <h4>Pain</h4>
            
            <!-- Unselected bread components -->
            {#each editedComponents.filter(c => c.notes === 'Pain' && c.recipe_id === null && c.ingredient_id === null) as component (component.id)}
              <div class="component-row">
                <div class="component-row-content">
                  <select
                    value={component.ingredient_id || ''}
                    on:change={(e) => {
                      const target = e.target as HTMLSelectElement;
                      selectIngredient(component.id, parseInt(target.value));
                    }}
                  >
                    <option value="" disabled>-- Choisir un pain --</option>
                    {#each availableIngredients.filter(ingredient =>
                      // Filtrer les ingrédients de type "pain"
                      ingredient.type === 'pain'
                    ) as ingredient}
                      <option value={ingredient.id}>{ingredient.name}</option>
                    {/each}
                  </select>
                  
                  <button
                    type="button"
                    class="create-btn"
                    on:click|preventDefault={() => openIngredientCreateModal(editedComponents.indexOf(component))}
                    title="Créer un nouvel ingrédient de type pain"
                  >
                    +
                  </button>
                </div>
                
                <button
                  type="button"
                  class="remove-btn"
                  on:click|preventDefault={() => removeComponent(component.id)}
                >
                  &times;
                </button>
              </div>
            {/each}
            
            <!-- Selected bread components -->
            {#each editedComponents.filter(c => c.notes === 'Pain' && c.ingredient_id !== null) as component (component.id)}
              <div class="component-row selected-recipe">
                <div class="component-row-content">
                  <span class="selected-item-name">{component.ingredient_name}</span>
                  
                  <div class="quantity-input-group">
                    <input
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={component.quantity_per_person || 1}
                      on:input={(e) => {
                        const target = e.target as HTMLInputElement;
                        updateIngredientQuantity(component.id, parseFloat(target.value));
                      }}
                    />
                    <span class="unit">{component.unit}/pers</span>
                  </div>
                </div>
                
                <button
                  type="button"
                  class="remove-btn"
                  on:click|preventDefault={() => removeComponent(component.id)}
                >
                  &times;
                </button>
              </div>
            {/each}
            
            <button
              type="button"
              class="add-btn"
              on:click|preventDefault={() => addBread()}
            >
              + Ajouter Pain
            </button>
          </section>
        </div>
        
        <div class="modal-actions">
          <button type="button" class="cancel-btn" on:click|preventDefault={() => closeModal()}>Annuler</button>
          <button type="button" class="save-btn" on:click|preventDefault={() => saveChanges()}>Sauvegarder</button>
        </div>
      {:else}
        <p>Aucune donnée de repas disponible</p>
        <div class="modal-actions">
          <button type="button" on:click|preventDefault={() => closeModal()}>Fermer</button>
        </div>
      {/if}
    </div>
  </div>
{/if}

<!-- Render modals -->
<RecipeCreateModal
  bind:showModal={showRecipeCreateModal}
  on:close={closeRecipeCreateModal}
  on:recipeCreated={handleRecipeCreated}
/>

<IngredientCreateModal
  bind:showModal={showIngredientCreateModal}
  on:close={closeIngredientCreateModal}
  on:ingredientCreated={handleIngredientCreated}
/>

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
    z-index: 1000;
  }

  .modal-content {
    background-color: white;
    padding: 1.5rem 2rem;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 700px;
    max-height: 90vh;
    overflow-y: auto;
  }

  h3 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #333;
  }

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
    margin-bottom: 1rem;
  }

  .course-section h4 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #444;
    border-bottom: 1px dashed #ddd;
    padding-bottom: 0.5rem;
  }

  .component-row {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.75rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid #f0f0f0;
    position: relative;
  }
  
  .component-row-content {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
  
  .component-row select,
  .component-row .selected-item-name {
    flex-grow: 1;
  }
  
  .component-row .create-btn {
    flex-shrink: 0;
  }
  
  .selected-recipe {
    background-color: #f8f9fa;
    padding: 0.5rem;
    border-radius: 4px;
  }
  
  .selected-item-name {
    font-weight: 500;
  }
  
  .quantity-input-group {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
  
  .quantity-input-group input {
    width: 60px;
    padding: 0.3rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
  }
  
  .unit {
    font-size: 0.9rem;
    color: #6c757d;
  }
  
  .ingredients-section {
    background-color: #f8fff8;
    border-color: #d1e7dd;
  }
  
  .drinks-section {
    background-color: #f0f8ff;
    border-color: #b8daff;
  }
  
  .bread-section {
    background-color: #fff8f0;
    border-color: #ffeeba;
  }

  .add-btn {
    padding: 0.4rem 0.8rem;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }
  
  .create-btn {
    background-color: #17a2b8;
    color: white;
    border: none;
    border-radius: 4px;
    width: 30px;
    height: 30px;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .remove-btn {
    background-color: rgba(220, 53, 69, 0.7);
    color: white;
    border: none;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    font-size: 0.9rem;
    line-height: 1;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    right: 0;
    transition: background-color 0.2s ease;
    z-index: 10;
    padding: 0;
    margin: 0;
  }
  
  .remove-btn:hover {
    background-color: #dc3545;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1.5rem;
  }

  .modal-actions button {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 0.5rem;
  }
  
  .cancel-btn {
    background-color: #6c757d;
    color: white;
  }
  
  .save-btn {
    background-color: #007bff;
    color: white;
  }

  .error {
    color: #dc3545;
    font-weight: bold;
  }
</style>