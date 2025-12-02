import { Request, RequestOpts } from "../core";
import { GetMessagesResponse, SendMessageResponse } from "../responses";

export class MessageRequest extends Request {
  constructor(opts: RequestOpts) {
    super(opts);
  }

  async sendMessage({
    profileIds,
    text,
    conversationId,
  }: {
    profileIds: string[];
    text: string;
    conversationId?: string;
  }): Promise<SendMessageResponse> {
    const queryParams = {
      action: "create",
    };
    const directMessagePayload = {
      keyVersion: "LEGACY_INBOX",
      conversationCreate: {
        eventCreate: {
          value: {
            "com.linkedin.voyager.messaging.create.MessageCreate": {
              attributedBody: {
                text,
                attributes: [],
              },
              attachments: [],
            },
          },
        },
        subtype: "MEMBER_TO_MEMBER",
        recipients: profileIds,
      },
    };

    const conversationPayload = {
      eventCreate: {
        originToken: "54b3a724-59c5-4cf2-adbd-660483010a87",
        value: {
          "com.linkedin.voyager.messaging.create.MessageCreate": {
            attributedBody: { text, attributes: [] },
            attachments: [],
          },
        },
      },
      dedupeByClientGeneratedToken: false,
    };

    const conversationUrl = `messaging/conversations/${conversationId}/events`;
    const directMessageUrl = "messaging/conversations";

    const payload = conversationId ? conversationPayload : directMessagePayload;
    const url = conversationId ? conversationUrl : directMessageUrl;

    return this.fetchJson<SendMessageResponse>(url, {
      method: "POST",
      body: JSON.stringify(payload),
      queryParams,
    });
  }

  async getMessages({
    conversationId,
    createdBefore,
  }: {
    conversationId: string;
    createdBefore?: Date;
  }) {
    const queryParams = {
      keyVersion: "LEGACY_INBOX",
      ...(createdBefore && { createdBefore: createdBefore.getTime() }),
    };

    return this.fetchJson<GetMessagesResponse>(
      `messaging/conversations/${conversationId}/events`,
      { queryParams }
    );
  }
}
