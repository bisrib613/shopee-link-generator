const { generateAffiliateLink } = require("../lib/affiliate");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (!["GET", "POST"].includes(req.method)) {
    return res.status(405).json({
      success: false,
      error: "Method not allowed. Use GET or POST."
    });
  }

  try {
    let input = req.query?.url || "";
    let affiliateId = req.query?.affiliate_id || "";
    let subId = req.query?.sub_id || "";

    if (req.method === "POST" && req.body) {
      input = req.body.url || input;
      affiliateId = req.body.affiliate_id ?? affiliateId;
      subId = req.body.sub_id || subId;
    }

    if (!input) {
      return res.status(400).json({
        success: false,
        error: "Missing URL. Use ?url=... or POST JSON {\"url\":\"...\"}."
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
      error: error instanceof Error ? error.message : "Failed to generate affiliate link"
    });
  }
};
