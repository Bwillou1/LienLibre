// =============================================================================
// LISTE NOIRE DES DOMAINES BLOQUÉS — LienLibre (Blocklist)
// ----------------------------------------------------------------------------
// Domaines bloqués automatiquement par NextDNS, menaces de sécurité ou score < 75.
// =============================================================================

export const BLOCKED_DOMAINS = [
  // ── Raccourcisseurs & Masquage d'URL ──
  "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd", "buff.ly", "cutt.ly",
  "rb.gy", "shorturl.at", "rebrand.ly", "bl.ink", "tiny.cc", "lnkd.in", "s.id", "v.gd",
  "qr.ae", "trib.al", "linktr.ee", "bc.vc", "adf.ly", "shorte.st", "ouo.io", "clck.ru",
  "rotf.lol", "vzturl.com", "hyperurl.co", "short.io", "soo.gd",

  // ── Hébergement anonyme / Stockage cloud non journalistique ──
  "mega.nz", "mega.io", "anonfiles.com", "gofile.io", "mediafire.com", "rapidgator.net",
  "zippyshare.com", "krakenfiles.com", "1fichier.com", "filecrypt.co", "catbox.moe",
  "pomf2.lain.la", "file.io", "ufile.io", "bayfiles.com", "ddownload.com", "turbobit.net",

  // ── Domaines et Réseaux Publicitaires / Tracking / Maliciels connus ──
  "doubleclick.net", "adservice.google.com", "pagead2.googlesyndication.com",
  "adnxs.com", "criteo.com", "outbrain.com", "taboola.com", "popads.net"
];
