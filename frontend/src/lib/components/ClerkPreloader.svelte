<script lang="ts">
  import { onMount } from 'svelte';
  
  export let publishableKey: string | null = null;
  
  onMount(() => {
    if (!publishableKey || typeof window === 'undefined') return;
    
    // Preload Clerk resources as early as possible
    preloadClerkResources();
  });
  
  function preloadClerkResources() {
    // Preload main Clerk script
    const clerkScript = document.createElement('link');
    clerkScript.rel = 'preload';
    clerkScript.as = 'script';
    clerkScript.href = 'https://js.clerk.com/v4/clerk.js';
    clerkScript.crossOrigin = 'anonymous';
    document.head.appendChild(clerkScript);
    
    // Preload Clerk CSS
    const clerkCSS = document.createElement('link');
    clerkCSS.rel = 'preload';
    clerkCSS.as = 'style';
    clerkCSS.href = 'https://js.clerk.com/v4/clerk.css';
    clerkCSS.crossOrigin = 'anonymous';
    document.head.appendChild(clerkCSS);
    
    // DNS prefetch for Clerk domains
    const domains = [
      'https://clerk.com',
      'https://api.clerk.com',
      'https://js.clerk.com'
    ];
    
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
    
    // Preconnect to Clerk API
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://api.clerk.com';
    preconnect.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect);
  }
</script>

<!-- This component has no visual output, it just preloads resources -->