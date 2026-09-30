const { generateAffiliateLink } = require("../../lib/affiliate");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json; charset=utf-8"
};

function json(statusCode, body) {
  return {
    statusCode,
    headers: corsHeaders,
    body: JSON.stringify(body)
  };
}

exports.handler = async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (![ "GET", "POST" ].includes(event.httpMethod)) {
    return json(405, {
      success: false,
      error: "Method not allowed. Use GET or POST."
    });
  }

  try {
    let input = event.queryStringParameters?.url || "";
    let subId = event.queryStringParameters?.sub_id || "";

    if (event.httpMethod === "POST" && event.body) {
      const payload = JSON.parse(event.body);
      input = payload.url || input;
      subId = payload.sub_id || subId;
    }

    if (!input) {
      return json(400, {
        success: false,
        error: "Missing URL. Use ?url=... or POST JSON {\"url\":\"...\"}."
      });
    }

    const result = await generateAffiliateLink(input, subId);

    return json(200, {
      success: true,
      ...result
    });
  } catch (error) {
    return json(400, {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate affiliate link"
    });
  }
};
