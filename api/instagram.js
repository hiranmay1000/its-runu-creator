const FIELDS = "id,caption,media_type,media_product_type,media_url,thumbnail_url,permalink,timestamp";

// Vercel serverless function. Keep the token on the server: never use VITE_* for it.
export default async function handler(request, response) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID || "me";
  const limit = Math.min(Math.max(Number(request.query.limit) || 8, 1), 24);

  if (!token) return response.status(503).json({ error: "Instagram is not connected yet." });

  const url = new URL(`https://graph.instagram.com/v27.0/${userId}/media`);
  url.searchParams.set("fields", FIELDS);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("access_token", token);

  try {
    const instagramResponse = await fetch(url);
    const data = await instagramResponse.json();
    if (!instagramResponse.ok) return response.status(instagramResponse.status).json({ error: "Instagram request failed." });
    response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return response.status(200).json({ data: data.data ?? [] });
  } catch {
    return response.status(502).json({ error: "Unable to reach Instagram." });
  }
}
