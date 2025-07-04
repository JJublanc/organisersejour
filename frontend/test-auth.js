#!/usr/bin/env node

/**
 * Script de test pour valider l'authentification Clerk
 * Usage: node test-auth.js <BASE_URL> [CLERK_TOKEN]
 */

const BASE_URL = process.argv[2] || 'http://localhost:5173';
const CLERK_TOKEN = process.argv[3];

console.log('🧪 Test d\'authentification Clerk');
console.log(`📍 URL de base: ${BASE_URL}`);
console.log(`🔑 Token fourni: ${CLERK_TOKEN ? 'Oui' : 'Non'}`);
console.log('');

async function testEndpoint(endpoint, method = 'GET', token = null) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, { method, headers });
    const status = response.status;
    const statusText = response.statusText;
    
    let body = '';
    try {
      body = await response.text();
      if (body) {
        const parsed = JSON.parse(body);
        body = JSON.stringify(parsed, null, 2);
      }
    } catch (e) {
      // Body is not JSON, keep as text
    }
    
    return { status, statusText, body };
  } catch (error) {
    return { error: error.message };
  }
}

async function runTests() {
  const endpoints = [
    '/api/ingredients',
    '/api/recipes',
    '/api/kitchen_tools'
  ];
  
  console.log('🔒 Test 1: Accès sans authentification (doit échouer)');
  console.log('─'.repeat(60));
  
  for (const endpoint of endpoints) {
    console.log(`\n📡 ${endpoint}`);
    const result = await testEndpoint(endpoint);
    
    if (result.error) {
      console.log(`❌ Erreur: ${result.error}`);
    } else {
      const success = result.status === 401;
      console.log(`${success ? '✅' : '❌'} Status: ${result.status} ${result.statusText}`);
      if (!success && result.body) {
        console.log(`📄 Réponse: ${result.body.substring(0, 200)}...`);
      }
    }
  }
  
  if (CLERK_TOKEN) {
    console.log('\n\n🔓 Test 2: Accès avec authentification (doit réussir)');
    console.log('─'.repeat(60));
    
    for (const endpoint of endpoints) {
      console.log(`\n📡 ${endpoint}`);
      const result = await testEndpoint(endpoint, 'GET', CLERK_TOKEN);
      
      if (result.error) {
        console.log(`❌ Erreur: ${result.error}`);
      } else {
        const success = result.status === 200;
        console.log(`${success ? '✅' : '❌'} Status: ${result.status} ${result.statusText}`);
        if (success && result.body) {
          try {
            const data = JSON.parse(result.body);
            const count = data.ingredients?.length || data.recipes?.length || data.kitchen_tools?.length || 0;
            console.log(`📊 Éléments retournés: ${count}`);
          } catch (e) {
            console.log(`📄 Réponse: ${result.body.substring(0, 100)}...`);
          }
        }
      }
    }
  } else {
    console.log('\n\n💡 Pour tester l\'authentification, fournissez un token Clerk:');
    console.log(`   node test-auth.js ${BASE_URL} YOUR_CLERK_TOKEN`);
  }
  
  console.log('\n\n📋 Résumé des tests');
  console.log('─'.repeat(60));
  console.log('✅ Les endpoints doivent retourner 401 sans authentification');
  console.log('✅ Les endpoints doivent retourner 200 avec un token valide');
  console.log('✅ Chaque utilisateur ne doit voir que ses propres données');
  console.log('\n🔍 Vérifiez manuellement:');
  console.log('   - Isolation des données entre utilisateurs');
  console.log('   - Accès aux éléments système pour tous');
  console.log('   - Performance des requêtes authentifiées');
}

// Vérification de la disponibilité de fetch
if (typeof fetch === 'undefined') {
  console.log('❌ fetch n\'est pas disponible. Installez node-fetch:');
  console.log('   npm install node-fetch');
  process.exit(1);
}

runTests().catch(console.error);