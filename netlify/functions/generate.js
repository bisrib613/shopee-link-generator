const { generateAffiliateLink } = require("../../lib/affiliate");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
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

function parseBody(event) {
  if (!event.body) return {};

  const contentType =
    event.headers?.["content-type"] ||
    event.headers?.["Content-Type"] ||
    "";

  if (contentType.includes("application/json")) {
    return JSON.parse(event.body);
  }

  if (contentType.includes("application/x-www-form-urlencoded")) {
    return Object.fromEntries(new URLSearchParams(event.body));
  }

  throw new Error(
    "Unsupported Content-Type. Use application/json or application/x-www-form-urlencoded."
  );
}

exports.handler = async function handler(event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: corsHeaders, body: "" };
  }

  if (!["POST", "GET"].includes(event.httpMethod)) {
    return json(405, {
      success: false,
      error: "Method not allowed. Use POST."
    });
  }

  try {
    let input = "";
    let affiliateId = "";
    let subId = "";

    if (event.httpMethod === "POST") {
      const payload = parseBody(event);
      input = payload.url || "";
      affiliateId = payload.affiliate_id ?? "";
      subId = payload.sub_id || "";
    } else {
      input = event.queryStringParameters?.url || "";
      affiliateId = event.queryStringParameters?.affiliate_id || "";
      subId = event.queryStringParameters?.sub_id || "";
    }

    if (!input) {
      return json(400, {
        success: false,
        error: "Missing required parameter: url"
      });
    }

    const result = await generateAffiliateLink(input, affiliateId, subId);

    return json(200, {
      success: true,
      ...result
    });
  } catch (error) {
    return json(400, {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to generate affiliate link"
    });
  }
};
