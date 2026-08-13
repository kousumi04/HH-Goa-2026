export default function handler(request, response) {
  const imageUrl = request.query?.image;

  if (!isAllowedBlobUrl(imageUrl)) {
    return response.status(400).send("Invalid share image");
  }

  const safeImageUrl = escapeHtml(imageUrl);
  const description = "I am building for Hacker House Goa @247pmstudio #FameInGoa";

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hacker House Goa 2026</title>
    <meta name="description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Hacker House Goa 2026" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${safeImageUrl}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Hacker House Goa 2026" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${safeImageUrl}" />
    <style>
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #08462d; }
      img { max-width: 95vw; max-height: 95vh; }
    </style>
  </head>
  <body>
    <img src="${safeImageUrl}" alt="Hacker House Goa 2026" />
  </body>
</html>`;

  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.setHeader("Cache-Control", "public, max-age=300");
  return response.status(200).send(html);
}

function isAllowedBlobUrl(value) {
  if (typeof value !== "string") return false;

  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname.endsWith(".public.blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
