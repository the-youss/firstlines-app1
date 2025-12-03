import { StartExtractionProps } from "@/interface/StartExtractionProps"
import { db } from "@/lib/db"
import { LinkedinClient } from "@/Linkedin-API"
import fs from 'fs'
const run = async () => {
  const payload = await db.extensionPayload.findUnique({
    where: {
      id: "cmipmqka30000ngv49hnluzws"
    }
  })
  if (!payload) {
    return
  }
  const props = payload.payload as unknown as StartExtractionProps
  const url = props.url
  const lk = new LinkedinClient({
    cookies: props.cookies,
    linkedinHeaders: props.headers
  })
  const searchResult = await lk.salesnavSearch.fetchMetas(url,
    // async (args) => {
    //   fs.writeFileSync('search-result.json', JSON.stringify(args, null, 2))
    //   return true
    // }
  )
  console.log('searchResult', searchResult)
}

run()