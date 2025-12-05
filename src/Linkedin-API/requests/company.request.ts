import { Request, RequestOpts } from "../core";
import { GetProfileResponse } from "../responses";
import { GetCompanyResponse } from "../responses/company.get.response";

export class CompanyRequest extends Request {
  constructor(opts: RequestOpts) {
    super(opts);
  }


  getCompany({ universalName }: { universalName: string }): Promise<GetCompanyResponse> {
    const queryParams = {
      includeWebMetadata: 'false',
      variables: `(universalName:${universalName})`,
      queryId: 'voyagerOrganizationDashCompanies.65c62125bce49cdff2acb0d3a0bcb33c',
    };

    return this.fetchJson<GetCompanyResponse>('graphql', {
      queryParams,
    });
  }
}
