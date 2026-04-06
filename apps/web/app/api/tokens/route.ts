export async function GET() {
  return Response.json({
    pauth: process.env.PAUTH || "",
    bauth: process.env.BAUTH || ""
  })
}
