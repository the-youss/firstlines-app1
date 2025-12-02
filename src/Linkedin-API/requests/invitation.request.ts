import { Request, RequestOpts } from "../core";
import { LinkedInRequest } from "../core/linkedin-request";
import { GetReceivedInvitationResponse } from "../responses/received-invitations.response.get";
import { GetSentInvitationResponse } from "../responses/sent-invitations.response.get";

export class InvitationRequest extends Request {
  constructor(opts: RequestOpts) {
    super(opts);
  }

  sendInvitation({
    profileId,
    message,
  }: {
    profileId: string;
    message?: string;
  }): Promise<void> {
    const queryParams = {
      action: "verifyQuotaAndCreateV2",
      decorationId:
        "com.linkedin.voyager.dash.deco.relationships.InvitationCreationResultWithInvitee-2",
    };
    const requestPayload = {
      invitee: {
        inviteeUnion: {
          memberProfile: "urn:li:fsd_profile:" + profileId,
        },
      },
      ...(message && { customMessage: message }),
    };

    return this.fetchJson<any>("voyagerRelationshipsDashMemberRelationships", {
      method: "POST",
      body: JSON.stringify(requestPayload),
      queryParams,
    });
  }

  getReceivedInvitations({
    skip = 0,
    limit = 100,
  } = {}): Promise<GetReceivedInvitationResponse> {
    const queryParams = {
      start: skip,
      count: limit,
      q: "receivedInvitation",
    };

    return this.fetchJson<GetReceivedInvitationResponse>(
      "relationships/invitationViews",
      {
        queryParams,
      }
    );
  }

  getSentInvitations({
    skip = 0,
    limit = 100,
  } = {}): Promise<GetSentInvitationResponse> {
    const queryParams = {
      start: skip,
      count: limit,
      invitationType: "CONNECTION",
      q: "invitationType",
    };

    return this.fetchJson<GetSentInvitationResponse>(
      "relationships/sentInvitationViewsV2",
      {
        queryParams,
      }
    );
  }
}
