import { put } from "@vercel/blob";
import crypto from "node:crypto";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "6mb"
    }
  }
};

export default async function handler(request, response) {
  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { dataUrl } = request.body || {};

    if (
      typeof dataUrl !== "string" ||
      !dataUrl.startsWith("data:image/png;base64,")
    ) {
      return response.status(400).json({ error: "Invalid PNG image" });
    }

    const base64Image = dataUrl.slice("data:image/png;base64,".length);
    const imageBuffer = Buffer.from(base64Image, "base64");

    if (!imageBuffer.length || imageBuffer.length > 5 * 1024 * 1024) {
      return response.status(413).json({ error: "Image must be under 5 MB" });
    }

    const blob = await put(
      `hacker-house-goa/${crypto.randomUUID()}.png`,
      imageBuffer,
      {
        access: "public",
        contentType: "image/png",
        addRandomSuffix: false
      }
    );

    const protocol = request.headers["x-forwarded-proto"] || "https";
    const host = request.headers["x-forwarded-host"] || request.headers.host;
    const shareUrl = `${protocol}://${host}/api/share?image=${encodeURIComponent(blob.url)}`;

    return response.status(200).json({ shareUrl });
  } catch (error) {
    console.error("Share image creation failed:", error);
    return response.status(500).json({ error: "Could not create share image" });
  }
}
