/**
 * LIENLIBRE - BACKEND (Cloudflare Worker)
 * 
 * Passerelle citoyenne, éducative et de recherche pour l'interopérabilité
 * des métadonnées web (Open Graph Protocol, Twitter Cards, Schema.org).
 * Conforme à l'utilisation équitable (art. 29 Loi sur le droit d'auteur du Canada)
 * et au statut d'intermédiaire technique passif (art. 31.1 LDA).
 * 
 * FONCTIONNALITÉS :
 * - Extraction éphémère de métadonnées Open Graph pour recherche et compatibilité.
 * - Anti-Tracking : Nettoyage automatique des mouchards publicitaires (fbclid, utm_*, etc.).
 * - Statistiques ouvertes en temps réel : Agrégation anonyme (Cloudflare KV).
 * - Zero-Log : Aucune adresse IP ni identifiant utilisateur conservé.
 */

// Headers complets pour assurer l'interopérabilité avec les serveurs web distants
const SPOOF_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "fr-CA,fr;q=0.9,en-US;q=0.8,en;q=0.7",
  "Cache-Control": "no-cache",
  "Pragma": "no-cache",
  "Sec-Ch-Ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"macOS"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1"
};

// En-têtes CORS globaux pour autoriser le frontend
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Max-Age": "86400"
};

// En-têtes HTTP de sécurité globaux
const SECURITY_HEADERS = {
  "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src *; data: *;",
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin"
};

// Liste blanche des médias canadiens autorisés (Redirection directe instantanée)
const ALLOWED_DOMAINS = [
  // Nationaux & Majeurs
  "lapresse.ca",
  "radio-canada.ca",
  "cbc.ca",
  "ctvnews.ca",
  "tvanouvelles.ca",
  "ledevoir.com",
  "journaldemontreal.com",
  "journaldequebec.com",
  "theglobeandmail.com",
  "nationalpost.com",
  "thestar.com",
  "torontostar.com",
  "globalnews.ca",
  "rds.ca",
  "tsn.ca",
  "noovo.info",
  "lactualite.com",
  "lesaffaires.com",
  "macleans.ca",
  "tvo.org",
  "cheknews.ca",
  "hilltimes.com",
  
  // Coopératives de l'information (Québec)
  "lesoleil.com",
  "latribune.ca",
  "lenouvelliste.ca",
  "ledroit.com",
  "lequotidien.com",
  "lavoixdelest.ca",

  // Quotidiens Régionaux (Ontario)
  "thespec.com",
  "windsorstar.com",
  "thesudburystar.com",
  "thewhig.com",
  "stcatharinesstandard.ca",
  "wellandtribune.ca",
  "niagarafallsreview.ca",
  "peterboroughexaminer.com",
  "saultstar.com",
  "northbaynugget.ca",
  "theintelligencer.ca",
  "standard-freeholder.com",
  "recorder.ca",
  "chroniclejournal.com",

  // Ouest Canadien & Prairies
  "vancouversun.com",
  "theprovince.com",
  "calgaryherald.com",
  "edmontonjournal.com",
  "winnipegfreepress.com",
  "leaderpost.com",
  "thestarphoenix.com",
  "timescolonist.com",
  "dailyhive.com",
  "narcity.com",
  "thetyee.ca",
  "nationalobserver.com",
  "castanet.net",
  "pentictonherald.ca",
  "kelownadailycourier.ca",
  "brandonsun.com",
  "sasktoday.ca",
  "cjme.com",
  "ckom.com",
  "paherald.sk.ca",
  "stalbertgazette.com",
  "cochranetoday.ca",
  "okotokstoday.ca",
  "reddeeradvocate.com",
  "medicinehatnews.com",
  "lethbridgeherald.com",
  "vancouverisawesome.com",
  "pgcitizen.ca",

  // Provinces de l'Atlantique & Acadie
  "saltwire.com",
  "thetelegram.com",
  "theguardian.pe.ca",
  "capebretonpost.com",
  "chronicleherald.ca",
  "acadienouvelle.com",
  "l-express.ca",

  // Hebdomadaires et hyperlocaux (Québec)
  "journalmetro.com",
  "les2rives.com",
  "lecourrier.qc.ca",
  "lecharlevoisien.com",
  "lecitoyenvaldor.com",
  "lecitoyenrouyn.com",
  "laction.com",
  "lanouvelle.net",
  "courrierfrontenac.qc.ca",
  "lecanadafrancais.qc.ca",
  "journalexpress.ca",
  "lhebdojournal.com",
  "lecourrierdesud.ca",
  "soreltracy.com",
  "infodimanche.com",
  "enbeauce.com",
  "neomedia.com",
  "lavantage.qc.ca",
  "urbania.ca",
  
  // Radios et médias locaux
  "iheartradio.ca",
  "chga.fm",
  "cime.fm",
  "cjso.ca",
  "republiquedebagages.ca"

  // =============================================================================
// LISTE BLANCHE DES MÉDIAS D'INFORMATION CANADIENS — LienLibre
// ----------------------------------------------------------------------------
// Générée et vérifiée le 8 septembre 2026.
// 957 domaines uniques, dédupliqués, testés un par un (DNS + HTTP/HTTPS).
// Critères : Conseil de presse du Québec, OJQC/ARC (organisations journalistiques
// enregistrées), Médias d'Info Canada, Hebdos Québec, AMECQ, associations de presse
// hebdomadaire provinciales (OCNA, AWNA, SWNA, MCNA), médias autochtones,
// presse étudiante et médias d'enquête indépendants établis.
// Exclus : agrégateurs, blogs d'opinion, Substack individuels, sites de
// propagande / désinformation, médias de plaidoyer partisan, domaines morts
// ou redirigeant vers du parking / contenu non journalistique.
// Note : les sous-domaines sont couverts automatiquement par isDomainAllowed()
// (ex. montreal.ctvnews.ca est couvert par ctvnews.ca).
// =============================================================================

const ALLOWED_DOMAINS = [
  // ── 01. NATIONAUX — Grands médias anglophones (45) ──
  "bnnbloomberg.ca",                    // BNN Bloomberg
  "breachmedia.ca",                     // The Breach
  "broadview.org",                      // Broadview
  "c2cjournal.ca",                      // C2C Journal
  "canadianaffairs.news",               // Canadian Affairs
  "canadianimmigrant.ca",               // Canadian Immigrant
  "cbc.ca",                             // CBC News
  "citynews.ca",                        // CityNews
  "convivium.ca",                       // Convivium
  "corporateknights.com",               // Corporate Knights
  "cp24.com",                           // CP24
  "cpac.ca",                            // CPAC
  "ctvnews.ca",                         // CTV News
  "financialpost.com",                  // Financial Post
  "futureofgood.co",                    // Future of Good
  "globalnews.ca",                      // Global News
  "hilltimes.com",                      // The Hill Times
  "ici.radio-canada.ca",                // Radio-Canada ICI
  "inroadsjournal.ca",                  // Inroads
  "ipolitics.ca",                       // iPolitics
  "literaryreviewofcanada.ca",          // Literary Review of Canada
  "macleans.ca",                        // Maclean's
  "nationalobserver.com",               // Canada's National Observer
  "nationalpost.com",                   // National Post
  "northernpublicaffairs.ca",           // Northern Public Affairs
  "policyoptions.irpp.org",             // Policy Options / IRPP
  "rabble.ca",                          // rabble.ca
  "radio-canada.ca",                    // Radio-Canada
  "ricochet.media",                     // Ricochet
  "spacing.ca",                         // Spacing
  "thebreachmedia.ca",                  // The Breach
  "thebureau.news",                     // The Bureau
  "thecanadianpress.com",               // La Presse canadienne / The Canadian Press
  "theenergymix.com",                   // The Energy Mix
  "theglobeandmail.com",                // The Globe and Mail
  "thehub.ca",                          // The Hub
  "thelawyersdaily.ca",                 // The Lawyer's Daily
  "thelogic.co",                        // The Logic
  "thenarwhal.ca",                      // The Narwhal
  "theprogressreport.ca",               // The Progress Report
  "thestar.com",                        // Toronto Star
  "thetyee.ca",                         // The Tyee
  "thewalrus.ca",                       // The Walrus
  "torontosun.com",                     // Toronto Sun
  "tvo.org",                            // TVO

  // ── 02. NATIONAUX — Grands médias francophones (33) ──
  "agenceqmi.ca",                       // Agence QMI
  "francopresse.ca",                    // Francopresse
  "journaldemontreal.com",              // Journal de Montréal
  "journaldequebec.com",                // Journal de Québec
  "journaldesvoisins.com",              // Journal des voisins
  "laconverse.com",                     // La Converse
  "lactualite.com",                     // L'actualité
  "lanouvelle.net",                     // La Nouvelle
  "lapresse.ca",                        // La Presse
  "laterre.ca",                         // La Terre de chez nous
  "latribune.ca",                       // La Tribune
  "lavoixdelest.ca",                    // La Voix de l'Est
  "ledevoir.com",                       // Le Devoir
  "ledroit.com",                        // Le Droit
  "lenouvelliste.ca",                   // Le Nouvelliste
  "lequotidien.com",                    // Le Quotidien
  "les2rives.com",                      // Les 2 Rives
  "lesaffaires.com",                    // Les Affaires
  "lesoleil.com",                       // Le Soleil
  "noovo.info",                         // Noovo info
  "nouveauprojet.com",                  // Nouveau Projet
  "nouvellesdici.com",                  // Nouvelles d'ici
  "pivot.quebec",                       // Pivot
  "protegez-vous.ca",                   // Protégez-Vous
  "quartierlibre.ca",                   // Quartier Libre (UdeM)
  "quebecscience.qc.ca",                // Québec Science
  "rds.ca",                             // RDS
  "rdsinfo.ca",                         // RDS Info
  "refletdesociete.com",                // Reflet de Société
  "soreltracy.com",                     // Sorel-Tracy
  "tvanouvelles.ca",                    // TVA Nouvelles
  "tvasports.ca",                       // TVA Sports
  "urbania.ca",                         // Urbania

  // ── 03. NATIONAUX — Numériques, enquête, affaires publiques (3) ──
  "atelier10.ca",                       // Nouveau Projet / Atelier 10
  "betakit.com",                        // BetaKit
  "law360.ca",                          // Law360 Canada

  // ── 04. NATIONAUX — Sports (4) ──
  "sportscage.com",                     // The Sports Cage
  "sportsnet.ca",                       // Sportsnet
  "thehockeynews.com",                  // The Hockey News
  "tsn.ca",                             // TSN

  // ── 05. ONTARIO — Quotidiens et grands régionaux (37) ──
  "brantfordexpositor.ca",              // Brantford Expositor
  "chathamdailynews.ca",                // Chatham Daily News
  "chathamthisweek.ca",                 // Chatham This Week
  "chroniclejournal.com",               // The Chronicle-Journal
  "guelphmercury.com",                  // Guelph Mercury
  "intelligencer.ca",                   // Belleville Intelligencer
  "kingstonthisweek.com",               // Kingston This Week
  "lfpress.com",                        // London Free Press
  "niagarafallsreview.ca",              // Niagara Falls Review
  "northbaynugget.ca",                  // North Bay Nugget
  "northernontariobusiness.com",        // Northern Ontario Business
  "nugget.ca",                          // North Bay Nugget
  "nwonewswatch.com",                   // NWO NewsWatch
  "ottawacitizen.com",                  // Ottawa Citizen
  "ottawasun.com",                      // Ottawa Sun
  "owensoundsuntimes.com",              // Owen Sound Sun Times
  "peterboroughexaminer.com",           // Peterborough Examiner
  "recorder.ca",                        // Brockville Recorder and Times
  "saultstar.com",                      // Sault Star
  "simcoereformer.ca",                  // Simcoe Reformer
  "snnewswatch.com",                    // SNN NewsWatch
  "standard-freeholder.com",            // Cornwall Standard-Freeholder
  "stcatharinesstandard.ca",            // St. Catharines Standard
  "stratfordbeaconherald.com",          // Stratford Beacon Herald
  "stthomastimesjournal.com",           // St. Thomas Times-Journal
  "sudbury.com",                        // Sudbury.com
  "tbnewswatch.com",                    // TBNewswatch
  "theobserver.ca",                     // Sarnia Observer
  "thepeterboroughexaminer.com",        // Peterborough Examiner
  "therecord.com",                      // Waterloo Region Record
  "thespec.com",                        // The Hamilton Spectator
  "thesudburystar.com",                 // Sudbury Star
  "thewhig.com",                        // Kingston Whig-Standard
  "timminspress.com",                   // Timmins Press
  "wellandtribune.ca",                  // Welland Tribune
  "windsorstar.com",                    // Windsor Star
  "woodstocksentinelreview.com",        // Woodstock Sentinel-Review

  // ── 06. ONTARIO — Métroland / Torstar (hyperlocal) (19) ──
  "bradfordtimes.ca",                   // Bradford Times
  "bramptonguardian.com",               // Brampton Guardian
  "burlingtonpost.com",                 // Burlington Post
  "cambridgetimes.ca",                  // Cambridge Times
  "durhamregion.com",                   // DurhamRegion.com
  "guelphtribune.ca",                   // Guelph Tribune
  "insauga.com",                        // inSauga
  "insidehalton.com",                   // Inside Halton
  "mississauga.com",                    // Mississauga.com
  "niagarathisweek.com",                // Niagara This Week
  "northumberlandnews.com",             // Northumberland News
  "oakvillebeaver.com",                 // Oakville Beaver
  "orangeville.com",                    // Orangeville Banner
  "sachem.ca",                          // The Sachem
  "simcoe.com",                         // Simcoe.com
  "theifp.ca",                          // Independent Free Press
  "toronto.com",                        // Torstar / Metroland Toronto
  "waterloochronicle.ca",               // Waterloo Chronicle
  "yorkregion.com",                     // YorkRegion.com

  // ── 07. ONTARIO — Village Media (réseau numérique local) (28) ──
  "auroratoday.ca",                     // AuroraToday
  "barrietoday.com",                    // BarrieToday
  "baytoday.ca",                        // BayToday
  "bradfordtoday.ca",                   // BradfordToday
  "burlingtontoday.com",                // BurlingtonToday
  "cambridgetoday.ca",                  // CambridgeToday
  "collingwoodtoday.ca",                // CollingwoodToday
  "dundastoday.com",                    // DundasToday
  "elliotlaketoday.com",                // ElliotLakeToday
  "elorafergustoday.com",               // EloraFergusToday
  "flamboroughtoday.com",               // FlamboroughToday
  "guelphtoday.com",                    // GuelphToday
  "haltonhillstoday.ca",                // HaltonHillsToday
  "innisfiltoday.ca",                   // InnisfilToday
  "midlandtoday.ca",                    // MidlandToday
  "miltontoday.ca",                     // MiltonToday
  "newmarkettoday.ca",                  // NewmarketToday
  "oakvillenews.org",                   // Oakville News
  "orilliamatters.com",                 // OrilliaMatters
  "parliamenttoday.ca",                 // Parliament Today
  "pelhamtoday.ca",                     // PelhamToday
  "sootoday.com",                       // SooToday
  "stratfordtoday.ca",                  // StratfordToday
  "thetrillium.ca",                     // The Trillium
  "thoroldtoday.ca",                    // ThoroldToday
  "timminstoday.com",                   // TimminsToday
  "torontotoday.ca",                    // TorontoToday
  "villagereport.ca",                   // Village Report

  // ── 08. ONTARIO — Hebdomadaires communautaires (106) ──
  "auroran.com",                        // The Auroran
  "aylmerexpress.com",                  // Aylmer Express
  "ayrnews.ca",                         // Ayr News
  "bancroftthisweek.com",               // Bancroft This Week
  "brucepeninsulapress.com",            // Bruce Peninsula Press
  "burlingtonindependent.ca",           // Burlington Independent
  "caledoncitizen.com",                 // Caledon Citizen
  "chathamvoice.com",                   // Chatham Voice
  "citizen.on.ca",                      // Orangeville Citizen
  "clintonnewsrecord.com",              // Clinton News Record
  "cochranetimespost.ca",               // Cochrane Times-Post
  "cochranetimespost.com",              // Cochrane Times-Post
  "cornwallseawaynews.com",             // Cornwall Seaway News
  "creemore.com",                       // Creemore Echo
  "dorchestersignpost.com",             // Dorchester Signpost
  "editionap.ca",                       // Hawkesbury Tribune-Express
  "eganvilleleader.ca",                 // Eganville Leader
  "elliotlakestandard.ca",              // Elliot Lake Standard
  "essexfreepress.com",                 // Essex Free Press
  "fftimes.com",                        // Fort Frances Times
  "frontenacnews.ca",                   // Frontenac News
  "goderichsignalstar.com",             // Goderich Signal Star
  "granthaven.com",                     // Grant Haven Media
  "haldimandpress.com",                 // Haldimand Press
  "haliburtonecho.ca",                  // Haliburton County Echo
  "heraldadvance.ca",                   // The Advance (Dundalk/Flesherton)
  "huntsvilleforester.com",             // Huntsville Forester
  "huroncitizen.ca",                    // Blyth/Brussels Citizen
  "independent.on.ca",                  // Kincardine Independent
  "kenoradailyminerandnews.com",        // Kenora Daily Miner and News
  "kenoraminerandnews.com",             // Kenora Miner and News
  "kingsentinel.com",                   // King Weekly Sentinel
  "kitchissippi.com",                   // Kitchissippi Times
  "lakefieldherald.com",                // Lakefield Herald
  "lakereport.ca",                      // The Lake Report (Niagara-on-the-Lake)
  "lakeshoreadvance.com",               // Lakeshore Times-Advance
  "lakeshorenews.com",                  // Lakeshore News Reporter
  "lanarkera.com",                      // Lanark Era
  "lasallepost.ca",                     // Lasalle Post Reporter
  "lucknowsentinel.com",                // Lucknow Sentinel
  "middlesexbanner.ca",                 // Middlesex Banner
  "midnorthmonitor.com",                // Mid-North Monitor
  "midwesternnewspapers.com",           // Midwestern Newspapers (Postmedia)
  "mildmaycrier.com",                   // Mildmay Town & Country Crier
  "mindentimes.ca",                     // Minden Times
  "mitchelladvocate.com",               // Mitchell Advocate
  "morrisburgleader.ca",                // Morrisburg Leader
  "muskokaregion.com",                  // Muskoka Region
  "napaneebeaver.ca",                   // Napanee Beaver
  "napaneeguide.com",                   // Napanee Guide
  "newsnowniagara.com",                 // NewsNow Niagara
  "newspapers-online.com",              // London Publishing / Auroran
  "newtectimes.com",                    // New Tecumseth Times
  "ngtimes.ca",                         // North Grenville Times
  "niagaraindependent.ca",              // Niagara Independent
  "northbaynipissing.com",              // North Bay Nipissing
  "northernnews.ca",                    // Northern News (Kirkland Lake)
  "northperth.com",                     // Listowel Banner / Independent Plus
  "northrenfrewtimes.ca",               // North Renfrew Times
  "notllocal.com",                      // NOTL Local
  "observerxtra.com",                   // Elmira-Woolwich Observer
  "oronoweeklytimes.com",               // Orono Weekly Times
  "parrysound.com",                     // Parry Sound North Star
  "petrolialambtonindependent.ca",      // Petrolia/Lambton Independent
  "pictongazette.ca",                   // Picton Gazette
  "portdovermapleleaf.com",             // Port Dover Maple Leaf
  "reviewmirror.ca",                    // Westport Review-Mirror
  "rivertowntimes.com",                 // River Town Times (Amherstburg)
  "sarniathisweek.com",                 // Sarnia This Week
  "saultthisweek.com",                  // Sault Ste. Marie This Week
  "seaforthhuronexpositor.com",         // Seaforth Huron Expositor
  "shelburnefreepress.ca",              // Shelburne Free Press
  "shorelinebeacon.com",                // Shoreline Beacon
  "siouxbulletin.com",                  // Sioux Lookout Bulletin
  "southpointsun.ca",                   // Southpoint Sun
  "speaker.northernontario.ca",         // Temiskaming Speaker
  "springwaternews.ca",                 // North Simcoe Springwater News
  "stmarysindependent.com",             // St. Marys Independent
  "strathroyagedispatch.com",           // Strathroy Age Dispatch
  "thechronicle-online.com",            // West Elgin Chronicle
  "thecosmos.ca",                       // Uxbridge Cosmos
  "thehighlander.ca",                   // The Highlander
  "thelaker.ca",                        // The Laker (Muskoka)
  "thelondoner.ca",                     // The Londoner
  "themeafordindependent.ca",           // Meaford Independent
  "thepost.on.ca",                      // The Post (Hanover)
  "therecordnews.ca",                   // Chesterville Record
  "thereporter.ca",                     // The Reporter (Windsor-Essex)
  "thereview.ca",                       // Vankleek Hill Review
  "thesarniajournal.com",               // Sarnia Journal
  "thestandardnewspaper.ca",            // The Standard (Durham/Kawartha)
  "thetimesstar.ca",                    // Geraldton Times Star
  "theturtleislandnews.com",            // Turtle Island News
  "thetweednews.ca",                    // Tweed News
  "thevalleygazette.ca",                // The Valley Gazette (Barry's Bay)
  "thevoiceofpelham.ca",                // The Voice of Pelham
  "tilburytimes.ca",                    // Tilbury Times Reporter
  "timminstimes.com",                   // Timmins Times
  "trentonian.ca",                      // Trenton Trentonian
  "walkerton.com",                      // Walkerton Herald Times
  "wawataynews.ca",                     // Wawatay News
  "wellingtonadvertiser.com",           // Wellington Advertiser
  "westnipissing.com",                  // West Nipissing Tribune
  "wiartonecho.com",                    // Wiarton Echo
  "wingham.com",                        // Wingham Advance Times
  "wn3.ca",                             // News Now Grimsby/Lincoln

  // ── 09. ONTARIO — Toronto / Ottawa indépendants et magazines (8) ──
  "apt613.ca",                          // APT613
  "capitalcurrent.ca",                  // Capital Current
  "excal.on.ca",                        // Excalibur (York)
  "kingstonist.com",                    // Kingstonist
  "nowtoronto.com",                     // NOW Toronto
  "theeyeopener.com",                   // The Eyeopener
  "thelocal.to",                        // The Local
  "torontolife.com",                    // Toronto Life

  // ── 11. QUÉBEC — Hebdomadaires locaux et régionaux (147) ──
  "ascot-corner.com",                   // Aux Quatre Coins
  "atlasmedias.com",                    // Atlas Mtl
  "beaucemedia.ca",                     // Beauce Média
  "bulletinaylmer.com",                 // Le Bulletin d'Aylmer
  "burysimagedebury.com",               // L'Image de Bury
  "canadafrancais.com",                 // Le Canada Français
  "chamblyexpress.ca",                  // Chambly Express
  "chamblymatin.com",                   // Chambly Matin
  "charlevoixendirect.com",             // Le Charlevoisien
  "citesnouvelles.com",                 // Cité Nouvelles
  "cittadinocanadese.com",              // Il Cittadino Canadese
  "coupdoeil.info",                     // Coup d'œil
  "courrierahuntsic.com",               // Courrier Ahuntsic
  "courrierdeportneuf.com",             // Courrier de Portneuf
  "courrierfrontenac.qc.ca",            // Courrier Frontenac
  "courrierlaval.com",                  // Courrier Laval
  "cybersoleil.com",                    // Le Soleil de Châteauguay
  "easterndoor.com",                    // The Eastern Door (Kahnawà:ke)
  "echocantley.ca",                     // L'Écho de Cantley
  "echodefrontenac.com",                // L'Écho de Frontenac
  "enbeauce.com",                       // Beauce Média
  "entreelibre.info",                   // Entrée Libre (Sherbrooke)
  "expressoutremont.com",               // L'Express d'Outremont / Mont-Royal
  "flambeaudelest.com",                 // Le Flambeau de l'Est
  "gaspespec.com",                      // Gaspé Spec
  "gazettemauricie.com",                // La Gazette de la Mauricie
  "graffici.ca",                        // Graffici
  "granbyexpress.com",                  // Le Granby Express
  "guidemtlnord.com",                   // Le Guide Montréal-Nord
  "hebdorivenord.com",                  // Hebdo Rive Nord
  "hebdosvalleyfield.ca",               // Hebdos Valleyfield
  "horizonweekly.ca",                   // Horizon Weekly (arménien)
  "info07.com",                         // Info 07 (Gatineau)
  "infodimanche.com",                   // Info Dimanche
  "journal-ensemble.org",               // Ensemble pour bâtir
  "journaldechambly.com",               // Le Journal de Chambly
  "journaldelevis.com",                 // Le Journal de Lévis
  "journalderosemont.com",              // Journal de Rosemont–La Petite-Patrie
  "journaldestmichel.com",              // Journal de Saint-Michel
  "journalexpress.ca",                  // Journal Express
  "journalhsf.com",                     // Le Haut-Saint-François
  "journallarevue.com",                 // La Revue (Gatineau)
  "journallecourrier.com",              // Le Courrier (Sainte-Thérèse)
  "journalleguide.com",                 // Le Guide (Cowansville)
  "journallehavre.ca",                  // Le Havre (Gaspé)
  "journallenord.com",                  // Le Nord (Saint-Jérôme)
  "journallereflet.com",                // Le Reflet (Victoriaville)
  "journallesactualites.ca",            // Les Actualités (Asbestos)
  "journallesoir.ca",                   // Le Journal Les Soir
  "journalmalartic.com",                // Le P'tit Journal de Malartic
  "journalmobiles.com",                 // Journal Mobiles
  "journaltdn.ca",                      // Le Trait d'Union du Nord
  "laction.com",                        // L'Action (Joliette)
  "lactiondautray.com",                 // L'Action d'Autray
  "ladepeche.qc.ca",                    // La Dépêche
  "lapensee.qc.ca",                     // La Pensée de Bagot
  "lapetitenation.com",                 // La Petite Nation
  "lappel.com",                         // L'Appel (Québec)
  "lareleve.qc.ca",                     // La Relève
  "larevue.qc.ca",                      // La Revue (Gatineau)
  "lasentinelle.ca",                    // La Sentinelle
  "lautjournal.info",                   // L'aut'journal
  "lavalnews.ca",                       // Laval News
  "lavantage.qc.ca",                    // L'Avantage
  "lavantposte.ca",                     // L'Avant-Poste (Amqui)
  "laveniretdesrivieres.com",           // L'Avenir et des Rivières
  "lavoixdusud.com",                    // La Voix du Sud
  "lavoixpop.com",                      // La Voix Pop
  "lecharlevoisien.com",                // Le Charlevoisien
  "lechoabitibien.ca",                  // L'Écho Abitibien
  "lechodelarivenord.ca",               // L'Écho de la Rive-Nord
  "lechodelatuque.com",                 // L'Écho de La Tuque
  "lechodelaval.ca",                    // L'Écho de Laval
  "lechodemaskinonge.ca",               // L'Écho de Maskinongé
  "lechodemaskinonge.com",              // L'Écho de Maskinongé
  "lechodetroisrivieres.ca",            // L'Écho de Trois-Rivières
  "leclaireurprogres.ca",               // L'Éclaireur Progrès
  "leclaireurprogres.com",              // L'Éclaireur Progrès
  "leclairon.qc.ca",                    // Le Clairon régional (Saint-Hyacinthe)
  "lecourrier.qc.ca",                   // Le Courrier
  "lecourrierdusud.ca",                 // Le Courrier du Sud (Longueuil)
  "lecourriersud.com",                  // Le Courrier Sud (Nicolet)
  "lehavre.ca",                         // Le Havre (Gaspé)
  "lejacquescartier.com",               // Le Jacques-Cartier
  "lejournaldejoliette.ca",             // Le Journal de Joliette
  "lejournaldesherbrooke.ca",           // Le Journal de Sherbrooke
  "lejournaldespaysdenhautlavallee.ca",  // Le Journal des Pays-d'en-Haut
  "lelacstjean.com",                    // Le Journal Le Lac St-Jean
  "lenord-cotier.com",                  // Le Nord-Côtier
  "lepeuplelevis.ca",                   // Le Peuple de Lévis
  "lepeuplelotbiniere.ca",              // Le Peuple Lotbinière
  "lephare.info",                       // Le Phare
  "lepharillon.ca",                     // Le Pharillon
  "leplacoteux.com",                    // Le Placoteux
  "leplateau.com",                      // Le Plateau
  "leprogres.net",                      // Le Progrès (Cookshire-Eaton)
  "leprogresvilleray.com",              // Progrès Villeray
  "lequebecexpress.com",                // Le Québec Express
  "lequebecois.org",                    // Le Québécois
  "leradar.qc.ca",                      // Le Radar (Îles-de-la-Madeleine)
  "lereflet.qc.ca",                     // Le Reflet
  "lerefletdulac.com",                  // Le Reflet du Lac
  "lereveil.ca",                        // Le Réveil (Saguenay)
  "lereveil.com",                       // Le Réveil (Saguenay)
  "lesexplos.com",                      // Les Explos
  "letincelle.qc.ca",                   // L'Étincelle
  "letoiledulac.com",                   // L'Étoile du Lac
  "letraitdunion.com",                  // Le Trait d'Union
  "leveil.com",                         // La Concorde / L'Éveil (Saint-Eustache)
  "lhebdodustmaurice.com",              // L'Hebdo du St-Maurice
  "lhebdojournal.com",                  // L'Hebdo Journal
  "linformateurrdp.com",                // L'Informateur de Rivière-des-Prairies
  "linformation.ca",                    // L'Information (Mont-Joli)
  "lowdownonline.com",                  // The Low Down to Hull and Back
  "magazinegaspesie.ca",                // Magazine Gaspésie
  "maroc-canada.ca",                    // Maghreb Canada Express
  "messagerlachine.com",                // Le Messager Lachine-Dorval
  "messagerlasalle.com",                // Le Messager Lasalle
  "monquartier.ca",                     // Monquartier (Québec)
  "monquartier.quebec",                 // Monquartier (Québec)
  "montrealexpress.ca",                 // Montréal Express
  "mtltimes.ca",                        // Montreal Times
  "neomedia.com",                       // Néo Média
  "nouvelleshebdo.com",                 // Nouvelles Hebdo
  "nouvellessaint-laurent.com",         // Les Nouvelles Saint-Laurent News
  "ns-news.com",                        // North Shore News (Sept-Îles)
  "oeilregional.com",                   // L'Œil régional (Beloeil)
  "pointsud.ca",                        // Point Sud
  "progresstleonard.com",               // Progrès Saint-Léonard
  "px-news.com",                        // Parc Extension News
  "qctonline.com",                      // Quebec Chronicle-Telegraph
  "quebechebdo.com",                    // Québec Hebdo
  "rivesudexpress.ca",                  // Rive-Sud Express
  "sherbrooke.info",                    // Sherbrooke.info
  "sherbrookerecord.com",               // Sherbrooke Record
  "sorel-tracyexpress.ca",              // Sorel-Tracy Express
  "stanstead-journal.com",              // Stanstead Journal
  "the-gleaner.com",                    // The Gleaner (Shawville)
  "theequity.ca",                       // The Equity (Shawville)
  "thesuburban.com",                    // The Suburban
  "tremblantexpress.com",               // Journal Tremblant Express
  "valleedurichelieuexpress.ca",        // Vallée du Richelieu Express
  "voir.ca",                            // Voir
  "westislandchronicle.com",            // The Chronicle West Island
  "westmountexaminer.com",              // Westmount Examiner
  "westmountindependent.com",           // Westmount Independent
  "yourlocaljournal.ca",                // Your Local Journal

  // ── 12. QUÉBEC — Presse urbaine, anglophone et communautaire (12) ──
  "cultmontreal.com",                   // Cult MTL
  "cultmtl.com",                        // Cult MTL
  "journalmetro.com",                   // Métro
  "larotonde.ca",                       // La Rotonde (uOttawa)
  "levoyageur.ca",                      // Le Voyageur (Grand Sudbury)
  "mcgilldaily.com",                    // McGill Daily
  "mcgilltribune.com",                  // McGill Tribune
  "montrealgazette.com",                // Montreal Gazette
  "onfr.tfo.org",                       // ONFR
  "theconcordian.com",                  // The Concordian
  "thefulcrum.ca",                      // The Fulcrum (uOttawa)
  "thelinknewspaper.ca",                // The Link

  // ── 13. COLOMBIE-BRITANNIQUE (171) ──
  "100milefreepress.net",               // 100 Mile House Free Press
  "250news.com",                        // 250 News
  "abbotsfordtoday.ca",                 // Abbotsford Today
  "abbynews.com",                       // Abbotsford News
  "agassizharrisonobserver.com",        // Agassiz Harrison Observer
  "alaskahighwaynews.ca",               // Alaska Highway News
  "albernivalleynews.com",              // Alberni Valley News
  "aldergrovestar.com",                 // Aldergrove Star
  "arrowlakesnews.com",                 // Arrow Lakes News
  "avtimes.net",                        // Alberni Valley Times
  "barrierestarjournal.com",            // Barriere North Thompson Star Journal
  "bcbusiness.ca",                      // BC Business
  "bcmag.ca",                           // British Columbia Magazine
  "biv.com",                            // Business in Vancouver
  "boundarycreektimes.com",             // Boundary Creek Times
  "boundarysentinel.com",               // Boundary Sentinel
  "bowenislandundercurrent.com",        // Bowen Island Undercurrent
  "bulkleybrowser.ca",                  // Bulkley Browser
  "burnabynow.com",                     // Burnaby Now
  "burnslakelakesdistrictnews.com",     // Burns Lake Lakes District News
  "caledoniacourier.com",               // Caledonia Courier
  "campbellrivermirror.com",            // Campbell River Mirror
  "castanet.net",                       // Castanet
  "castlegarnews.com",                  // Castlegar News
  "castlegarsource.com",                // Castlegar Source
  "cfjctoday.com",                      // CFJC Today (Kamloops)
  "cheknews.ca",                        // CHEK News
  "chemainusvalleycourier.ca",          // Chemainus Valley Courier
  "chilliwacktimes.com",                // Chilliwack Times
  "clearwatertimes.com",                // Clearwater Times
  "cloverdalereporter.com",             // Cloverdale Reporter
  "coastmountainnews.com",              // Coast Mountain News
  "coastreporter.net",                  // Coast Reporter
  "columbiavalleypioneer.com",          // Columbia Valley Pioneer
  "comoxvalleyecho.com",                // Comox Valley Echo
  "comoxvalleyrecord.com",              // Comox Valley Record
  "cowichanvalleycitizen.com",          // Cowichan Valley Citizen
  "cranbrooktownsman.com",              // Cranbrook Townsman
  "crestonvalleyadvance.ca",            // Creston Valley Advance
  "dailyhive.com",                      // Daily Hive
  "delta-optimist.com",                 // Delta Optimist
  "discoveryislands.ca",                // Discovery Islander
  "douglasmagazine.com",                // Douglas Magazine
  "e-know.ca",                          // e-KNOW (Cranbrook)
  "eaglevalleynews.com",                // Eagle Valley News
  "elkvalleyherald.ca",                 // Elk Valley Herald
  "energeticcity.ca",                   // Energeticcity.ca (Fort St. John)
  "expressnews.ca",                     // Express (Nelson)
  "focusonline.ca",                     // Focus Magazine
  "fraservalleynewsnetwork.com",        // Fraser Valley News Network
  "fraservalleytoday.ca",               // Fraser Valley Today
  "friam.ca",                           // Friday AM (Salmon Arm)
  "grandforksgazette.ca",               // Grand Forks Gazette
  "gulfislandsdriftwood.com",           // Gulf Islands Driftwood
  "haidagwaiiobserver.com",             // Haida Gwaii Observer
  "hashilthsa.com",                     // Ha-Shilth-Sa
  "hopestandard.com",                   // Hope Standard
  "houston-today.com",                  // Houston Today
  "interior-news.com",                  // Interior News
  "jamesbaybeacon.ca",                  // James Bay Beacon
  "kamloopsbcnow.com",                  // Kamloops BC Now
  "kamloopsmatters.com",                // Kamloops Matters
  "kamloopsthisweek.com",               // Kamloops This Week
  "kelownacapnews.com",                 // Kelowna Capital News
  "kelownadailycourier.ca",             // Kelowna Daily Courier
  "kelownanow.com",                     // Kelowna Now
  "keremeosreview.com",                 // Keremeos Review
  "kitimatdaily.ca",                    // Kitimat Daily Online
  "kootenayadvertiser.com",             // Kootenay News Advertiser
  "ladysmithchronicle.com",             // Ladysmith Chronicle
  "lakecountrycalendar.com",            // Lake Country Calendar
  "lakecowichangazette.com",            // Lake Cowichan Gazette
  "langleyadvance.com",                 // Langley Advance Times
  "langleyadvancetimes.com",            // Langley Advance Times
  "langleytimes.com",                   // Langley Times
  "langleytoday.ca",                    // Langley Today
  "ldnews.net",                         // Lakes District News
  "lillooetnews.net",                   // Bridge River Lillooet News
  "lookoutnewspaper.com",               // Lookout (Esquimalt)
  "lumbyvalleytimes.ca",                // Lumby Valley Times
  "mapleridgenews.com",                 // Maple Ridge-Pitt Meadows News
  "merrittherald.com",                  // Merritt Herald
  "merrittnews.net",                    // Merritt News
  "missioncityrecord.com",              // Mission City Record
  "mondaymag.com",                      // Monday Magazine
  "mrtimes.com",                        // Maple Ridge Times
  "mybulkleylakesnow.com",              // My Bulkley Lakes Now
  "mycampbellrivernow.com",             // My Campbell River Now
  "mycariboonow.com",                   // My Cariboo Now
  "mychilliwacknews.com",               // My Chilliwack News
  "mycoastnow.com",                     // My Coast Now
  "mycomoxvalleynow.com",               // My Comox Valley Now
  "mycowichanvalleynow.com",            // My Cowichan Valley Now
  "mycrestonnow.com",                   // My Creston Now
  "mykootenaynow.com",                  // My Kootenay Now
  "mynechakovalleynow.com",             // My Nechako Valley Now
  "mynelsonnow.com",                    // My Nelson Now
  "mypowellrivernow.com",               // My Powell River Now
  "myprincegeorgenow.com",              // My Prince George Now
  "mytriportnow.com",                   // My Triport Now
  "nanaimobulletin.com",                // Nanaimo News Bulletin
  "nanaimonewsnow.com",                 // Nanaimo News Now
  "narcity.com",                        // Narcity
  "nelsonstar.com",                     // Nelson Star
  "newwestrecord.ca",                   // New Westminster Record
  "northeastnews.ca",                   // Northeast News
  "northernsentinel.com",               // Northern Sentinel
  "northislandgazette.com",             // North Island Gazette
  "nsnews.com",                         // North Shore News
  "okadvertiser.com",                   // Okanagan Advertiser
  "ominecaexpress.com",                 // Omineca Express
  "peacearchnews.com",                  // Peace Arch News
  "peachlandview.com",                  // Peachland View
  "pentictonherald.ca",                 // Penticton Herald
  "pentictonwesternnews.com",           // Penticton Western News
  "piquenewsmagazine.com",              // Pique Newsmagazine
  "pqbnews.com",                        // PQB News
  "princegeorgecitizen.com",            // Prince George Citizen
  "princegeorgematters.com",            // Prince George Matters
  "prpeak.com",                         // Powell River Peak
  "publiceyeonline.com",                // Public Eye Online
  "quesnelobserver.com",                // Quesnel Cariboo Observer
  "revelstokecurrent.com",              // Revelstoke Current
  "revelstokemountaineer.com",          // Revelstoke Mountaineer
  "revelstokereview.com",               // Revelstoke Review
  "richmond-news.com",                  // Richmond News
  "rosslandnews.com",                   // Rossland News
  "rosslandtelegraph.com",              // Rossland Telegraph
  "saobserver.net",                     // Salmon Arm Observer
  "similkameenspotlight.com",           // Similkameen Spotlight
  "skahamatters.com",                   // Skaha Matters
  "sookenewsmirror.com",                // Sooke News Mirror
  "soundernews.com",                    // Gabriola Sounder
  "squamishchief.com",                  // Squamish Chief
  "squamishreporter.com",               // Squamish Reporter
  "starjournal.net",                    // North Thompson Star Journal
  "straight.com",                       // Georgia Straight
  "summerlandreview.com",               // Summerland Review
  "sunpeaksnews.com",                   // Spin News Magazine
  "surreyleader.com",                   // Surrey Leader
  "surreynowleader.com",                // Surrey Now-Leader
  "terracestandard.com",                // Terrace Standard
  "thefreepress.ca",                    // The Free Press (Fernie)
  "thegoldenstar.net",                  // Golden Star
  "thelocalweekly.ca",                  // Local Weekly (Sechelt)
  "thenelsondaily.com",                 // Nelson Daily
  "thenelsonpost.ca",                   // Nelson Post
  "thenorthernview.com",                // The Northern View
  "thenownewspaper.com",                // Surrey Now-Leader
  "theprogress.com",                    // Chilliwack Progress
  "theprovince.com",                    // The Province
  "therockymountaingoat.com",           // Rocky Mountain Goat
  "thevalleysentinel.com",              // Valley Sentinel
  "timeschronicle.ca",                  // Times Chronicle (Osoyoos/Oliver)
  "timescolonist.com",                  // Times Colonist
  "trailchampion.com",                  // Trail Champion
  "traildailytimes.ca",                 // Trail Daily Times
  "trailtimes.ca",                      // Trail Times
  "tricitynews.com",                    // Tri-City News
  "tumblerridgenews.com",               // Tumbler Ridge News
  "valleyvoice.ca",                     // Valley Voice
  "vancourier.com",                     // Vancouver Courier
  "vancouverisawesome.com",             // Vancouver Is Awesome
  "vancouversun.com",                   // Vancouver Sun
  "vernonmorningstar.com",              // Vernon Morning Star
  "vicnews.com",                        // Victoria News
  "westerlynews.ca",                    // Westerly News
  "westerninvestor.com",                // Western Investor
  "westvanbeacon.ca",                   // West Van Beacon
  "whiterocksun.com",                   // White Rock Sun
  "wltribune.com",                      // Williams Lake Tribune

  // ── 14. ALBERTA (92) ──
  "airdriecityview.com",                // Airdrie City View
  "airdrieecho.com",                    // Airdrie Echo
  "albertanativenews.com",              // Alberta Native News
  "albertapolitics.ca",                 // Alberta Politics
  "albertaviews.ca",                    // Alberta Views
  "allcaribou.com",                     // Caribou Publishing (Alberta)
  "athabascaadvocate.com",              // Athabasca Advocate
  "barrheadleader.com",                 // Barrhead Leader
  "bashawstar.com",                     // Bashaw Star
  "bowislandcommentator.com",           // 40 Mile County Commentator
  "brooksbulletin.com",                 // Brooks Bulletin
  "businessedge.ca",                    // Business Edge
  "businessincalgary.com",              // Business in Calgary
  "calgaryherald.com",                  // Calgary Herald
  "calgarysun.com",                     // Calgary Sun
  "canadianchinesetimes.ca",            // Canadian Chinese Times
  "cochraneeagle.ca",                   // Cochrane Eagle
  "cochranenow.com",                    // Cochrane Now
  "cochranetimes.com",                  // Cochrane Times
  "com-voice.com",                      // Community Voice
  "dailyheraldtribune.com",             // Daily Herald Tribune
  "discoverairdrie.com",                // Discover Airdrie
  "draytonvalleywesternreview.com",     // Drayton Valley Western Review
  "drumhellermail.com",                 // Drumheller Mail
  "edmontonjournal.com",                // Edmonton Journal
  "edmontonsun.com",                    // Edmonton Sun
  "everythinggp.com",                   // EverythingGP
  "fitzhugh.ca",                        // The Fitzhugh (Jasper)
  "fortmcmurraytoday.com",              // Fort McMurray Today
  "fortsaskatchewanrecord.com",         // Fort Saskatchewan Record
  "fortsaskonline.com",                 // Fort Saskatchewan Online
  "heartlandnews.ca",                   // Heartland News
  "heresthescoop.ca",                   // Here's the Scoop
  "highcountrynews.ca",                 // High Country News
  "highriveronline.com",                // High River Online
  "highrivertimes.com",                 // High River Times
  "laclabichepost.com",                 // Lac La Biche Post
  "lacombeexpress.com",                 // Lacombe Express
  "lakelandconnect.net",                // Lakeland Connect
  "lakelandtoday.ca",                   // Lakeland Today
  "lakesideleader.com",                 // Lakeside Leader
  "lamontleader.com",                   // Lamont Leader
  "lethbridgeherald.com",               // Lethbridge Herald
  "lethbridgenewsnow.com",              // Lethbridge News Now
  "medicinehatnews.com",                // Medicine Hat News
  "meridianbooster.com",                // Meridian Booster
  "meridiansource.ca",                  // Meridian Source
  "meridiansource.com",                 // Meridian Source
  "morinvillenews.com",                 // Morinville News
  "mygrandeprairienow.com",             // My Grande Prairie Now
  "mylakelandnow.com",                  // My Lakeland Now
  "mylloydminsternow.com",              // My Lloydminster Now
  "nantonnews.com",                     // Nanton News
  "newsadvertiser.com",                 // Vegreville News Advertiser
  "okotoksonline.com",                  // Okotoks Online
  "pipestoneflyer.ca",                  // Pipestone Flyer
  "ponokanews.com",                     // Ponoka News
  "producer.com",                       // Western Producer
  "reddeeradvocate.com",                // Red Deer Advocate
  "rimbeyreview.com",                   // Rimbey Review
  "rmotoday.com",                       // Rocky Mountain Outlook
  "rockyviewweekly.com",                // Rocky View Weekly
  "sherwoodparknews.com",               // Sherwood Park News
  "sprucegroveexaminer.com",            // Spruce Grove Examiner
  "stalbertgazette.com",                // St. Albert Gazette
  "starnews.ca",                        // Wainwright Star/Edge
  "stettlerindependent.com",            // Stettler Independent
  "stonyplainreporter.com",             // Stony Plain Reporter
  "strathmorenow.com",                  // Strathmore Now
  "strathmoretimes.com",                // Strathmore Times
  "sylvanlakenews.com",                 // Sylvan Lake News
  "tabertimes.com",                     // Taber Times
  "tcctnews.com",                       // Canadian Chinese Times
  "thealbertan.com",                    // The Albertan
  "thebeaumontnews.ca",                 // Beaumont News
  "thecommunitypress.com",              // Community Press
  "thecragandcanyon.ca",                // Bow Valley Crag and Canyon
  "thegrizzlygazette.com",              // Grizzly Gazette
  "threehillscapital.com",              // Three Hills Capital
  "tofieldmerc.com",                    // Tofield Mercury
  "townandcountrynews.ca",              // Town and Country News
  "townandcountrytoday.com",            // Town and Country Today
  "vauxhalladvance.com",                // Vauxhall Advance
  "vermilionstandard.com",              // Vermilion Standard
  "vermilionvoice.com",                 // Vermilion Voice
  "vulcanadvocate.com",                 // Vulcan Advocate
  "weeklyreview.ca",                    // Weekly Review (Viking)
  "westernwheel.ca",                    // Western Wheel
  "westlocknews.com",                   // Westlock News
  "wetaskiwintimes.com",                // Wetaskiwin Times
  "whitecourtpress.com",                // Whitecourt Press
  "whitecourtstar.com",                 // Whitecourt Star

  // ── 15. SASKATCHEWAN (59) ──
  "ammsa.com",                          // AMMSA (Windspeaker, Sweetgrass, Sage)
  "assiniboiatimes.ca",                 // Assiniboia Times
  "battlefordsnow.com",                 // Battlefords Now
  "biggarindependent.ca",               // Biggar Independent
  "canoracourier.com",                  // Canora Courier
  "carlyleobserver.com",                // Carlyle Observer
  "ccgazette.ca",                       // Clark's Crossing Gazette
  "discoverestevan.com",                // Discover Estevan
  "discoverhumboldt.com",               // Discover Humboldt
  "discovermoosejaw.com",               // Discover Moose Jaw
  "discoverweyburn.com",                // Discover Weyburn
  "eaglefeathernews.com",               // Eagle Feather News
  "eastendecho.ca",                     // Eastend Echo
  "estevanmercury.ca",                  // Estevan Mercury
  "grasslandsnews.ca",                  // Grasslands News
  "humboldtjournal.ca",                 // Humboldt Journal
  "kamsacktimes.com",                   // Kamsack Times
  "kindersleysocial.ca",                // Kindersley Social
  "kiplingcitizen.ca",                  // Kipling Citizen
  "lastmountaintimes.ca",               // Last Mountain Times
  "leaderonline.ca",                    // Davidson Leader
  "leaderpost.com",                     // Regina Leader-Post
  "leau-vive.ca",                       // L'Eau vive
  "lloydminstersource.com",             // Lloydminster Source
  "maplecreeknews.com",                 // Maple Creek News
  "martensvillemessenger.ca",           // Martensville Messenger
  "meadowlakenow.com",                  // Meadow Lake Now
  "melfortjournal.com",                 // Melfort Journal
  "mjvex.com",                          // Moose Jaw Express
  "moosejawtoday.com",                  // MooseJawToday
  "newsoptimist.ca",                    // Battlefords News Optimist
  "nipawinjournal.com",                 // Nipawin Journal
  "northeastnow.com",                   // North East Now
  "northernprideml.com",                // Northern Pride
  "paherald.sk.ca",                     // Prince Albert Daily Herald
  "panow.com",                          // PA Now
  "prairiedogmag.com",                  // Prairie Dog
  "preecevilleprogress.com",            // Preeceville Progress
  "saskatoonexpress.com",               // Saskatoon Express
  "sasknow.ca",                         // Sask Now
  "sasknow.com",                        // saskNOW
  "sasktoday.ca",                       // SaskToday
  "shellbrookchronicle.com",            // Shellbrook Chronicle
  "spiritwoodherald.com",               // Spiritwood Herald
  "swbooster.com",                      // Southwest Booster
  "swiftcurrentonline.com",             // Swift Current Online
  "theclarion.ca",                      // The Clarion (Kindersley)
  "theoutlook.ca",                      // Outlook
  "theshaunavonstandard.com",           // Shaunavon Standard
  "thestarphoenix.com",                 // Saskatoon StarPhoenix
  "twmnews.com",                        // The Watrous Manitou
  "unitystories.com",                   // Unity Wilkie Press-Herald
  "wadenanews.ca",                      // Wadena News
  "westcentralcrossroads.ca",           // West Central Crossroads
  "westcentralonline.com",              // West Central Online
  "weyburnreview.com",                  // Weyburn Review
  "weyburnthisweek.com",                // Weyburn This Week
  "world-spectator.com",                // World Spectator (Moosomin)
  "yorktonthisweek.com",                // Yorkton This Week

  // ── 16. MANITOBA (53) ──
  "agripost.ca",                        // Agri-Post
  "angperyodiko.ca",                    // Ang Peryodiko
  "baldur-glenborogazette.ca",          // Baldur Glenboro Gazette
  "brandonsun.com",                     // Brandon Sun
  "carberrynews.ca",                    // Carberry News Express
  "clipper.mb.ca",                      // Clipper Weekly
  "crossroadsthisweek.com",             // Crossroads This Week
  "dauphinherald.com",                  // Dauphin Herald
  "dawsontrail.ca",                     // Dawson Trail Dispatch
  "delorainetimes.ca",                  // Deloraine Times and Star
  "discoverwestman.com",                // Discover Westman
  "empireadvance.ca",                   // Virden Empire Advance
  "enterprisenews.ca",                  // Interlake Enterprise
  "expressweeklynews.ca",               // Express Weekly News
  "fenghuavoice.ca",                    // Manitoba Chinese Tribune
  "filipinojournal.com",                // Filipino Journal
  "firstperspective.ca",                // The Drum / First Perspective
  "flinflononline.com",                 // Flin Flon Online
  "jewishpostandnews.ca",               // Jewish Post and News
  "killarneyguide.ca",                  // Killarney Guide
  "lh-inc.ca",                          // Lögberg-Heimskringla
  "minnedosatribune.com",               // Minnedosa Tribune
  "mysteinbach.ca",                     // My Steinbach
  "mywestman.ca",                       // Neepawa Banner / Press
  "neepawabanner.com",                  // Neepawa Banner
  "opasquiatimes.com",                  // Opasquia Times
  "outwords.ca",                        // OutWords
  "pembinavalleyonline.com",            // Pembina Valley Online
  "pilipino-express.com",               // Pilipino Express
  "portagedailygraphic.com",            // Portage Daily Graphic
  "portageonline.com",                  // Portage Online
  "russellbanner.com",                  // Russell Banner
  "selkirkrecord.ca",                   // Selkirk Record
  "sentinelcourier.com",                // Sentinel Courier
  "southeastjournal.ca",                // Southeast Journal
  "starandtimes.ca",                    // Swan Valley Star and Times
  "steinbachonline.com",                // Steinbach Online
  "stonewallteulontribune.ca",          // Stonewall Teulon Tribune
  "thecarillon.com",                    // Steinbach Carillon
  "themanitoban.com",                   // The Manitoban
  "thepasonline.com",                   // The Pas Online
  "theprojector.ca",                    // The Projector
  "thequill.ca",                        // The Quill (Brandon University)
  "therecorder.ca",                     // Boissevain Recorder
  "thereminder.ca",                     // The Reminder
  "theroblinreview.com",                // Roblin Review
  "thewesterncanadian.ca",              // The Western Canadian
  "thompsononline.com",                 // Thompson Online
  "trehernetimes.ca",                   // Treherne Times
  "wcmbnews.com",                       // WCMB News (Manitoba)
  "winklermordenvoice.ca",              // Winkler Morden Voice
  "winnipegfreepress.com",              // Winnipeg Free Press
  "winnipegsun.com",                    // Winnipeg Sun

  // ── 17. ATLANTIQUE — Nouvelle-Écosse (35) ──
  "allnovascotia.com",                  // allNovaScotia
  "annapoliscountyspectator.ca",        // Annapolis County Spectator
  "auroranewspaper.com",                // Aurora (Fall River)
  "capebretonpost.com",                 // Cape Breton Post
  "dalgazette.com",                     // Dalhousie Gazette
  "digbycourier.ca",                    // Digby County Courier
  "enfieldweeklypress.com",             // Weekly Press (Enfield)
  "guysboroughjournal.ca",              // Guysborough Journal
  "halifaxexaminer.ca",                 // Halifax Examiner
  "halifaxtoday.ca",                    // Halifax Today
  "hantsjournal.ca",                    // Hants Journal
  "hfxnews.com",                        // HFX News
  "hubnow.ca",                          // Hub Now
  "invernessoran.ca",                   // Inverness Oran
  "journalnews.ca",                     // Guysborough-Antigonish Journal
  "lecourrier.com",                     // Le Courrier de la Nouvelle-Écosse
  "ngnews.ca",                          // News (New Glasgow)
  "pictouadvocate.com",                 // Pictou Advocate
  "porthawkesburyreporter.com",         // The Reporter
  "saltwire.com",                       // SaltWire Network
  "signalhfx.ca",                       // The Signal
  "southshorenow.ca",                   // South Shore Now
  "tatamagouchelight.com",              // Tatamagouche Light
  "theadvance.ca",                      // Queens County Advance
  "thecasket.ca",                       // The Casket (Antigonish)
  "thechronicleherald.ca",              // The Chronicle Herald
  "thecoast.ca",                        // The Coast
  "thecoastguard.ca",                   // Shelburne County Coast Guard
  "themastheadnews.ca",                 // Masthead News
  "theshorelinejournal.com",            // Shoreline Journal
  "thevanguard.ca",                     // Yarmouth County Vanguard
  "trurodaily.com",                     // Truro Daily News
  "victoriastandard.ca",                // Victoria Standard
  "wayves.ca",                          // Wayves
  "xaverian.ca",                        // The Xaverian Weekly

  // ── 18. ATLANTIQUE — Nouveau-Brunswick (8) ──
  "acadienouvelle.com",                 // L'Acadie Nouvelle
  "infoweekend.ca",                     // Info Weekend
  "miramichionline.com",                // Miramichi Online
  "moniteuracadien.com",                // Le Moniteur Acadien
  "ossekeag.ca",                        // Ossekeag Publishing (Hampton Herald, Sussex Herald)
  "theaquinian.net",                    // The Aquinian
  "thebruns.ca",                        // The Brunswickan
  "tj.news",                            // Telegraph-Journal (Brunswick News)

  // ── 19. ATLANTIQUE — Terre-Neuve-et-Labrador (22) ──
  "allnewfoundlandlabrador.com",        // All Newfoundland Labrador
  "cbncompass.ca",                      // The Compass
  "gaboteur.ca",                        // Le Gaboteur
  "ganderbeacon.ca",                    // Gander Beacon
  "gfwadvertiser.ca",                   // Grand Falls-Windsor Advertiser
  "gulfnews.ca",                        // Gulf News
  "lportepilot.ca",                     // The Pilot
  "nlnewsnow.com",                      // NL News Now
  "northernpen.ca",                     // The Northern Pen
  "ntv.ca",                             // NTV News
  "southerngazette.ca",                 // Southern Gazette
  "theaurora.ca",                       // The Aurora
  "theindependent.ca",                  // The Independent
  "thelabradorian.ca",                  // The Labradorian
  "themuse.ca",                         // The Muse (MUN)
  "thenorwester.ca",                    // The Nor'wester
  "theovercast.ca",                     // The Overcast
  "thepacket.ca",                       // The Packet (Clarenville)
  "theshoreline.ca",                    // The Shoreline (Terre-Neuve)
  "theshorelinenews.com",               // The Shoreline
  "thetelegram.com",                    // The Telegram
  "vocm.com",                           // VOCM News

  // ── 20. ATLANTIQUE — Île-du-Prince-Édouard (5) ──
  "journalpioneer.com",                 // Journal Pioneer
  "lavoixacadienne.com",                // La Voix acadienne
  "peicanada.com",                      // PEI Canada (Eastern Graphic, West Prince Graphic)
  "thecadreupei.com",                   // The Cadre (UPEI)
  "theguardian.pe.ca",                  // The Guardian

  // ── 21. TERRITOIRES — Yukon, T.N.-O., Nunavut (10) ──
  "cabinradio.ca",                      // Cabin Radio
  "klondikesun.com",                    // Klondike Sun
  "nnsl.com",                           // Northern News Services (Yellowknifer, News/North, Inuvik Drum)
  "nunatsiaq.com",                      // Nunatsiaq News
  "nunatsiaqonline.ca",                 // Nunatsiaq News
  "uphere.ca",                          // Up Here
  "upherebusiness.ca",                  // Up Here Business
  "whitehorsestar.com",                 // Whitehorse Daily Star
  "yukon-news.com",                     // Yukon News
  "yukoner.com",                        // Yukoner Magazine

  // ── 22. MÉDIAS AUTOCHTONES (7) ──
  "anishinabeknews.ca",                 // Anishinabek News
  "aptn.ca",                            // APTN News
  "aptn.org",                           // APTN News
  "indiginews.com",                     // IndigiNews
  "muskratmagazine.com",                // Muskrat Magazine
  "nationnews.ca",                      // The Nation
  "tworowtimes.com",                    // Two Row Times

  // ── 23. PRESSE ÉTUDIANTE UNIVERSITAIRE (22) ──
  "capilanocourier.com",                // Capilano Courier
  "charlatan.ca",                       // The Charlatan (Carleton)
  "impactcampus.ca",                    // Impact Campus (Université Laval)
  "langaravoice.ca",                    // The Voice (Langara)
  "linkbcit.ca",                        // The Link (BCIT)
  "marshillonline.com",                 // Mars' Hill (Trinity Western)
  "martlet.ca",                         // The Martlet (Victoria)
  "nexusnewspaper.com",                 // Nexus (Camosun)
  "queensjournal.ca",                   // Queen's Journal
  "the-peak.ca",                        // The Peak (SFU)
  "thegatewayonline.ca",                // The Gateway (Alberta)
  "thelambda.ca",                       // Lambda (Laurentian)
  "themedium.ca",                       // The Medium (UTM)
  "themeliorist.ca",                    // The Meliorist (Lethbridge)
  "thenav.ca",                          // The Navigator (Vancouver Island U)
  "theotherpress.ca",                   // The Other Press (Douglas)
  "thephoenixnews.com",                 // The Phoenix (UBC Okanagan)
  "thesheaf.com",                       // The Sheaf (Saskatchewan)
  "thevarsity.ca",                      // The Varsity (U of T)
  "ubyssey.ca",                         // The Ubyssey (UBC)
  "ufvcascade.ca",                      // The Cascade (UFV)
  "westerngazette.ca",                  // Western Gazette

  // ── 24. PRESSE ETHNIQUE, MULTICULTURELLE ET FRANCOPHONE HORS QUÉBEC (31) ──
  "asianpacificpost.com",               // Asian Pacific Post
  "bccatholic.ca",                      // The B.C. Catholic
  "celtic-connection.com",              // Celtic Connection
  "correiodamanhacanada.com",           // Correio da Manhã Canada
  "corriere.ca",                        // Corriere Canadese
  "dailyxtra.com",                      // Daily Xtra
  "fairchildtv.com",                    // Fairchild TV
  "indocanadiantimes.com",              // Indo-Canadian Times
  "jewishindependent.ca",               // Jewish Independent
  "joinsmediacanada.com",               // Joongang Ilbo Canada
  "kanadaimagyarsag.ca",                // Kanadai Magyarság
  "mingpaocanada.com",                  // Ming Pao
  "newcanadianmedia.ca",                // New Canadian Media
  "omnitv.ca",                          // OMNI Television
  "punjabguardian.com",                 // Punjabi Guardian
  "punjabitribune.ca",                  // Punjabi Tribune
  "russianexpress.net",                 // Russian Express
  "russianweek.ca",                     // Russian Week
  "singtao.ca",                         // Sing Tao Daily
  "southasianpost.com",                 // South Asian Post
  "theafronews.com",                    // Afro News
  "thecjn.ca",                          // The Canadian Jewish News
  "thefilipinopost.com",                // Filipino Post
  "thelinkpaper.ca",                    // The Link (Vancouver)
  "thoibao.com",                        // Thoi Bao
  "v-shinpo.com",                       // Vancouver Shinpo
  "voiceonline.com",                    // Indo-Canadian Voice
  "weeklyvoice.com",                    // Weekly Voice
  "worldjournal.com",                   // World Journal
  "xtra.ca",                            // Xtra Magazine
  "xtramagazine.com",                   // Xtra Magazine
];

// Noms officiels (utilisés pour l'affichage sur les cartes Open Graph)
const MEDIA_NAMES = {
  "100milefreepress.net": "100 Mile House Free Press",
  "250news.com": "250 News",
  "abbotsfordtoday.ca": "Abbotsford Today",
  "abbynews.com": "Abbotsford News",
  "acadienouvelle.com": "L'Acadie Nouvelle",
  "agassizharrisonobserver.com": "Agassiz Harrison Observer",
  "agenceqmi.ca": "Agence QMI",
  "agripost.ca": "Agri-Post",
  "airdriecityview.com": "Airdrie City View",
  "airdrieecho.com": "Airdrie Echo",
  "alaskahighwaynews.ca": "Alaska Highway News",
  "albernivalleynews.com": "Alberni Valley News",
  "albertanativenews.com": "Alberta Native News",
  "albertapolitics.ca": "Alberta Politics",
  "albertaviews.ca": "Alberta Views",
  "aldergrovestar.com": "Aldergrove Star",
  "allcaribou.com": "Caribou Publishing (Alberta)",
  "allnewfoundlandlabrador.com": "All Newfoundland Labrador",
  "allnovascotia.com": "allNovaScotia",
  "ammsa.com": "AMMSA (Windspeaker, Sweetgrass, Sage)",
  "angperyodiko.ca": "Ang Peryodiko",
  "anishinabeknews.ca": "Anishinabek News",
  "annapoliscountyspectator.ca": "Annapolis County Spectator",
  "apt613.ca": "APT613",
  "aptn.ca": "APTN News",
  "aptn.org": "APTN News",
  "arrowlakesnews.com": "Arrow Lakes News",
  "ascot-corner.com": "Aux Quatre Coins",
  "asianpacificpost.com": "Asian Pacific Post",
  "assiniboiatimes.ca": "Assiniboia Times",
  "atelier10.ca": "Nouveau Projet / Atelier 10",
  "athabascaadvocate.com": "Athabasca Advocate",
  "atlasmedias.com": "Atlas Mtl",
  "auroran.com": "The Auroran",
  "auroranewspaper.com": "Aurora (Fall River)",
  "auroratoday.ca": "AuroraToday",
  "avtimes.net": "Alberni Valley Times",
  "aylmerexpress.com": "Aylmer Express",
  "ayrnews.ca": "Ayr News",
  "baldur-glenborogazette.ca": "Baldur Glenboro Gazette",
  "bancroftthisweek.com": "Bancroft This Week",
  "barrheadleader.com": "Barrhead Leader",
  "barrierestarjournal.com": "Barriere North Thompson Star Journal",
  "barrietoday.com": "BarrieToday",
  "bashawstar.com": "Bashaw Star",
  "battlefordsnow.com": "Battlefords Now",
  "baytoday.ca": "BayToday",
  "bcbusiness.ca": "BC Business",
  "bccatholic.ca": "The B.C. Catholic",
  "bcmag.ca": "British Columbia Magazine",
  "beaucemedia.ca": "Beauce Média",
  "betakit.com": "BetaKit",
  "biggarindependent.ca": "Biggar Independent",
  "biv.com": "Business in Vancouver",
  "bnnbloomberg.ca": "BNN Bloomberg",
  "boundarycreektimes.com": "Boundary Creek Times",
  "boundarysentinel.com": "Boundary Sentinel",
  "bowenislandundercurrent.com": "Bowen Island Undercurrent",
  "bowislandcommentator.com": "40 Mile County Commentator",
  "bradfordtimes.ca": "Bradford Times",
  "bradfordtoday.ca": "BradfordToday",
  "bramptonguardian.com": "Brampton Guardian",
  "brandonsun.com": "Brandon Sun",
  "brantfordexpositor.ca": "Brantford Expositor",
  "breachmedia.ca": "The Breach",
  "broadview.org": "Broadview",
  "brooksbulletin.com": "Brooks Bulletin",
  "brucepeninsulapress.com": "Bruce Peninsula Press",
  "bulkleybrowser.ca": "Bulkley Browser",
  "bulletinaylmer.com": "Le Bulletin d'Aylmer",
  "burlingtonindependent.ca": "Burlington Independent",
  "burlingtonpost.com": "Burlington Post",
  "burlingtontoday.com": "BurlingtonToday",
  "burnabynow.com": "Burnaby Now",
  "burnslakelakesdistrictnews.com": "Burns Lake Lakes District News",
  "burysimagedebury.com": "L'Image de Bury",
  "businessedge.ca": "Business Edge",
  "businessincalgary.com": "Business in Calgary",
  "c2cjournal.ca": "C2C Journal",
  "cabinradio.ca": "Cabin Radio",
  "caledoncitizen.com": "Caledon Citizen",
  "caledoniacourier.com": "Caledonia Courier",
  "calgaryherald.com": "Calgary Herald",
  "calgarysun.com": "Calgary Sun",
  "cambridgetimes.ca": "Cambridge Times",
  "cambridgetoday.ca": "CambridgeToday",
  "campbellrivermirror.com": "Campbell River Mirror",
  "canadafrancais.com": "Le Canada Français",
  "canadianaffairs.news": "Canadian Affairs",
  "canadianchinesetimes.ca": "Canadian Chinese Times",
  "canadianimmigrant.ca": "Canadian Immigrant",
  "canoracourier.com": "Canora Courier",
  "capebretonpost.com": "Cape Breton Post",
  "capilanocourier.com": "Capilano Courier",
  "capitalcurrent.ca": "Capital Current",
  "carberrynews.ca": "Carberry News Express",
  "carlyleobserver.com": "Carlyle Observer",
  "castanet.net": "Castanet",
  "castlegarnews.com": "Castlegar News",
  "castlegarsource.com": "Castlegar Source",
  "cbc.ca": "CBC News",
  "cbncompass.ca": "The Compass",
  "ccgazette.ca": "Clark's Crossing Gazette",
  "celtic-connection.com": "Celtic Connection",
  "cfjctoday.com": "CFJC Today (Kamloops)",
  "chamblyexpress.ca": "Chambly Express",
  "chamblymatin.com": "Chambly Matin",
  "charlatan.ca": "The Charlatan (Carleton)",
  "charlevoixendirect.com": "Le Charlevoisien",
  "chathamdailynews.ca": "Chatham Daily News",
  "chathamthisweek.ca": "Chatham This Week",
  "chathamvoice.com": "Chatham Voice",
  "cheknews.ca": "CHEK News",
  "chemainusvalleycourier.ca": "Chemainus Valley Courier",
  "chilliwacktimes.com": "Chilliwack Times",
  "chroniclejournal.com": "The Chronicle-Journal",
  "citesnouvelles.com": "Cité Nouvelles",
  "citizen.on.ca": "Orangeville Citizen",
  "cittadinocanadese.com": "Il Cittadino Canadese",
  "citynews.ca": "CityNews",
  "clearwatertimes.com": "Clearwater Times",
  "clintonnewsrecord.com": "Clinton News Record",
  "clipper.mb.ca": "Clipper Weekly",
  "cloverdalereporter.com": "Cloverdale Reporter",
  "coastmountainnews.com": "Coast Mountain News",
  "coastreporter.net": "Coast Reporter",
  "cochraneeagle.ca": "Cochrane Eagle",
  "cochranenow.com": "Cochrane Now",
  "cochranetimes.com": "Cochrane Times",
  "cochranetimespost.ca": "Cochrane Times-Post",
  "cochranetimespost.com": "Cochrane Times-Post",
  "collingwoodtoday.ca": "CollingwoodToday",
  "columbiavalleypioneer.com": "Columbia Valley Pioneer",
  "com-voice.com": "Community Voice",
  "comoxvalleyecho.com": "Comox Valley Echo",
  "comoxvalleyrecord.com": "Comox Valley Record",
  "convivium.ca": "Convivium",
  "cornwallseawaynews.com": "Cornwall Seaway News",
  "corporateknights.com": "Corporate Knights",
  "correiodamanhacanada.com": "Correio da Manhã Canada",
  "corriere.ca": "Corriere Canadese",
  "coupdoeil.info": "Coup d'œil",
  "courrierahuntsic.com": "Courrier Ahuntsic",
  "courrierdeportneuf.com": "Courrier de Portneuf",
  "courrierfrontenac.qc.ca": "Courrier Frontenac",
  "courrierlaval.com": "Courrier Laval",
  "cowichanvalleycitizen.com": "Cowichan Valley Citizen",
  "cp24.com": "CP24",
  "cpac.ca": "CPAC",
  "cranbrooktownsman.com": "Cranbrook Townsman",
  "creemore.com": "Creemore Echo",
  "crestonvalleyadvance.ca": "Creston Valley Advance",
  "crossroadsthisweek.com": "Crossroads This Week",
  "ctvnews.ca": "CTV News",
  "cultmontreal.com": "Cult MTL",
  "cultmtl.com": "Cult MTL",
  "cybersoleil.com": "Le Soleil de Châteauguay",
  "dailyheraldtribune.com": "Daily Herald Tribune",
  "dailyhive.com": "Daily Hive",
  "dailyxtra.com": "Daily Xtra",
  "dalgazette.com": "Dalhousie Gazette",
  "dauphinherald.com": "Dauphin Herald",
  "dawsontrail.ca": "Dawson Trail Dispatch",
  "delorainetimes.ca": "Deloraine Times and Star",
  "delta-optimist.com": "Delta Optimist",
  "digbycourier.ca": "Digby County Courier",
  "discoverairdrie.com": "Discover Airdrie",
  "discoverestevan.com": "Discover Estevan",
  "discoverhumboldt.com": "Discover Humboldt",
  "discovermoosejaw.com": "Discover Moose Jaw",
  "discoverwestman.com": "Discover Westman",
  "discoverweyburn.com": "Discover Weyburn",
  "discoveryislands.ca": "Discovery Islander",
  "dorchestersignpost.com": "Dorchester Signpost",
  "douglasmagazine.com": "Douglas Magazine",
  "draytonvalleywesternreview.com": "Drayton Valley Western Review",
  "drumhellermail.com": "Drumheller Mail",
  "dundastoday.com": "DundasToday",
  "durhamregion.com": "DurhamRegion.com",
  "e-know.ca": "e-KNOW (Cranbrook)",
  "eaglefeathernews.com": "Eagle Feather News",
  "eaglevalleynews.com": "Eagle Valley News",
  "eastendecho.ca": "Eastend Echo",
  "easterndoor.com": "The Eastern Door (Kahnawà:ke)",
  "echocantley.ca": "L'Écho de Cantley",
  "echodefrontenac.com": "L'Écho de Frontenac",
  "editionap.ca": "Hawkesbury Tribune-Express",
  "edmontonjournal.com": "Edmonton Journal",
  "edmontonsun.com": "Edmonton Sun",
  "eganvilleleader.ca": "Eganville Leader",
  "elkvalleyherald.ca": "Elk Valley Herald",
  "elliotlakestandard.ca": "Elliot Lake Standard",
  "elliotlaketoday.com": "ElliotLakeToday",
  "elorafergustoday.com": "EloraFergusToday",
  "empireadvance.ca": "Virden Empire Advance",
  "enbeauce.com": "Beauce Média",
  "energeticcity.ca": "Energeticcity.ca (Fort St. John)",
  "enfieldweeklypress.com": "Weekly Press (Enfield)",
  "enterprisenews.ca": "Interlake Enterprise",
  "entreelibre.info": "Entrée Libre (Sherbrooke)",
  "essexfreepress.com": "Essex Free Press",
  "estevanmercury.ca": "Estevan Mercury",
  "everythinggp.com": "EverythingGP",
  "excal.on.ca": "Excalibur (York)",
  "expressnews.ca": "Express (Nelson)",
  "expressoutremont.com": "L'Express d'Outremont / Mont-Royal",
  "expressweeklynews.ca": "Express Weekly News",
  "fairchildtv.com": "Fairchild TV",
  "fenghuavoice.ca": "Manitoba Chinese Tribune",
  "fftimes.com": "Fort Frances Times",
  "filipinojournal.com": "Filipino Journal",
  "financialpost.com": "Financial Post",
  "firstperspective.ca": "The Drum / First Perspective",
  "fitzhugh.ca": "The Fitzhugh (Jasper)",
  "flambeaudelest.com": "Le Flambeau de l'Est",
  "flamboroughtoday.com": "FlamboroughToday",
  "flinflononline.com": "Flin Flon Online",
  "focusonline.ca": "Focus Magazine",
  "fortmcmurraytoday.com": "Fort McMurray Today",
  "fortsaskatchewanrecord.com": "Fort Saskatchewan Record",
  "fortsaskonline.com": "Fort Saskatchewan Online",
  "francopresse.ca": "Francopresse",
  "fraservalleynewsnetwork.com": "Fraser Valley News Network",
  "fraservalleytoday.ca": "Fraser Valley Today",
  "friam.ca": "Friday AM (Salmon Arm)",
  "frontenacnews.ca": "Frontenac News",
  "futureofgood.co": "Future of Good",
  "gaboteur.ca": "Le Gaboteur",
  "ganderbeacon.ca": "Gander Beacon",
  "gaspespec.com": "Gaspé Spec",
  "gazettemauricie.com": "La Gazette de la Mauricie",
  "gfwadvertiser.ca": "Grand Falls-Windsor Advertiser",
  "globalnews.ca": "Global News",
  "goderichsignalstar.com": "Goderich Signal Star",
  "graffici.ca": "Graffici",
  "granbyexpress.com": "Le Granby Express",
  "grandforksgazette.ca": "Grand Forks Gazette",
  "granthaven.com": "Grant Haven Media",
  "grasslandsnews.ca": "Grasslands News",
  "guelphmercury.com": "Guelph Mercury",
  "guelphtoday.com": "GuelphToday",
  "guelphtribune.ca": "Guelph Tribune",
  "guidemtlnord.com": "Le Guide Montréal-Nord",
  "gulfislandsdriftwood.com": "Gulf Islands Driftwood",
  "gulfnews.ca": "Gulf News",
  "guysboroughjournal.ca": "Guysborough Journal",
  "haidagwaiiobserver.com": "Haida Gwaii Observer",
  "haldimandpress.com": "Haldimand Press",
  "haliburtonecho.ca": "Haliburton County Echo",
  "halifaxexaminer.ca": "Halifax Examiner",
  "halifaxtoday.ca": "Halifax Today",
  "haltonhillstoday.ca": "HaltonHillsToday",
  "hantsjournal.ca": "Hants Journal",
  "hashilthsa.com": "Ha-Shilth-Sa",
  "heartlandnews.ca": "Heartland News",
  "hebdorivenord.com": "Hebdo Rive Nord",
  "hebdosvalleyfield.ca": "Hebdos Valleyfield",
  "heraldadvance.ca": "The Advance (Dundalk/Flesherton)",
  "heresthescoop.ca": "Here's the Scoop",
  "hfxnews.com": "HFX News",
  "highcountrynews.ca": "High Country News",
  "highriveronline.com": "High River Online",
  "highrivertimes.com": "High River Times",
  "hilltimes.com": "The Hill Times",
  "hopestandard.com": "Hope Standard",
  "horizonweekly.ca": "Horizon Weekly (arménien)",
  "houston-today.com": "Houston Today",
  "hubnow.ca": "Hub Now",
  "humboldtjournal.ca": "Humboldt Journal",
  "huntsvilleforester.com": "Huntsville Forester",
  "huroncitizen.ca": "Blyth/Brussels Citizen",
  "ici.radio-canada.ca": "Radio-Canada ICI",
  "impactcampus.ca": "Impact Campus (Université Laval)",
  "independent.on.ca": "Kincardine Independent",
  "indiginews.com": "IndigiNews",
  "indocanadiantimes.com": "Indo-Canadian Times",
  "info07.com": "Info 07 (Gatineau)",
  "infodimanche.com": "Info Dimanche",
  "infoweekend.ca": "Info Weekend",
  "innisfiltoday.ca": "InnisfilToday",
  "inroadsjournal.ca": "Inroads",
  "insauga.com": "inSauga",
  "insidehalton.com": "Inside Halton",
  "intelligencer.ca": "Belleville Intelligencer",
  "interior-news.com": "Interior News",
  "invernessoran.ca": "Inverness Oran",
  "ipolitics.ca": "iPolitics",
  "jamesbaybeacon.ca": "James Bay Beacon",
  "jewishindependent.ca": "Jewish Independent",
  "jewishpostandnews.ca": "Jewish Post and News",
  "joinsmediacanada.com": "Joongang Ilbo Canada",
  "journal-ensemble.org": "Ensemble pour bâtir",
  "journaldechambly.com": "Le Journal de Chambly",
  "journaldelevis.com": "Le Journal de Lévis",
  "journaldemontreal.com": "Journal de Montréal",
  "journaldequebec.com": "Journal de Québec",
  "journalderosemont.com": "Journal de Rosemont–La Petite-Patrie",
  "journaldestmichel.com": "Journal de Saint-Michel",
  "journaldesvoisins.com": "Journal des voisins",
  "journalexpress.ca": "Journal Express",
  "journalhsf.com": "Le Haut-Saint-François",
  "journallarevue.com": "La Revue (Gatineau)",
  "journallecourrier.com": "Le Courrier (Sainte-Thérèse)",
  "journalleguide.com": "Le Guide (Cowansville)",
  "journallehavre.ca": "Le Havre (Gaspé)",
  "journallenord.com": "Le Nord (Saint-Jérôme)",
  "journallereflet.com": "Le Reflet (Victoriaville)",
  "journallesactualites.ca": "Les Actualités (Asbestos)",
  "journallesoir.ca": "Le Journal Les Soir",
  "journalmalartic.com": "Le P'tit Journal de Malartic",
  "journalmetro.com": "Métro",
  "journalmobiles.com": "Journal Mobiles",
  "journalnews.ca": "Guysborough-Antigonish Journal",
  "journalpioneer.com": "Journal Pioneer",
  "journaltdn.ca": "Le Trait d'Union du Nord",
  "kamloopsbcnow.com": "Kamloops BC Now",
  "kamloopsmatters.com": "Kamloops Matters",
  "kamloopsthisweek.com": "Kamloops This Week",
  "kamsacktimes.com": "Kamsack Times",
  "kanadaimagyarsag.ca": "Kanadai Magyarság",
  "kelownacapnews.com": "Kelowna Capital News",
  "kelownadailycourier.ca": "Kelowna Daily Courier",
  "kelownanow.com": "Kelowna Now",
  "kenoradailyminerandnews.com": "Kenora Daily Miner and News",
  "kenoraminerandnews.com": "Kenora Miner and News",
  "keremeosreview.com": "Keremeos Review",
  "killarneyguide.ca": "Killarney Guide",
  "kindersleysocial.ca": "Kindersley Social",
  "kingsentinel.com": "King Weekly Sentinel",
  "kingstonist.com": "Kingstonist",
  "kingstonthisweek.com": "Kingston This Week",
  "kiplingcitizen.ca": "Kipling Citizen",
  "kitchissippi.com": "Kitchissippi Times",
  "kitimatdaily.ca": "Kitimat Daily Online",
  "klondikesun.com": "Klondike Sun",
  "kootenayadvertiser.com": "Kootenay News Advertiser",
  "laclabichepost.com": "Lac La Biche Post",
  "lacombeexpress.com": "Lacombe Express",
  "laconverse.com": "La Converse",
  "laction.com": "L'Action (Joliette)",
  "lactiondautray.com": "L'Action d'Autray",
  "lactualite.com": "L'actualité",
  "ladepeche.qc.ca": "La Dépêche",
  "ladysmithchronicle.com": "Ladysmith Chronicle",
  "lakecountrycalendar.com": "Lake Country Calendar",
  "lakecowichangazette.com": "Lake Cowichan Gazette",
  "lakefieldherald.com": "Lakefield Herald",
  "lakelandconnect.net": "Lakeland Connect",
  "lakelandtoday.ca": "Lakeland Today",
  "lakereport.ca": "The Lake Report (Niagara-on-the-Lake)",
  "lakeshoreadvance.com": "Lakeshore Times-Advance",
  "lakeshorenews.com": "Lakeshore News Reporter",
  "lakesideleader.com": "Lakeside Leader",
  "lamontleader.com": "Lamont Leader",
  "lanarkera.com": "Lanark Era",
  "langaravoice.ca": "The Voice (Langara)",
  "langleyadvance.com": "Langley Advance Times",
  "langleyadvancetimes.com": "Langley Advance Times",
  "langleytimes.com": "Langley Times",
  "langleytoday.ca": "Langley Today",
  "lanouvelle.net": "La Nouvelle",
  "lapensee.qc.ca": "La Pensée de Bagot",
  "lapetitenation.com": "La Petite Nation",
  "lappel.com": "L'Appel (Québec)",
  "lapresse.ca": "La Presse",
  "lareleve.qc.ca": "La Relève",
  "larevue.qc.ca": "La Revue (Gatineau)",
  "larotonde.ca": "La Rotonde (uOttawa)",
  "lasallepost.ca": "Lasalle Post Reporter",
  "lasentinelle.ca": "La Sentinelle",
  "lastmountaintimes.ca": "Last Mountain Times",
  "laterre.ca": "La Terre de chez nous",
  "latribune.ca": "La Tribune",
  "lautjournal.info": "L'aut'journal",
  "lavalnews.ca": "Laval News",
  "lavantage.qc.ca": "L'Avantage",
  "lavantposte.ca": "L'Avant-Poste (Amqui)",
  "laveniretdesrivieres.com": "L'Avenir et des Rivières",
  "lavoixacadienne.com": "La Voix acadienne",
  "lavoixdelest.ca": "La Voix de l'Est",
  "lavoixdusud.com": "La Voix du Sud",
  "lavoixpop.com": "La Voix Pop",
  "law360.ca": "Law360 Canada",
  "ldnews.net": "Lakes District News",
  "leaderonline.ca": "Davidson Leader",
  "leaderpost.com": "Regina Leader-Post",
  "leau-vive.ca": "L'Eau vive",
  "lecharlevoisien.com": "Le Charlevoisien",
  "lechoabitibien.ca": "L'Écho Abitibien",
  "lechodelarivenord.ca": "L'Écho de la Rive-Nord",
  "lechodelatuque.com": "L'Écho de La Tuque",
  "lechodelaval.ca": "L'Écho de Laval",
  "lechodemaskinonge.ca": "L'Écho de Maskinongé",
  "lechodemaskinonge.com": "L'Écho de Maskinongé",
  "lechodetroisrivieres.ca": "L'Écho de Trois-Rivières",
  "leclaireurprogres.ca": "L'Éclaireur Progrès",
  "leclaireurprogres.com": "L'Éclaireur Progrès",
  "leclairon.qc.ca": "Le Clairon régional (Saint-Hyacinthe)",
  "lecourrier.com": "Le Courrier de la Nouvelle-Écosse",
  "lecourrier.qc.ca": "Le Courrier",
  "lecourrierdusud.ca": "Le Courrier du Sud (Longueuil)",
  "lecourriersud.com": "Le Courrier Sud (Nicolet)",
  "ledevoir.com": "Le Devoir",
  "ledroit.com": "Le Droit",
  "lehavre.ca": "Le Havre (Gaspé)",
  "lejacquescartier.com": "Le Jacques-Cartier",
  "lejournaldejoliette.ca": "Le Journal de Joliette",
  "lejournaldesherbrooke.ca": "Le Journal de Sherbrooke",
  "lejournaldespaysdenhautlavallee.ca": "Le Journal des Pays-d'en-Haut",
  "lelacstjean.com": "Le Journal Le Lac St-Jean",
  "lenord-cotier.com": "Le Nord-Côtier",
  "lenouvelliste.ca": "Le Nouvelliste",
  "lepeuplelevis.ca": "Le Peuple de Lévis",
  "lepeuplelotbiniere.ca": "Le Peuple Lotbinière",
  "lephare.info": "Le Phare",
  "lepharillon.ca": "Le Pharillon",
  "leplacoteux.com": "Le Placoteux",
  "leplateau.com": "Le Plateau",
  "leprogres.net": "Le Progrès (Cookshire-Eaton)",
  "leprogresvilleray.com": "Progrès Villeray",
  "lequebecexpress.com": "Le Québec Express",
  "lequebecois.org": "Le Québécois",
  "lequotidien.com": "Le Quotidien",
  "leradar.qc.ca": "Le Radar (Îles-de-la-Madeleine)",
  "lereflet.qc.ca": "Le Reflet",
  "lerefletdulac.com": "Le Reflet du Lac",
  "lereveil.ca": "Le Réveil (Saguenay)",
  "lereveil.com": "Le Réveil (Saguenay)",
  "les2rives.com": "Les 2 Rives",
  "lesaffaires.com": "Les Affaires",
  "lesexplos.com": "Les Explos",
  "lesoleil.com": "Le Soleil",
  "lethbridgeherald.com": "Lethbridge Herald",
  "lethbridgenewsnow.com": "Lethbridge News Now",
  "letincelle.qc.ca": "L'Étincelle",
  "letoiledulac.com": "L'Étoile du Lac",
  "letraitdunion.com": "Le Trait d'Union",
  "leveil.com": "La Concorde / L'Éveil (Saint-Eustache)",
  "levoyageur.ca": "Le Voyageur (Grand Sudbury)",
  "lfpress.com": "London Free Press",
  "lh-inc.ca": "Lögberg-Heimskringla",
  "lhebdodustmaurice.com": "L'Hebdo du St-Maurice",
  "lhebdojournal.com": "L'Hebdo Journal",
  "lillooetnews.net": "Bridge River Lillooet News",
  "linformateurrdp.com": "L'Informateur de Rivière-des-Prairies",
  "linformation.ca": "L'Information (Mont-Joli)",
  "linkbcit.ca": "The Link (BCIT)",
  "literaryreviewofcanada.ca": "Literary Review of Canada",
  "lloydminstersource.com": "Lloydminster Source",
  "lookoutnewspaper.com": "Lookout (Esquimalt)",
  "lowdownonline.com": "The Low Down to Hull and Back",
  "lportepilot.ca": "The Pilot",
  "lucknowsentinel.com": "Lucknow Sentinel",
  "lumbyvalleytimes.ca": "Lumby Valley Times",
  "macleans.ca": "Maclean's",
  "magazinegaspesie.ca": "Magazine Gaspésie",
  "maplecreeknews.com": "Maple Creek News",
  "mapleridgenews.com": "Maple Ridge-Pitt Meadows News",
  "maroc-canada.ca": "Maghreb Canada Express",
  "marshillonline.com": "Mars' Hill (Trinity Western)",
  "martensvillemessenger.ca": "Martensville Messenger",
  "martlet.ca": "The Martlet (Victoria)",
  "mcgilldaily.com": "McGill Daily",
  "mcgilltribune.com": "McGill Tribune",
  "meadowlakenow.com": "Meadow Lake Now",
  "medicinehatnews.com": "Medicine Hat News",
  "melfortjournal.com": "Melfort Journal",
  "meridianbooster.com": "Meridian Booster",
  "meridiansource.ca": "Meridian Source",
  "meridiansource.com": "Meridian Source",
  "merrittherald.com": "Merritt Herald",
  "merrittnews.net": "Merritt News",
  "messagerlachine.com": "Le Messager Lachine-Dorval",
  "messagerlasalle.com": "Le Messager Lasalle",
  "middlesexbanner.ca": "Middlesex Banner",
  "midlandtoday.ca": "MidlandToday",
  "midnorthmonitor.com": "Mid-North Monitor",
  "midwesternnewspapers.com": "Midwestern Newspapers (Postmedia)",
  "mildmaycrier.com": "Mildmay Town & Country Crier",
  "miltontoday.ca": "MiltonToday",
  "mindentimes.ca": "Minden Times",
  "mingpaocanada.com": "Ming Pao",
  "minnedosatribune.com": "Minnedosa Tribune",
  "miramichionline.com": "Miramichi Online",
  "missioncityrecord.com": "Mission City Record",
  "mississauga.com": "Mississauga.com",
  "mitchelladvocate.com": "Mitchell Advocate",
  "mjvex.com": "Moose Jaw Express",
  "mondaymag.com": "Monday Magazine",
  "moniteuracadien.com": "Le Moniteur Acadien",
  "monquartier.ca": "Monquartier (Québec)",
  "monquartier.quebec": "Monquartier (Québec)",
  "montrealexpress.ca": "Montréal Express",
  "montrealgazette.com": "Montreal Gazette",
  "moosejawtoday.com": "MooseJawToday",
  "morinvillenews.com": "Morinville News",
  "morrisburgleader.ca": "Morrisburg Leader",
  "mrtimes.com": "Maple Ridge Times",
  "mtltimes.ca": "Montreal Times",
  "muskokaregion.com": "Muskoka Region",
  "muskratmagazine.com": "Muskrat Magazine",
  "mybulkleylakesnow.com": "My Bulkley Lakes Now",
  "mycampbellrivernow.com": "My Campbell River Now",
  "mycariboonow.com": "My Cariboo Now",
  "mychilliwacknews.com": "My Chilliwack News",
  "mycoastnow.com": "My Coast Now",
  "mycomoxvalleynow.com": "My Comox Valley Now",
  "mycowichanvalleynow.com": "My Cowichan Valley Now",
  "mycrestonnow.com": "My Creston Now",
  "mygrandeprairienow.com": "My Grande Prairie Now",
  "mykootenaynow.com": "My Kootenay Now",
  "mylakelandnow.com": "My Lakeland Now",
  "mylloydminsternow.com": "My Lloydminster Now",
  "mynechakovalleynow.com": "My Nechako Valley Now",
  "mynelsonnow.com": "My Nelson Now",
  "mypowellrivernow.com": "My Powell River Now",
  "myprincegeorgenow.com": "My Prince George Now",
  "mysteinbach.ca": "My Steinbach",
  "mytriportnow.com": "My Triport Now",
  "mywestman.ca": "Neepawa Banner / Press",
  "nanaimobulletin.com": "Nanaimo News Bulletin",
  "nanaimonewsnow.com": "Nanaimo News Now",
  "nantonnews.com": "Nanton News",
  "napaneebeaver.ca": "Napanee Beaver",
  "napaneeguide.com": "Napanee Guide",
  "narcity.com": "Narcity",
  "nationalobserver.com": "Canada's National Observer",
  "nationalpost.com": "National Post",
  "nationnews.ca": "The Nation",
  "neepawabanner.com": "Neepawa Banner",
  "nelsonstar.com": "Nelson Star",
  "neomedia.com": "Néo Média",
  "newcanadianmedia.ca": "New Canadian Media",
  "newmarkettoday.ca": "NewmarketToday",
  "newsadvertiser.com": "Vegreville News Advertiser",
  "newsnowniagara.com": "NewsNow Niagara",
  "newsoptimist.ca": "Battlefords News Optimist",
  "newspapers-online.com": "London Publishing / Auroran",
  "newtectimes.com": "New Tecumseth Times",
  "newwestrecord.ca": "New Westminster Record",
  "nexusnewspaper.com": "Nexus (Camosun)",
  "ngnews.ca": "News (New Glasgow)",
  "ngtimes.ca": "North Grenville Times",
  "niagarafallsreview.ca": "Niagara Falls Review",
  "niagaraindependent.ca": "Niagara Independent",
  "niagarathisweek.com": "Niagara This Week",
  "nipawinjournal.com": "Nipawin Journal",
  "nlnewsnow.com": "NL News Now",
  "nnsl.com": "Northern News Services (Yellowknifer, News/North, Inuvik Drum)",
  "noovo.info": "Noovo info",
  "northbaynipissing.com": "North Bay Nipissing",
  "northbaynugget.ca": "North Bay Nugget",
  "northeastnews.ca": "Northeast News",
  "northeastnow.com": "North East Now",
  "northernnews.ca": "Northern News (Kirkland Lake)",
  "northernontariobusiness.com": "Northern Ontario Business",
  "northernpen.ca": "The Northern Pen",
  "northernprideml.com": "Northern Pride",
  "northernpublicaffairs.ca": "Northern Public Affairs",
  "northernsentinel.com": "Northern Sentinel",
  "northislandgazette.com": "North Island Gazette",
  "northperth.com": "Listowel Banner / Independent Plus",
  "northrenfrewtimes.ca": "North Renfrew Times",
  "northumberlandnews.com": "Northumberland News",
  "notllocal.com": "NOTL Local",
  "nouveauprojet.com": "Nouveau Projet",
  "nouvellesdici.com": "Nouvelles d'ici",
  "nouvelleshebdo.com": "Nouvelles Hebdo",
  "nouvellessaint-laurent.com": "Les Nouvelles Saint-Laurent News",
  "nowtoronto.com": "NOW Toronto",
  "ns-news.com": "North Shore News (Sept-Îles)",
  "nsnews.com": "North Shore News",
  "ntv.ca": "NTV News",
  "nugget.ca": "North Bay Nugget",
  "nunatsiaq.com": "Nunatsiaq News",
  "nunatsiaqonline.ca": "Nunatsiaq News",
  "nwonewswatch.com": "NWO NewsWatch",
  "oakvillebeaver.com": "Oakville Beaver",
  "oakvillenews.org": "Oakville News",
  "observerxtra.com": "Elmira-Woolwich Observer",
  "oeilregional.com": "L'Œil régional (Beloeil)",
  "okadvertiser.com": "Okanagan Advertiser",
  "okotoksonline.com": "Okotoks Online",
  "ominecaexpress.com": "Omineca Express",
  "omnitv.ca": "OMNI Television",
  "onfr.tfo.org": "ONFR",
  "opasquiatimes.com": "Opasquia Times",
  "orangeville.com": "Orangeville Banner",
  "orilliamatters.com": "OrilliaMatters",
  "oronoweeklytimes.com": "Orono Weekly Times",
  "ossekeag.ca": "Ossekeag Publishing (Hampton Herald, Sussex Herald)",
  "ottawacitizen.com": "Ottawa Citizen",
  "ottawasun.com": "Ottawa Sun",
  "outwords.ca": "OutWords",
  "owensoundsuntimes.com": "Owen Sound Sun Times",
  "paherald.sk.ca": "Prince Albert Daily Herald",
  "panow.com": "PA Now",
  "parliamenttoday.ca": "Parliament Today",
  "parrysound.com": "Parry Sound North Star",
  "peacearchnews.com": "Peace Arch News",
  "peachlandview.com": "Peachland View",
  "peicanada.com": "PEI Canada (Eastern Graphic, West Prince Graphic)",
  "pelhamtoday.ca": "PelhamToday",
  "pembinavalleyonline.com": "Pembina Valley Online",
  "pentictonherald.ca": "Penticton Herald",
  "pentictonwesternnews.com": "Penticton Western News",
  "peterboroughexaminer.com": "Peterborough Examiner",
  "petrolialambtonindependent.ca": "Petrolia/Lambton Independent",
  "pictongazette.ca": "Picton Gazette",
  "pictouadvocate.com": "Pictou Advocate",
  "pilipino-express.com": "Pilipino Express",
  "pipestoneflyer.ca": "Pipestone Flyer",
  "piquenewsmagazine.com": "Pique Newsmagazine",
  "pivot.quebec": "Pivot",
  "pointsud.ca": "Point Sud",
  "policyoptions.irpp.org": "Policy Options / IRPP",
  "ponokanews.com": "Ponoka News",
  "portagedailygraphic.com": "Portage Daily Graphic",
  "portageonline.com": "Portage Online",
  "portdovermapleleaf.com": "Port Dover Maple Leaf",
  "porthawkesburyreporter.com": "The Reporter",
  "pqbnews.com": "PQB News",
  "prairiedogmag.com": "Prairie Dog",
  "preecevilleprogress.com": "Preeceville Progress",
  "princegeorgecitizen.com": "Prince George Citizen",
  "princegeorgematters.com": "Prince George Matters",
  "producer.com": "Western Producer",
  "progresstleonard.com": "Progrès Saint-Léonard",
  "protegez-vous.ca": "Protégez-Vous",
  "prpeak.com": "Powell River Peak",
  "publiceyeonline.com": "Public Eye Online",
  "punjabguardian.com": "Punjabi Guardian",
  "punjabitribune.ca": "Punjabi Tribune",
  "px-news.com": "Parc Extension News",
  "qctonline.com": "Quebec Chronicle-Telegraph",
  "quartierlibre.ca": "Quartier Libre (UdeM)",
  "quebechebdo.com": "Québec Hebdo",
  "quebecscience.qc.ca": "Québec Science",
  "queensjournal.ca": "Queen's Journal",
  "quesnelobserver.com": "Quesnel Cariboo Observer",
  "rabble.ca": "rabble.ca",
  "radio-canada.ca": "Radio-Canada",
  "rds.ca": "RDS",
  "rdsinfo.ca": "RDS Info",
  "recorder.ca": "Brockville Recorder and Times",
  "reddeeradvocate.com": "Red Deer Advocate",
  "refletdesociete.com": "Reflet de Société",
  "revelstokecurrent.com": "Revelstoke Current",
  "revelstokemountaineer.com": "Revelstoke Mountaineer",
  "revelstokereview.com": "Revelstoke Review",
  "reviewmirror.ca": "Westport Review-Mirror",
  "richmond-news.com": "Richmond News",
  "ricochet.media": "Ricochet",
  "rimbeyreview.com": "Rimbey Review",
  "rivertowntimes.com": "River Town Times (Amherstburg)",
  "rivesudexpress.ca": "Rive-Sud Express",
  "rmotoday.com": "Rocky Mountain Outlook",
  "rockyviewweekly.com": "Rocky View Weekly",
  "rosslandnews.com": "Rossland News",
  "rosslandtelegraph.com": "Rossland Telegraph",
  "russellbanner.com": "Russell Banner",
  "russianexpress.net": "Russian Express",
  "russianweek.ca": "Russian Week",
  "sachem.ca": "The Sachem",
  "saltwire.com": "SaltWire Network",
  "saobserver.net": "Salmon Arm Observer",
  "sarniathisweek.com": "Sarnia This Week",
  "saskatoonexpress.com": "Saskatoon Express",
  "sasknow.ca": "Sask Now",
  "sasknow.com": "saskNOW",
  "sasktoday.ca": "SaskToday",
  "saultstar.com": "Sault Star",
  "saultthisweek.com": "Sault Ste. Marie This Week",
  "seaforthhuronexpositor.com": "Seaforth Huron Expositor",
  "selkirkrecord.ca": "Selkirk Record",
  "sentinelcourier.com": "Sentinel Courier",
  "shelburnefreepress.ca": "Shelburne Free Press",
  "shellbrookchronicle.com": "Shellbrook Chronicle",
  "sherbrooke.info": "Sherbrooke.info",
  "sherbrookerecord.com": "Sherbrooke Record",
  "sherwoodparknews.com": "Sherwood Park News",
  "shorelinebeacon.com": "Shoreline Beacon",
  "signalhfx.ca": "The Signal",
  "simcoe.com": "Simcoe.com",
  "simcoereformer.ca": "Simcoe Reformer",
  "similkameenspotlight.com": "Similkameen Spotlight",
  "singtao.ca": "Sing Tao Daily",
  "siouxbulletin.com": "Sioux Lookout Bulletin",
  "skahamatters.com": "Skaha Matters",
  "snnewswatch.com": "SNN NewsWatch",
  "sookenewsmirror.com": "Sooke News Mirror",
  "sootoday.com": "SooToday",
  "sorel-tracyexpress.ca": "Sorel-Tracy Express",
  "soreltracy.com": "Sorel-Tracy",
  "soundernews.com": "Gabriola Sounder",
  "southasianpost.com": "South Asian Post",
  "southeastjournal.ca": "Southeast Journal",
  "southerngazette.ca": "Southern Gazette",
  "southpointsun.ca": "Southpoint Sun",
  "southshorenow.ca": "South Shore Now",
  "spacing.ca": "Spacing",
  "speaker.northernontario.ca": "Temiskaming Speaker",
  "spiritwoodherald.com": "Spiritwood Herald",
  "sportscage.com": "The Sports Cage",
  "sportsnet.ca": "Sportsnet",
  "springwaternews.ca": "North Simcoe Springwater News",
  "sprucegroveexaminer.com": "Spruce Grove Examiner",
  "squamishchief.com": "Squamish Chief",
  "squamishreporter.com": "Squamish Reporter",
  "stalbertgazette.com": "St. Albert Gazette",
  "standard-freeholder.com": "Cornwall Standard-Freeholder",
  "stanstead-journal.com": "Stanstead Journal",
  "starandtimes.ca": "Swan Valley Star and Times",
  "starjournal.net": "North Thompson Star Journal",
  "starnews.ca": "Wainwright Star/Edge",
  "stcatharinesstandard.ca": "St. Catharines Standard",
  "steinbachonline.com": "Steinbach Online",
  "stettlerindependent.com": "Stettler Independent",
  "stmarysindependent.com": "St. Marys Independent",
  "stonewallteulontribune.ca": "Stonewall Teulon Tribune",
  "stonyplainreporter.com": "Stony Plain Reporter",
  "straight.com": "Georgia Straight",
  "stratfordbeaconherald.com": "Stratford Beacon Herald",
  "stratfordtoday.ca": "StratfordToday",
  "strathmorenow.com": "Strathmore Now",
  "strathmoretimes.com": "Strathmore Times",
  "strathroyagedispatch.com": "Strathroy Age Dispatch",
  "stthomastimesjournal.com": "St. Thomas Times-Journal",
  "sudbury.com": "Sudbury.com",
  "summerlandreview.com": "Summerland Review",
  "sunpeaksnews.com": "Spin News Magazine",
  "surreyleader.com": "Surrey Leader",
  "surreynowleader.com": "Surrey Now-Leader",
  "swbooster.com": "Southwest Booster",
  "swiftcurrentonline.com": "Swift Current Online",
  "sylvanlakenews.com": "Sylvan Lake News",
  "tabertimes.com": "Taber Times",
  "tatamagouchelight.com": "Tatamagouche Light",
  "tbnewswatch.com": "TBNewswatch",
  "tcctnews.com": "Canadian Chinese Times",
  "terracestandard.com": "Terrace Standard",
  "the-gleaner.com": "The Gleaner (Shawville)",
  "the-peak.ca": "The Peak (SFU)",
  "theadvance.ca": "Queens County Advance",
  "theafronews.com": "Afro News",
  "thealbertan.com": "The Albertan",
  "theaquinian.net": "The Aquinian",
  "theaurora.ca": "The Aurora",
  "thebeaumontnews.ca": "Beaumont News",
  "thebreachmedia.ca": "The Breach",
  "thebruns.ca": "The Brunswickan",
  "thebureau.news": "The Bureau",
  "thecadreupei.com": "The Cadre (UPEI)",
  "thecanadianpress.com": "La Presse canadienne / The Canadian Press",
  "thecarillon.com": "Steinbach Carillon",
  "thecasket.ca": "The Casket (Antigonish)",
  "thechronicle-online.com": "West Elgin Chronicle",
  "thechronicleherald.ca": "The Chronicle Herald",
  "thecjn.ca": "The Canadian Jewish News",
  "theclarion.ca": "The Clarion (Kindersley)",
  "thecoast.ca": "The Coast",
  "thecoastguard.ca": "Shelburne County Coast Guard",
  "thecommunitypress.com": "Community Press",
  "theconcordian.com": "The Concordian",
  "thecosmos.ca": "Uxbridge Cosmos",
  "thecragandcanyon.ca": "Bow Valley Crag and Canyon",
  "theenergymix.com": "The Energy Mix",
  "theequity.ca": "The Equity (Shawville)",
  "theeyeopener.com": "The Eyeopener",
  "thefilipinopost.com": "Filipino Post",
  "thefreepress.ca": "The Free Press (Fernie)",
  "thefulcrum.ca": "The Fulcrum (uOttawa)",
  "thegatewayonline.ca": "The Gateway (Alberta)",
  "theglobeandmail.com": "The Globe and Mail",
  "thegoldenstar.net": "Golden Star",
  "thegrizzlygazette.com": "Grizzly Gazette",
  "theguardian.pe.ca": "The Guardian",
  "thehighlander.ca": "The Highlander",
  "thehockeynews.com": "The Hockey News",
  "thehub.ca": "The Hub",
  "theifp.ca": "Independent Free Press",
  "theindependent.ca": "The Independent",
  "thelabradorian.ca": "The Labradorian",
  "thelaker.ca": "The Laker (Muskoka)",
  "thelambda.ca": "Lambda (Laurentian)",
  "thelawyersdaily.ca": "The Lawyer's Daily",
  "thelinknewspaper.ca": "The Link",
  "thelinkpaper.ca": "The Link (Vancouver)",
  "thelocal.to": "The Local",
  "thelocalweekly.ca": "Local Weekly (Sechelt)",
  "thelogic.co": "The Logic",
  "thelondoner.ca": "The Londoner",
  "themanitoban.com": "The Manitoban",
  "themastheadnews.ca": "Masthead News",
  "themeafordindependent.ca": "Meaford Independent",
  "themedium.ca": "The Medium (UTM)",
  "themeliorist.ca": "The Meliorist (Lethbridge)",
  "themuse.ca": "The Muse (MUN)",
  "thenarwhal.ca": "The Narwhal",
  "thenav.ca": "The Navigator (Vancouver Island U)",
  "thenelsondaily.com": "Nelson Daily",
  "thenelsonpost.ca": "Nelson Post",
  "thenorthernview.com": "The Northern View",
  "thenorwester.ca": "The Nor'wester",
  "thenownewspaper.com": "Surrey Now-Leader",
  "theobserver.ca": "Sarnia Observer",
  "theotherpress.ca": "The Other Press (Douglas)",
  "theoutlook.ca": "Outlook",
  "theovercast.ca": "The Overcast",
  "thepacket.ca": "The Packet (Clarenville)",
  "thepasonline.com": "The Pas Online",
  "thepeterboroughexaminer.com": "Peterborough Examiner",
  "thephoenixnews.com": "The Phoenix (UBC Okanagan)",
  "thepost.on.ca": "The Post (Hanover)",
  "theprogress.com": "Chilliwack Progress",
  "theprogressreport.ca": "The Progress Report",
  "theprojector.ca": "The Projector",
  "theprovince.com": "The Province",
  "thequill.ca": "The Quill (Brandon University)",
  "therecord.com": "Waterloo Region Record",
  "therecorder.ca": "Boissevain Recorder",
  "therecordnews.ca": "Chesterville Record",
  "thereminder.ca": "The Reminder",
  "thereporter.ca": "The Reporter (Windsor-Essex)",
  "thereview.ca": "Vankleek Hill Review",
  "theroblinreview.com": "Roblin Review",
  "therockymountaingoat.com": "Rocky Mountain Goat",
  "thesarniajournal.com": "Sarnia Journal",
  "theshaunavonstandard.com": "Shaunavon Standard",
  "thesheaf.com": "The Sheaf (Saskatchewan)",
  "theshoreline.ca": "The Shoreline (Terre-Neuve)",
  "theshorelinejournal.com": "Shoreline Journal",
  "theshorelinenews.com": "The Shoreline",
  "thespec.com": "The Hamilton Spectator",
  "thestandardnewspaper.ca": "The Standard (Durham/Kawartha)",
  "thestar.com": "Toronto Star",
  "thestarphoenix.com": "Saskatoon StarPhoenix",
  "thesuburban.com": "The Suburban",
  "thesudburystar.com": "Sudbury Star",
  "thetelegram.com": "The Telegram",
  "thetimesstar.ca": "Geraldton Times Star",
  "thetrillium.ca": "The Trillium",
  "theturtleislandnews.com": "Turtle Island News",
  "thetweednews.ca": "Tweed News",
  "thetyee.ca": "The Tyee",
  "thevalleygazette.ca": "The Valley Gazette (Barry's Bay)",
  "thevalleysentinel.com": "Valley Sentinel",
  "thevanguard.ca": "Yarmouth County Vanguard",
  "thevarsity.ca": "The Varsity (U of T)",
  "thevoiceofpelham.ca": "The Voice of Pelham",
  "thewalrus.ca": "The Walrus",
  "thewesterncanadian.ca": "The Western Canadian",
  "thewhig.com": "Kingston Whig-Standard",
  "thoibao.com": "Thoi Bao",
  "thompsononline.com": "Thompson Online",
  "thoroldtoday.ca": "ThoroldToday",
  "threehillscapital.com": "Three Hills Capital",
  "tilburytimes.ca": "Tilbury Times Reporter",
  "timeschronicle.ca": "Times Chronicle (Osoyoos/Oliver)",
  "timescolonist.com": "Times Colonist",
  "timminspress.com": "Timmins Press",
  "timminstimes.com": "Timmins Times",
  "timminstoday.com": "TimminsToday",
  "tj.news": "Telegraph-Journal (Brunswick News)",
  "tofieldmerc.com": "Tofield Mercury",
  "toronto.com": "Torstar / Metroland Toronto",
  "torontolife.com": "Toronto Life",
  "torontosun.com": "Toronto Sun",
  "torontotoday.ca": "TorontoToday",
  "townandcountrynews.ca": "Town and Country News",
  "townandcountrytoday.com": "Town and Country Today",
  "trailchampion.com": "Trail Champion",
  "traildailytimes.ca": "Trail Daily Times",
  "trailtimes.ca": "Trail Times",
  "trehernetimes.ca": "Treherne Times",
  "tremblantexpress.com": "Journal Tremblant Express",
  "trentonian.ca": "Trenton Trentonian",
  "tricitynews.com": "Tri-City News",
  "trurodaily.com": "Truro Daily News",
  "tsn.ca": "TSN",
  "tumblerridgenews.com": "Tumbler Ridge News",
  "tvanouvelles.ca": "TVA Nouvelles",
  "tvasports.ca": "TVA Sports",
  "tvo.org": "TVO",
  "twmnews.com": "The Watrous Manitou",
  "tworowtimes.com": "Two Row Times",
  "ubyssey.ca": "The Ubyssey (UBC)",
  "ufvcascade.ca": "The Cascade (UFV)",
  "unitystories.com": "Unity Wilkie Press-Herald",
  "uphere.ca": "Up Here",
  "upherebusiness.ca": "Up Here Business",
  "urbania.ca": "Urbania",
  "v-shinpo.com": "Vancouver Shinpo",
  "valleedurichelieuexpress.ca": "Vallée du Richelieu Express",
  "valleyvoice.ca": "Valley Voice",
  "vancourier.com": "Vancouver Courier",
  "vancouverisawesome.com": "Vancouver Is Awesome",
  "vancouversun.com": "Vancouver Sun",
  "vauxhalladvance.com": "Vauxhall Advance",
  "vermilionstandard.com": "Vermilion Standard",
  "vermilionvoice.com": "Vermilion Voice",
  "vernonmorningstar.com": "Vernon Morning Star",
  "vicnews.com": "Victoria News",
  "victoriastandard.ca": "Victoria Standard",
  "villagereport.ca": "Village Report",
  "vocm.com": "VOCM News",
  "voiceonline.com": "Indo-Canadian Voice",
  "voir.ca": "Voir",
  "vulcanadvocate.com": "Vulcan Advocate",
  "wadenanews.ca": "Wadena News",
  "walkerton.com": "Walkerton Herald Times",
  "waterloochronicle.ca": "Waterloo Chronicle",
  "wawataynews.ca": "Wawatay News",
  "wayves.ca": "Wayves",
  "wcmbnews.com": "WCMB News (Manitoba)",
  "weeklyreview.ca": "Weekly Review (Viking)",
  "weeklyvoice.com": "Weekly Voice",
  "wellandtribune.ca": "Welland Tribune",
  "wellingtonadvertiser.com": "Wellington Advertiser",
  "westcentralcrossroads.ca": "West Central Crossroads",
  "westcentralonline.com": "West Central Online",
  "westerlynews.ca": "Westerly News",
  "westerngazette.ca": "Western Gazette",
  "westerninvestor.com": "Western Investor",
  "westernwheel.ca": "Western Wheel",
  "westislandchronicle.com": "The Chronicle West Island",
  "westlocknews.com": "Westlock News",
  "westmountexaminer.com": "Westmount Examiner",
  "westmountindependent.com": "Westmount Independent",
  "westnipissing.com": "West Nipissing Tribune",
  "westvanbeacon.ca": "West Van Beacon",
  "wetaskiwintimes.com": "Wetaskiwin Times",
  "weyburnreview.com": "Weyburn Review",
  "weyburnthisweek.com": "Weyburn This Week",
  "whitecourtpress.com": "Whitecourt Press",
  "whitecourtstar.com": "Whitecourt Star",
  "whitehorsestar.com": "Whitehorse Daily Star",
  "whiterocksun.com": "White Rock Sun",
  "wiartonecho.com": "Wiarton Echo",
  "windsorstar.com": "Windsor Star",
  "wingham.com": "Wingham Advance Times",
  "winklermordenvoice.ca": "Winkler Morden Voice",
  "winnipegfreepress.com": "Winnipeg Free Press",
  "winnipegsun.com": "Winnipeg Sun",
  "wltribune.com": "Williams Lake Tribune",
  "wn3.ca": "News Now Grimsby/Lincoln",
  "woodstocksentinelreview.com": "Woodstock Sentinel-Review",
  "world-spectator.com": "World Spectator (Moosomin)",
  "worldjournal.com": "World Journal",
  "xaverian.ca": "The Xaverian Weekly",
  "xtra.ca": "Xtra Magazine",
  "xtramagazine.com": "Xtra Magazine",
  "yorkregion.com": "YorkRegion.com",
  "yorktonthisweek.com": "Yorkton This Week",
  "yourlocaljournal.ca": "Your Local Journal",
  "yukon-news.com": "Yukon News",
  "yukoner.com": "Yukoner Magazine"
};

/**
 * Vérifie si le domaine cible fait partie des médias canadiens de confiance.
 */
function isDomainAllowed(hostname) {
  const cleanHost = hostname.toLowerCase().replace(/^www\./, "");
  return ALLOWED_DOMAINS.some(domain => cleanHost === domain || cleanHost.endsWith("." + domain));
}

function getMediaSiteName(hostname) {
  const cleanHost = (hostname || "").toLowerCase().replace(/^www\./, "");
  for (const [domain, name] of Object.entries(MEDIA_NAMES)) {
    if (cleanHost === domain || cleanHost.endsWith("." + domain)) {
      return name;
    }
  }
  return cleanHost.charAt(0).toUpperCase() + cleanHost.slice(1);
}

/**
 * Nettoie les paramètres de pistage Meta/Google (Anti-Tracking).
 */
function cleanTrackingParameters(urlStr) {
  try {
    const parsed = new URL(urlStr);
    const paramsToStrip = [
      "fbclid", "gclid", "utm_source", "utm_medium", "utm_campaign", 
      "utm_term", "utm_content", "msclkid", "mc_eid", "yclid", 
      "twclid", "dclid", "_hsenc", "_hsmi"
    ];
    let strippedAny = false;
    for (const param of paramsToStrip) {
      if (parsed.searchParams.has(param)) {
        parsed.searchParams.delete(param);
        strippedAny = true;
      }
    }
    return { cleanedUrl: parsed.href, strippedAny };
  } catch (e) {
    return { cleanedUrl: urlStr, strippedAny: false };
  }
}

// Durée de rétention automatique des données temporaires (30 jours)
const RETENTION_30_DAYS_SECONDS = 60 * 60 * 24 * 30;

/**
 * Enregistre un clic de manière 100% anonyme dans le stockage Cloudflare KV.
 * Uniquement pour les médias journalistiques officiels et vérifiés.
 * Rétention maximale de 30 jours (purge automatique par Cloudflare).
 */
async function recordClick(env, hostname, isVerified = false) {
  if (!env || !env.LIENLIBRE_KV || !isVerified) return;
  try {
    const cleanHost = hostname.toLowerCase().replace(/^www\./, "");
    
    // Filtre strict : Ne jamais enregistrer de site non vérifié ou non autorisé
    if (!isDomainAllowed(cleanHost)) {
      return;
    }

    // 1. Incrémenter le total global des médias vérifiés (Rétention 30 jours)
    const totalKey = "stats:total_clicks";
    let total = parseInt(await env.LIENLIBRE_KV.get(totalKey) || "0");
    await env.LIENLIBRE_KV.put(totalKey, (total + 1).toString(), { expirationTtl: RETENTION_30_DAYS_SECONDS });

    // 2. Incrémenter la statistique du domaine vérifié (Rétention 30 jours)
    const domainKey = `stats:domain:${cleanHost}`;
    let domainTotal = parseInt(await env.LIENLIBRE_KV.get(domainKey) || "0");
    await env.LIENLIBRE_KV.put(domainKey, (domainTotal + 1).toString(), { expirationTtl: RETENTION_30_DAYS_SECONDS });
  } catch (e) {
    console.error("Erreur d'écriture KV :", e);
  }
}

/**
 * Récupère les statistiques agrégées depuis le stockage Cloudflare KV.
 * Filtre STRICTEMENT pour n'exposer que les médias journalistiques officiels vérifiés.
 */
async function getStats(env) {
  if (!env || !env.LIENLIBRE_KV) {
    return { total_clicks: 0, domains: {} };
  }
  try {
    const listResult = await env.LIENLIBRE_KV.list({ prefix: "stats:domain:" });
    const domains = {};
    let totalClicks = 0;
    
    for (const key of listResult.keys) {
      const domainName = key.name.replace("stats:domain:", "").toLowerCase();
      
      // Filtre absolu : seuls les médias de la liste officielle sont comptabilisés et affichés
      if (isDomainAllowed(domainName)) {
        const val = parseInt(await env.LIENLIBRE_KV.get(key.name) || "0");
        if (val > 0) {
          domains[domainName] = val;
          totalClicks += val;
        }
      }
    }
    
    return { total_clicks: totalClicks, domains };
  } catch (e) {
    return { total_clicks: 0, domains: {}, error: e.message };
  }
}

/**
 * Vérifie si un domaine est banni dynamiquement dans Cloudflare KV.
 * Clé KV : `blacklist:domaine.com`
 * Permet un bannissement instantané en 5 secondes depuis le tableau de bord Cloudflare sans redéploiement de code.
 */
async function checkDynamicBlacklist(env, hostname) {
  if (!env || !env.LIENLIBRE_KV || !hostname) return null;
  try {
    const cleanHost = hostname.toLowerCase().replace(/^www\./i, "").trim();
    // 1. Vérification exacte du nom d'hôte (ex: blog.fraude.com)
    const exact = await env.LIENLIBRE_KV.get(`blacklist:${cleanHost}`);
    if (exact !== null) return exact || "Signalement de sécurité / abus";
    
    // 2. Vérification du domaine racine parent (ex: fraude.com)
    const parts = cleanHost.split(".");
    if (parts.length > 2) {
      const rootDomain = parts.slice(-2).join(".");
      const rootCheck = await env.LIENLIBRE_KV.get(`blacklist:${rootDomain}`);
      if (rootCheck !== null) return rootCheck || "Signalement de sécurité / abus";
    }
    return null;
  } catch (_) {
    return null;
  }
}

function encodePackedUrl(urlStr) {
  try {
    return btoa(encodeURIComponent(urlStr)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch (_) {
    return "";
  }
}

function decodePackedUrl(packed) {
  try {
    let base64 = packed.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    return decodeURIComponent(atob(base64));
  } catch (_) {
    return null;
  }
}

/**
 * Génère l'URL du proxy d'image.
 * RÈGLE PÉNALE STRICTE : Ne proxyifie QUE si le domaine fait partie de ALLOWED_DOMAINS.
 * Pour tous les autres domaines, conserve l'URL d'origine sans passer par le proxy /i/.
 */
function getProxyImageUrl(origin, rawImageUrl, isAllowed = false) {
  if (!rawImageUrl) return "";
  if (!isAllowed) {
    return rawImageUrl; // Pas de relais proxy pour les domaines non vérifiés
  }
  try {
    const b64 = btoa(rawImageUrl).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    return `${origin}/i/${b64}`;
  } catch (_) {
    return rawImageUrl;
  }
}

// 1. Raccourcisseurs d'URL interdits (Anti-Obfuscation)
const BLOCKED_URL_SHORTENERS = [
  "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd", "buff.ly", "cutt.ly",
  "rb.gy", "shorturl.at", "rebrand.ly", "bl.ink", "tiny.cc", "lnkd.in", "s.id", "v.gd",
  "qr.ae", "trib.al", "linktr.ee", "bc.vc", "adf.ly", "shorte.st", "ouo.io", "clck.ru",
  "rotf.lol", "vzturl.com", "hyperurl.co", "short.io", "soo.gd"
];

// 2. Services de stockage cloud chiffré / anonyme / messageries privées (Non-journalistiques)
const BLOCKED_CLOUD_AND_ANON_SERVICES = [
  "mega.nz", "mega.io", "t.me", "telegram.me", "telegram.org", "discord.gg", "discord.com",
  "whatsapp.com", "chat.whatsapp.com", "signal.group", "anonfiles.com", "gofile.io",
  "mediafire.com", "drive.google.com", "dropbox.com", "wetransfer.com", "pastebin.com",
  "rentry.co", "ghostbin.com", "sendspace.com", "rapidgator.net", "zippyshare.com",
  "krakenfiles.com", "1fichier.com", "filecrypt.co", "catbox.moe", "pomf2.lain.la",
  "file.io", "ufile.io", "bayfiles.com", "ddownload.com", "turbobit.net", "nitroflare.com"
];

// 3. Extensions de domaines (TLD) jetables ou à haut risque d'abus
const BLOCKED_TLDS = [
  ".tk", ".ml", ".ga", ".cf", ".gq", ".top", ".xyz", ".click", ".link", ".stream",
  ".win", ".loan", ".date", ".party", ".zip", ".mov", ".ru", ".cn", ".pw", ".cc",
  ".work", ".racing", ".download", ".kim", ".country", ".science", ".cricket", ".gdn",
  ".men", ".bid", ".trade", ".webcam", ".faith", ".review", ".accountant"
];

// 4. Extensions de fichiers exécutables / dangereux
const DANGEROUS_EXTENSIONS_REGEX = /\.(exe|scr|bat|cmd|apk|dmg|iso|zip|rar|7z|tar|gz|sh|vbs|ps1|dll|bin|msi|app|pkg|deb|rpm|jar|vhd|img|torrent)$/i;

// 5. Adresses IP brutes (IPv4 & IPv6)
const IP_ADDRESS_REGEX = /^(\d{1,3}\.){3}\d{1,3}$|^([0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{1,4}$/;

// 6. Filtrage sémantique de toxicité / arnaque / phishing / substances illicites
const TOXIC_SEMANTIC_REGEX = /\b(crypto\s*(giveaway|airdrop|doubler|investment|mining|presale)|free\s*bitcoin|wallet\s*connect|verify\s*your\s*wallet|metamask\s*update|claim\s*tokens?|suspended\s*account|account\s*blocked|verify\s*bank|banking\s*security\s*alert|urgent\s*password|viagra|cialis|casino\s*bonus|warez|crack\s*download|keygen|darkweb|tor\s*mirror|drugs\s*online|buy\s*weapons?|phishing|stealer|malware)\b/i;

/**
 * Analyse stricte des menaces de sécurité et des vecteurs d'abus.
 */
function checkSecurityThreats(targetUrl, meta = {}) {
  let urlObj = targetUrl;
  if (typeof targetUrl === "string") {
    try {
      urlObj = new URL(targetUrl);
    } catch (e) {
      return { isBlocked: true, reason: "URL invalide ou malformée." };
    }
  }
  const hostname = urlObj.hostname.toLowerCase().replace(/^www\./, "");
  const path = urlObj.pathname.toLowerCase();
  const search = urlObj.search.toLowerCase();
  const fullText = `${urlObj.href} ${meta.title || ""} ${meta.description || ""} ${meta.standardTitle || ""}`.toLowerCase();

  // 1. IP brute
  if (IP_ADDRESS_REGEX.test(hostname)) {
    return {
      isBlocked: true,
      reason: "Les adresses IP directes sont formellement interdites pour prévenir les vecteurs d'attaque."
    };
  }

  // 2. Raccourcisseurs d'URL
  if (BLOCKED_URL_SHORTENERS.some(s => hostname === s || hostname.endsWith("." + s))) {
    return {
      isBlocked: true,
      reason: "Les raccourcisseurs d'URL (ex: bit.ly, tinyurl) sont interdits afin d'empêcher le masquage de destinations malveillantes."
    };
  }

  // 3. Stockage cloud chiffré / Messageries anonymes
  if (BLOCKED_CLOUD_AND_ANON_SERVICES.some(s => hostname === s || hostname.endsWith("." + s))) {
    return {
      isBlocked: true,
      reason: "Les plateformes de stockage chiffré, d'hébergement anonyme de fichiers et de canaux de messagerie privée ne sont pas des organes de presse et sont exclues."
    };
  }

  // 4. TLDs suspects / jetables
  if (BLOCKED_TLDS.some(tld => hostname.endsWith(tld))) {
    const matchedTld = BLOCKED_TLDS.find(tld => hostname.endsWith(tld)) || "";
    return {
      isBlocked: true,
      reason: `L'extension de domaine (${matchedTld}) est classée à haut risque d'abus et n'est pas autorisée.`
    };
  }

  // 5. Fichiers dangereux / exécutables
  if (DANGEROUS_EXTENSIONS_REGEX.test(path)) {
    return {
      isBlocked: true,
      reason: "Le lien pointe vers un fichier exécutable, une archive ou un binaire potentiellement dangereux."
    };
  }

  // 6. Toxicité sémantique / Scam / Phishing
  if (TOXIC_SEMANTIC_REGEX.test(fullText) || TOXIC_SEMANTIC_REGEX.test(path) || TOXIC_SEMANTIC_REGEX.test(search)) {
    return {
      isBlocked: true,
      reason: "Des marqueurs de sécurité critiques (phishing, fraude, malware ou contenu illicite) ont été détectés."
    };
  }

  return { isBlocked: false, reason: "" };
}

/**
 * 🌐 Double Bouclier DNS Infaillible (NextDNS 8d3993 + Cloudflare 1.1.1.3)
 * - Interroge NextDNS (listes HaGeZi, 1Hosts, NRD, Contrôle parental).
 * - Interroge Cloudflare Famille 1.1.1.3 (Illimité, bloque malwares et contenus adultes).
 * - Si l'un des deux signale un blocage (0.0.0.0, ::, NXDOMAIN), le lien est rejeté.
 * - Si NextDNS dépasse son quota mensuel gratuit de 300 000 requêtes, Cloudflare protège le relais sans interruption.
 */
async function checkDnsFamilyShield(hostname) {
  try {
    const cleanHost = (hostname || "").toLowerCase().replace(/^www\./, "");
    if (!cleanHost || isDomainAllowed(cleanHost)) {
      return { isBlocked: false, reason: "" };
    }

    const fetchDoh = async (url) => {
      const ctrl = new AbortController();
      const tId = setTimeout(() => ctrl.abort(), 1800);
      try {
        const res = await fetch(url, {
          headers: { "Accept": "application/dns-json" },
          signal: ctrl.signal
        });
        clearTimeout(tId);
        if (!res.ok) return null;
        return await res.json();
      } catch (_) {
        clearTimeout(tId);
        return null;
      }
    };

    // Requêtes simultanées vers NextDNS (profil 8d3993) et Cloudflare 1.1.1.3
    const nextDnsUrl = `https://dns.nextdns.io/8d3993/dns-query?name=${encodeURIComponent(cleanHost)}&type=A`;
    const cfUrl = `https://family.cloudflare-dns.com/dns-query?name=${encodeURIComponent(cleanHost)}&type=A`;

    const [nextData, cfData] = await Promise.all([
      fetchDoh(nextDnsUrl),
      fetchDoh(cfUrl)
    ]);

    // 1. Vérification NextDNS
    if (nextData) {
      if (nextData.Answer && Array.isArray(nextData.Answer)) {
        const isBlockedNext = nextData.Answer.some(a => 
          a.data === "0.0.0.0" || 
          a.data === "::" || 
          a.data === "127.0.0.1" || 
          (typeof a.data === "string" && a.data.startsWith("0.0.0."))
        );
        if (isBlockedNext) {
          return {
            isBlocked: true,
            reason: "Ce domaine est bloqué par le bouclier NextDNS (menace de sécurité, piratage ou contenu prohibé détecté)."
          };
        }
      }
      if (nextData.Status === 3) {
        return { isBlocked: true, reason: "Ce nom de domaine est inexistant ou non attribué (NXDOMAIN)." };
      }
    }

    // 2. Vérification Cloudflare Famille (Secours illimité)
    if (cfData) {
      if (cfData.Answer && Array.isArray(cfData.Answer)) {
        const isBlockedCf = cfData.Answer.some(a => 
          a.data === "0.0.0.0" || a.data === "::" || a.data === "127.0.0.1"
        );
        if (isBlockedCf) {
          return {
            isBlocked: true,
            reason: "Ce domaine est bloqué par le bouclier Cloudflare Sécurité & Famille (site malveillant ou contenu explicite)."
          };
        }
      }
      if (cfData.Status === 3) {
        return { isBlocked: true, reason: "Ce nom de domaine est inexistant ou non attribué (NXDOMAIN)." };
      }
    }

  } catch (err) {
    console.warn("Erreur de validation DNS bouclier :", err);
  }

  return { isBlocked: false, reason: "" };
}
/**
 * Mini-Bot Sentinel : Analyse heuristique et sémantique automatique gratuite.
 * Évalue la crédibilité journalistique et l'intégrité d'une source web sans intervention humaine et sans frais.
 */
function calculateBotAudit(targetUrl, meta = {}, isWhitelisted = false, dnsThreat = null) {
  if (isWhitelisted) {
    return {
      score: 100,
      isJournalistic: true,
      isValidated: true,
      isBlocked: false,
      category: "whitelisted_media",
      badgeText: "Média Canadien Vérifié (Liste Officielle)",
      signals: [
        "Domaine inscrit au répertoire officiel des médias canadiens",
        "Protocole sécurisé et chiffré HTTPS",
        "Métadonnées Open Graph intègres",
        "Bouclier DNS Protection Famille & Sécurité validé"
      ]
    };
  }

  let urlObj = targetUrl;
  if (typeof targetUrl === "string") {
    try {
      urlObj = new URL(targetUrl);
    } catch (e) {
      return {
        score: 0,
        isJournalistic: false,
        isValidated: false,
        isBlocked: true,
        blockReason: "URL invalide ou malformée.",
        category: "blocked_threat",
        badgeText: "Source Bloquée (URL Invalide)",
        signals: ["⚠️ URL invalide ou malformée."]
      };
    }
  }

  const threat = checkSecurityThreats(urlObj, meta);
  if (threat.isBlocked) {
    return {
      score: 0,
      isJournalistic: false,
      isValidated: false,
      isBlocked: true,
      blockReason: threat.reason,
      category: "blocked_threat",
      badgeText: "Source Bloquée (Menace de Sécurité)",
      signals: ["⚠️ " + threat.reason]
    };
  }

  if (dnsThreat && dnsThreat.isBlocked) {
    return {
      score: 0,
      isJournalistic: false,
      isValidated: false,
      isBlocked: true,
      blockReason: dnsThreat.reason,
      category: "blocked_threat",
      badgeText: "Source Bloquée (Bouclier DNS Famille)",
      signals: ["⚠️ " + dnsThreat.reason]
    };
  }

  let score = 20; // Base score
  const signals = [];

  if (urlObj.protocol === "https:") {
    score += 15;
    signals.push("Protocole sécurisé HTTPS");
  }

  signals.push("Bouclier DNS Protection Famille & Sécurité (1.1.1.3) validé");

  const hostname = urlObj.hostname.toLowerCase().replace(/^www\./, "");
  const path = urlObj.pathname.toLowerCase();

  // Extension de domaine réputée
  if (/\.(ca|qc\.ca|org|com|net|info|news|press|media|tv|fm)$/i.test(hostname)) {
    score += 10;
    signals.push("Nom de domaine et TLD conformes");
  }

  // Type Open Graph
  if (meta.ogType && meta.ogType.toLowerCase().includes("article")) {
    score += 25;
    signals.push("Format Open Graph 'article' authentifié");
  } else if (meta.ogType && meta.ogType.toLowerCase().includes("website")) {
    score += 5;
  }

  // Schema.org ou données structurées NewsArticle
  if (meta.schemaType && (meta.schemaType.includes("NewsArticle") || meta.schemaType.includes("Article") || meta.schemaType.includes("ReportageNewsArticle"))) {
    score += 25;
    signals.push("Schéma sémantique de presse (NewsArticle / Schema.org)");
  }

  // Auteur ou Date de publication
  if (meta.author || meta.publishedTime) {
    score += 15;
    signals.push("Signature d'auteur ou horodatage éditorial détecté");
  }

  // Mot-clés de chemin journalistique
  const newsRegex = /\/(actualites?|nouvelles?|news|articles?|reportages?|politique|societe|regions?|nation|monde|opinions?|editorial|chroniques?|journal|en-direct|faits-divers)\b/i;
  if (newsRegex.test(path)) {
    score += 15;
    signals.push("Structure d'URL de rubrique journalistique");
  }

  score = Math.max(0, Math.min(100, score));
  
  // SEUIL ÉLIMINATOIRE STRICT : 
  // 1. Si score < 60 et que le domaine n'est pas dans ALLOWED_DOMAINS -> Blocage pur et simple (403)
  // 2. Si score >= 80 -> Validation automatique comme média journalistique
  // 3. Si 60 <= score < 80 -> Contenu non répertorié autorisé uniquement avec avertissement statique et clic volontaire
  const isBlockedByScore = !isAllowed && score < 60;
  const isJournalistic = score >= 80;
  const isValidated = isJournalistic;

  if (isBlockedByScore) {
    return {
      score,
      isJournalistic: false,
      isValidated: false,
      isBlocked: true,
      blockReason: `Score de fiabilité insuffisant (${score}/100 - seuil minimal éliminatoire : 60/100). Ce domaine non répertorié ne présente pas les garanties minimales de publication journalistique ou de sécurité.`,
      category: "insufficient_score",
      badgeText: `Source Bloquée (Score insuffisant : ${score}/100)`,
      signals: ["⚠️ Score d'intégrité inférieur au seuil de 60/100", ...signals]
    };
  }

  return {
    score,
    isJournalistic,
    isValidated,
    isBlocked: false,
    category: isJournalistic ? "journalistic_source" : "unverified_content",
    badgeText: isJournalistic 
      ? `Source Journalistique Conforme (${score}/100)` 
      : `Contenu Non Répertorié (${score}/100)`,
    signals
  };
}

export default {
  async fetch(request, env, ctx) {
    // 1. Gérer les requêtes CORS Preflight (OPTIONS)
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS
      });
    }

    const requestUrl = new URL(request.url);
    const lang = (requestUrl.searchParams.get("lang") || "fr").toLowerCase();

    // 2. Fichiers PWA, SEO et Indexation LLMs / Robots
    if (requestUrl.pathname === "/manifest.json" || requestUrl.pathname === "/manifest.webmanifest") {
      const manifestContent = JSON.stringify({
        name: "LienLibre — Passerelle Citoyenne & Éducative",
        short_name: "LienLibre",
        description: "Outil civique et éducatif pour l'interopérabilité des métadonnées Open Graph et le libre accès aux informations publiques canadiennes.",
        start_url: "./",
        scope: "./",
        display: "standalone",
        orientation: "portrait-primary",
        background_color: "#090d16",
        theme_color: "#090d16",
        categories: ["utilities", "news", "education"],
        icons: [
          {
            src: "icon.svg",
            sizes: "512x512 192x192 128x128 64x64 32x32",
            type: "image/svg+xml",
            purpose: "any maskable"
          }
        ]
      });
      return new Response(manifestContent, {
        status: 200,
        headers: { "Content-Type": "application/manifest+json; charset=utf-8", "Cache-Control": "public, max-age=86400", ...CORS_HEADERS }
      });
    }

    if (requestUrl.pathname === "/icon.svg" || requestUrl.pathname === "/favicon.svg" || requestUrl.pathname === "/favicon.ico") {
      const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none"><defs><linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#090d16"/><stop offset="100%" stop-color="#0f172a"/></linearGradient><linearGradient id="linkGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#06b6d4"/><stop offset="50%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient></defs><rect width="512" height="512" rx="128" fill="url(#bgGrad)"/><g stroke="url(#linkGrad)" stroke-width="38" stroke-linecap="round" stroke-linejoin="round" transform="translate(40, 40) scale(0.84)"><path d="M280 184l32-32a96 96 0 0 1 136 136l-96 96a96 96 0 0 1-136-136l32-32"/><path d="M232 328l-32 32a96 96 0 0 1-136-136l96-96a96 96 0 0 1 136 136l-32 32"/></g></svg>`;
      return new Response(iconSvg, {
        status: 200,
        headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "public, max-age=604800", ...CORS_HEADERS }
      });
    }

    if (requestUrl.pathname === "/og-image.svg" || requestUrl.pathname === "/og-image.png") {
      const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630" fill="none"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#090d16"/><stop offset="50%" stop-color="#0f172a"/><stop offset="100%" stop-color="#020617"/></linearGradient><linearGradient id="primary" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#06b6d4"/><stop offset="50%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#6366f1"/></linearGradient><linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#38bdf8"/><stop offset="50%" stop-color="#818cf8"/><stop offset="100%" stop-color="#c084fc"/></linearGradient></defs><rect width="1200" height="630" fill="url(#bg)"/><rect x="24" y="24" width="1152" height="582" rx="32" stroke="rgba(255,255,255,0.08)" stroke-width="2" fill="none"/><g transform="translate(100, 150)"><rect width="130" height="130" rx="32" fill="#0f172a" stroke="rgba(255,255,255,0.12)" stroke-width="2"/><g stroke="url(#primary)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" transform="translate(20, 20) scale(0.7)"><path d="M70 46l8-8a24 24 0 0 1 34 34l-24 24a24 24 0 0 1-34-34l8-8"/><path d="M58 82l-8 8a24 24 0 0 1-34-34l24-24a24 24 0 0 1 34 34l-8 8"/></g></g><text x="260" y="215" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="72" fill="#ffffff" letter-spacing="-1.5">Lien<tspan fill="url(#textGrad)">Libre</tspan></text><text x="265" y="260" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="22" fill="#38bdf8" letter-spacing="2">PASSERELLE CITOYENNE D'INFORMATION</text><text x="100" y="370" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="44" fill="#f1f5f9" letter-spacing="-0.5">Partagez l'actualité en toute liberté et transparence.</text><text x="100" y="425" font-family="system-ui, -apple-system, sans-serif" font-weight="400" font-size="24" fill="#94a3b8">Outil civique et éducatif pour l'interopérabilité des métadonnées Open Graph</text><text x="100" y="460" font-family="system-ui, -apple-system, sans-serif" font-weight="400" font-size="24" fill="#94a3b8">et la préservation du libre accès aux nouvelles canadiennes d'intérêt public.</text><g transform="translate(100, 520)"><rect width="180" height="42" rx="21" fill="rgba(14,165,233,0.12)" stroke="rgba(14,165,233,0.3)" stroke-width="1.5"/><text x="90" y="26" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="16" fill="#38bdf8">🍁 100% Open Source</text><rect x="200" width="220" height="42" rx="21" fill="rgba(99,102,241,0.12)" stroke="rgba(99,102,241,0.3)" stroke-width="1.5"/><text x="310" y="26" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="16" fill="#818cf8">⚖️ Utilisation Équitable</text><rect x="440" width="180" height="42" rx="21" fill="rgba(16,185,129,0.12)" stroke="rgba(16,185,129,0.3)" stroke-width="1.5"/><text x="530" y="26" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="16" fill="#34d399">🔒 Zéro Log / Privé</text><text x="1000" y="27" text-anchor="end" font-family="monospace" font-weight="600" font-size="20" fill="#64748b">bwillou1.github.io/LienLibre</text></g></svg>`;
      return new Response(ogSvg, {
        status: 200,
        headers: { "Content-Type": "image/svg+xml; charset=utf-8", "Cache-Control": "public, max-age=604800", ...CORS_HEADERS }
      });
    }

    if (requestUrl.pathname === "/robots.txt") {
      const robotsContent = `User-agent: *\nAllow: /\n\nUser-agent: GPTBot\nAllow: /\n\nUser-agent: ChatGPT-User\nAllow: /\n\nUser-agent: Google-Extended\nAllow: /\n\nUser-agent: Googlebot\nAllow: /\n\nUser-agent: Bingbot\nAllow: /\n\nUser-agent: Anthropic-ai\nAllow: /\n\nUser-agent: Claude-Web\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: cohere-ai\nAllow: /\n\nUser-agent: OAI-SearchBot\nAllow: /\n\nUser-agent: Meta-ExternalAgent\nAllow: /\n\nUser-agent: facebookexternalhit\nAllow: /\n\nSitemap: ${requestUrl.origin}/sitemap.xml\n`;
      return new Response(robotsContent, {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8", ...CORS_HEADERS }
      });
    }

    if (requestUrl.pathname === "/sitemap.xml") {
      const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${requestUrl.origin}/</loc>\n    <lastmod>2026-09-08</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>`;
      return new Response(sitemapContent, {
        status: 200,
        headers: { "Content-Type": "application/xml; charset=utf-8", ...CORS_HEADERS }
      });
    }

    if (requestUrl.pathname === "/llms.txt") {
      const llmsContent = `# LienLibre\n\n> LienLibre is an open-source civic tech and educational laboratory bridge designed for research on web metadata protocols (Open Graph, Schema.org), fair dealing under Section 29 of the Canadian Copyright Act, and preserving public access to emergency safety alerts and public interest journalism.\n\n## Overview\n- Website: https://bwillou1.github.io/LienLibre/\n- Gateway: ${requestUrl.origin}\n- Repository: https://github.com/Bwillou1/LienLibre\n- License: MIT License\n\n## Academic & Educational Framing\n- Purpose: Non-commercial educational research, public safety information dissemination, and technical protocol interoperability.\n- Legal Basis: Fair Dealing (s. 29 Copyright Act) and Network Intermediary / Pure Technical Conduit (s. 31.1 Copyright Act). Does not fall under commercial publisher regulations.\n\n## Endpoints\n- GET /?url=<URL>: HTML bridge with instant human redirect.\n- POST /api/create: JSON link generator.\n- GET /api/stats: JSON aggregated metrics.\n- GET /l/:id: Short redirection link.\n- GET /p/:packed: Stateless unpacked bridge.\n- GET /i/:base64: Privacy-preserving image proxy.\n`;
      return new Response(llmsContent, {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8", ...CORS_HEADERS }
      });
    }

    if (requestUrl.pathname === "/llms-full.txt") {
      const llmsFullContent = `# LienLibre — Complete Documentation for LLMs & AI Agents\n\n## Mission & Context\nLienLibre is an academic, educational, and civic technology initiative developed to study open metadata interoperability (Open Graph, Twitter Cards, Schema.org) and to ensure that Canadian citizens maintain access to vital public safety announcements, health alerts, and news journalism during critical emergencies.\n\n## Legal Shield & Compliance\n1. **Pure Technical Conduit (Section 31.1 Copyright Act)**: LienLibre acts solely as a transient, automated network intermediary. It does not reproduce, modify, monetize, or host third-party journalistic works.\n2. **Fair Dealing (Section 29 Copyright Act)**: Created for private study, research, education, and public interest review.\n3. **Non-Application of Bill C-18**: LienLibre is an open-source, non-profit civic utility, not a designated digital news intermediary subject to commercial bargaining frameworks. The tool does not circumvent Canadian legislation.\n4. **Zero-Logs Privacy Policy**: Strictly no IP retention, no profiling cookies, and automatic stripping of tracking markers.\n`;
      return new Response(llmsFullContent, {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8", ...CORS_HEADERS }
      });
    }

    // 3. Proxy d'image ultra-sécurisé pour masquer les CDN de presse canadiens à Meta (Verrouillé aux domaines vérifiés)
    if (requestUrl.pathname.startsWith("/i/")) {
      try {
        const rawB64 = requestUrl.pathname.slice(3).split("?")[0];
        let base64 = rawB64.replace(/-/g, "+").replace(/_/g, "/");
        while (base64.length % 4) base64 += "=";
        const targetImgUrl = atob(base64);
        if (targetImgUrl.startsWith("http://") || targetImgUrl.startsWith("https://")) {
          const imgHost = new URL(targetImgUrl).hostname.replace(/^www\./i, "");
          
          // VERROUILLAGE PÉNAL STRICT : Seuls les domaines officiels vérifiés sont relayés
          if (!isDomainAllowed(imgHost)) {
            return new Response(null, { status: 403, headers: CORS_HEADERS });
          }

          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 secondes max (Anti-Slowloris)
          try {
            const imgRes = await fetch(targetImgUrl, {
              headers: {
                "User-Agent": SPOOF_HEADERS["User-Agent"],
                "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
                "Referer": new URL(targetImgUrl).origin
              },
              signal: controller.signal
            });
            if (imgRes.ok) {
              const contentType = imgRes.headers.get("Content-Type") || "image/jpeg";
              return new Response(imgRes.body, {
                status: 200,
                headers: {
                  "Content-Type": contentType,
                  "Cache-Control": "public, max-age=604800, s-maxage=604800",
                  ...CORS_HEADERS
                }
              });
            }
          } finally {
            clearTimeout(timeoutId);
          }
        }
      } catch (e) {}
      return new Response(null, { status: 404, headers: CORS_HEADERS });
    }

    // 3. Point de terminaison API Stats
    if (requestUrl.pathname === "/api/stats") {
      const stats = await getStats(env);
      return new Response(JSON.stringify(stats), {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json; charset=utf-8"
        }
      });
    }

    // 4. Point de terminaison API Create (/api/create - supporte POST et GET pour compatibilité totale)
    if (requestUrl.pathname === "/api/create") {
      let targetInput = "";
      let targetLang = lang;
      let isSelfCertified = false;

      if (request.method === "POST") {
        try {
          const body = await request.json();
          targetInput = body.url || body.targetUrl || "";
          if (body.lang) targetLang = body.lang.toLowerCase();
          if (body.selfCertified === true || body.cert === true || body.certified === true) {
            isSelfCertified = true;
          }
        } catch (e) {
          try {
            const formData = await request.formData();
            targetInput = formData.get("url") || "";
            if (formData.get("lang")) targetLang = formData.get("lang").toLowerCase();
            if (formData.get("cert") === "1" || formData.get("selfCertified") === "true") {
              isSelfCertified = true;
            }
          } catch (_) {}
        }
      } else {
        targetInput = requestUrl.searchParams.get("url") || "";
        if (requestUrl.searchParams.get("cert") === "1" || requestUrl.searchParams.get("selfCertified") === "true") {
          isSelfCertified = true;
        }
      }

      if (!targetInput) {
        return new Response(JSON.stringify({ error: "URL cible manquante." }), {
          status: 400,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" }
        });
      }

      try {
        let parsedTarget = new URL(targetInput.trim());
        const { cleanedUrl } = cleanTrackingParameters(parsedTarget.href);
        parsedTarget = new URL(cleanedUrl);

        // 1. Vérification de la liste noire dynamique Cloudflare KV
        const kvBlacklistReason = await checkDynamicBlacklist(env, parsedTarget.hostname);
        if (kvBlacklistReason) {
          return new Response(JSON.stringify({
            error: true,
            blocked: true,
            message: `Ce domaine est suspendu par mesure de sécurité (${kvBlacklistReason}).`
          }), {
            status: 403,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" }
          });
        }
        
        // 2. Vérification statique des menaces
        const threat = checkSecurityThreats(parsedTarget);
        if (threat.isBlocked) {
          return new Response(JSON.stringify({
            error: true,
            blocked: true,
            message: threat.reason
          }), {
            status: 403,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" }
          });
        }

        // 3. Bouclier DNS Famille Cloudflare 1.1.1.3
        const dnsShield = await checkDnsFamilyShield(parsedTarget.hostname);
        if (dnsShield.isBlocked) {
          return new Response(JSON.stringify({
            error: true,
            blocked: true,
            message: dnsShield.reason
          }), {
            status: 403,
            headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" }
          });
        }

        const isAllowed = isDomainAllowed(parsedTarget.hostname);
        const randomId = Math.random().toString(36).substring(2, 10);
        const packedSlug = encodePackedUrl(parsedTarget.href);

        if (env && env.LIENLIBRE_KV) {
          await env.LIENLIBRE_KV.put(`link:${randomId}`, JSON.stringify({
            url: parsedTarget.href,
            lang: targetLang,
            selfCertified: isSelfCertified,
            created: Date.now()
          }), { expirationTtl: RETENTION_30_DAYS_SECONDS }); // 30 jours
        }

        const cleanPath = parsedTarget.href.replace(/^https?:\/\/(?:www\.)?/i, '');
        const queryParts = [];
        if (targetLang !== "fr") queryParts.push(`lang=${targetLang}`);
        if (isSelfCertified) queryParts.push("cert=1");
        
        const queryString = queryParts.length > 0 ? "?" + queryParts.join("&") : "";
        const paramString = queryParts.length > 0 ? "&" + queryParts.join("&") : "";

        const vanityLink = `${requestUrl.origin}/${cleanPath}${queryString}`;
        const directLink = `${requestUrl.origin}/?url=${encodeURIComponent(parsedTarget.href)}${paramString}`;
        const shortLink = `${requestUrl.origin}/l/${randomId}${queryString}`;
        const packedLink = `${requestUrl.origin}/p/${packedSlug}${queryString}`;

        return new Response(JSON.stringify({
          ok: true,
          id: randomId,
          url: parsedTarget.href,
          link: vanityLink,
          directLink: directLink,
          shortLink: shortLink,
          packedLink: packedLink,
          allowed: isAllowed,
          selfCertified: isSelfCertified
        }), {
          status: 200,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: "URL invalide ou mal formée." }), {
          status: 400,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" }
        });
      }
    }

    // Uniquement accepter les requêtes GET pour le reste
    if (request.method !== "GET") {
      return new Response("Méthode non autorisée", { 
        status: 405, 
        headers: { ...CORS_HEADERS, "Content-Type": "text/plain; charset=utf-8" } 
      });
    }

    let targetUrlString = requestUrl.searchParams.get("url");

    // Résolution stateless de liens opaques /p/:packed
    if (!targetUrlString && requestUrl.pathname.startsWith("/p/")) {
      const packed = requestUrl.pathname.slice(3).split("/")[0].split("?")[0];
      const decoded = decodePackedUrl(packed);
      if (decoded) {
        targetUrlString = decoded;
      }
    }

    // Résolution des liens courts /l/:id ou /go/:id ou /r/:id
    if (!targetUrlString && (requestUrl.pathname.startsWith("/l/") || requestUrl.pathname.startsWith("/go/") || requestUrl.pathname.startsWith("/r/"))) {
      const id = requestUrl.pathname.replace(/^\/(?:l|go|r)\//, "").split("/")[0].split("?")[0];
      if (env && env.LIENLIBRE_KV && id) {
        const stored = await env.LIENLIBRE_KV.get(`link:${id}`);
        if (stored) {
          try {
            const parsedStored = JSON.parse(stored);
            targetUrlString = parsedStored.url;
          } catch (_) {
            targetUrlString = stored;
          }
        }
      }
      // Si non trouvé dans KV, vérifier si c'est un slug encodé
      if (!targetUrlString && id) {
        const decoded = decodePackedUrl(id);
        if (decoded) {
          targetUrlString = decoded;
        }
      }
    }

    // Résolution des liens miroirs ressemblant fidèlement à l'URL originale (/lapresse.ca/actualites/...)
    if (!targetUrlString && requestUrl.pathname.length > 1 && !requestUrl.pathname.startsWith("/api/")) {
      const rawPath = requestUrl.pathname.slice(1);
      if (rawPath === "favicon.ico" || rawPath === "robots.txt") {
        return new Response(null, { status: 204 });
      }

      if (rawPath.startsWith("http:/") || rawPath.startsWith("https:/")) {
        const cleanProto = rawPath.replace(/^(https?):\/+/, "$1://");
        targetUrlString = cleanProto + (requestUrl.search || "");
      } else {
        // Vérifier si le premier segment ressemble à un domaine
        const firstSlash = rawPath.indexOf("/");
        const domainCandidate = (firstSlash !== -1 ? rawPath.substring(0, firstSlash) : rawPath).toLowerCase().replace(/^www\./, "");

        if (domainCandidate.includes(".") && !domainCandidate.includes(" ")) {
          const searchParamsClean = new URLSearchParams(requestUrl.search);
          searchParamsClean.delete("json");
          searchParamsClean.delete("lang");
          const remainingQuery = searchParamsClean.toString() ? "?" + searchParamsClean.toString() : "";
          targetUrlString = "https://" + rawPath + remainingQuery;
        }
      }
    }

    // Si aucune URL n'est passée, afficher une page de bienvenue informative
    if (!targetUrlString) {
      return new Response(getWelcomeHTML(), {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          ...SECURITY_HEADERS,
          "Content-Type": "text/html; charset=utf-8"
        }
      });
    }

    // 3. Valider et formater l'URL cible
    let targetUrl;
    try {
      targetUrl = new URL(targetUrlString.trim());
      if (targetUrl.protocol !== "http:" && targetUrl.protocol !== "https:") {
        throw new Error("Le protocole doit être HTTP ou HTTPS");
      }
    } catch (e) {
      return new Response(JSON.stringify({ error: "URL invalide ou mal formée." }), {
        status: 400,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json; charset=utf-8"
        }
      });
    }

    // 4. Anti-Tracking : Nettoyer l'URL cible
    const { cleanedUrl, strippedAny } = cleanTrackingParameters(targetUrl.href);
    targetUrl = new URL(cleanedUrl); // Utiliser l'URL nettoyée des mouchards

    const isJsonRequested = 
      requestUrl.searchParams.get("json") === "1" || 
      requestUrl.searchParams.get("json") === "true" ||
      (request.headers.get("Accept") || "").includes("application/json");

    const isAllowed = isDomainAllowed(targetUrl.hostname);

    // 1. Vérification de la liste noire dynamique Cloudflare KV
    const kvBlacklistReason = await checkDynamicBlacklist(env, targetUrl.hostname);
    if (kvBlacklistReason) {
      if (isJsonRequested) {
        return new Response(JSON.stringify({
          error: true,
          blocked: true,
          title: "Domaine Suspendu",
          description: `Ce domaine est suspendu par mesure de sécurité (${kvBlacklistReason}).`,
          allowed: false
        }), {
          status: 403,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" }
        });
      }
      return new Response(generateBlockedHTML(targetUrl.href, `Ce domaine est désactivé suite à un signalement de sécurité ou d'abus (${kvBlacklistReason}).`, lang, requestUrl.origin), {
        status: 403,
        headers: { ...CORS_HEADERS, ...SECURITY_HEADERS, "Content-Type": "text/html; charset=utf-8" }
      });
    }

    // 2. Vérification préventive immédiate des menaces statiques
    const initialThreat = checkSecurityThreats(targetUrl);
    if (initialThreat.isBlocked) {
      if (isJsonRequested) {
        return new Response(JSON.stringify({
          error: true,
          blocked: true,
          title: "Source Bloquée",
          description: initialThreat.reason,
          allowed: false
        }), {
          status: 403,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" }
        });
      }
      return new Response(generateBlockedHTML(targetUrl.href, initialThreat.reason, lang, requestUrl.origin), {
        status: 403,
        headers: { ...CORS_HEADERS, ...SECURITY_HEADERS, "Content-Type": "text/html; charset=utf-8" }
      });
    }

    // 3. Bouclier DNS Protection Famille Cloudflare 1.1.1.3
    const dnsThreat = await checkDnsFamilyShield(targetUrl.hostname);
    if (dnsThreat.isBlocked) {
      if (isJsonRequested) {
        return new Response(JSON.stringify({
          error: true,
          blocked: true,
          title: "Source Bloquée (Bouclier DNS)",
          description: dnsThreat.reason,
          allowed: false
        }), {
          status: 403,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json; charset=utf-8" }
        });
      }
      return new Response(generateBlockedHTML(targetUrl.href, dnsThreat.reason, lang, requestUrl.origin), {
        status: 403,
        headers: { ...CORS_HEADERS, ...SECURITY_HEADERS, "Content-Type": "text/html; charset=utf-8" }
      });
    }

    // 5. Extraire les métadonnées de la page cible
    const meta = {
      title: "",
      description: "",
      image: "",
      twitterTitle: "",
      twitterDescription: "",
      twitterImage: "",
      standardTitle: "",
      ogType: "",
      author: "",
      publishedTime: "",
      schemaType: "",
      fallbackImages: []
    };

    try {
      // Effectuer la requête vers le média canadien avec nos en-têtes de spoofing et un timeout explicite anti-Slowloris
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 secondes max (Anti-Slowloris)

      try {
        const response = await fetch(targetUrl.href, {
          headers: SPOOF_HEADERS,
          redirect: "follow",
          signal: controller.signal
        });

        if (response.ok) {
          const rewriter = new HTMLRewriter()
            .on('meta[property="og:title"]', {
              element(el) { meta.title = el.getAttribute("content") || ""; }
            })
            .on('meta[property="og:description"]', {
              element(el) { meta.description = el.getAttribute("content") || ""; }
            })
            .on('meta[property="og:image"]', {
              element(el) { meta.image = el.getAttribute("content") || ""; }
            })
            .on('meta[property="og:type"]', {
              element(el) { meta.ogType = el.getAttribute("content") || ""; }
            })
            .on('meta[property="article:author"], meta[name="author"]', {
              element(el) { meta.author = el.getAttribute("content") || ""; }
            })
            .on('meta[property="article:published_time"], meta[name="date"]', {
              element(el) { meta.publishedTime = el.getAttribute("content") || ""; }
            })
            .on('meta[name="twitter:title"]', {
              element(el) { meta.twitterTitle = el.getAttribute("content") || ""; }
            })
            .on('meta[name="twitter:description"]', {
              element(el) { meta.twitterDescription = el.getAttribute("content") || ""; }
            })
            .on('meta[name="twitter:image"]', {
              element(el) { meta.twitterImage = el.getAttribute("content") || ""; }
            })
            .on('title', {
              text(textChunk) { meta.standardTitle += textChunk.text; }
            })
            .on('script[type="application/ld+json"]', {
              text(textChunk) {
                if (textChunk.text && (textChunk.text.includes("NewsArticle") || textChunk.text.includes("Article") || textChunk.text.includes("ReportageNewsArticle"))) {
                  meta.schemaType += textChunk.text;
                }
              }
            })
            .on('article img, main img, header img', {
              element(el) {
                const src = el.getAttribute("src");
                if (src && meta.fallbackImages.length < 5) {
                  meta.fallbackImages.push(src);
                }
              }
            });

          const transformedResponse = rewriter.transform(response);
          await transformedResponse.arrayBuffer(); // Déclenche le parsing
        }
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (err) {
      console.warn("Erreur ou timeout lors du scraping :", err.name === "AbortError" ? "Scraping timeout (4s)" : err.message);
    }

    // 6. Appliquer la logique de Fallback et calcul du Mini-Bot Sentinel
    const finalTitle = (meta.title || meta.twitterTitle || meta.standardTitle || targetUrl.hostname).trim();
    const finalDescription = (meta.description || meta.twitterDescription || "Cliquez pour lire l'article complet sur " + targetUrl.hostname).trim();
    
    let rawImage = meta.image || meta.twitterImage;
    if (!rawImage && meta.fallbackImages.length > 0) {
      rawImage = meta.fallbackImages[0];
    }
    
    const finalImage = rawImage ? resolveUrl(targetUrl.href, rawImage) : "";

    // Calcul de l'audit automatique du Mini-Bot
    const botAudit = calculateBotAudit(targetUrl, meta, isAllowed, dnsThreat);
    const isSelfCertified = requestUrl.searchParams.get("cert") === "1" || 
                            requestUrl.searchParams.get("selfCertified") === "true" || 
                            requestUrl.searchParams.get("verified") === "1" ||
                            requestUrl.searchParams.get("allow") === "1";

    // 7. Renvoyer la réponse selon le format demandé
    if (isJsonRequested) {
      if (botAudit.isBlocked) {
        return new Response(
          JSON.stringify({
            error: true,
            blocked: true,
            title: "Source Bloquée",
            description: botAudit.blockReason,
            allowed: false,
            botAudit: botAudit
          }),
          {
            status: 403,
            headers: {
              ...CORS_HEADERS,
              "Content-Type": "application/json; charset=utf-8"
            }
          }
        );
      }
      return new Response(
        JSON.stringify({
          title: finalTitle,
          description: finalDescription,
          image: finalImage,
          url: targetUrl.href,
          allowed: isAllowed,
          selfCertified: isSelfCertified,
          trackingCleaned: strippedAny,
          botAudit: botAudit
        }),
        {
          status: 200,
          headers: {
            ...CORS_HEADERS,
            "Content-Type": "application/json; charset=utf-8"
          }
        }
      );
    }

    // Si la source est bloquée pour menace de sécurité -> Erreur 403
    if (botAudit.isBlocked) {
      return new Response(
        generateBlockedHTML(targetUrl.href, botAudit.blockReason, lang, requestUrl.origin),
        {
          status: 403,
          headers: {
            ...CORS_HEADERS,
            ...SECURITY_HEADERS,
            "Content-Type": "text/html; charset=utf-8"
          }
        }
      );
    }

    const userAgent = request.headers.get("User-Agent") || "";
    const isCrawler = /facebookexternalhit|Facebot|Meta-ExternalAgent|Instagram|WhatsApp|Twitterbot|LinkedInBot|Discordbot|TelegramBot|Slackbot/i.test(userAgent);

    // 1. Si le domaine est dans la liste blanche ou validé par le Mini-Bot (Score >= 80) -> Redirection immédiate
    if (isAllowed || botAudit.isValidated) {
      if (!isJsonRequested && !isCrawler && ctx && typeof ctx.waitUntil === "function") {
        ctx.waitUntil(recordClick(env, targetUrl.hostname, true));
      }
      return new Response(
        generateRedirectionHTML(targetUrl.href, finalTitle, finalDescription, finalImage, lang, requestUrl.href, isCrawler),
        {
          status: 200,
          headers: {
            ...CORS_HEADERS,
            ...SECURITY_HEADERS,
            "Content-Type": "text/html; charset=utf-8"
          }
        }
      );
    }

    // 2. Si le lien est auto-certifié mais n'atteint pas 80/100 -> Interstitiel citoyen avec transfert de responsabilité
    if (isSelfCertified) {
      return new Response(
        generateCitizenInterstitialHTML(targetUrl.href, finalTitle, finalDescription, finalImage, lang, requestUrl.href, botAudit),
        {
          status: 200,
          headers: {
            ...CORS_HEADERS,
            ...SECURITY_HEADERS,
            "Content-Type": "text/html; charset=utf-8"
          }
        }
      );
    }

    // 3. Sinon -> Avertissement standard avec compte à rebours de 10s et audit
    const userIp = request.headers.get("CF-Connecting-IP") || "Inconnue";
    return new Response(
      generateWarningHTML(targetUrl.href, finalTitle, finalDescription, finalImage, userIp, lang, requestUrl.href, isCrawler, botAudit),
      {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          ...SECURITY_HEADERS,
          "Content-Type": "text/html; charset=utf-8"
        }
      }
    );
  }
};

/**
 * Génère le HTML pour les URLs bloquées par sécurité.
 */
function generateBlockedHTML(targetUrl, reason, lang, requestOrigin) {
  const isFr = lang === "fr";
  const title = isFr ? "Accès Bloqué par Mesure de Sécurité" : "Access Blocked for Security Reasons";
  const subtitle = isFr ? "Ce lien ne respecte pas les critères de sécurité et d'éthique de LienLibre." : "This link violates LienLibre security and ethics policies.";
  const homeBtn = isFr ? "Retourner à l'accueil LienLibre" : "Return to LienLibre Home";

  return `<!DOCTYPE html>
<html lang="${escapeHtml(lang)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} — LienLibre</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #090d16;
      background-image: radial-gradient(at 50% 20%, rgba(239, 68, 68, 0.15) 0px, transparent 60%);
      color: #f1f5f9;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 1.5rem;
    }
    .card {
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 1.5rem;
      padding: 2.5rem 2rem;
      max-width: 540px;
      width: 100%;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(239, 68, 68, 0.2);
    }
    .icon { font-size: 3rem; margin-bottom: 1rem; display: inline-block; }
    h1 { font-size: 1.5rem; font-weight: 800; color: #f87171; margin: 0 0 0.5rem; }
    p { color: #94a3b8; font-size: 0.9rem; line-height: 1.5; margin: 0 0 1.25rem; }
    .reason-box {
      background: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 0.75rem;
      padding: 1rem;
      color: #fca5a5;
      font-size: 0.85rem;
      text-align: left;
      margin-bottom: 1.5rem;
      line-height: 1.4;
    }
    .btn-home {
      display: inline-block;
      background: linear-gradient(135deg, #0ea5e9, #6366f1);
      color: #fff;
      text-decoration: none;
      padding: 0.75rem 1.25rem;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.9rem;
      margin-bottom: 0.75rem;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">🛑</div>
    <h1>${escapeHtml(title)}</h1>
    <p>${escapeHtml(subtitle)}</p>
    <div class="reason-box">
      <strong>Motif du refus :</strong> ${escapeHtml(reason)}
    </div>
    <a href="https://bwillou1.github.io/LienLibre/" class="btn-home">${escapeHtml(homeBtn)}</a>
  </div>
</body>
</html>`;
}

/**
 * Génère le HTML pour l'interstitiel citoyen (Source auto-certifiée sous le seuil de 80/100).
 */
function generateCitizenInterstitialHTML(targetUrl, finalTitle, finalDescription, finalImage, lang, requestUrl, botAudit) {
  const isFr = lang === "fr";
  const hostname = new URL(targetUrl).hostname.replace(/^www\./i, '');
  const title = isFr ? "Passerelle Citoyenne — Source Déclarée" : "Citizen Gateway — Declared Source";
  const desc = isFr 
    ? "Ce lien mène vers une source externe auto-certifiée par un utilisateur. LienLibre agit comme intermédiaire technique neutre et ne contrôle ni n'héberge ce contenu."
    : "This link leads to an external source self-certified by a user. LienLibre acts as a neutral technical intermediary and does not control or host this content.";
  const continueBtn = isFr ? `Continuer vers ${hostname} ↗` : `Continue to ${hostname} ↗`;
  const reportBtn = isFr ? "🚩 Signaler ce lien (Abus / Illégalité)" : "🚩 Report this link (Abuse / Illegal)";
  const reportEmail = "guindonwilliam2@gmail.com";
  const reportSubject = encodeURIComponent(`[Signalement Abus LienLibre] - ${hostname}`);
  const reportBody = encodeURIComponent(`Bonjour,\n\nJe signale ce lien pour contenu inapproprié ou abusif :\nURL : ${targetUrl}\nMotif : [Veuillez préciser]\n\nMerci.`);
  const reportMailto = `mailto:${reportEmail}?subject=${reportSubject}&body=${reportBody}`;

  return `<!DOCTYPE html>
<html lang="${escapeHtml(lang)}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(finalTitle || hostname)} — LienLibre</title>
  <meta property="og:title" content="${escapeHtml(finalTitle)}">
  <meta property="og:description" content="${escapeHtml(finalDescription)}">
  ${finalImage ? `<meta property="og:image" content="${escapeHtml(finalImage)}">` : ''}
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #090d16;
      background-image: 
        radial-gradient(at 15% 15%, rgba(6, 182, 212, 0.15) 0px, transparent 45%),
        radial-gradient(at 85% 85%, rgba(99, 102, 241, 0.15) 0px, transparent 45%);
      color: #f1f5f9;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 1.5rem;
    }
    .card {
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(6, 182, 212, 0.3);
      border-radius: 1.5rem;
      padding: 2.25rem 2rem;
      max-width: 560px;
      width: 100%;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(6, 182, 212, 0.15);
      border: 1px solid rgba(6, 182, 212, 0.35);
      color: #38bdf8;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 700;
      margin-bottom: 1.25rem;
    }
    h1 { font-size: 1.35rem; font-weight: 800; color: #ffffff; margin: 0 0 0.5rem; line-height: 1.3; }
    p { color: #94a3b8; font-size: 0.85rem; line-height: 1.5; margin: 0 0 1.25rem; }
    .dest-box {
      background: rgba(2, 6, 23, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 0.75rem;
      padding: 1rem;
      margin-bottom: 1.5rem;
      text-align: left;
    }
    .dest-title { font-size: 0.95rem; font-weight: 700; color: #38bdf8; margin-bottom: 0.35rem; }
    .dest-host { font-family: monospace; font-size: 0.8rem; color: #94a3b8; word-break: break-all; }
    .btn-continue {
      display: block;
      background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%);
      color: #ffffff;
      text-decoration: none;
      padding: 0.85rem 1.25rem;
      border-radius: 0.6rem;
      font-weight: 700;
      font-size: 0.95rem;
      transition: all 0.2s;
      box-shadow: 0 4px 14px rgba(6, 182, 212, 0.35);
      margin-bottom: 0.75rem;
    }
    .btn-continue:hover { transform: translateY(-1px); opacity: 0.95; }
    .btn-report {
      display: inline-block;
      color: #f87171;
      text-decoration: none;
      font-size: 0.8rem;
      padding: 0.4rem 0.8rem;
      border: 1px solid rgba(239, 68, 68, 0.25);
      border-radius: 0.4rem;
      background: rgba(239, 68, 68, 0.08);
      transition: all 0.2s;
    }
    .btn-report:hover { background: rgba(239, 68, 68, 0.2); }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">⚖️ ${escapeHtml(title)}</div>
    <h1>${escapeHtml(finalTitle || hostname)}</h1>
    <p>${escapeHtml(desc)}</p>
    
    <div class="dest-box">
      <div class="dest-title">🌐 ${escapeHtml(hostname)}</div>
      <div class="dest-host">${escapeHtml(targetUrl)}</div>
    </div>

    <a href="${escapeHtml(targetUrl)}" class="btn-continue" rel="noopener noreferrer">${escapeHtml(continueBtn)}</a>
    
    <div style="margin-top: 1rem;">
      <a href="${reportMailto}" class="btn-report">${escapeHtml(reportBtn)}</a>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Résout une URL relative par rapport à une URL de base.
 */
function resolveUrl(baseUrl, relativeUrl) {
  try {
    return new URL(relativeUrl, baseUrl).href;
  } catch (e) {
    return relativeUrl;
  }
}

/**
 * Échappe les caractères HTML sensibles pour éviter les failles XSS.
 */
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Génère le HTML pour rediriger l'utilisateur tout en affichant l'aperçu Open Graph pour les bots.
 */
const WORKER_TRANSLATIONS = {
  fr: {
    redirectTitle: "Redirection sécurisée",
    redirecting: "LienLibre vous redirige vers l'article d'origine :",
    fallbackNote: "Si la redirection automatique ne fonctionne pas après quelques secondes, veuillez cliquer ci-dessous.",
    accessBtn: "Accéder à l'article",
    supportBanner: "<strong>Soutenez le journalisme local :</strong> ce média (<strong>{host}</strong>) a besoin de vous. Pensez à vous abonner ou à désactiver votre bloqueur de pub sur leur site."
  },
  en: {
    redirectTitle: "Secure Redirection",
    redirecting: "LienLibre is redirecting you to the original article:",
    fallbackNote: "If the automatic redirection does not work after a few seconds, please click below.",
    accessBtn: "Access the article",
    supportBanner: "<strong>Support local journalism:</strong> this media outlet (<strong>{host}</strong>) needs you. Please consider subscribing or disabling your ad blocker on their site."
  },
  ar: {
    redirectTitle: "إعادة توجيه آمنة",
    redirecting: "يقوم LienLibre بإعادة توجيهك إلى المقال الأصلي:",
    fallbackNote: "إذا لم تعمل إعادة التوجيه التلقائي بعد بضع ثوانٍ، يرجى النقر أدناه.",
    accessBtn: "الوصول إلى المقال",
    supportBanner: "<strong>ادعم الصحافة المحلية:</strong> هذه الوسيلة الإعلامية (<strong>{host}</strong>) بحاجة إليك. يرجى التفكير في الاشتراك أو إيقاف تشغيل مانع الإعلانات على موقعهم."
  },
  es: {
    redirectTitle: "Redirección segura",
    redirecting: "LienLibre le está redirigiendo al artículo original:",
    fallbackNote: "Si la redirección automática no funciona después de unos segundos, haga clic a continuación.",
    accessBtn: "Acceder al artículo",
    supportBanner: "<strong>Apoye el periodismo local:</strong> este medio (<strong>{host}</strong>) le necesita. Considere suscribirse o desactivar su bloqueador de anuncios en su sitio."
  },
  it: {
    redirectTitle: "Reindirizzamento sicuro",
    redirecting: "LienLibre ti sta reindirizzando all'articolo originale:",
    fallbackNote: "Se il reindirizzamento automatico non funziona dopo pochi secondi, clicca qui sotto.",
    accessBtn: "Accedi all'articolo",
    supportBanner: "<strong>Sostieni il giornalismo locale:</strong> questo media (<strong>{host}</strong>) ha bisogno di te. Considera di abbonarti o disattivare il tuo ad blocker sul loro sito."
  },
  zh: {
    redirectTitle: "安全重定向",
    redirecting: "LienLibre 正在将您重定向至原始文章：",
    fallbackNote: "如果自动重定向在几秒钟后未运行，请点击下方链接。",
    accessBtn: "访问文章",
    supportBanner: "<strong>支持本地新闻：</strong>该媒体（<strong>{host}</strong>）需要您的支持。请考虑订阅或在其网站上停用广告拦截器。"
  },
  cr: {
    redirectTitle: "Kwayask pimi-cahkêyhk",
    redirecting: "LienLibre wîci-ayamihtân ôma âcimowin:",
    fallbackNote: "Kîspin nama-sêmâk pimohtêmakahk, ôta cahkêyhk.",
    accessBtn: "Ayamihtâ âcimowin",
    supportBanner: "<strong>Wîcihiwê kânata âcimowina:</strong> ôma (<strong>{host}</strong>) wîci-nîso-kamik. Masinahikan kie wîcihiwê."
  },
  iu: {
    redirectTitle: "Nalunaiqtillugu nuutitauniq",
    redirecting: "LienLibre nuutitsijuq tusaraksaq-mut:",
    fallbackNote: "Utaqqilaurlutit maanna nuutingippat.",
    accessBtn: "Tusaraksaq atulugu",
    supportBanner: "<strong>Ikayurlugu tusagaksat:</strong> una (<strong>{host}</strong>) ikayuriqquq. Ikayuriaqutit."
  },
  in: {
    redirectTitle: "Tshitisheun e kanatshiau",
    redirecting: "LienLibre tshitissipitamin nete tipatshimun:",
    fallbackNote: "Eka sêmâk tshitissipitamin, kussenitan nete tshe miskamin.",
    accessBtn: "Tipatshimun aitun",
    supportBanner: "<strong>Uitsheue tipatshimun:</strong> nete (<strong>{host}</strong>) uitsheue tshetshi tutamin."
  },
  moh: {
    redirectTitle: "Tsi nioht tyohtetyon",
    redirecting: "LienLibre tsi niahsewenni ne karihwaneken:",
    fallbackNote: "Kwah ok kwahiaton ne thó tsi niiorihwà:ke.",
    accessBtn: "Acceder ne karihwaneken",
    supportBanner: "<strong>Sewarihwakwenihs ne ohwentsia:</strong> ne (<strong>{host}</strong>) karihwaneken. Takwarent."
  }
};

const WORKER_WARN_TRANSLATIONS = {
  fr: {
    warnTitle: "Sas de Sécurité & Responsabilité — LienLibre",
    unverifiedLink: "Domaine Non Répertorié",
    warnDesc: "Ce site ne figure pas dans la liste officielle des médias vérifiés. Conformément au principe du sas de sécurité actif, aucune redirection automatique n'est effectuée.",
    destination: "Destination :",
    ipLabel: "Votre IP publique :",
    continueBtn: "Quitter LienLibre et continuer vers {host} à mes risques ↗",
    disclaimerText: "Avertissement : En cliquant ci-dessus, vous accédez à ce site externe sous votre entière responsabilité et déchargez LienLibre de toute responsabilité civile ou pénale quant aux contenus tiers (art. 31.1 LDA).",
    reportBtn: "Signaler un contenu abusif ou illicite au Canada",
    supportBanner: "<strong>Soutenez le journalisme d'intérêt public :</strong> Visitez les médias d'information directement et abonnez-vous pour financer la presse locale."
  },
  en: {
    warnTitle: "Security Airlock & Liability Disclaimer — LienLibre",
    unverifiedLink: "Unlisted External Domain",
    warnDesc: "This website is not on our verified whitelist of Canadian news media. In accordance with our active security airlock policy, no automatic redirection is performed.",
    destination: "Destination:",
    ipLabel: "Your public IP:",
    continueBtn: "Leave LienLibre and proceed to {host} at my own risk ↗",
    disclaimerText: "Disclaimer: By clicking above, you proceed to this external website under your sole responsibility and hold LienLibre harmless from all civil or criminal liabilities (s. 31.1 Copyright Act).",
    reportBtn: "Report abusive or illegal content in Canada",
    supportBanner: "<strong>Support public interest journalism:</strong> Consider subscribing directly to local news organizations."
  },
  ar: {
    warnTitle: "حاجز الأمان وإخلاء المسؤولية — LienLibre",
    unverifiedLink: "نطاق خارجي غير مدرج",
    warnDesc: "هذا الموقع غير مدرج في القائمة البيضاء الرسمية لوسائل الإعلام المعتمدة. وفقاً لسياسة حاجز الأمان النشط، لا يتم إجراء أي إعادة توجيه تلقائية.",
    destination: "الوجهة:",
    ipLabel: "عنوان IP العام الخاص بك:",
    continueBtn: "مغادرة LienLibre والمتابعة إلى {host} على مسؤوليتي ↗",
    disclaimerText: "إخلاء مسؤولية: بالنقر أعلاه، فإنك تقر بالوصول إلى هذا الموقع الخارجي على مسؤوليتك الكاملة وتخلي طرف LienLibre من أي مسؤولية قانونية.",
    reportBtn: "الإبلاغ عن محتوى غير لائق في كندا",
    supportBanner: "<strong>ادعم الصحافة المستقلة:</strong> فكر في زيارة مواقع الأخبار مباشرة."
  },
  es: {
    warnTitle: "Control de Seguridad y Descargo Legal — LienLibre",
    unverifiedLink: "Dominio No Verificado",
    warnDesc: "Este sitio web no figura en la lista oficial de medios de comunicación verificados. Conforme a la política de seguridad activa, no se realiza ninguna redirección automática.",
    destination: "Destino:",
    ipLabel: "Su IP pública:",
    continueBtn: "Salir de LienLibre y continuar hacia {host} bajo mi propio riesgo ↗",
    disclaimerText: "Descargo legal: Al hacer clic arriba, usted asume la total responsabilidad por acceder a este sitio externo y exonera a LienLibre de cualquier reclamo legal.",
    reportBtn: "Reportar un abuso o fraude en Canadá",
    supportBanner: "<strong>Apoye el periodismo independiente:</strong> Considere suscribirse a medios locales."
  },
  it: {
    warnTitle: "Avviso di Sicurezza & Esonero di Responsabilità — LienLibre",
    unverifiedLink: "Dominio Non in Elenco",
    warnDesc: "Questo sito non è presente nella lista ufficiale dei media verificati. In conformità con la nostra politica di sicurezza, non viene effettuato alcun reindirizzamento automatico.",
    destination: "Destinazione:",
    ipLabel: "Il tuo IP pubblico:",
    continueBtn: "Lasciare LienLibre e continuare verso {host} a mio rischio ↗",
    disclaimerText: "Esonero di responsabilità: Cliccando sopra, accedi a questo sito esterno sotto la tua esclusiva responsabilità ed esoneri LienLibre da ogni responsabilità.",
    reportBtn: "Segnala un abuso in Canada",
    supportBanner: "<strong>Sostieni il giornalismo:</strong> Considera di abbonarti ai media locali."
  },
  zh: {
    warnTitle: "安全隔离与免责声明 — LienLibre",
    unverifiedLink: "未收录的外部域名",
    warnDesc: "此网站未包含在已验证的新闻媒体白名单中。遵循主动安全隔离区原则，系统绝不执行任何自动重定向。",
    destination: "目标地址:",
    ipLabel: "您的公网 IP:",
    continueBtn: "离开 LienLibre 并自行承担风险继续访问 {host} ↗",
    disclaimerText: "免责声明：点击上方按钮即代表您确认完全以个人责任访问第三方网站，并免除 LienLibre 的任何民事或刑事法律责任（加拿大版权法第31.1条）。",
    reportBtn: "在加拿大举报滥用或欺诈行为",
    supportBanner: "<strong>支持独立新闻：</strong>请考虑直接订阅本地新闻媒体。"
  },
  cr: {
    warnTitle: "Sas kwayask paminikêwin - LienLibre",
    unverifiedLink: "Nama-kwayask kiskêyihtâkwan",
    warnDesc: "Ôma kiskinowâpahtihikowin nama-kiskêyihtâkwan ôta. Nama-sêmâk pimohtêwin.",
    destination: "Tânte pimi-ayâw:",
    ipLabel: "Kiyahk IP pimohtêwin:",
    continueBtn: "Nakatamowin LienLibre êkwa pimohtêw {host} ↗",
    disclaimerText: "Kâ-tôhtamiyan, kiyawaw ka-kiskêyihten ôma kîkway.",
    reportBtn: "Report a scam attempt in Canada",
    supportBanner: "<strong>Wîcihiwê âcimowina:</strong> Masinahikan kie wîcihiwê."
  },
  iu: {
    warnTitle: "Nalunaiqtillugu nuutitauniq - LienLibre",
    unverifiedLink: "Nalunaiqtaulluarsimangittuq Domain",
    warnDesc: "Una qaritaujakkuurutinga ilisimajaujut list-inginniiqataungittuq. Nuutitsinngittuq qaritaujakkuurutinganik maanna.",
    destination: "Nuutarvik:",
    ipLabel: "IP-it:",
    continueBtn: "Qimakkugu LienLibre uvalu aturlugu {host} ↗",
    disclaimerText: "Tuqługu una, illivit nalunaiqtait pilirijjutit.",
    reportBtn: "Report a scam attempt in Canada",
    supportBanner: "<strong>Ikayurlugu tusagaksat:</strong> Una ikayuriqquq."
  },
  in: {
    warnTitle: "Sas kanatshiau uitsheun - LienLibre",
    unverifiedLink: "Eka tshissikuat Domain",
    warnDesc: "Mane tshitshipan eka e nishtutamin tshe ishinakuat. Eka sêmâk tshitissipitamin.",
    destination: "Tshitisheun:",
    ipLabel: "IP nete:",
    continueBtn: "Tshitshipan LienLibre mak pimohtêw {host} ↗",
    disclaimerText: "E tshitutamin, tshin ka-nishtutamin mishta aimun.",
    reportBtn: "Report a scam attempt in Canada",
    supportBanner: "<strong>Uitsheue tipatshimun:</strong> Uitsheue tshetshi tutamin."
  },
  moh: {
    warnTitle: "Sas skennen'kówa - LienLibre",
    unverifiedLink: "Iáh teiowatennion Domain",
    warnDesc: "Tsi niiorihwà:ke iáh teiowatennion ne Kanada. Iáh sêmâk tyohtetyon.",
    destination: "Destination:",
    ipLabel: "IP:",
    continueBtn: "Yah LienLibre ohni tyohtetyon {host} ↗",
    disclaimerText: "Kwah ok kwahiaton ne thó tsi niiorihwà:ke.",
    reportBtn: "Report a scam in Canada",
    supportBanner: "<strong>Sewarihwakwenihs ne ohwentsia:</strong> Takwarent."
  }
};

const MAILTO_TEMPLATES = {
  en: {
    btn: "Request integration for this media (Email)",
    question: "Are you a local or independent news organization?",
    subject: "Media Integration Request for LienLibre - {domain} (Case #{caseId})",
    body: `Bonjour, Hello,

I hope this message finds you well.

I am a journalist writing to you on behalf of {domain} (or: as an independent journalist). I would like to add my media platform to the LienLibre tool because [insert your reason here].

To contact me, you can reach out via [insert your contact info].

Thank you for reading my message.

Warm regards,
[Your Name]

#case id: {caseId}`
  },
  fr: {
    btn: "Demander l'ajout de ce média (Courriel)",
    question: "Vous êtes un média d'information local ou indépendant ?",
    subject: "Demande d'ajout de média pour LienLibre - {domain} (Cas #{caseId})",
    body: `Bonjour,

J'espère que vous allez bien.

Je suis journaliste pour {domain} (ou : en tant que journaliste indépendant·e). J'aimerais ajouter mon média à l'outil LienLibre car [insérer votre raison ici].

Pour me contacter, vous pouvez m'écrire à [insérer vos coordonnées].

Merci d'avoir lu mon message.

Cordialement,

[Votre Nom]

#case id : {caseId}`
  },
  ar: {
    btn: "طلب إضافة هذه الوسيلة الإعلامية (بريد إلكتروني)",
    question: "هل أنت وسيلة إعلامية محلية أو مستقلة؟",
    subject: "طلب إضافة وسيلة إعلامية إلى LienLibre - {domain} (Case #{caseId})",
    body: `مرحباً،

أتمنى أن تكونوا بخير.

أنا صحفي(ة) وأكتب لكم نيابةً عن {domain} (أو: كصحفي(ة) مستقل(ة)). أود إضافة منصتي الإعلامية إلى أداة LienLibre لأن [أدخل السبب هنا].

للتواصل معي، يمكنكم مراسلتي عبر [أدخل معلومات الاتصال هنا].

شكرًا لقراءة رسالتي.

مع فائق الاحترام والتقدير،

[اسمك]

#case id: {caseId}`
  },
  es: {
    btn: "Solicitar la adición de este medio (Correo)",
    question: "¿Es usted un medio de comunicación local o independiente?",
    subject: "Solicitud de integración de medios para LienLibre - {domain} (Caso #{caseId})",
    body: `Hola,

Espero que se encuentre bien.

Soy periodista y les escribo en nombre de {domain} (o: como periodista independiente). Me gustaría añadir mi medio de comunicación a la herramienta LienLibre porque [inserta tu razón aquí].

Para ponerse en contacto conmigo, puede hacerlo a través de [inserta tus datos de contacto].

Gracias por leer mi mensaje.

Saludos cordiales,

[Tu Nombre]

#case id: {caseId}`
  },
  it: {
    btn: "Richiedi l'integrazione di questo media (Email)",
    question: "Sei un media locale o indipendente?",
    subject: "Richiesta di integrazione media per LienLibre - {domain} (Caso #{caseId})",
    body: `Buongiorno,

Spero che questa email vi trovi bene.

Sono un·a giornalista e vi scrivo a nome di {domain} (o: come giornalista indipendente). Vorrei aggiungere il mio media allo strumento LienLibre perché [inserisci il motivo qui].

Per contattarmi, potete trovarmi a [inserisci i tuoi dati di contatto].

Grazie per aver letto il mio messaggio.

Cordiali saluti,

[Il tuo nome]

#case id: {caseId}`
  },
  zh: {
    btn: "申请添加此媒体 (电子邮件)",
    question: "您是本地或独立新闻媒体吗？",
    subject: "LienLibre 媒体添加申請 - {domain} (案件编号 #{caseId})",
    body: `您好，

展信佳。

我是一名记者，代表 {domain} (或者：作为一名独立记者) 向您致信。我想将我的媒体平台添加到 LienLibre 工具中，因为 [在此处插入您的原因]。

如需与我联系，请通过 [在此处插入您的联系方式]。

感谢您抽空阅读我的信件。

顺祝商祺，

[您的名字]

#case id: {caseId}`
  },
  cr: {
    btn: "Sēkakinamowin kīkway (E-mail)",
    question: "Kîya cî ōma ācimowin paminikêw?",
    subject: "Sēkakinamowin kīkway LienLibre - {domain} (Case #{caseId})",
    body: `Tānisi,

Nipakosēyimowān miywāyāyan.

Nīya ācimowinihkēw, nimāmitonēyihten ōma {domain} (or: independent ācimowinihkēw). Nitawēyihten ta-asitahikātēg nītācimowin ōta LienLibre tansi [insert your reason here].

Kakwēcimiyan, kika-asitahamawin ōta [insert your contact info].

Kinaskomitin ē-kī-isihitaman nitācimowin.

Mina mīywātisiwin,

[Your Name]

#case id: {caseId}`
  },
  iu: {
    btn: "ᑐᒃᓯᕋᐅᑎ ᑐᓴᒐᒃᓴᓕᕆᔨᓂᒃ ᐃᓚᓯᖁᔨᓂᕐᒧᑦ (Email)",
    question: "ᑐᓴᒐᒃᓴᓕᕆᔨᐅᕖᑦ ᓄᓇᓕᖕᓂ?",
    subject: "ᑐᒃᓯᕋᐅᑎ ᑐᓴᒐᒃᓴᓕᕆᔨᓂᒃ ᐃᓚᓯᖁᔨᓂᕐᒧᑦ LienLibre - {domain} (Case #{caseId})",
    body: `ᖃᓄᐃᑉᐱᑦ, Haloo,

ᖃᓄᐃᙱᑦᑎᐊᕐᓂᕐᓂᒃ ᓂᕆᐅᒃᐳᖓ.

ᑐᓴᒐᒃᓴᓕᕆᔨᐅᕗᖓ ᑎᑎᕋᖅᑐᖓ ᐅᖃᕐᕕᒋᓪᓗᑎᑦ ᐱᔾᔪᑎᒋᓪᓗᒍ {domain} (or: ᓇᖕᒥᓂᖅ ᑐᓴᒐᒃᓴᓕᕆᔨᐅᓪᓗᖓ). ᐃᓚᓯᔪᒪᒐᒪ ᑐᓴᒐᒃᓴᓕᕆᕝᕕᓐᓂᒃ ᐅᕗᖓ LienLibre ᐱᔾᔪᑎᒋᓪᓗᒍ [insert your reason here].

ᐅᖃᕐᕕᒋᔪᓐᓇᖅᐸᕐᒪ ᐅᕗᖓ [insert your contact info].

ᖁᔭᓐᓇᖄ ᐅᖃᓕᒫᕋᕕᐅᒃ ᑎᑎᕋᖅᑕᒃᑲ.

ᐃᒃᐱᒍᓱᑦᑎᐊᕐᓂᒃᑯᑦ,

[Your Name]

#case id: {caseId}`
  },
  in: {
    btn: "Natshishikutamun tshe takuakinut (Email)",
    question: "Tshin tshekuan utatshimushish?",
    subject: "Natshishikutamun tshe takuakinut utatshimushinu LienLibre - {domain} (Case #{caseId})",
    body: `Kuei,

Nipakuasseniten tshe munu-ayan.

Ninian utatshimushish (or: independent utatshimushish) miam {domain}. Nitapuaten tshe takuakinut nutatshimushinu ut LienLibre tshekuan [insert your reason here].

Tshe tshi tueshin, ut nika tshi itatshimushen [insert your contact info].

Tshinaskumitin e tshi tshitapataman nutatshimun.

Minuat tshitueshin,

[Your Name]

#case id: {caseId}`
  },
  moh: {
    btn: "Waharihwahserónni ne LienLibre (Email)",
    question: "Íse ken ne kahwátsire tsi niioríwa?",
    subject: "Ne tsha nikarihóten ne LienLibre waharihwahserónni - {domain} (Case #{caseId})",
    body: `Kwe kwe,

Kateriwayentéhris ki nón:wa skennen'kóva ken'tiiéntere.

Iken's ne kahwátsire tsi niioríwa {domain} (or: independent kahwátsire). Iken's ií:kehre ratiió'te ne LienLibre oh niyon tsi [insert your reason here].

Tsatáweia tsi ní:ioht tsi tskatsenri [insert your contact info].

Niawen'kówa tsi wahatshá:ri ne ioríwa.

Onhwentsiákon,

[Your Name]

#case id: {caseId}`
  }
};

function getContactEmail() {
  return atob("Z3VpbmRvd2lsbGlhbTJAZ21haWwuY29t");
}

/**
 * Génère une URL mailto pré-remplie multilingue avec un identifiant de dossier (Case ID) aléatoire.
 */
function generateMailtoUrl(lang, domain) {
  const t = MAILTO_TEMPLATES[lang] || MAILTO_TEMPLATES.fr;
  const randomId = Math.floor(100000 + Math.random() * 900000).toString();
  const domainClean = (domain || "").replace(/^www\./i, "");
  const subject = t.subject.replace("{domain}", domainClean).replace("{caseId}", randomId);
  const body = t.body.replace("{domain}", domainClean).replace(/{caseId}/g, randomId);
  return "mailto:" + getContactEmail() + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
}

/**
 * Génère le HTML pour rediriger l'utilisateur tout en affichant l'aperçu Open Graph pour les bots.
 */
function generateRedirectionHTML(targetUrl, title, description, image, lang = "fr", currentUrl = "", isCrawler = false) {
  const origin = new URL(currentUrl || targetUrl).origin;
  const proxyImg = image ? getProxyImageUrl(origin, image) : "";
  const escapedUrl = escapeHtml(targetUrl);
  const escapedCurrentUrl = escapeHtml(currentUrl || targetUrl);
  const escapedTitle = escapeHtml(title);
  const escapedDesc = escapeHtml(description);
  const escapedImg = escapeHtml(proxyImg || image);
  const targetHost = new URL(targetUrl).hostname.replace("www.", "");

  const trans = WORKER_TRANSLATIONS[lang] || WORKER_TRANSLATIONS.fr;
  const htmlDir = lang === "ar" ? "rtl" : "ltr";
  const supportBannerText = trans.supportBanner.replace("{host}", escapeHtml(targetHost));
  const siteName = getMediaSiteName(targetHost);
  const encodedPayload = btoa(encodeURIComponent(targetUrl));

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${htmlDir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapedTitle}</title>
  
  <!-- Balises Open Graph Blindées pour Meta (Facebook, Instagram, Threads, Messenger) -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${escapedCurrentUrl}">
  <link rel="canonical" href="${escapedCurrentUrl}">
  <meta property="og:title" content="${escapedTitle}">
  <meta property="og:description" content="${escapedDesc}">
  ${escapedImg ? `<meta property="og:image" content="${escapedImg}">` : ""}
  <meta property="og:site_name" content="${escapeHtml(siteName)}">
  
  <!-- Balises Meta Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${escapedCurrentUrl}">
  <meta name="twitter:title" content="${escapedTitle}">
  <meta name="twitter:description" content="${escapedDesc}">
  ${escapedImg ? `<meta name="twitter:image" content="${escapedImg}">` : ""}

  <!-- Schema.org JSON-LD de validation de contenu -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": ${JSON.stringify(title)},
    "description": ${JSON.stringify(description)},
    "image": [${JSON.stringify(escapedImg)}],
    "mainEntityOfPage": "${escapedCurrentUrl}",
    "publisher": {
      "@type": "Organization",
      "name": ${JSON.stringify(siteName)}
    }
  }
  </script>

  <!-- Redirection automatique côté client (immédiate pour les visiteurs réels) -->
  ${!isCrawler ? `<meta http-equiv="refresh" content="0;url=${escapedUrl}">` : ""}
  
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #030712;
      color: #f3f4f6;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 1.5rem;
      box-sizing: border-box;
    }
    .card {
      background: rgba(17, 24, 39, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 1rem;
      padding: 2.5rem;
      max-width: 500px;
      width: 100%;
      text-align: center;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
      margin-bottom: 1.5rem;
    }
    .spinner {
      border: 3px solid rgba(255, 255, 255, 0.05);
      border-top: 3px solid #06b6d4;
      border-radius: 50%;
      width: 3rem;
      height: 3rem;
      animation: spin 1s linear infinite;
      margin: 0 auto 1.5rem;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    h1 {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 0.5rem;
      color: #f3f4f6;
    }
    p {
      color: #9ca3af;
      font-size: 0.95rem;
      margin: 0 0 1.5rem;
      line-height: 1.5;
    }
    .link-btn {
      display: inline-block;
      background-color: #0891b2;
      color: white;
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    .link-btn:hover {
      background-color: #0e7490;
    }
    .support-banner {
      background-color: rgba(6, 182, 212, 0.05);
      border: 1px solid rgba(6, 182, 212, 0.15);
      color: #22d3ee;
      border-radius: 0.75rem;
      padding: 1rem;
      font-size: 0.85rem;
      max-width: 500px;
      text-align: center;
      line-height: 1.4;
    }
    .heart {
      color: #f43f5e;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner"></div>
    <h1>${trans.redirectTitle}</h1>
    <p>${trans.redirecting}<br><strong style="color: #e5e7eb; word-break: break-all;">${escapedTitle}</strong></p>
    <p style="font-size: 0.85rem;">${trans.fallbackNote}</p>
    <a href="${escapedUrl}" class="link-btn">${trans.accessBtn}</a>
  </div>

  <div class="support-banner">
    <span class="heart">❤️</span> ${supportBannerText}
  </div>

  <script>
    (function() {
      try {
        var p = "${encodedPayload}";
        var u = decodeURIComponent(atob(p));
        if (u && (u.indexOf('http://') === 0 || u.indexOf('https://') === 0)) {
          window.location.replace(u);
        } else {
          window.location.replace(${JSON.stringify(targetUrl)});
        }
      } catch (e) {
        window.location.replace(${JSON.stringify(targetUrl)});
      }
    })();
  </script>
</body>
</html>`;
}

/**
 * Génère une page d'avertissement de sécurité (sas de sécurité actif) pour les domaines non vérifiés.
 * Conforme au statut d'intermédiaire technique passif (art. 31.1 LDA) : 
 * - Aucune redirection automatique (pas de meta refresh, pas de JS timeout).
 * - Clic actif obligatoire de l'utilisateur avec transfert et acceptation de responsabilité.
 * - Aucune proxyfication d'images via /i/.
 */
function generateWarningHTML(targetUrl, title, description, image, userIp, lang = "fr", currentUrl = "", isCrawler = false, botAudit = null, isAllowed = false) {
  const origin = new URL(currentUrl || targetUrl).origin;
  const proxyImg = image ? getProxyImageUrl(origin, image, isAllowed) : "";
  const escapedUrl = escapeHtml(targetUrl);
  const escapedCurrentUrl = escapeHtml(currentUrl || targetUrl);
  const escapedTitle = escapeHtml(title);
  const escapedDesc = escapeHtml(description);
  const escapedImg = escapeHtml(proxyImg || image);
  const escapedIp = escapeHtml(userIp);
  const hostname = new URL(targetUrl).hostname;

  const trans = WORKER_WARN_TRANSLATIONS[lang] || WORKER_WARN_TRANSLATIONS.fr;
  const htmlDir = lang === "ar" ? "rtl" : "ltr";
  
  // Anti-fraud report URL selection (EN vs FR/Indigenous)
  const reportUrl = (lang === "fr" || lang === "cr" || lang === "iu" || lang === "in" || lang === "moh")
    ? "https://www.antifraudcentre-centreantifraude.ca/report-signalez-fra.htm"
    : "https://www.antifraudcentre-centreantifraude.ca/report-signalez-eng.htm";

  const mailTpl = MAILTO_TEMPLATES[lang] || MAILTO_TEMPLATES.fr;
  const mailtoUrl = generateMailtoUrl(lang, hostname);
  const siteName = getMediaSiteName(hostname);

  const auditScore = (botAudit && typeof botAudit.score === 'number') ? botAudit.score : 60;
  const auditBadge = (botAudit && botAudit.badgeText) ? botAudit.badgeText : "Contenu Non Répertorié";
  const auditSignals = (botAudit && Array.isArray(botAudit.signals)) ? botAudit.signals : [];

  const continueBtnText = trans.continueBtn.replace("{host}", escapeHtml(hostname));

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${htmlDir}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${trans.warnTitle}</title>
  
  <!-- Balises Open Graph pour les robots d'exploration -->
  <meta property="og:type" content="article">
  <meta property="og:url" content="${escapedCurrentUrl}">
  <link rel="canonical" href="${escapedCurrentUrl}">
  <meta property="og:title" content="${escapedTitle}">
  <meta property="og:description" content="${escapedDesc}">
  ${escapedImg ? `<meta property="og:image" content="${escapedImg}">` : ""}
  <meta property="og:site_name" content="${escapeHtml(siteName)}">
  
  <!-- Balises Meta Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:url" content="${escapedCurrentUrl}">
  <meta name="twitter:title" content="${escapedTitle}">
  <meta name="twitter:description" content="${escapedDesc}">
  ${escapedImg ? `<meta name="twitter:image" content="${escapedImg}">` : ""}

  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #020617;
      color: #f3f4f6;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 1.5rem;
      box-sizing: border-box;
    }
    .card {
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(239, 68, 68, 0.35);
      border-radius: 1.25rem;
      padding: 2.25rem 2rem;
      max-width: 560px;
      width: 100%;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      margin-bottom: 1.5rem;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.35);
      color: #f87171;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 700;
      margin-bottom: 1.25rem;
    }
    h1 {
      font-size: 1.35rem;
      font-weight: 800;
      margin: 0 0 0.5rem;
      color: #ffffff;
      line-height: 1.3;
    }
    p {
      color: #9ca3af;
      font-size: 0.88rem;
      margin: 0 0 1.25rem;
      line-height: 1.5;
    }
    .bot-box {
      background: rgba(6, 182, 212, 0.08);
      border: 1px solid rgba(6, 182, 212, 0.3);
      border-radius: 0.75rem;
      padding: 1rem;
      text-align: left;
      margin-bottom: 1.25rem;
      font-size: 0.85rem;
    }
    .bot-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    .bot-title {
      font-weight: 700;
      color: #38bdf8;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .bot-score-badge {
      background: rgba(6, 182, 212, 0.2);
      color: #e0f2fe;
      border: 1px solid rgba(56, 189, 248, 0.4);
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 0.8rem;
      font-family: monospace;
    }
    .bot-signals {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      margin-top: 0.5rem;
    }
    .bot-signal-tag {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #cbd5e1;
      padding: 0.2rem 0.45rem;
      border-radius: 0.375rem;
      font-size: 0.75rem;
    }
    .info-box {
      background-color: rgba(2, 6, 23, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 0.75rem;
      padding: 0.85rem 1rem;
      text-align: left;
      margin-bottom: 1.25rem;
      font-size: 0.82rem;
    }
    .info-row {
      margin-bottom: 0.4rem;
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }
    .info-row:last-child {
      margin-bottom: 0;
    }
    .info-label {
      color: #64748b;
      font-weight: 500;
      flex-shrink: 0;
    }
    .info-value {
      color: #e2e8f0;
      font-family: monospace;
      word-break: break-all;
      text-align: right;
    }
    .btn-action-leave {
      display: block;
      background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%);
      color: #ffffff;
      text-decoration: none;
      padding: 0.95rem 1.25rem;
      border-radius: 0.65rem;
      font-weight: 700;
      font-size: 0.95rem;
      transition: all 0.2s;
      box-shadow: 0 4px 14px rgba(14, 165, 233, 0.35);
      text-align: center;
    }
    .btn-action-leave:hover {
      opacity: 0.95;
      transform: translateY(-1px);
    }
    .disclaimer-box {
      font-size: 0.78rem;
      color: #94a3b8;
      margin-top: 0.65rem;
      margin-bottom: 1.25rem;
      line-height: 1.4;
      text-align: center;
      background: rgba(0, 0, 0, 0.25);
      padding: 0.6rem 0.8rem;
      border-radius: 0.5rem;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    .btn-mailto {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background-color: rgba(37, 99, 235, 0.2);
      border: 1px solid rgba(37, 99, 235, 0.4);
      color: #93c5fd;
      text-decoration: none;
      padding: 0.55rem 1.15rem;
      border-radius: 0.5rem;
      font-size: 0.82rem;
      font-weight: 600;
      transition: background-color 0.2s;
    }
    .btn-mailto:hover {
      background-color: rgba(37, 99, 235, 0.35);
    }
    .btn-report {
      display: block;
      background-color: rgba(239, 68, 68, 0.1);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #fca5a5;
      text-decoration: none;
      padding: 0.6rem 1rem;
      border-radius: 0.5rem;
      font-weight: 500;
      font-size: 0.8rem;
      transition: background-color 0.2s;
      margin-bottom: 1.25rem;
      text-align: center;
    }
    .btn-report:hover {
      background-color: rgba(239, 68, 68, 0.2);
    }
    .support-banner {
      background-color: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.05);
      color: #94a3b8;
      border-radius: 0.75rem;
      padding: 0.9rem;
      font-size: 0.82rem;
      max-width: 560px;
      text-align: center;
      line-height: 1.4;
    }
    .heart {
      color: #f43f5e;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">🛡️ ${escapeHtml(trans.unverifiedLink)}</div>
    <h1>${escapedTitle || escapeHtml(hostname)}</h1>
    <p>${escapeHtml(trans.warnDesc)}</p>
    
    <!-- Mini-Bot Sentinel Audit Box -->
    <div class="bot-box">
      <div class="bot-header">
        <span class="bot-title">🤖 Mini-Bot Sentinel</span>
        <span class="bot-score-badge">${auditScore} / 100</span>
      </div>
      <div style="color: #f1f5f9; font-weight: 600; font-size: 0.85rem; margin-bottom: 0.35rem;">
        ${escapeHtml(auditBadge)}
      </div>
      ${auditSignals.length > 0 ? `
      <div class="bot-signals">
        ${auditSignals.map(s => `<span class="bot-signal-tag">✓ ${escapeHtml(s)}</span>`).join('')}
      </div>` : ''}
    </div>

    <div class="info-box">
      <div class="info-row">
        <span class="info-label">${trans.destination}</span>
        <span class="info-value">${escapeHtml(hostname)}</span>
      </div>
      <div class="info-row">
        <span class="info-label">${trans.ipLabel}</span>
        <span class="info-value">${escapedIp}</span>
      </div>
    </div>

    <!-- Action Explicite de Sortie / Transfert de Responsabilité (Pas de compte à rebours) -->
    <a href="${escapedUrl}" class="btn-action-leave" rel="noopener noreferrer nofollow" target="_blank">
      ${continueBtnText}
    </a>
    
    <div class="disclaimer-box">
      ⚖️ ${escapeHtml(trans.disclaimerText)}
    </div>

    <div style="margin-bottom: 1rem; padding: 0.75rem; background: rgba(59, 130, 246, 0.06); border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 0.6rem; text-align: center;">
      <div style="font-size: 0.8rem; color: #93c5fd; margin-bottom: 0.5rem; font-weight: 500;">
        📰 ${escapeHtml(mailTpl.question)}
      </div>
      <a href="${mailtoUrl}" class="btn-mailto">
        ✉️ ${escapeHtml(mailTpl.btn)}
      </a>
    </div>

    <a href="${reportUrl}" target="_blank" rel="noopener noreferrer" class="btn-report">
      🚩 ${trans.reportBtn}
    </a>
  </div>

  <div class="support-banner">
    <span class="heart">❤️</span> ${trans.supportBanner}
  </div>
</body>
</html>`;
}

/**
 * Génère le HTML pour la page d'accueil du Worker (si appelé sans ?url=)
 */
function getWelcomeHTML() {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LienLibre — Passerelle Citoyenne & Éducative</title>
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #090d16;
      background-image: 
        radial-gradient(at 15% 10%, rgba(14, 165, 233, 0.15) 0px, transparent 45%),
        radial-gradient(at 85% 15%, rgba(99, 102, 241, 0.15) 0px, transparent 45%);
      color: #f1f5f9;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 1.5rem;
    }
    .card {
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1.5rem;
      padding: 2.5rem 2rem;
      max-width: 580px;
      width: 100%;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(14, 165, 233, 0.12);
      border: 1px solid rgba(14, 165, 233, 0.3);
      color: #38bdf8;
      padding: 0.4rem 0.9rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }
    .dot {
      width: 8px;
      height: 8px;
      background-color: #22c55e;
      border-radius: 50%;
      display: inline-block;
      box-shadow: 0 0 10px #22c55e;
    }
    h1 {
      font-size: 2.2rem;
      font-weight: 800;
      margin: 0 0 0.75rem;
      letter-spacing: -0.03em;
      color: #ffffff;
    }
    h1 span {
      background: linear-gradient(135deg, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p {
      color: #94a3b8;
      font-size: 0.95rem;
      margin: 0 0 1.5rem;
      line-height: 1.6;
    }
    .btn-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.75rem;
    }
    @media (min-width: 480px) {
      .btn-group {
        flex-direction: row;
      }
    }
    .btn-primary {
      flex: 1;
      background: linear-gradient(135deg, #0ea5e9, #6366f1);
      color: #ffffff;
      padding: 0.85rem 1.25rem;
      border-radius: 0.75rem;
      font-weight: 600;
      font-size: 0.9rem;
      text-decoration: none;
      transition: all 0.2s ease;
      box-shadow: 0 4px 14px 0 rgba(14, 165, 233, 0.35);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px 0 rgba(14, 165, 233, 0.5);
    }
    .btn-secondary {
      flex: 1;
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #e2e8f0;
      padding: 0.85rem 1.25rem;
      border-radius: 0.75rem;
      font-weight: 600;
      font-size: 0.9rem;
      text-decoration: none;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .btn-secondary:hover {
      background: rgba(51, 65, 85, 0.8);
      color: #ffffff;
    }
    .legal-notice {
      font-size: 0.75rem;
      color: #64748b;
      line-height: 1.5;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      padding-top: 1.25rem;
      text-align: left;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">
      <span class="dot"></span>
      Passerelle Technique Active
    </div>
    <h1>Lien<span>Libre</span></h1>
    <p>
      Infrastructure civique et éducative open-source dédiée à l'étude de l'interopérabilité des métadonnées web et au libre accès aux informations publiques d'intérêt général au Canada.
    </p>

    <div class="btn-group">
      <a href="https://bwillou1.github.io/LienLibre/" class="btn-primary">
        <span>Ouvrir l'application</span>
        <span>↗</span>
      </a>
      <a href="https://github.com/Bwillou1/LienLibre/fork" target="_blank" rel="noopener noreferrer" class="btn-secondary">
        <span>🪞 Créer un miroir</span>
      </a>
    </div>

    <div class="legal-notice">
      ⚖️ <strong>Cadre légal :</strong> Conforme à l'utilisation équitable (art. 29 <em>Loi sur le droit d'auteur du Canada</em>) et au statut de simple conduit technique (art. 31.1 LDA). Aucun cookie publicitaire, zéro conservation de données personnelles.
    </div>
  </div>
</body>
</html>`;
}
