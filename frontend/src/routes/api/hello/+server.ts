import type { RequestHandler } from '@sveltejs/kit';

/**
 * Route SvelteKit pour l'API /api/hello
 * Accède à la base de données D1 via platform.env
 * Fonctionne à la fois en développement et en production
 */
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
    
    // Si nous avons accès à platform.env, essayons d'utiliser la base de données
    try {
      const env = platform.env;
      const isProd = env.ENVIRONMENT === 'prod';
      const db = isProd ? env.DB : env.DB_PREPROD;
      
      if (!db) {
        console.error("Base de données non disponible");
        return new Response(JSON.stringify({ message: fallbackMessage }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      const result = await db.prepare('SELECT text FROM messages WHERE id = 1').first();
      return new Response(JSON.stringify({
        message: result?.text || 'Aucun message trouvé dans la DB'
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