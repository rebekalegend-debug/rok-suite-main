function lastLilithSnapshot() {

  const d = new Date()

  d.setUTCDate(d.getUTCDate() - 1)

  return d.toISOString().slice(0,10)

}

function prevDay(date:string){

  const d = new Date(date)
  d.setUTCDate(d.getUTCDate()-1)

  return d.toISOString().slice(0,10)

}

export async function GET(){

  const end = lastLilithSnapshot()

  console.log("Current snapshot:", end)

  // read last processed snapshot from sheet
  const metaRes = await fetch(`${process.env.APP_URL}/api/meta`)
  const meta = await metaRes.json()

  const lastProcessed = meta?.snapshot || null

  console.log("Last processed snapshot:", lastProcessed)

  // skip if already processed
  if(lastProcessed === end){
    console.log("Snapshot already processed. Skipping.")
    return Response.json({ skipped:true })
  }

  const start = prevDay(end)

  console.log("Calling Lilith with:", start, end)

  const kingdoms = [2500,2554,3237]

  for(const kingdom of kingdoms){

    console.log("Scanning kingdom:", kingdom)

    const url =
    `https://plat-rok-gametools-global-api.lilithgames.com/api/kindomMember?start=${start}&end=${end}&search=&server_id=${kingdom}`

    console.log("URL:", url)

    let data:any = null

    // retry until snapshot exists
    for(let i = 0; i < 10; i++){

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

      await new Promise(res => setTimeout(res,60000))
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

  // save snapshot date to sheet
  await fetch(`${process.env.APP_URL}/api/meta`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      snapshot:end
    })
  })

  console.log("Snapshot saved:", end)

  return Response.json({success:true})

}
