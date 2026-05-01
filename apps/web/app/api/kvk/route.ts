export async function GET() {
  const JWT = process.env.KVK_JWT;

  if (!JWT) {
    return Response.json({ error: "Missing JWT" }, { status: 500 });
  }

  const res = await fetch(
    "https://beta.prokingdoms.com/proxy-fast/stats/kvk/aggregated/891993",
    {
      headers: {
        Authorization: `Bearer ${JWT}`,
        Accept: "*/*",
      },
    }
  );

  if (!res.ok) {
    return Response.json(
      { error: "Upstream API failed" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return Response.json(data);
}
