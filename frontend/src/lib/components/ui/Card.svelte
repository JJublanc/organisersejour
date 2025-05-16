<script lang="ts">
  /**
   * Composant Card - Conteneur pour regrouper des informations connexes
   * 
   * Props:
   * - variant: "elevated" | "outlined" | "flat" (défaut: "elevated")
   * - padding: "none" | "sm" | "md" | "lg" (défaut: "md")
   * - className: string - classes CSS additionnelles
   * 
   * Slots:
   * - default: contenu principal de la carte
   * - header: en-tête de la carte (optionnel)
   * - footer: pied de la carte (optionnel)
   */
  
  export let variant: "elevated" | "outlined" | "flat" = "elevated";
  export let padding: "none" | "sm" | "md" | "lg" = "md";
  export let className: string = "";

  // Calculer les classes CSS en fonction des props
  $: variantClasses = {
    elevated: "bg-white border border-neutral-200 shadow-md",
    outlined: "bg-white border border-neutral-300",
    flat: "bg-neutral-50"
  };

  $: paddingClasses = {
    none: "p-0",
    sm: "p-2",
    md: "p-4",
    lg: "p-6"
  };

  $: cardClasses = `
    rounded-xl
    overflow-hidden
    transition-shadow duration-300
    hover:shadow-lg
    ${variantClasses[variant]}
    ${className}
  `;

  $: contentClasses = `
    ${paddingClasses[padding]}
  `;

  // Vérifier si les slots header et footer sont utilisés
  let headerSlot: HTMLElement;
  let footerSlot: HTMLElement;
  
  $: hasHeader = !!headerSlot && headerSlot.childNodes.length > 0;
  $: hasFooter = !!footerSlot && footerSlot.childNodes.length > 0;
</script>

<div class={cardClasses}>
  {#if hasHeader}
    <div class="card-header border-b border-neutral-200 p-4 bg-neutral-50" bind:this={headerSlot}>
      <slot name="header"></slot>
    </div>
  {:else}
    <div class="hidden" bind:this={headerSlot}>
      <slot name="header"></slot>
    </div>
  {/if}
  
  <div class={contentClasses}>
    <slot></slot>
  </div>
  
  {#if hasFooter}
    <div class="card-footer border-t border-neutral-200 p-4 bg-neutral-50" bind:this={footerSlot}>
      <slot name="footer"></slot>
    </div>
  {:else}
    <div class="hidden" bind:this={footerSlot}>
      <slot name="footer"></slot>
    </div>
  {/if}
</div>

<style>
  .card-header {
    font-weight: var(--font-weight-medium);
  }
  
  .hidden {
    display: none;
  }
  
  /* Animation subtile au survol */
  :global(.card:hover) {
    transform: translateY(-2px);
    transition: transform 0.3s ease;
  }
</style>