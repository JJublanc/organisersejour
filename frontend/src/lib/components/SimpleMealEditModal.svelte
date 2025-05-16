<script lang="ts">
  import type { Meal } from '$lib/types';
  import { createEventDispatcher } from 'svelte';

  // Props
  export let showModal: boolean = false;
  export let mealData: Meal | null = null;
  
  // Event dispatcher
  const dispatch = createEventDispatcher();
  
  // Close modal
  function closeModal() {
    dispatch('close');
  }
  
  // Debug function to log meal data
  function logMealData() {
    console.log("Meal data in SimpleMealEditModal:", mealData);
    if (mealData) {
      console.log("Type:", mealData.type);
      console.log("ID:", mealData.id);
      console.log("Has recipe_components:", !!mealData.recipe_components);
      console.log("Has accompaniments:", !!mealData.accompaniments);
    }
  }
</script>

{#if showModal}
  <div class="modal-backdrop" on:click={closeModal}>
    <div class="modal-content" on:click|stopPropagation>
      <h3>Informations du repas</h3>
      
      {#if mealData}
        <div class="meal-info">
          <p><strong>ID:</strong> {mealData.id}</p>
          <p><strong>Type:</strong> {mealData.type}</p>
          
          <button on:click={logMealData}>Afficher les détails dans la console</button>
          
          <div class="modal-actions">
            <button on:click={closeModal}>Fermer</button>
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
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
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
  
  .modal-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
  
  button {
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 10px;
  }
  
  button:hover {
    background-color: #0056b3;
  }
</style>