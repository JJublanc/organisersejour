<script lang="ts">
  // Data is now loaded by +page.server.ts and passed in automatically
  export let data;
  // Remove form prop as it's no longer needed here
  // export let form: Record<string, any> | undefined | null;
</script>

<main>
  <h1>Bienvenue !</h1>

  {#if data.message}
    <p>Message from DB: {data.message}</p>
  {:else}
    <p>Loading message...</p>
  {/if}

  <!-- Remove the trip creation form -->

</main>

<!-- Remove form styles -->
<style>
  /* Keep any original styles for the welcome page if there were any */
  main {
    padding: 1rem;
  }
</style>
