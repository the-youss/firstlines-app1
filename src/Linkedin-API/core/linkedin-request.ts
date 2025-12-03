import { InvitationRequest } from "../requests/invitation.request";
import { MessageRequest } from "../requests/message.request";
import { ProfileRequest } from "../requests/profile.request";
import { SalesNavRequest } from "../requests/sales-nav-request";
import { SalesNavSearchRequest } from "../requests/sales-nav-search-request";
import { RequestOpts } from "./request";

export type LinkedInRequestOpts = Omit<RequestOpts, "baseURL">;

export class LinkedInRequest {
  private _opts: LinkedInRequestOpts;
  constructor(opts: LinkedInRequestOpts) {
    this._opts = opts;
  }

  get profile() {
    const baseURL = `https://www.linkedin.com/voyager/api/`;
    return new ProfileRequest({ ...this._opts, baseURL });
  }

  get salesnav() {
    const baseURL = `https://www.linkedin.com/sales-api/`;
    return new SalesNavRequest({ ...this._opts, baseURL });
  }
  get salesnavSearch() {
    const baseURL = `https://www.linkedin.com/`;
    return new SalesNavSearchRequest({ ...this._opts, baseURL });
  }

  get message() {
    const baseURL = `https://www.linkedin.com/voyager/api/`;
    return new MessageRequest({ ...this._opts, baseURL });
  }

  get invitation() {
    const baseURL = `https://www.linkedin.com/voyager/api/`;
    return new InvitationRequest({ ...this._opts, baseURL });
  }
}
