<script lang="ts">
  /**
   * Composant Input - Champ de saisie pour les formulaires
   * 
   * Props:
   * - type: type d'input (défaut: "text")
   * - value: valeur du champ
   * - placeholder: texte d'indication (défaut: "")
   * - label: libellé du champ (défaut: "")
   * - id: identifiant unique du champ (généré automatiquement si non fourni)
   * - name: nom du champ pour les formulaires (défaut: "")
   * - required: indique si le champ est obligatoire (défaut: false)
   * - disabled: indique si le champ est désactivé (défaut: false)
   * - readonly: indique si le champ est en lecture seule (défaut: false)
   * - error: message d'erreur à afficher (défaut: "")
   * - helperText: texte d'aide (défaut: "")
   * - className: classes CSS additionnelles pour le conteneur
   * - inputClassName: classes CSS additionnelles pour l'input
   */
  
  import { createEventDispatcher } from 'svelte';
  import { onMount } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  export let type: string = "text";
  export let value: string = "";
  export let placeholder: string = "";
  export let label: string = "";
  export let id: string = "";
  export let name: string = "";
  export let required: boolean = false;
  export let disabled: boolean = false;
  export let readonly: boolean = false;
  export let error: string = "";
  export let helperText: string = "";
  export let className: string = "";
  export let inputClassName: string = "";
  
  // Générer un ID unique si non fourni
  let uniqueId: string;
  
  onMount(() => {
    if (!id) {
      uniqueId = `input-${Math.random().toString(36).substring(2, 9)}`;
    } else {
      uniqueId = id;
    }
  });
  
  // Calculer les classes CSS en fonction des props
  $: containerClasses = `
    input-container
    ${className}
  `;
  
  $: inputClasses = `
    w-full
    px-3 py-2
    border rounded-md
    transition-all duration-200
    ${error ? 'border-danger-500 focus:ring-danger-500 bg-danger-50' : 'border-neutral-300 focus:ring-primary-500 hover:border-primary-300'}
    ${disabled ? 'bg-neutral-100 cursor-not-allowed opacity-60' : 'bg-white'}
    focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:border-primary-400
    shadow-sm
    ${inputClassName}
  `;
  
  // Gérer les événements
  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;
    dispatch('input', { value });
  }
  
  function handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    value = target.value;
    dispatch('change', { value });
  }
  
  function handleFocus(event: FocusEvent) {
    dispatch('focus', event);
  }
  
  function handleBlur(event: FocusEvent) {
    dispatch('blur', event);
  }
</script>

<div class={containerClasses}>
  {#if label}
    <label 
      for={uniqueId}
      class="block mb-2 font-medium text-neutral-700"
    >
      {label}
      {#if required}
        <span class="text-danger-500 ml-1">*</span>
      {/if}
    </label>
  {/if}
  
  <input
    {type}
    {name}
    id={uniqueId}
    class={inputClasses}
    {placeholder}
    value={value}
    {required}
    {disabled}
    {readonly}
    aria-invalid={!!error}
    aria-describedby={error ? `${uniqueId}-error` : helperText ? `${uniqueId}-helper` : undefined}
    on:input={handleInput}
    on:change={handleChange}
    on:focus={handleFocus}
    on:blur={handleBlur}
    {...$$restProps}
  />
  
  {#if error}
    <p id="{uniqueId}-error" class="mt-1 text-sm text-danger-600 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      {error}
    </p>
  {:else if helperText}
    <p id="{uniqueId}-helper" class="mt-1 text-sm text-neutral-500">
      {helperText}
    </p>
  {/if}
</div>

<style>
  .input-container {
    margin-bottom: 1.25rem;
  }
  
  input::placeholder {
    color: var(--color-neutral-400);
  }
  
  input:disabled {
    opacity: 0.6;
  }
  
  input:focus {
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
  }
</style>