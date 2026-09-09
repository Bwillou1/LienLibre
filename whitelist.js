// =============================================================================
// LISTE BLANCHE DES MÉDIAS D'INFORMATION CANADIENS — LienLibre
// ----------------------------------------------------------------------------

export const ALLOWED_DOMAINS = [
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
export const MEDIA_NAMES = {
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
