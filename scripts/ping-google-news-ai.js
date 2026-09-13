#!/usr/bin/env node

/**
 * LienLibre - Real-Time Search Engine, Google News & AI Indexing Dispatcher
 * 
 * Ce script exécute des pings réels et soumet les URLs, sitemaps et flux RSS
 * aux moteurs de recherche mondiaux (Google, Google Actualités, Bing, IndexNow),
 * aux hubs WebSub (PubSubHubbub) et aux dépôts d'archivage IA (Wayback Machine).
 */

const SITE_URL = 'https://bwillou1.github.io/LienLibre';
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const SITEMAP_NEWS_URL = `${SITE_URL}/sitemap-news.xml`;
const FEED_URL = `${SITE_URL}/feed.xml`;
const LLMS_URL = `${SITE_URL}/llms.txt`;
const INDEXNOW_KEY = 'e0f7a63459c748c08169992d9d1469e3';
const INDEXNOW_KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;

const URLS_TO_INDEX = [
  `${SITE_URL}/`,
  `${SITE_URL}/alertes.html`,
  `${SITE_URL}/lite.html`,
  `${SITE_URL}/liseuse.html`,
  `${SITE_URL}/remerciements.html`,
  `${SITE_URL}/politiques.html`,
  `${SITE_URL}/sitemap-news.xml`,
  `${SITE_URL}/feed.xml`,
  `${SITE_URL}/atom.xml`,
  `${SITE_URL}/feed.json`,
  `${SITE_URL}/llms.txt`,
  `${SITE_URL}/llms-full.txt`
];

async function sendPing(name, url, options = {}) {
  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'User-Agent': 'LienLibre-Civic-Indexer/2.5 (+https://bwillou1.github.io/LienLibre/)',
        ...(options.headers || {})
      }
    });
    clearTimeout(timeout);
    
    const duration = Date.now() - startTime;
    const isSuccess = response.status >= 200 && response.status < 400;
    const statusIcon = isSuccess ? '✅' : '⚠️';
    console.log(`${statusIcon} [${name}] HTTP ${response.status} (${duration}ms) -> ${url.slice(0, 75)}...`);
    return { name, success: isSuccess, status: response.status };
  } catch (err) {
    const duration = Date.now() - startTime;
    console.warn(`❌ [${name}] Échec (${duration}ms) : ${err.message}`);
    return { name, success: false, error: err.message };
  }
}

async function runAllPings() {
  console.log('='.repeat(70));
  console.log('🚀 Démarrage des pings réels Google, Google Actualités, Bing & IA');
  console.log(`📡 URL Principale : ${SITE_URL}`);
  console.log(`📰 Sitemap News   : ${SITEMAP_NEWS_URL}`);
  console.log(`⏱️ Horodatage      : ${new Date().toISOString()}`);
  console.log('='.repeat(70) + '\n');

  const tasks = [];

  // 1. Google Search Sitemap Ping
  tasks.push(sendPing(
    'Google Search Ping',
    `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
  ));

  // 2. Google News Sitemap Ping (Google Actualités)
  tasks.push(sendPing(
    'Google News Ping',
    `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP_NEWS_URL)}`
  ));

  // 3. Bing & Yahoo Search Sitemap Ping
  tasks.push(sendPing(
    'Bing Search Ping',
    `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP_URL)}`
  ));

  // 4. WebSub / PubSubHubbub Hub (Google Appspot Hub pour syndication immédiate RSS / Google News)
  tasks.push(sendPing(
    'WebSub Google Hub (PubSubHubbub)',
    'https://pubsubhubbub.appspot.com/',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `hub.mode=publish&hub.url=${encodeURIComponent(FEED_URL)}`
    }
  ));

  // 5. WebSub Superfeedr Hub (Agrégateurs & Lecteurs d'actualités mondiaux)
  tasks.push(sendPing(
    'WebSub Superfeedr Hub',
    'https://pubsubhubbub.superfeedr.com/',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `hub.mode=publish&hub.url=${encodeURIComponent(FEED_URL)}`
    }
  ));

  // 6. IndexNow API - Direct Bing, Yandex, Seznam & Naver push
  const indexNowPayload = JSON.stringify({
    host: 'bwillou1.github.io',
    key: INDEXNOW_KEY,
    keyLocation: INDEXNOW_KEY_LOCATION,
    urlList: URLS_TO_INDEX
  });

  tasks.push(sendPing(
    'IndexNow API (Global Endpoint)',
    'https://api.indexnow.org/indexnow',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: indexNowPayload
    }
  ));

  tasks.push(sendPing(
    'IndexNow API (Bing Direct)',
    'https://www.bing.com/indexnow',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: indexNowPayload
    }
  ));

  tasks.push(sendPing(
    'IndexNow API (Yandex Direct)',
    'https://yandex.com/indexnow',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: indexNowPayload
    }
  ));

  // 7. Wayback Machine / Internet Archive Live Snapshot (Garantit l'ingestion dans Common Crawl & datasets IA)
  tasks.push(sendPing(
    'Internet Archive Wayback Save (Home)',
    `https://web.archive.org/save/${SITE_URL}/`
  ));

  tasks.push(sendPing(
    'Internet Archive Wayback Save (News Sitemap)',
    `https://web.archive.org/save/${SITEMAP_NEWS_URL}`
  ));

  tasks.push(sendPing(
    'Internet Archive Wayback Save (llms.txt)',
    `https://web.archive.org/save/${LLMS_URL}`
  ));

  const results = await Promise.allSettled(tasks);
  
  console.log('\n' + '='.repeat(70));
  const successfulCount = results.filter(r => r.status === 'fulfilled' && r.value.success).length;
  console.log(`📊 Bilan des Pings : ${successfulCount} / ${tasks.length} services notifiés avec succès.`);
  console.log('='.repeat(70));
}

runAllPings().catch(err => {
  console.error('Erreur critique lors de l\'exécution des pings :', err);
  process.exit(1);
});
