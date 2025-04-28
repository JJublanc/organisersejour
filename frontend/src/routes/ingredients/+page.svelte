<script lang="ts">
  import { onMount } from 'svelte';
  import type { PageData } from './$types';
  import type { Ingredient } from '$lib/types';
  import IngredientCreateModal from '$lib/components/IngredientCreateModal.svelte';
  import { fade } from 'svelte/transition';

  export let data: PageData;
  const { ingredients } = data;
  
  // State for ingredient creation modal
  let showIngredientModal = false;
  let ingredientsList = ingredients;
  let isLoading = false;
  let loadError: string | null = null;
  
  // Function to fetch ingredients from API
  async function fetchIngredients() {
    isLoading = true;
    loadError = null;
    
    try {
      console.log("Fetching ingredients from API...");
      const response = await fetch('/api/ingredients');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ingredients: ${response.statusText}`);
      }
      
      const data = await response.json();
      ingredientsList = data.ingredients || [];
      console.log(`Fetched ${ingredientsList.length} ingredients from API`);
      
      // Log the first ingredient for debugging
      if (ingredientsList.length > 0) {
        console.log("First ingredient:", ingredientsList[0]);
      }
    } catch (err: any) {
      console.error("Error fetching ingredients:", err);
      loadError = err.message || "Failed to load ingredients";
    } finally {
      isLoading = false;
    }
  }
  
  // Fetch ingredients on mount
  onMount(() => {
    fetchIngredients();
  });

  // Group ingredients by type
  function groupIngredientsByType(ingredients: Ingredient[]): Record<string, Ingredient[]> {
    const grouped: Record<string, Ingredient[]> = {};
    
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

  // Group ingredients by type
  const groupedIngredients = groupIngredientsByType(ingredients);
  
  // Define the order of types for display
  const typeOrder = ['légume', 'fruit', 'viande', 'poisson', 'pain', 'condiment', 'boisson', 'autre'];
  
  // Handle new ingredient creation
  async function handleIngredientCreated(event: CustomEvent<Ingredient>) {
    const newIngredient = event.detail;
    console.log(`New ingredient created: ${newIngredient.name} (${newIngredient.type})`);
    
    // Refresh ingredients list from API
    await fetchIngredients();
  }
  
  // Handle ingredient deletion
  async function deleteIngredient(id: number, name: string) {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'ingrédient "${name}" ?`)) {
      return;
    }
    
    isLoading = true;
    try {
      const response = await fetch(`/api/ingredients?id=${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || `Erreur lors de la suppression: ${response.statusText}`);
      }
      
      console.log(`Ingredient deleted: ${name} (ID: ${id})`);
      await fetchIngredients();
    } catch (err: any) {
      console.error("Error deleting ingredient:", err);
      loadError = err.message || "Échec de la suppression de l'ingrédient";
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="ingredients-container">
  <h1>Mes Ingrédients</h1>
  
  <div class="actions">
    <button class="add-ingredient-btn" on:click={() => showIngredientModal = true}>
      + Ajouter un ingrédient
    </button>
  </div>
  
  {#if isLoading}
    <p class="loading">Chargement des ingrédients...</p>
  {:else if loadError}
    <p class="error">Erreur: {loadError}</p>
    <button class="retry-btn" on:click={fetchIngredients}>Réessayer</button>
  {:else if ingredientsList.length === 0}
    <p class="no-ingredients">Aucun ingrédient trouvé.</p>
  {:else}
    <div class="ingredients-grid">
      {#each typeOrder as type}
        {@const typeIngredients = groupIngredientsByType(ingredientsList)[type] || []}
        {#if typeIngredients.length > 0}
          <div class="ingredient-category">
            <h2>{getTypeLabel(type)}</h2>
            <div class="ingredient-list">
              {#each typeIngredients as ingredient (ingredient.id)}
                <div class="ingredient-card" transition:fade>
                  <div class="card-header">
                    <h3>{ingredient.name}</h3>
                    <button
                      class="delete-btn"
                      title="Supprimer cet ingrédient"
                      on:click|stopPropagation={() => deleteIngredient(ingredient.id, ingredient.name)}
                    >
                      &times;
                    </button>
                  </div>
                  <p class="ingredient-unit">Unité: {ingredient.unit}</p>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</div>

<!-- Ingredient creation modal -->
<IngredientCreateModal
  showModal={showIngredientModal}
  on:close={() => showIngredientModal = false}
  on:ingredientCreated={handleIngredientCreated}
/>

<style>
  .ingredients-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  h1 {
    color: #333;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #eee;
    padding-bottom: 0.5rem;
  }
  
  .actions {
    margin-bottom: 2rem;
    display: flex;
    justify-content: flex-end;
  }
  
  .add-ingredient-btn {
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.6rem 1.2rem;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }
  
  .add-ingredient-btn:hover {
    background-color: #218838;
  }
  
  .loading, .error, .no-ingredients {
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
  
  .ingredients-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }
  
  .ingredient-category {
    margin-bottom: 2rem;
  }
  
  .ingredient-category h2 {
    color: #444;
    font-size: 1.3rem;
    margin-bottom: 1rem;
    padding-bottom: 0.3rem;
    border-bottom: 1px solid #eee;
  }
  
  .ingredient-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
  
  .ingredient-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    position: relative;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .delete-btn {
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    font-size: 16px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
    opacity: 0.8;
    transition: opacity 0.2s ease, transform 0.2s ease;
  }
  
  .delete-btn:hover {
    opacity: 1;
    transform: scale(1.1);
  }
  
  .ingredient-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .card-header h3 {
    color: #333;
    margin: 0;
    font-size: 1.1rem;
    flex-grow: 1;
  }
  
  .ingredient-unit {
    color: #666;
    font-size: 0.9rem;
    margin: 0;
  }
  
  @media (max-width: 768px) {
    .ingredients-grid {
      grid-template-columns: 1fr;
    }
  }
</style>