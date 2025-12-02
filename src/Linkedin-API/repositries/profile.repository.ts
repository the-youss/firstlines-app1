import { LinkedinClient } from "../core/client";
import { GetOwnProfileResponse } from "../responses";

export class ProfileRepository {
  private client: LinkedinClient;

  constructor({ client }: { client: LinkedinClient }) {
    this.client = client;
  }

  async getOwnProfile(): Promise<GetOwnProfileResponse | null> {
    const response = await this.client.request.profile.getOwnProfile();

    const miniProfile = response;

    if (!miniProfile) {
      return null;
    }

    // return this.getProfile(miniProfile);
    return response;
  }
}
