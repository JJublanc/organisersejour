<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  export let showModal: boolean = false; // Controlled by parent

  // Form state
  let name = '';
  let startDate = getTodayDateString();
  let endDate = getTodayDateString();
  let location = '';
  let numPeople = 1;
  let isSubmitting = false;
  let errorMessage = '';
  let successMessage = '';

  const dispatch = createEventDispatcher();

  function closeModal() {
    // Reset form on close
    resetForm();
    dispatch('close'); // Notify parent to update showModal
  }

  function resetForm() {
    name = '';
    startDate = getTodayDateString();
    endDate = getTodayDateString();
    location = '';
    numPeople = 1;
    isSubmitting = false;
    errorMessage = '';
    successMessage = '';
  }

  // Helper function (could be moved to a utility file)
  function getTodayDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async function handleSubmit() {
    isSubmitting = true;
    errorMessage = '';
    successMessage = '';

    // Basic client-side validation (optional, server validation is key)
    if (!name || !startDate || !endDate || numPeople < 1) {
        errorMessage = 'Veuillez remplir tous les champs obligatoires.';
        isSubmitting = false;
        return;
    }
    if (new Date(endDate) < new Date(startDate)) {
        errorMessage = 'La date de fin ne peut pas être antérieure à la date de début.';
        isSubmitting = false;
        return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('start_date', startDate);
    formData.append('end_date', endDate);
    formData.append('location', location);
    formData.append('num_people', numPeople.toString());

    try {
      // Use fetch to submit to the action on the /trips page
      // The action will be named 'createTrip' (defined in /trips/+page.server.ts)
      const response = await fetch('/trips?/createTrip', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        // Try to parse error from server response if using fail()
        try {
            const result = await response.json();
            errorMessage = result?.error || `Erreur ${response.status}: ${response.statusText}`;
        } catch {
            errorMessage = `Erreur ${response.status}: ${response.statusText}`;
        }
      } else {
        // Success
        const result = await response.json();
        successMessage = result?.message || 'Séjour créé avec succès !';
        // Optionally close modal on success after a delay, or let parent handle it
        setTimeout(() => {
            closeModal();
            dispatch('tripCreated'); // Notify parent that a trip was created
        }, 1500); // Close after 1.5 seconds
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      errorMessage = 'Une erreur réseau est survenue.';
    } finally {
      isSubmitting = false;
    }
  }

</script>

{#if showModal}
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="modal-backdrop" on:click={closeModal}>
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <div class="modal-content" on:click|stopPropagation>
      <h2>Créer un nouveau séjour</h2>

      {#if errorMessage}
        <p class="error-message">{errorMessage}</p>
      {/if}
      {#if successMessage}
        <p class="success-message">{successMessage}</p>
      {/if}

      <form on:submit|preventDefault={handleSubmit}>
        <div class="form-group">
          <label for="modal-name">Nom du séjour:</label>
          <input type="text" id="modal-name" bind:value={name} required disabled={isSubmitting}>
        </div>

        <div class="form-group">
          <label for="modal-start_date">Date de début:</label>
          <input type="date" id="modal-start_date" bind:value={startDate} required disabled={isSubmitting}>
        </div>

        <div class="form-group">
          <label for="modal-end_date">Date de fin:</label>
          <input type="date" id="modal-end_date" bind:value={endDate} required min={startDate} disabled={isSubmitting}>
        </div>

        <div class="form-group">
          <label for="modal-location">Lieu (Optionnel):</label>
          <input type="text" id="modal-location" bind:value={location} disabled={isSubmitting}>
        </div>

        <div class="form-group">
          <label for="modal-num_people">Nombre de personnes:</label>
          <input type="number" id="modal-num_people" bind:value={numPeople} required min="1" disabled={isSubmitting}>
        </div>

        <div class="form-actions">
          <button type="submit" class="submit-button" disabled={isSubmitting}>
            {isSubmitting ? 'Création...' : 'Créer le séjour'}
          </button>
          <button type="button" class="cancel-button" on:click={closeModal} disabled={isSubmitting}>
            Annuler
          </button>
        </div>
      </form>
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
    z-index: 100; /* Ensure modal is on top */
  }

  .modal-content {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 90%;
  }

  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    text-align: center;
  }

 .form-group {
   margin-bottom: 1rem;
 }

 .form-group label {
   display: block;
   margin-bottom: 0.25rem;
   font-weight: 500;
 }

 .form-group input {
   padding: 0.5rem;
   border: 1px solid #ccc;
   border-radius: 4px;
   width: 100%;
   box-sizing: border-box;
 }

 .form-actions {
   display: flex;
   justify-content: flex-end; /* Align buttons to the right */
   gap: 1rem;
   margin-top: 1.5rem;
 }

 .submit-button, .cancel-button {
   padding: 0.75rem 1.5rem;
   border: none;
   border-radius: 4px;
   cursor: pointer;
   font-size: 1rem;
 }

 .submit-button {
   background-color: #007bff;
   color: white;
 }
 .submit-button:hover {
   background-color: #0056b3;
 }
 .submit-button:disabled {
    background-color: #a0cfff;
    cursor: not-allowed;
 }


 .cancel-button {
   background-color: #6c757d;
   color: white;
 }
 .cancel-button:hover {
   background-color: #5a6268;
 }
  .cancel-button:disabled {
    background-color: #adb5bd;
    cursor: not-allowed;
 }


 .error-message {
    color: #d9534f;
    font-weight: 500;
    margin-bottom: 1rem;
    text-align: center;
  }

  .success-message {
    color: #5cb85c;
    font-weight: 500;
    margin-bottom: 1rem;
    text-align: center;
  }
</style>