<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import type { Recipe } from '$lib/types';
  import RecipeCreateModal from '$lib/components/RecipeCreateModal.svelte';

  export let data: PageData;
  const { recipes } = data;
  
  // State for recipe creation modal
  let showRecipeModal = false;
  let recipesList = recipes;
  let isLoading = false;
  let loadError: string | null = null;
  
  // Function to fetch recipes from API
  async function fetchRecipes() {
    isLoading = true;
    loadError = null;
    
    try {
      console.log("Fetching recipes from API...");
      const response = await fetch('/api/recipes');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recipes: ${response.statusText}`);
      }
      
      const data = await response.json();
      recipesList = data.recipes || [];
      console.log(`Fetched ${recipesList.length} recipes from API`);
      
      // Log the first recipe for debugging
      if (recipesList.length > 0) {
        console.log("First recipe:", recipesList[0]);
      }
    } catch (err: any) {
      console.error("Error fetching recipes:", err);
      loadError = err.message || "Failed to load recipes";
    } finally {
      isLoading = false;
    }
  }
  
  // Fetch recipes on mount
  onMount(() => {
    fetchRecipes();
  });

  // Helper function to format time
  function formatTime(minutes: number | null): string {
    if (!minutes) return '-';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? mins + 'min' : ''}`;
    }
    return `${mins}min`;
  }

  // Group ingredients by type
  function groupIngredientsByType(ingredients: any[]): Record<string, any[]> {
    const grouped: Record<string, any[]> = {};
    
    for (const ingredient of ingredients) {
      const type = ingredient.type || 'autre';
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(ingredient);
    }
    
    return grouped;
  }

  // Get type label in French
  function getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      'légume': 'Légumes',
      'fruit': 'Fruits',
      'viande': 'Viandes',
      'poisson': 'Poissons',
      'pain': 'Pains',
      'condiment': 'Condiments',
      'boisson': 'Boissons',
      'autre': 'Autres'
    };
    
    return labels[type] || 'Autres';
  }
  // Handle new recipe creation
  async function handleRecipeCreated(event: CustomEvent<Recipe>) {
    const newRecipe = event.detail;
    console.log(`New recipe created: ${newRecipe.name}`);
    
    // Refresh recipes list from API
    await fetchRecipes();
  }
</script>

<div class="recipes-container">
  <h1>Mes Recettes</h1>
  
  <div class="actions">
    <button class="add-recipe-btn" on:click={() => showRecipeModal = true}>
      + Ajouter une recette
    </button>
  </div>
  
  {#if isLoading}
    <p class="loading">Chargement des recettes...</p>
  {:else if loadError}
    <p class="error">Erreur: {loadError}</p>
    <button class="retry-btn" on:click={fetchRecipes}>Réessayer</button>
  {:else if recipesList.length === 0}
    <p class="no-recipes">Aucune recette trouvée. Créez votre première recette !</p>
  {:else}
    <div class="recipes-grid">
      {#each recipesList as recipe (recipe.id)}
        <div class="recipe-card">
          <h2>{recipe.name}</h2>
          
          {#if recipe.description}
            <p class="recipe-description">{recipe.description}</p>
          {/if}
          
          <div class="recipe-meta">
            <span><strong>Portions:</strong> {recipe.servings}</span>
            {#if recipe.prep_time_minutes}
              <span><strong>Préparation:</strong> {formatTime(recipe.prep_time_minutes)}</span>
            {/if}
            {#if recipe.cook_time_minutes}
              <span><strong>Cuisson:</strong> {formatTime(recipe.cook_time_minutes)}</span>
            {/if}
          </div>
          
          <div class="recipe-ingredients">
            <h3>Ingrédients</h3>
            {#if recipe.ingredients && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0}
              {@const groupedIngredients = groupIngredientsByType(recipe.ingredients)}
              
              {#each Object.entries(groupedIngredients) as [type, ingredients]}
                <div class="ingredient-group">
                  <h4>{getTypeLabel(type)}</h4>
                  <ul>
                    {#each ingredients as ingredient}
                      <li>
                        <span class="quantity">{ingredient.quantity}</span>
                        <span class="unit">{ingredient.unit}</span>
                        <span class="name">{ingredient.name}</span>
                      </li>
                    {/each}
                  </ul>
                </div>
              {/each}
            {:else}
              <p>Aucun ingrédient spécifié</p>
            {/if}
          </div>
          
          {#if recipe.instructions}
            <div class="recipe-instructions">
              <h3>Instructions</h3>
              <p>{recipe.instructions}</p>
            </div>
          {/if}
          
          {#if recipe.kitchen_tools && Array.isArray(recipe.kitchen_tools) && recipe.kitchen_tools.length > 0}
            <div class="recipe-tools">
              <h3>Ustensiles</h3>
              <ul>
                {#each recipe.kitchen_tools as tool}
                  <li>{tool.name}</li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
  
  <!-- Recipe creation modal - déplacé en dehors de la boucle each -->
  <RecipeCreateModal
    showModal={showRecipeModal}
    on:close={() => showRecipeModal = false}
    on:recipeCreated={handleRecipeCreated}
  />
</div>

<style>
  .recipes-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  .actions {
    margin-bottom: 2rem;
    display: flex;
    justify-content: flex-end;
  }
  
  .add-recipe-btn {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .add-recipe-btn:hover {
    background-color: #0056b3;
  }
  
  h1 {
    color: #333;
    margin-bottom: 2rem;
    border-bottom: 2px solid #eee;
    padding-bottom: 0.5rem;
  }
  
  .loading, .error, .no-recipes {
    text-align: center;
    color: #666;
    font-style: italic;
    margin: 3rem 0;
  }
  
  .error {
    color: #dc3545;
  }
  
  .retry-btn {
    display: block;
    margin: 1rem auto;
    padding: 0.5rem 1rem;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .recipes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
  }
  
  .recipe-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 1.5rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  
  .recipe-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
  }
  
  .recipe-card h2 {
    color: #333;
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
  
  .recipe-description {
    color: #666;
    font-style: italic;
    margin-bottom: 1rem;
  }
  
  .recipe-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    color: #555;
  }
  
  .recipe-ingredients, 
  .recipe-instructions,
  .recipe-tools {
    margin-bottom: 1.5rem;
  }
  
  .recipe-ingredients h3,
  .recipe-instructions h3,
  .recipe-tools h3 {
    font-size: 1.2rem;
    color: #444;
    margin-bottom: 0.75rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.3rem;
  }
  
  .ingredient-group h4 {
    font-size: 1rem;
    color: #555;
    margin: 0.75rem 0 0.5rem 0;
    background-color: #f5f5f5;
    padding: 0.3rem 0.5rem;
    border-radius: 4px;
  }
  
  .recipe-ingredients ul,
  .recipe-tools ul {
    list-style-type: none;
    padding-left: 0;
    margin: 0.5rem 0;
  }
  
  .recipe-ingredients li {
    margin-bottom: 0.3rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
  
  .recipe-ingredients .quantity {
    font-weight: bold;
    min-width: 2.5rem;
  }
  
  .recipe-ingredients .unit {
    color: #666;
    min-width: 2rem;
  }
  
  .recipe-tools li {
    margin-bottom: 0.3rem;
    color: #555;
  }
  
  .recipe-instructions p {
    white-space: pre-line;
    line-height: 1.5;
    color: #333;
  }
  
  @media (max-width: 768px) {
    .recipes-grid {
      grid-template-columns: 1fr;
    }
  }
</style>