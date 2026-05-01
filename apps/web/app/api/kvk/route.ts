export async function GET() {
  try {
    const JWT = process.env.KVK_JWT;

    if (!JWT) {
      return Response.json(
        { error: "Missing KVK_JWT env variable" },
        { status: 500 }
      );
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

    const text = await res.text();

    // guard against HTML error pages
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return Response.json(
        {
          error: "Invalid JSON from upstream API",
          preview: text.slice(0, 200),
        },
        { status: 502 }
      );
    }

    if (!res.ok) {
      return Response.json(
        {
          error: "Upstream API error",
          status: res.status,
          data,
        },
        { status: res.status }
      );
    }

    return Response.json(data);
  } catch (err) {
    return Response.json(
      {
        error: "Server crashed",
        detail: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
