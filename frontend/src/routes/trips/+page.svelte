<script lang="ts">
  import type { PageData } from './$types';
  import TripFormModal from '$lib/components/TripFormModal.svelte'; // Import the modal component
  import { invalidateAll } from '$app/navigation'; // To refresh data after creation

  export let data: PageData; // Data loaded from +page.server.ts

  let showCreateModal = false; // State to control modal visibility

  // Function to open the modal
  function openCreateModal() {
    showCreateModal = true;
  }

  // Function to close the modal (called by the modal's 'close' event)
  function closeCreateModal() {
    showCreateModal = false;
  }

  // Function called when a trip is successfully created (by modal's 'tripCreated' event)
  function handleTripCreated() {
    // Invalidate data to refresh the list of trips
    invalidateAll();
  }

  // Helper to format date strings
  function formatDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return dateString; // Return original if formatting fails
    }
  }
</script>

<h1>My Trips</h1>

<div class="page-actions">
  <button on:click={openCreateModal} class="create-button">Créer un nouveau séjour</button>
</div>

{#if data.trips.length > 0}
  <ul class="trip-list">
    {#each data.trips as trip (trip.id)}
      <li class="trip-item">
        <h2>{trip.name}</h2>
        <p>
          {#if trip.location}
            <strong>Location:</strong> {trip.location}<br />
          {/if}
          <strong>Dates:</strong> {formatDate(trip.start_date)} - {formatDate(trip.end_date)}<br />
          <strong>Attendees:</strong> {trip.num_people}
        </p>
        <!-- Add links for viewing details or planning meals later -->
        <!-- <a href="/trips/{trip.id}">View Details</a> -->
      </li>
    {/each}
  </ul>
{:else}
  <p>Vous n'avez pas encore créé de séjour.</p>
  <!-- Button to open modal is already present above -->
{/if}

<!-- Render the modal component -->
<TripFormModal bind:showModal={showCreateModal} on:close={closeCreateModal} on:tripCreated={handleTripCreated} />

<style>
  .page-actions {
    margin-bottom: 1.5rem;
    text-align: right; /* Align button to the right */
  }

  .create-button {
    padding: 0.75rem 1.5rem;
    background-color: #28a745; /* Green color */
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
  }
  .create-button:hover {
    background-color: #218838;
  }

  .trip-list {
    list-style: none;
    padding: 0;
  }

  .trip-item {
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 1rem 1.5rem;
    margin-bottom: 1rem;
    background-color: #f9f9f9;
  }

  .trip-item h2 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: #333;
  }

  .trip-item p {
    margin-bottom: 0;
    line-height: 1.6;
    color: #555;
  }

  a {
      color: #007bff;
      text-decoration: none;
  }
  a:hover {
      text-decoration: underline;
  }
</style>