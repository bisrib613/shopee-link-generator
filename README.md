# Shopee Affiliate Link Generator

A lightweight Shopee affiliate link generator with a public API. The default affiliate ID is **11304530178**.

## Features

- Generate Shopee affiliate links from full product URLs.
- Resolve \`s.shopee.co.id\` short links before generating the affiliate link.
- Keep the original product URL query parameters intact.
- Browser UI for manual use.
- Public JSON API for scripts, apps, automation, and other code.
- No API key or authentication required.
- CORS enabled for cross-origin requests.

## Web

Paste a Shopee product URL or short link into the web interface and click **Generate Link**.

## Public API

The API endpoint is:

\`\`\`
GET /api/generate?url=<URL>
\`\`\`

Example with JavaScript:

\`\`\`js
const productUrl = "https://shopee.co.id/example-product";

const response = await fetch(
  "https://YOUR-DOMAIN/api/generate?url=" + encodeURIComponent(productUrl)
);

const data = await response.json();

console.log(data.affiliateLink);
\`\`\`

Example with cURL:

\`\`\`bash
curl "https://YOUR-DOMAIN/api/generate?url=https%3A%2F%2Fshopee.co.id%2Fexample-product"
\`\`\`

POST is also supported:

\`\`\`js
const response = await fetch("https://YOUR-DOMAIN/api/generate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    url: "https://shopee.co.id/example-product"
  })
});

const data = await response.json();
\`\`\`

### Optional sub_id

Pass a custom \`sub_id\` when needed:

\`\`\`
GET /api/generate?url=<URL>&sub_id=my-campaign
\`\`\`

Without a custom value, the API uses \`kuntyy-link-generator\`.

### Response

\`\`\`json
{
  "success": true,
  "affiliateLink": "https://s.shopee.co.id/an_redir?...",
  "originLink": "https://shopee.co.id/example-product",
  "affiliateId": "11304530178",
  "subId": "kuntyy-link-generator"
}
\`\`\`

No authentication header, API key, or session cookie is required.

## Link format

The generator follows Shopee's documented affiliate short-link pattern using \`origin_link\`, \`affiliate_id\`, and \`sub_id\`.

Shopee documentation:
https://help.shopee.co.id/portal/10/article/184879-[Shopee-Affiliate-Program]-Pedoman-Pembuatan-Link-Pendek-Affiliate

## License

This project is open-sourced under the MIT License.
