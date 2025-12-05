export type Company = {
  callToAction:{
    url?:string
  },
  industry?:Array<{name:string}>
  websiteUrl:string
  universalName:string
}


export type GetCompanyResponse = {
  data?: {
    organizationDashCompaniesByUniversalName?: {
      elements?: Company[]
    }
  }
}