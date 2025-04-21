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

// We can add more shared types here as needed, like Recipe, Meal, etc.
