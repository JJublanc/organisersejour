import { json, error } from '@sveltejs/kit';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { getNeonDbUrl, getDbClient } from '$lib/server/db';

export async function GET({ params, platform }: { params: { tripId: string }, platform: any }) {
  const { tripId } = params;
  
  // Get database connection
  const dbUrl = getNeonDbUrl(platform?.env);
  if (!dbUrl) {
    console.error("[API /api/trips/[tripId]/shopping-list GET] Neon Database URL not found for environment.");
    throw error(500, "Database connection information not found.");
  }
  const sql = getDbClient(dbUrl);

  // Get shopping list data
  let shoppingList;
  try {
    console.log(`[API] Fetching shopping list for trip ID: ${tripId}`);
    
    // First, let's check if the trip exists and get basic info
    const tripCheck = await sql`
      SELECT id, name, num_people FROM trips WHERE id = ${tripId}
    `;
    console.log(`[API] Trip check result:`, tripCheck);
    
    if (!tripCheck || tripCheck.length === 0) {
      console.log(`[API] Trip ${tripId} not found`);
      return json({
        shoppingList: [],
        pdfData: null,
        message: 'Voyage non trouvé.'
      }, { status: 404 });
    }
    
    // Now let's get ingredients from recipes
    const recipeIngredients = await sql`
      SELECT i.id as ingredient_id, i.name, i.unit, i.type, ri.quantity, mc.recipe_id
      FROM meal_components mc
      JOIN recipes r ON mc.recipe_id = r.id
      JOIN recipe_ingredients ri ON r.id = ri.recipe_id
      JOIN ingredients i ON ri.ingredient_id = i.id
      JOIN meals m ON mc.meal_id = m.id
      JOIN trip_days td ON m.trip_day_id = td.id
      WHERE td.trip_id = ${tripId} AND mc.recipe_id IS NOT NULL
    `;
    console.log(`[API] Recipe ingredients:`, recipeIngredients);
    
    // Now implement the full query
    const result = await sql`
      WITH trip_ingredients AS (
        -- Direct ingredients from meal_components
        SELECT i.id as ingredient_id, i.name, i.unit, i.type, mc.quantity_per_person as quantity
        FROM meal_components mc
        JOIN ingredients i ON mc.ingredient_id = i.id
        JOIN meals m ON mc.meal_id = m.id
        JOIN trip_days td ON m.trip_day_id = td.id
        WHERE td.trip_id = ${tripId} AND mc.ingredient_id IS NOT NULL
        
        UNION ALL
        
        -- Ingredients from recipes in meal_components (each recipe occurrence counts)
        SELECT i.id as ingredient_id, i.name, i.unit, i.type, ri.quantity
        FROM meal_components mc
        JOIN recipes r ON mc.recipe_id = r.id
        JOIN recipe_ingredients ri ON r.id = ri.recipe_id
        JOIN ingredients i ON ri.ingredient_id = i.id
        JOIN meals m ON mc.meal_id = m.id
        JOIN trip_days td ON m.trip_day_id = td.id
        WHERE td.trip_id = ${tripId} AND mc.recipe_id IS NOT NULL
      ),
      summed_ingredients AS (
        -- Sum all quantities for each ingredient (including multiple recipe occurrences)
        SELECT ingredient_id, name, unit, type, SUM(quantity) as total_base_quantity
        FROM trip_ingredients
        GROUP BY ingredient_id, name, unit, type
      )
      -- Finally multiply by number of people
      SELECT
        si.ingredient_id,
        si.name,
        si.unit,
        si.type,
        (si.total_base_quantity * t.num_people) as total_quantity
      FROM summed_ingredients si
      CROSS JOIN trips t
      WHERE t.id = ${tripId}
      ORDER BY si.type, si.name
    `;
    
    console.log(`[API] Final query result:`, result);
    
    shoppingList = result.map((row: any) => ({
      ingredient_id: row.ingredient_id,
      name: row.name,
      unit: row.unit,
      type: row.type,
      total_quantity: parseFloat(row.total_quantity)
    }));
  } catch (dbError: any) {
    console.error('[API /api/trips/[tripId]/shopping-list GET] Error fetching shopping list:', dbError);
    console.error('[API] Error details:', {
      message: dbError?.message,
      code: dbError?.code,
      detail: dbError?.detail,
      stack: dbError?.stack
    });
    throw error(500, `Failed to fetch shopping list from database: ${dbError?.message || 'Unknown error'}`);
  }

  if (!shoppingList || shoppingList.length === 0) {
    return json({
      shoppingList: [],
      pdfData: null,
      message: 'Aucun ingrédient requis pour les repas planifiés.'
    }, { status: 200 });
  }

  // Generate PDF
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawText('Liste de courses', {
    x: 50,
    y: 750,
    size: 24,
    font: font,
    color: rgb(0, 0, 0),
  });

  let y = 700;
  shoppingList.forEach((item: { ingredient_id: any; name: any; unit: any; type: any; total_quantity: number }) => {
    page.drawText(`${item.name}: ${item.total_quantity} ${item.unit}`, {
      x: 50,
      y: y,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    });
    y -= 20;
  });

  const pdfBytes = await pdfDoc.save();
  const pdfBase64 = btoa(String.fromCharCode(...pdfBytes));
  
  // Return both the shopping list data and the PDF
  return json({
    shoppingList: shoppingList,
    pdfData: pdfBase64
  }, { status: 200 });
}