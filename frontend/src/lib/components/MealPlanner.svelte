<script lang="ts">
  import type { TripDay, Meal, MealComponent } from '$lib/types';
  import MealEditModal from './MealEditModal.svelte';
  import { invalidateAll } from '$app/navigation'; // Import invalidateAll for data refresh

  export let days: TripDay[];

  let showEditModal = false;
  let selectedMealData: Meal | null = null;

  function openEditModal(meal: Meal) {
      console.log("Opening edit modal for meal:", meal);
      
      // Vérifier si les propriétés nécessaires existent
      if (!meal.recipe_components) {
          console.error("meal.recipe_components is undefined or null", meal);
          meal.recipe_components = {};
      }
      
      if (!meal.accompaniments) {
          console.error("meal.accompaniments is undefined or null", meal);
          meal.accompaniments = [];
      }
      
      // Créer une copie profonde pour éviter les problèmes de référence
      const mealCopy = JSON.parse(JSON.stringify(meal));
      console.log("Deep copy of meal:", mealCopy);
      
      selectedMealData = mealCopy;
      showEditModal = true;
  }

  function closeEditModal() {
      showEditModal = false;
      selectedMealData = null;
  }

  function handleMealUpdated() {
      console.log("Meal updated, refreshing data...");
      invalidateAll();
      closeEditModal();
  }

  // Helper to format date
  function formatDisplayDate(dateString: string): string {
    try {
      return new Date(dateString).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return dateString;
    }
  }

  // Helper to capitalize meal type
  function capitalize(str: string): string {
      if (!str) return str;
      return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Helper to get course label
  function getCourseLabel(courseType: string): string {
      const labels: Record<string, string> = {
          'starter': 'Entrée',
          'main': 'Plat Principal',
          'dessert': 'Dessert',
          'side': 'Accompagnement',
          'extra': 'Extra / Divers',
          'breakfast_item': 'Petit Déjeuner'
      };
      return labels[courseType] || courseType;
  }

  // Define valid course types
  type CourseType = 'starter' | 'main' | 'dessert' | 'side' | 'extra' | 'breakfast_item';
  
  // Helper to get courses for a meal type
  function getCoursesForMealType(mealType: string): CourseType[] {
      if (mealType === 'breakfast') {
          return ['breakfast_item'];
      } else {
          return ['starter', 'main', 'dessert', 'side', 'extra'];
      }
  }

  // Helper to check if a meal has any components (recipes or accompaniments)
  function hasMealComponents(meal: Meal): boolean {
      // Only use the new structure
      const hasRecipes = meal.recipe_components ?
          Object.values(meal.recipe_components).some(components => components && components.length > 0) :
          false;
      const hasAccompaniments = meal.accompaniments && meal.accompaniments.length > 0;
      return hasRecipes || hasAccompaniments;
  }

  // Helper to safely get recipe components for a course type
  function getComponentsForCourse(meal: Meal, courseType: CourseType): MealComponent[] {
      // Only use the new structure
      return meal.recipe_components?.[courseType] || [];
  }
  
  // Helper to get accompaniments
  function getAccompaniments(meal: Meal): MealComponent[] {
      // Only use the new structure
      return meal.accompaniments || [];
  }
</script>

<div class="meal-planner">
  {#each days as day (day.id)}
    <div class="day-card">
      <h3>{formatDisplayDate(day.date)}</h3>
      <div class="meals-grid">
        {#each day.meals as meal (meal.id)}
          <div class="meal-slot">
            <div class="meal-header">
              <h4>{capitalize(meal.type)}</h4>
              <button class="edit-meal-button" on:click={() => openEditModal(meal)}>
                Modifier
              </button>
            </div>
            
            <div class="meal-content">
              {#if hasMealComponents(meal)}
                <!-- Recipe Components by Course -->
                {#each getCoursesForMealType(meal.type) as courseType}
                  <!-- Only show course section if it has components -->
                  {@const components = getComponentsForCourse(meal, courseType)}
                  {#if components.length > 0}
                    <div class="course-section">
                      {#if meal.type !== 'breakfast'}
                        <h5>{getCourseLabel(courseType)}</h5>
                      {/if}
                      <ul>
                        {#each components as component (component.id)}
                          <li>
                            <!-- Recipe component -->
                            <span class="component-name">{component.recipe_name}</span>
                            {#if component.notes}
                              <span class="component-notes">({component.notes})</span>
                            {/if}
                          </li>
                        {/each}
                      </ul>
                    </div>
                  {/if}
                {/each}
                
                <!-- Accompaniments Section -->
                {@const accompaniments = getAccompaniments(meal)}
                {#if accompaniments.length > 0}
                  <div class="course-section accompaniments-section">
                    <h5>Accompagnements</h5>
                    <ul>
                      {#each accompaniments as component (component.id)}
                        <li>
                          <!-- Direct ingredient component with quantity per person -->
                          <span class="component-name">
                            {component.quantity_per_person} {component.unit} {component.ingredient_name}/pers
                          </span>
                          {#if component.notes}
                            <span class="component-notes">({component.notes})</span>
                          {/if}
                        </li>
                      {/each}
                    </ul>
                  </div>
                {/if}
              {:else}
                <p class="no-components"><i>Aucun élément planifié</i></p>
              {/if}

              <!-- Keep these for backward compatibility until fully migrated to accompaniments -->
              {#if meal.drinks}
                <p class="meal-extra"><strong>Boissons :</strong> {meal.drinks}</p>
              {/if}

              {#if meal.bread}
                <p class="meal-extra"><strong>Pain inclus</strong></p>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/each}
</div>

<!-- Render the MealEditModal -->
<MealEditModal bind:showModal={showEditModal} mealData={selectedMealData} on:close={closeEditModal} on:mealUpdated={handleMealUpdated} />


<style>
  .meal-planner {
    margin-top: 1rem;
  }

  .day-card {
    background-color: #f9f9f9;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    margin-bottom: 1.5rem;
    padding: 1rem 1.5rem;
  }

  .day-card h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    color: #333;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.5rem;
  }

  .meals-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); /* Wider slots for more content */
    gap: 1rem;
  }

  .meal-slot {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
  }

  .meal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    border-bottom: 1px dashed #eee;
    padding-bottom: 0.5rem;
  }

  .meal-header h4 {
    margin: 0;
    color: #555;
  }

  .meal-content {
    flex-grow: 1;
    margin-bottom: 0.5rem;
  }

  .course-section {
    margin-bottom: 1rem;
  }
  
  .accompaniments-section {
    border-top: 1px dashed #eee;
    padding-top: 0.5rem;
    margin-top: 0.5rem;
  }

  .course-section h5 {
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: #666;
    font-size: 0.95rem;
    border-bottom: 1px dotted #eee;
    padding-bottom: 0.2rem;
  }

  .course-section ul {
    list-style: disc;
    padding-left: 20px;
    margin: 0 0 0.5rem 0;
    font-size: 0.95rem;
  }

  .course-section li {
    margin-bottom: 0.3rem;
  }

  .component-name {
    font-weight: normal;
  }

  .component-notes {
    font-style: italic;
    color: #777;
    font-size: 0.9em;
  }

  .no-components {
    font-style: italic;
    color: #888;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .meal-extra {
    font-size: 0.9rem;
    color: #666;
    margin-top: 0.5rem;
    margin-bottom: 0;
  }

  .edit-meal-button {
    padding: 0.4rem 0.8rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
  }

  .edit-meal-button:hover {
    background-color: #0056b3;
  }
</style>