function lastLilithSnapshot() {

  const now = new Date()

  const snapshot = new Date(now)
  snapshot.setUTCHours(2,0,0,0)

  if(now < snapshot){
    snapshot.setUTCDate(snapshot.getUTCDate()-1)
  }

  return snapshot.toISOString().slice(0,10)
}

function prevDay(date:string){

  const d = new Date(date)
  d.setUTCDate(d.getUTCDate()-1)

  return d.toISOString().slice(0,10)
}

export async function GET(){

  const end = lastLilithSnapshot()
  const start = prevDay(end)

  const kingdoms = [2500,2554,3237]

  for(const kingdom of kingdoms){

    console.log("Scanning kingdom:", kingdom)

    const url =
    `https://plat-rok-gametools-global-api.lilithgames.com/api/kindomMember?start=${start}&end=${end}&search=&server_id=${kingdom}`

    let data:any = null

    // retry until snapshot exists
    for(let i = 0; i < 5; i++){

      const r = await fetch(url,{
        headers:{
          pauthorization:process.env.PAUTH!,
          bauthorization:process.env.BAUTH!,
          lang:"en_US"
        }
      })

      data = await r.json()

      if(data?.data?.length > 0){
        console.log("Snapshot ready:", kingdom, data.data.length)
        break
      }

      console.log("Snapshot not ready for", kingdom, "retrying...")

      await new Promise(res => setTimeout(res,60000)) // wait 1 minute
    }

    console.log("Members received:", data?.data?.length)

    await fetch(`${process.env.APP_URL}/api/migration-sync`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        members:data?.data || [],
        date:start,
        kingdom
      })
    })

  }

  return Response.json({success:true})

}
