import { LinkedinClient } from "../core/client";
import { Company, GetCompanyResponse } from "../responses/company.get.response";

export class CompanyRepository {
  private client: LinkedinClient;

  constructor({ client }: { client: LinkedinClient }) {
    this.client = client;
  }

  async getCompany({ universalName }: { universalName: string }): Promise<Company | null> {
    const response = await this.client.request.company.getCompany({ universalName });

    if (!response) {
      return null;
    }
    const company = response?.data?.organizationDashCompaniesByUniversalName?.elements?.find(e => e.universalName === universalName)

    return company ? {
      callToAction: company?.callToAction,
      websiteUrl: company?.websiteUrl,
      industry: company?.industry,
      universalName,
    } : null
  }


}
