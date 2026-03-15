export async function GET(){

const end = lastLilithSnapshot()
const start = prevDay(end)

const kingdoms = [2500,2554,3237]

for(const kingdom of kingdoms){

const url =
`https://plat-rok-gametools-global-api.lilithgames.com/api/kindomMember?start=${start}&end=${end}&search=&server_id=${kingdom}`

const r = await fetch(url,{
headers:{
pauthorization:process.env.PAUTH!,
bauthorization:process.env.BAUTH!,
lang:"en_US"
}
})

const data = await r.json()

await fetch(`${process.env.APP_URL}/api/migration-sync`,{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
members:data.data || [],
date:start,
kingdom
})
})

}

return Response.json({success:true})

}
