import { Request, RequestOpts } from "../core";
import { GetSalesNavProfileResponse } from "../responses/sales-nav/get-profile.response.get";

export class SalesNavRequest extends Request {
  constructor(opts: RequestOpts) {
    super(opts);
  }

  getProfile = async ({
    profileHash,
  }: {
    profileHash: string;
  }): Promise<GetSalesNavProfileResponse> => {
    const queryParams = {
      decoration: this._craftProfileUrlDecoration(),
    };
    return this.fetchJson<GetSalesNavProfileResponse>(
      `salesApiProfiles/(profileId:${profileHash})`,
      {
        queryParams,
        overwriteHeaders: this.overwriteHeaders,
      }
    );
  };

  private _craftProfileUrlDecoration(omitEncode = false) {
    let deco =
      "(firstName,lastName,summary,degree,entityUrn~fs_salesProfile(entityUrn,firstName,lastName,birthDateOn,objectUrn,memberBadges,location,positions*(current,title,companyName,companyUrn~fs_salesCompany(industry,flagshipCompanyUrl,website,employeeCountRange)),educations*(degree,schoolName,fieldsOfStudy)))";
    if (omitEncode !== true) {
      deco = encodeURIComponent(deco)
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29");
    }
    return deco;
  }

  private overwriteHeaders(headers: Headers) {
    delete headers["content-encoding" as keyof typeof headers];
    headers.set("accept", "*/*");
  }
}
