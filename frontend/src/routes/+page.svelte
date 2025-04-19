<script lang="ts">
  // Data is now loaded by +page.server.ts and passed in automatically
  export let data;
</script>

<main>
  <h1>Bienvenue !</h1>
  
  {#if data.message}
    <p>Message from DB: {data.message}</p>
  {:else}
    <p>Loading message...</p>
  {/if}
  
  <p>This message is now loaded on the server.</p>
</main>
