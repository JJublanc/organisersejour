// Define common types used across the application

export interface Ingredient {
    id: number;
    name: string;
    unit: string; // e.g., 'g', 'kg', 'ml', 'l', 'pcs', 'unit', 'pincée', 'gousse', 'feuille'
}

export interface KitchenTool {
    id: number;
    name: string;
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
}
// Structure for submitting meal component updates
export interface MealComponentPayload {
    course_type: 'starter' | 'main' | 'dessert' | 'side' | 'extra' | 'breakfast_item';
    recipe_id?: number | null;
    ingredient_id?: number | null;
    quantity?: number | null; // Only for direct ingredients
    notes?: string | null;
    display_order?: number;
}

// Structure for the PUT request body to update a meal
export interface UpdateMealRequestBody {
    components: MealComponentPayload[];
    drinks?: string | null;
    bread?: boolean;
}

// We can add more shared types here as needed, like Recipe, Meal, etc.

