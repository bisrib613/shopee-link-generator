const { generateAffiliateLink } = require("../lib/affiliate");

function parseBody(req) {
  if (!req.body) return {};

  if (typeof req.body === "object") {
    return req.body;
  }

  const contentType = req.headers?.["content-type"] || "";

  if (contentType.includes("application/json")) {
    return JSON.parse(req.body);
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    return Object.fromEntries(new URLSearchParams(req.body));
  }

  throw new Error(
    "Unsupported Content-Type. Use application/json or application/x-www-form-urlencoded."
  );
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (!["POST", "GET"].includes(req.method)) {
    return res.status(405).json({
      success: false,
      error: "Method not allowed. Use POST."
    });
  }

  try {
    let input = "";
    let affiliateId = "";
    let subId = "";

    if (req.method === "POST") {
      const payload = parseBody(req);
      input = payload.url || "";
      affiliateId = payload.affiliate_id ?? "";
      subId = payload.sub_id || "";
    } else {
      input = req.query?.url || "";
      affiliateId = req.query?.affiliate_id || "";
      subId = req.query?.sub_id || "";
    }

    if (!input) {
      return res.status(400).json({
        success: false,
        error: "Missing required parameter: url"
      });
    }

    const result = await generateAffiliateLink(input, affiliateId, subId);

    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate affiliate link"
    });
  }
};
