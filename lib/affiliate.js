const DEFAULT_AFFILIATE_ID = "11304530178";
const DEFAULT_SUB_ID = "kuntyy-social";

const ALLOWED_HOSTS = new Set([
  "shopee.co.id",
  "s.shopee.co.id"
]);

function getAffiliateId(value) {
  const requested = String(value ?? "").trim();
  if (requested) return requested;

  const configured = String(process.env.SHOPEE_AFFILIATE_ID ?? "").trim();
  return configured || DEFAULT_AFFILIATE_ID;
}

function getSubId(value) {
  const candidate = String(value || DEFAULT_SUB_ID).trim();
  if (!candidate) return DEFAULT_SUB_ID;
  return candidate.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 100) || DEFAULT_SUB_ID;
}

function parseAndValidateShopeeUrl(value) {
  let parsed;
  try {
    parsed = new URL(String(value).trim());
  } catch {
    throw new Error("Invalid URL");
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error("Only HTTP(S) URLs are supported");
  }

  const hostname = parsed.hostname.toLowerCase();
  if (!ALLOWED_HOSTS.has(hostname)) {
    throw new Error("Only Shopee Indonesia URLs are supported");
  }

  return parsed;
}

async function expandShopeeUrl(url) {
  const parsed = parseAndValidateShopeeUrl(url);

  if (parsed.hostname !== "s.shopee.co.id") {
    return parsed.toString();
  }

  try {
    let response = await fetch(parsed.toString(), {
      method: "HEAD",
      redirect: "follow"
    });

    if (!response.ok && [400, 403, 405, 429, 500, 502, 503, 504].includes(response.status)) {
      response = await fetch(parsed.toString(), {
        method: "GET",
        redirect: "follow"
      });
    }

    if (!response.url) {
      throw new Error("Could not resolve Shopee short link");
    }

    const finalUrl = parseAndValidateShopeeUrl(response.url);
    return finalUrl.toString();
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Could not resolve Shopee short link");
  }
}

function cleanOriginUrl(url) {
  return String(url).split("?")[0];
}

async function generateAffiliateLink(inputUrl, affiliateId, subId) {
  const expandedUrl = await expandShopeeUrl(inputUrl);
  const cleanedUrl = cleanOriginUrl(expandedUrl);
  const finalAffiliateId = getAffiliateId(affiliateId);
  const finalSubId = getSubId(subId);

  const affiliateLink =
    `https://s.shopee.co.id/an_redir?origin_link=${encodeURIComponent(cleanedUrl)}&affiliate_id=${encodeURIComponent(finalAffiliateId)}&sub_id=${encodeURIComponent(finalSubId)}`;

  return {
    affiliateLink,
    originLink: cleanedUrl,
    affiliateId: finalAffiliateId,
    subId: finalSubId
  };
}

module.exports = {
  DEFAULT_AFFILIATE_ID,
  DEFAULT_SUB_ID,
  generateAffiliateLink,
  parseAndValidateShopeeUrl
};
