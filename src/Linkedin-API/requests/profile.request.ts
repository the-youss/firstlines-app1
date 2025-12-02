import { Request, RequestOpts } from "../core";
import { GetProfileResponse } from "../responses";
import { GetOwnProfileResponse } from "../responses/own-profile.response.get";

export class ProfileRequest extends Request {
  constructor(opts: RequestOpts) {
    super(opts);
  }


  async getOwnProfile(): Promise<GetOwnProfileResponse> {
    return this.fetchJson<GetOwnProfileResponse>("me");
  }

  getProfile({ profileHash }: { profileHash: string }): Promise<GetProfileResponse> {
    const queryParams = {
      q: 'memberIdentity',
      memberIdentity: profileHash,
      decorationId: 'com.linkedin.voyager.dash.deco.identity.profile.FullProfileWithEntities-35',
    };

    return this.fetchJson<GetProfileResponse>('identity/dash/profiles', {
      queryParams,
    });
  }
}
