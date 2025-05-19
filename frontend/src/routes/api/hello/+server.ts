import type { RequestHandler } from '@sveltejs/kit';

/**
 * Route SvelteKit pour l'API /api/hello
 * Accède à la base de données Neon PostgreSQL via platform.env
 * Fonctionne à la fois en développement et en production
 */
import { getNeonDbUrl, getDbClient } from '$lib/server/db';

export const GET: RequestHandler = async ({ platform }) => {
  try {
    // Message de secours si la base de données n'est pas accessible
    const fallbackMessage = "Message de test (DB non accessible en développement)";
    
    // Si nous sommes en développement et que platform.env n'est pas disponible
    if (!platform?.env) {
      console.log("Environnement de développement détecté, utilisation du message de secours");
      return new Response(JSON.stringify({ message: fallbackMessage }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Si nous avons accès à platform.env, essayons d'utiliser la base de données Neon
    try {
      // Obtenir l'URL de la base de données Neon en fonction de l'environnement
      const dbUrl = getNeonDbUrl(platform.env);
      
      if (!dbUrl) {
        console.error("URL de base de données Neon non disponible");
        return new Response(JSON.stringify({ message: fallbackMessage }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      // Créer un client PostgreSQL
      const sql = getDbClient(dbUrl);
      
      // Exécuter une requête simple pour tester la connexion
      const result = await sql`SELECT 'Connexion à Neon PostgreSQL réussie!' as text`;
      
      // Le résultat est un tableau, nous prenons le premier élément
      const firstRow = result[0];
      
      return new Response(JSON.stringify({
        message: firstRow?.text || 'Aucun message trouvé dans la DB'
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error("Erreur d'accès à la base de données:", error);
      return new Response(JSON.stringify({ message: fallbackMessage }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error("Erreur dans la route /api/hello:", error);
    return new Response(JSON.stringify({ message: "Erreur serveur" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};