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
- API parameters are sent in the **request body**.
- Affiliate ID is optional: an empty or omitted value automatically falls back to **11304530178**.

## Web

Paste a Shopee product URL or short link into the web interface and click **Generate Link**.

The web interface uses affiliate ID **11304530178** by default.

## Public API

The public API endpoint is:

```
POST /api
```

The endpoint stays short. API parameters are sent in the request body as JSON.

### Request body

```json
{
  "url": "https://shopee.co.id/example-product",
  "affiliate_id": "11304530178",
  "sub_id": "kuntyy-social"
}
```

### Parameters

| Parameter | Required | Default | Description |
| --- | --- | --- | --- |
| `url` | Yes | — | Shopee product URL or `s.shopee.co.id` short link |
| `affiliate_id` | No | `11304530178` | Affiliate ID. Omitted or empty uses the built-in default |
| `sub_id` | No | `kuntyy-social` | Optional tracking sub ID |

## cURL

### Default affiliate ID

The shortest documented request:

```bash
curl -X POST "https://YOUR-DOMAIN/api" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://shopee.co.id/example-product"
  }'
```

Because `affiliate_id` is omitted, the API automatically uses **11304530178**.

### Custom affiliate ID

```bash
curl -X POST "https://YOUR-DOMAIN/api" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://shopee.co.id/example-product",
    "affiliate_id": "123456789"
  }'
```

### Empty affiliate ID

```bash
curl -X POST "https://YOUR-DOMAIN/api" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://shopee.co.id/example-product",
    "affiliate_id": ""
  }'
```

An empty value also falls back to **11304530178**.

### Custom sub ID

```bash
curl -X POST "https://YOUR-DOMAIN/api" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://shopee.co.id/example-product",
    "sub_id": "my-campaign"
  }'
```

### Form-encoded request

For clients that prefer form data, the API also accepts `application/x-www-form-urlencoded`:

```bash
curl "https://YOUR-DOMAIN/api" \
  -d "url=https://shopee.co.id/example-product" \
  -d "affiliate_id=11304530178"
```

## JavaScript

### POST JSON

```js
const response = await fetch("https://YOUR-DOMAIN/api", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    url: "https://shopee.co.id/example-product"
  })
});

const data = await response.json();

console.log(data.affiliateLink);
```

Add optional parameters only when needed:

```js
const response = await fetch("https://YOUR-DOMAIN/api", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    url: "https://shopee.co.id/example-product",
    affiliate_id: "123456789",
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
  "subId": "kuntyy-social"
}
```

## Compatibility

The previous `/api/generate` path remains available as a compatibility alias, but **`/api` is the canonical endpoint and the default documented API path**.

## Link format

The generator follows Shopee's documented affiliate short-link pattern using `origin_link`, `affiliate_id`, and `sub_id`.

Shopee documentation:
https://help.shopee.co.id/portal/10/article/184879-[Shopee-Affiliate-Program]-Pedoman-Pembuatan-Link-Pendek-Affiliate

## License

This project is open-sourced under the MIT License.
