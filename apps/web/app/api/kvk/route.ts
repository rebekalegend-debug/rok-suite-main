export async function GET() {
  const JWT = process.env.KVK_JWT;

  const headers: Record<string, string> = {
    accept: "*/*",
  };

  // ONLY attach if valid
  if (JWT && JWT.length > 10) {
    headers.Authorization = `Bearer ${JWT}`;
  }

  const res = await fetch(
    "https://beta.prokingdoms.com/proxy-fast/stats/kvk/aggregated/891993",
    {
      headers,
    }
  );

  const data = await res.json();

  return Response.json(data, { status: res.status });
}
