import { ProfileRepository } from "../repositries";
import { CompanyRepository } from "../repositries/company.repositry";
import { InvitationRepository } from "../repositries/invitation.repository";
import { MessageRepository } from "../repositries/message.repository";
import { SalesNavSearchRepository } from "../repositries/sales-nav-search.repository";
import { SalesNavRepository } from "../repositries/sales-nav.repository";
import { LinkedInRequest, LinkedInRequestOpts } from "./linkedin-request";

interface ClientOpts extends LinkedInRequestOpts { }

export class LinkedinClient {
  request: LinkedInRequest;

  constructor(opts: ClientOpts) {
    this.request = new LinkedInRequest(opts);
  }

  profile = new ProfileRepository({ client: this });

  salesnav = new SalesNavRepository({ client: this });

  salesnavSearch = new SalesNavSearchRepository({ client: this });

  message = new MessageRepository({ client: this });

  invitation = new InvitationRepository({ client: this });

  company = new CompanyRepository({ client: this });
}
