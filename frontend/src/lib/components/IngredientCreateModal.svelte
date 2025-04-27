<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Ingredient } from '$lib/types';

  // --- Props & Dispatch ---
  export let showModal: boolean = false;
  const dispatch = createEventDispatcher();

  // --- State ---
  let ingredientName: string = '';
  let ingredientUnit: string = '';
  let ingredientType: 'boisson' | 'pain' | 'condiment' | 'légume' | 'fruit' | 'viande' | 'poisson' | 'autre' = 'autre';
  let isSaving = false;
  let saveError: string | null = null;

  // --- Functions ---
  function closeModal() {
    resetForm();
    dispatch('close');
  }

  function resetForm() {
    ingredientName = '';
    ingredientUnit = '';
    ingredientType = 'autre';
    saveError = null;
    isSaving = false;
  }

  async function createIngredient() {
    if (!ingredientName.trim() || !ingredientUnit.trim()) {
      saveError = "Le nom et l'unité de l'ingrédient sont requis.";
      return;
    }

    isSaving = true;
    saveError = null;

    try {
      const response = await fetch('/api/ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: ingredientName.trim(),
          unit: ingredientUnit.trim(),
          type: ingredientType
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || `Erreur ${response.status}: ${response.statusText}`);
      }

      const newIngredient: Ingredient = responseData.ingredient;
      console.log('Ingredient created:', newIngredient);
      dispatch('ingredientCreated', newIngredient); // Dispatch event with the new ingredient data
      closeModal(); // Close modal on success

    } catch (err: any) {
      console.error("Error creating ingredient:", err);
      saveError = err.message || "Impossible de créer l'ingrédient.";
    } finally {
      isSaving = false;
    }
  }

  // Reset form when modal is opened
  $: if (showModal) {
    resetForm();
  }
</script>

{#if showModal}
  <div class="modal-backdrop" on:click={closeModal}>
    <div class="modal-content ingredient-create-modal" on:click|stopPropagation>
      <h3>Créer un Nouvel Ingrédient</h3>

      <form on:submit|preventDefault={createIngredient}>
        <div class="form-group">
          <label for="ingredient-name">Nom de l'ingrédient :</label>
          <input type="text" id="ingredient-name" bind:value={ingredientName} required disabled={isSaving} />
        </div>

        <div class="form-group">
          <label for="ingredient-unit">Unité (par défaut) :</label>
          <input type="text" id="ingredient-unit" bind:value={ingredientUnit} placeholder="Ex: g, ml, pièce, unité" required disabled={isSaving} />
        </div>

        <div class="form-group">
          <label for="ingredient-type">Type d'ingrédient :</label>
          <select id="ingredient-type" bind:value={ingredientType} disabled={isSaving}>
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

        {#if saveError}
          <p class="error save-error">Erreur: {saveError}</p>
        {/if}

        <div class="modal-actions">
          <button type="button" on:click={closeModal} disabled={isSaving}>Annuler</button>
          <button type="submit" class="save-button" disabled={isSaving}>
            {isSaving ? 'Création...' : 'Créer Ingrédient'}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  /* Basic Modal Styling (similar to RecipeCreateModal) */
  .modal-backdrop {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background-color: rgba(0, 0, 0, 0.6); display: flex;
    justify-content: center; align-items: center; z-index: 1050; /* Higher z-index if needed */
  }

  .ingredient-create-modal {
    background-color: white; padding: 1.5rem 2rem; border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2); width: 90%;
    max-width: 500px; /* Adjust as needed */
  }

  h3 { margin-top: 0; margin-bottom: 1.5rem; color: #333; }

  .form-group {
    margin-bottom: 1rem;
  }
  .form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
    color: #555;
  }
  .form-group input[type="text"],
  .form-group select {
    width: 100%;
    padding: 0.6rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box; /* Include padding in width */
  }

  .modal-actions {
    display: flex; justify-content: flex-end; gap: 1rem;
    margin-top: 2rem; border-top: 1px solid #eee; padding-top: 1rem;
  }

  button {
    padding: 0.6rem 1.2rem; border: 1px solid #ccc; border-radius: 4px;
    cursor: pointer; background-color: #f0f0f0;
  }
  button:hover { background-color: #e0e0e0; }
  button:disabled { opacity: 0.6; cursor: not-allowed; }

  .save-button {
    background-color: #007bff; color: white; border-color: #007bff;
  }
  .save-button:hover { background-color: #0056b3; border-color: #0056b3; }
  .save-button:disabled { background-color: #6caefc; border-color: #6caefc; }

  .error { color: #dc3545; font-size: 0.9rem; margin-top: 0.5rem; }
  .save-error { margin-top: 1rem; text-align: right; }
</style>