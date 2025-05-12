// Define common types used across the application

export interface Ingredient {
    id: number;
    name: string;
    unit: string; // e.g., 'g', 'kg', 'ml', 'l', 'pcs', 'unit', 'pincée', 'gousse', 'feuille'
    type: 'boisson' | 'pain' | 'condiment' | 'légume' | 'fruit' | 'viande' | 'poisson' | 'autre';
    season: 'spring' | 'summer' | 'autumn' | 'winter' | null;
    user_id?: string; // ID de l'utilisateur propriétaire
}

export interface KitchenTool {
    id: number;
    name: string;
  }
  
  // Define the structure for the join table data (RecipeIngredient)
  export interface RecipeIngredient {
      ingredient_id: number;
      name: string; // Name of the ingredient
      unit: string; // Unit of the ingredient
      quantity: number;
      type: 'boisson' | 'pain' | 'condiment' | 'légume' | 'fruit' | 'viande' | 'poisson' | 'autre'; // Add type property
  }
  
  // Structure for a Recipe
  export interface Recipe {
      id: number;
      name: string;
      description: string | null;
      prep_time_minutes: number | null;
      cook_time_minutes: number | null;
      instructions: string | null;
      servings: number;
      season: 'spring' | 'summer' | 'autumn' | 'winter' | null;
      user_id?: string; // ID de l'utilisateur propriétaire
      ingredients: RecipeIngredient[]; // Use RecipeIngredient[]
      kitchen_tools: KitchenTool[]; // Use KitchenTool[]
  }
  
  // Structure for a Trip (moved from /trips/+page.server.ts)
  export interface Trip {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    location: string | null;
    organiser_id: string;
    num_people: number;
}

// Structure for a Shopping List Item
export interface ShoppingListItem {
    ingredient_id: number;
    name: string;
    unit: string;
    total_quantity: number;
    type: 'boisson' | 'pain' | 'condiment' | 'légume' | 'fruit' | 'viande' | 'poisson' | 'autre';
}
// Structure for submitting meal component updates
export interface MealComponentPayload {
    course_type: 'starter' | 'main' | 'dessert' | 'side' | 'extra' | 'breakfast_item';
    recipe_id?: number | null;
    ingredient_id?: number | null;
    total_quantity?: number | null; // Renamed from quantity, used for non-direct ingredients or pre-calculated totals
    unit?: string | null; // Unit for direct ingredients
    quantity_per_person?: number | null; // Quantity per person for direct ingredients
    notes?: string | null;
    display_order?: number;
}

// Structure for the PUT request body to update a meal
export interface UpdateMealRequestBody {
    components: MealComponentPayload[];
    drinks?: string | null;
    bread?: boolean;
    season?: 'spring' | 'summer' | 'autumn' | 'winter' | null;
}
// We can add more shared types here as needed, like Recipe, Meal, etc.

// Structure for a component within a meal (recipe or ingredient)
export interface MealComponent {
    id: number;
    course_type: 'starter' | 'main' | 'dessert' | 'side' | 'extra' | 'breakfast_item';
    recipe_id: number | null;
    ingredient_id: number | null;
    total_quantity: number | null;
    unit: string | null;
    quantity_per_person: number | null;
    notes: string | null;
    display_order: number;
    recipe_name?: string | null;
    ingredient_name?: string | null;
    ingredient_unit?: string | null;
}

// Structure for a Meal, separating recipe components and accompaniments
export interface Meal {
    id: number;
    type: 'breakfast' | 'lunch' | 'dinner';
    drinks: string | null;
    bread: boolean;
    season: 'spring' | 'summer' | 'autumn' | 'winter' | null;
    // Recipe components grouped by course type
    recipe_components: {
        starter?: MealComponent[];
        main?: MealComponent[];
        dessert?: MealComponent[];
        side?: MealComponent[];
        extra?: MealComponent[];
        breakfast_item?: MealComponent[];
    };
    // Direct ingredients treated as accompaniments/drinks
    accompaniments: MealComponent[];
}

// Structure for a Trip Day
export interface TripDay {
    id: number;
    date: string; // YYYY-MM-DD
    meals: Meal[]; // Meals for this day (breakfast, lunch, dinner)
}


