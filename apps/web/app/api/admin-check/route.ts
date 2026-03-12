export async function POST(req: Request) {

  const { password } = await req.json()

  if(password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD){
    return Response.json({ success:true })
  }

  return Response.json({ success:false })

}
