<script lang="ts">
  // Type generation seems broken, using implicit types for now
  export let data;
</script>

<h1>Protected Page</h1>

{#if data.message}
  <p>{data.message}</p>
{:else}
  <p>Loading protected content...</p>
{/if}

<p>Only authenticated users should see this page when authentication is enabled.</p>