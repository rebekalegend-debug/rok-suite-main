//get chapter details 891993 is kvk number but it will need another api to get it

export async function GET() {
  const JWT = process.env.KVK_JWT;

  const res = await fetch(
    "https://beta.prokingdoms.com/proxy-fast/stats/kvk/aggregated/891993",
    {
      headers: {
        Authorization: `Bearer ${JWT}`,
        Accept: "*/*",
      },
    }
  );

  const data = await res.json();

  return Response.json(data);
}
