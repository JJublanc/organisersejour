<script lang="ts">
  /**
   * Composant Button - Bouton polyvalent avec plusieurs variantes
   * 
   * Props:
   * - variant: "primary" | "secondary" | "danger" | "success" | "text" (défaut: "primary")
   * - size: "sm" | "md" | "lg" (défaut: "md")
   * - disabled: boolean (défaut: false)
   * - type: "button" | "submit" | "reset" (défaut: "button")
   * - fullWidth: boolean (défaut: false)
   * - className: string - classes CSS additionnelles
   */
  
  export let variant: "primary" | "secondary" | "danger" | "success" | "text" = "primary";
  export let size: "sm" | "md" | "lg" = "md";
  export let disabled: boolean = false;
  export let type: "button" | "submit" | "reset" = "button";
  export let fullWidth: boolean = false;
  export let className: string = "";

  // Calculer les classes CSS en fonction des props
  $: variantClasses = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white border-transparent shadow-sm",
    secondary: "bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-300 shadow-sm",
    danger: "bg-danger-600 hover:bg-danger-700 text-white border-transparent shadow-sm",
    success: "bg-success-600 hover:bg-success-700 text-white border-transparent shadow-sm",
    text: "bg-transparent hover:bg-neutral-100 text-primary-700 hover:text-primary-800 border-transparent"
  };

  $: sizeClasses = {
    sm: "text-sm py-1 px-3 rounded",
    md: "text-base py-2 px-5 rounded-md",
    lg: "text-lg py-3 px-6 rounded-lg font-medium"
  };

  $: buttonClasses = `
    inline-flex items-center justify-center
    font-medium
    border
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `;
</script>

<button
  type={type}
  class={buttonClasses}
  {disabled}
  on:click
  on:focus
  on:blur
  on:mouseenter
  on:mouseleave
>
  <slot />
</button>

<style>
  button {
    font-family: var(--font-family-sans);
    transform: translateY(0);
  }
  
  button:focus {
    outline: none;
  }
  
  button:disabled {
    pointer-events: none;
  }
  
  button:active:not(:disabled) {
    transform: translateY(1px);
  }
</style>