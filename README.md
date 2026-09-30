# Shopee Affiliate Link Generator

A lightweight Shopee affiliate link generator with a public API. The default affiliate ID is **11304530178**.

## Features

- Generate Shopee affiliate links from full product URLs.
- Resolve `s.shopee.co.id` short links before generating the affiliate link.
- Keep the original product URL query parameters intact.
- Browser UI for manual use.
- Public JSON API for scripts, apps, automation, and other code.
- No API key, login, session, or authentication header required.
- CORS enabled for cross-origin requests.
- Affiliate ID is optional: an empty or omitted value automatically falls back to **11304530178**.

## Web

Paste a Shopee product URL or short link into the web interface and click **Generate Link**.

The web interface uses affiliate ID **11304530178** by default.

## Public API

The API endpoint is:

```
GET /api/generate?url=<URL>
```

### Affiliate ID

`affiliate_id` is optional.

- **Omitted:** uses **11304530178**.
- **Empty:** uses **11304530178**.
- **Provided:** uses the supplied affiliate ID.

So these are all valid:

```
/api/generate?url=<URL>
/api/generate?url=<URL>&affiliate_id=
/api/generate?url=<URL>&affiliate_id=123456789
```

The same fallback rule applies to GET and POST requests.

## cURL

### 1. Omit affiliate ID — uses the default

```bash
curl "https://YOUR-DOMAIN/api/generate?url=https%3A%2F%2Fshopee.co.id%2Fexample-product"
```

This uses affiliate ID **11304530178**.

### 2. Send an empty affiliate ID — uses the default

```bash
curl "https://YOUR-DOMAIN/api/generate?url=https%3A%2F%2Fshopee.co.id%2Fexample-product&affiliate_id="
```

This also uses affiliate ID **11304530178**.

### 3. Send a custom affiliate ID

```bash
curl "https://YOUR-DOMAIN/api/generate?url=https%3A%2F%2Fshopee.co.id%2Fexample-product&affiliate_id=123456789"
```

This uses the supplied affiliate ID instead of the default.

### 4. Send a custom sub_id

```bash
curl "https://YOUR-DOMAIN/api/generate?url=https%3A%2F%2Fshopee.co.id%2Fexample-product&sub_id=my-campaign"
```

If `sub_id` is omitted or empty, the API uses `kuntyy-link-generator`.

### 5. Send affiliate ID and sub_id together

```bash
curl "https://YOUR-DOMAIN/api/generate?url=https%3A%2F%2Fshopee.co.id%2Fexample-product&affiliate_id=123456789&sub_id=my-campaign"
```

### 6. POST with JSON

```bash
curl -X POST "https://YOUR-DOMAIN/api/generate" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://shopee.co.id/example-product","affiliate_id":"","sub_id":"my-campaign"}'
```

An empty `affiliate_id` in this request falls back to **11304530178**.

No authentication header, API key, or cookie is required for these requests.

## JavaScript

Example with the default affiliate ID:

```js
const productUrl = "https://shopee.co.id/example-product";

const response = await fetch(
  "https://YOUR-DOMAIN/api/generate?url=" + encodeURIComponent(productUrl)
);

const data = await response.json();

console.log(data.affiliateLink);
```

Explicitly send an empty affiliate ID to use the default:

```js
const params = new URLSearchParams({
  url: "https://shopee.co.id/example-product",
  affiliate_id: ""
});

const response = await fetch(
  "https://YOUR-DOMAIN/api/generate?" + params
);

const data = await response.json();

console.log(data.affiliateId); // "11304530178"
```

Use a custom affiliate ID:

```js
const params = new URLSearchParams({
  url: "https://shopee.co.id/example-product",
  affiliate_id: "123456789"
});

const response = await fetch(
  "https://YOUR-DOMAIN/api/generate?" + params
);

const data = await response.json();

console.log(data.affiliateId); // "123456789"
```

### POST

```js
const response = await fetch("https://YOUR-DOMAIN/api/generate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    url: "https://shopee.co.id/example-product",
    affiliate_id: "",
    sub_id: "my-campaign"
  })
});

const data = await response.json();
```

When `affiliate_id` is empty or omitted, the response uses **11304530178**.

## Response

```json
{
  "success": true,
  "affiliateLink": "https://s.shopee.co.id/an_redir?...",
  "originLink": "https://shopee.co.id/example-product",
  "affiliateId": "11304530178",
  "subId": "kuntyy-link-generator"
}
```

## Link format

The generator follows Shopee's documented affiliate short-link pattern using `origin_link`, `affiliate_id`, and `sub_id`.

Shopee documentation:
https://help.shopee.co.id/portal/10/article/184879-[Shopee-Affiliate-Program]-Pedoman-Pembuatan-Link-Pendek-Affiliate

## License

This project is open-sourced under the MIT License.
