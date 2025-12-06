import { linkedinLogs } from "@/api/lib/linkedin-logs";
import fs from "fs";
import { LinkedinCookies, LinkedinCustomHeaders } from "../entities";
import { db } from "@/lib/db";

export interface RequestOpts {
  cookies: LinkedinCookies;
  linkedinHeaders?: LinkedinCustomHeaders;
  baseURL: string;
  userId: string
}

export class Request {
  private _scraperMandatoryDelayBtwnRequestsMaxMs = 2500;
  private _scraperMandatoryDelayBtwnRequestsMinMs = 1200;

  constructor(protected params: RequestOpts) { }

  public async fetchJson<T extends object>(
    endpoint: string,
    init?: RequestInit & {
      queryParams?: Record<string, any>;
      overwriteHeaders?: (headers: Headers) => void;
    }
  ): Promise<T> {
    const baseHeaders = this._buildLinkedinHeaders(this.params.cookies);
    const merged = new Headers(baseHeaders);
    if (this.params.linkedinHeaders) {
      this.params.linkedinHeaders.forEach((v) => {
        merged.set(v.name, v.value);
      });
    }
    const cleanHeaders = this._cleanOutLinkedinHeaders(merged);
    const url = this.buildUrl(endpoint, init?.queryParams);
    console.log(`${new Date().toLocaleString()} :: [Linkedin API::Request] url => ${url}`);
    if (init?.overwriteHeaders) {
      init.overwriteHeaders(cleanHeaders);
    }

    await this.sleepRandomDelayBetweenRequests(url);
    const res = await fetch(url, {
      headers: cleanHeaders,
      ...init,
    });
    let json: T | Record<string, string> = {};
    try {
      json = await res.json();
      fs.writeFileSync("test.json", JSON.stringify(json, null, 2));
    } catch (error) { }
    const error = `Request failed with status ${res.status} ${JSON.stringify(json)}`
    linkedinLogs(this.params.userId, url, json, !res.ok ? { error } : undefined)
    if (!res.ok) {
      throw new Error(
        error
      );
    }

    return json as T;
  }

  private _cleanOutLinkedinHeaders(headers: Headers): Headers {
    const cleaned = new Headers(headers);
    cleaned.delete("content-encoding");
    cleaned.set("accept", "*/*");
    return cleaned;
  }

  // This method simulates browser traces added by website in cookies / http headers
  private _buildLinkedinHeaders = (cookies: LinkedinCookies) => {
    if (!cookies.JSESSIONID) {
      console.warn("missing linkedin cookie JSESSIONID");
    }
    if (!cookies.li_at) {
      console.warn("missing linkedin cookie li_at");
    }
    if (!cookies.li_a) {
      console.log(
        "linkedin cookie li_a is not set, this is a normal use case if user is not a Sales Nav user"
      );
    }

    let cookie = `li_at=${cookies.li_at}; JSESSIONID=${cookies.JSESSIONID};`;

    if (cookies.li_a) {
      cookie += ` li_a=${cookies.li_a}; `;
    }

    // Add LK cookies info to simulate it comes from normal user (https://www.linkedin.com/legal/l/cookie-table)
    // A sort of ID can be used by some cookies, let's simulate one
    const tmpUserId = (cookies.li_at || this._randChar(82)).replace(/_|-/g, "");
    // Browser Identifier cookie to uniquely identify devices accessing LinkedIn to detect abuse on the platform
    cookie +=
      ` bcookie="v=2&` +
      `${tmpUserId.substring(0, 8)}-${tmpUserId.substring(
        0,
        4
      )}-${tmpUserId.substring(0, 4)}-${tmpUserId.substring(
        0,
        4
      )}-${tmpUserId.substring(0, 12)}`.toLocaleLowerCase() +
      `";`;
    // Used for remembering that a logged in user is verified by two factor authentication.
    cookie += ` bscookie="";`;
    // Used to track impressions of LinkedIn alerts, such as the Cookie Banner and to implement cool off periods for display of alerts
    cookie += ` li_alerts=${this._randChar(3)}=;`;
    // No mention by LinkedIn
    cookie += ` AMCVS_${this._randChar(24).toLocaleUpperCase()}%40AdobeOrg=1;`;
    cookie += ` AMCV_${this._randChar(
      24
    ).toLocaleUpperCase()}%40AdobeOrg=-${this._randNum(9)}%7C${this._randChar(
      6
    )}%7C${this._randChar(5)}%7C${this._randChar(5)}%7C${this._randChar(
      38
    )}%7C${this._randChar(7)}-${this._randNum(10)}%7C${this._randNum(
      1
    )}%7C${this._randChar(6)}-${this._randNum(10)}%7C${this._randChar(
      52
    )}%7C${this._randChar(8)}-${this._randNum(
      10
    )}s%7CNONE%7CvVersion%7C5.1.1%7C${this._randChar(6)}%7C-${this._randNum(
      9
    )}; UserMatchHistory=${this._randChar(295)};`;
    // Used to measure ad and campaign performance and conversion rates for Google ads on a site visited
    cookie += ` _gcl_au=1.1.${this._randNum(10)}.${this._randNum(10)};`;
    // Set for ID sync for Adobe Audience Manager
    cookie += ` aam_uuid=${this._randNum(38)};`;
    // Used to make a probabilistic match of a user's identity outside the Designated Countries
    cookie += ` li_sugr=${this._randChar(8)}-${this._randChar(
      4
    )}-${this._randChar(4)}-${this._randChar(4)}-${this._randChar(12)};`;
    // Used to determine what a visitor is doing before they convert on a LinkedIn microsite
    cookie += ` SID=${this._randChar(8)}-${this._randChar(4)}-${this._randChar(
      4
    )}-${this._randChar(4)}-${this._randChar(12)};`;
    // ID associated with a visitor to a LinkedIn microsite which is used to determine conversions for lead gen purposes
    cookie += ` VID=V_2022_09_22_09_${this._randNum(7)};`;
    // Used by Linkedin ads
    const lkAdsTrack = `GCL.${this._randNum(10)}.${this._randChar(
      47
    )}-${this._randChar(43)}`;
    cookie += ` _gcl_aw=${lkAdsTrack};`;
    cookie += ` _gcl_dc=${lkAdsTrack};`;
    // Used to prevent fraud and abuse in payment flows
    cookie += ` __ssid=${this._randChar(8)}-${this._randChar(
      4
    )}-${this._randChar(4)}-${this._randChar(4)}-${this._randChar(12)};`;
    // Unique user identifier to prevent abuse in payment workflows for LinkedIn
    cookie += ` dfpfpt=${this._randChar(32).toLocaleLowerCase()};`;
    // Used to prevent abuse in payment workflows for LinkedIn
    cookie += ` fptctx2=${this._randChar(50)}%25${this._randChar(
      13
    )}%25${this._randChar(27)}%25${this._randChar(38)}%25${this._randChar(
      64
    )}%25${this._randChar(128)}%25${this._randChar(4)}%25${this._randChar(
      21
    )}%25${this._randChar(2)};`;
    // Live agent chat
    cookie += ` liveagent_oref=https://www.linkedin.com/sales/on-boarding/welcome;`;
    cookie += ` liveagent_ptid=${this._randChar(8)}-${this._randChar(
      4
    )}-${this._randChar(4)}-${this._randChar(4)}-${this._randChar(12)};`;
    cookie += ` liveagent_sid=${this._randChar(8)}-${this._randChar(
      4
    )}-${this._randChar(4)}-${this._randChar(4)}-${this._randChar(12)};`;
    cookie += ` liveagent_vc=${this._randChar(3)};`;
    // Used to identify a LinkedIn Member for advertising through Google Ads
    cookie += ` _guid=${this._randChar(8)}-${this._randChar(
      4
    )}-${this._randChar(4)}-${this._randChar(4)}-${this._randChar(12)};`;
    // Used to store consent of guests regarding the use of cookies for non-essential purposes
    cookie += ` li_gc=${this._randChar(71)}=;`;
    // Signed data service context cookie used for database routing to ensure consistency across all databases when a change is made. Used to ensure that user-inputted content is immediately available to the submitting user upon submission
    cookie += ` sdsc=1%3A${this._randChar(28)}%3D;`;
    // Used by Adobe Target to analyze the relevance of online content
    cookie += ` mbox=PC#${this._randChar(
      32
    ).toLocaleLowerCase()}.37_0#${this._randNum(10)}|session#${this._randChar(
      32
    ).toLocaleLowerCase()}#${this._randNum(10)};`;
    // Unique identifier for Adobe Analytics
    cookie += ` s_fid=${this._randChar(16)}-${this._randChar(16)};`;
    // Used by some LinkedIn services to store session information
    cookie += ` PLAY_SESSION=${this._randChar(20)}.${this._randChar(
      307
    )}-${this._randChar(194)}.${this._randChar(41)}-4;`;
    // Stores the timestamp for the purpose of honoring the cool off period and dismiss count for Google's one tap prompt feature.
    cookie += ` g_state={"i_l":1,"i_p":1673970${this._randNum(6)}};`;
    // Used to store information about the time a sync took place with the lms_analytics cookie
    cookie += ` AnalyticsSyncHistory=${this._randChar(24)}-${this._randChar(
      39
    )}_${this._randChar(21)};`;
    // Used to identify LinkedIn Members off LinkedIn for advertising
    const lmsId = `${this._randChar(22)}-${this._randChar(16)}-${this._randChar(
      48
    )}-${this._randChar(7)}`;
    cookie += ` lms_ads=${lmsId};`;
    cookie += ` lms_analytics=${lmsId};`;
    // Used as a temporary cache to avoid database lookups for a member's consent for use of non-essential cookies and used for having consent information on the client side to enforce consent on the client side
    cookie += ` li_mc=${this._randChar(29)}/${this._randChar(
      5
    )}+g/${this._randChar(24)}/${this._randChar(8)}=;`;
    // To facilitate data center selection
    cookie += ` lidc="b=${this._randChar(4)}:s=T:r=T:a=T:p=T:g=${this._randNum(
      4
    )}:u=${this._randNum(3)}:x=1:i=${this._randNum(10)}:t=${this._randNum(
      10
    )}:v=2:sig=${this._randChar(32)}";`;

    // Static
    cookie +=
      " G_ENABLED_IDPS=google; li_theme=light; li_theme_set=app; timezone=Europe/Paris;";
    cookie += " s_cc=true; PLAY_LANG=en; at_check=true; s_sq=%5B%5BB%5D%5D;";
    cookie +=
      " gpv_pn=developer.linkedin.com%2F; s_plt=2.55; s_pltp=developer.linkedin.com%2F; s_ips=1316; s_tp=2536;";
    cookie +=
      " s_ppv=developer.linkedin.com%2F%2C52%2C52%2C1316%2C1%2C2; s_tslv=1673874952444;";
    cookie += " visit=v=1&M; liap=true; lang=v=2&lang=en-US;";

    return {
      cookie,
      "csrf-token": cookies.JSESSIONID?.replace(/"/g, "") || "",
      "accept-language": "en-US,en;q=0.9,fr-FR;q=0.8,fr;q=0.7",
      "user-agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36",
      "x-restli-protocol-version": "2.0.0",
      authority: "www.linkedin.com",
      accept: "application/vnd.linkedin.normalized+json+2.1",
      referer: "https://www.linkedin.com/feed/",
      "sec-ch-ua": `"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"`,
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": `"macOS"`,
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-li-lang": "en_US",
      "x-li-page-instance": `urn:li:page:feed_index_index;${this._randChar(
        22
      )}==`,
      "x-li-track": `{"clientVersion":"1.11.8003","mpVersion":"1.11.8003","osName":"web","timezoneOffset":1,"timezone":"Europe/Paris","deviceFormFactor":"DESKTOP","mpName":"voyager-web","displayDensity":1,"displayWidth":1920,"displayHeight":1080}`,
    };
  };

  // utils functions
  private _randChar(length: number) {
    const arr =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(
        ""
      );
    return [...Array(length)]
      .map(() => arr[Math.floor(Math.random() * arr.length)])
      .join("");
  }

  private _randNum(length: number) {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    return [...Array(length)]
      .map(() => arr[Math.floor(Math.random() * arr.length)])
      .join("");
  }

  async sleepRandomDelayBetweenRequests(url?: string) {
    const delay = Math.floor(
      Math.random() *
      (this._scraperMandatoryDelayBtwnRequestsMaxMs -
        this._scraperMandatoryDelayBtwnRequestsMinMs +
        1) +
      this._scraperMandatoryDelayBtwnRequestsMinMs
    );
    await this.sleep(delay);
    await this.applyUserLevelWait(url)
  }
  async applyUserLevelWait(url?: string, min = 5, max = 12) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // 1. Fetch today's last log
    const lastLog = await db.linkedinAPILogs.findFirst({
      where: {
        userId: this.params.userId,
        date: { gte: todayStart, lte: todayEnd }
      },
      orderBy: { time: "desc" }
    });

    // 2. If no logs today → no wait
    if (!lastLog) return;

    const now = new Date().getTime();

    // Combine stored date + time
    const lastCallDateTime = new Date(
      `${lastLog.date.toISOString().split("T")[0]}T${lastLog.time.toISOString().split("T")[1]}`
    ).getTime();

    const diffSeconds = (now - lastCallDateTime) / 1000;

    // 3. Generate random wait interval
    let randomWait = Math.floor(Math.random() * (max - min + 1)) + min;
    // 4. If same URL as last call, add extra wait
    if (url && lastLog.url) {
      console.log('same url')
      console.log('prev random wait', randomWait)
      try {
        const lastUrlPath = new URL(lastLog.url).pathname;
        const currentUrlPath = new URL(url).pathname;

        if (lastUrlPath === currentUrlPath) {
          // Same endpoint → apply extra wait
          const extraWait = Math.floor(
            Math.random() * (max - min + 1)
          ) + min;

          randomWait += extraWait;
        }
      } catch (e) {
        // If URL is invalid, fallback to full string comparison
        if (lastLog.url === url) {
          const extraWait = Math.floor(
            Math.random() * (max - min + 1)
          ) + min;

          randomWait += extraWait;
        }
      }
      console.log('new random wait', randomWait)
    }

    console.log('diffSeconds', diffSeconds, randomWait)
    // 4. If already waited enough → skip
    if (diffSeconds >= randomWait) return;

    // 5. Sleep the remaining time
    const sleepMs = (randomWait - diffSeconds) * 1000;

    await this.sleep(sleepMs)
  }
  sleep(delay: number) {
    console.log(`SLEEP::LINKEDIN :: user-${this.params.userId}`, `${Math.floor(delay / 1000)} sec`)
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  protected buildUrl(endpoint: string, queryParams?: Record<string, string>) {
    const base = new URL(endpoint, this.params.baseURL);
    if (!queryParams) return base.toString();

    const query = Object.entries(queryParams)
      .map(([k, v]) => `${k}=${v}`)  // no encodeURIComponent()
      .join("&");

    return `${base.origin}${base.pathname}?${query}`;
  }

}
