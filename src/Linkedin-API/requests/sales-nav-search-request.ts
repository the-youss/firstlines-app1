// SalesNavScraper.ts
import fs from "fs";
import { Request, RequestOpts } from "../core";
import { GetSalesNavSearchResponse } from "../responses/sales-nav/search-result.response.get";

export const SEARCH_RESULT_MAX_ITEMS_COUNT = 2500;
export const MAX_PAGE_SIZE = 100;

export class SalesNavSearchRequest extends Request {
  constructor(protected params: RequestOpts) {
    super(params);
  }

  /** Scrape a Sales Navigator search (paginated, up to 2500 results) */
  getSalesNavSearch = async (
    sourceUrl: string,
    opts?: {
      start?: number;
      limit?: number;
    }
  ): Promise<GetSalesNavSearchResponse> => {
    let start = opts?.start || 0;
    let limit = opts?.limit || MAX_PAGE_SIZE;
    if (limit < 0 || limit > MAX_PAGE_SIZE) {
      limit = MAX_PAGE_SIZE;
    }
    // 🚨 clamp to 2500 max
    if (start >= SEARCH_RESULT_MAX_ITEMS_COUNT) {
      // nothing to scrape
      return {
        elements: [],
        paging: { total: 0, count: 0 },
        metadata: {},
      };
    }

    if (start + limit > SEARCH_RESULT_MAX_ITEMS_COUNT) {
      limit = SEARCH_RESULT_MAX_ITEMS_COUNT - start;
      console.warn(
        `Adjusted limit to ${limit} because start=${start} would exceed max=${SEARCH_RESULT_MAX_ITEMS_COUNT}`
      );
    }

    // let seachParams = this._getSearchPageUrlParams(sourceUrl);

    // // No search params
    // if (
    //   (!seachParams.isSearchingInSavedPeopleList &&
    //     !seachParams.query &&
    //     !seachParams.recentSearchId &&
    //     !seachParams.savedSearchId) ||
    //   (seachParams.isSearchingInSavedPeopleList && !seachParams.leadListId)
    // ) {
    //   // Sales Nav can wrap search params under url hash, lets see if this is the case
    //   const hash = new URL(sourceUrl).hash;
    //   if (hash) {
    //     const params = hash.replace(/^#/, "");
    //     const newUrl = new URL(sourceUrl);
    //     newUrl.search = params;
    //     console.log("Search params are wrapped inside url hash");
    //     seachParams = this._getSearchPageUrlParams(newUrl.toString());
    //   }
    // }
    // const {
    //   isSearchingInSavedPeopleList,
    //   query,
    //   recentSearchId,
    //   savedSearchId,
    //   leadListId,
    //   lastViewedAt,
    // } = seachParams;

    // if (
    //   !isSearchingInSavedPeopleList &&
    //   !query &&
    //   !recentSearchId &&
    //   !savedSearchId
    // ) {
    //   throw new Error(
    //     "_scrapeOneSearchResultPage sourceUrl is missing query param 'query' or 'recentSearchId' or 'savedSearchId'"
    //   );
    // } else if (isSearchingInSavedPeopleList && !leadListId) {
    //   throw new Error(
    //     "_scrapeOneSearchResultPage sourceUrl is missing leadListId if param"
    //   );
    // }

    // let endpointUrl = ``;

    // endpointUrl += isSearchingInSavedPeopleList
    //   ? "salesApiPeopleSearch"
    //   : "salesApiLeadSearch";
    // endpointUrl +=
    //   "?q=" +
    //   (isSearchingInSavedPeopleList
    //     ? "peopleSearchQuery"
    //     : query
    //     ? "searchQuery"
    //     : savedSearchId
    //     ? "savedSearchId"
    //     : "recentSearchId");
    // endpointUrl +=
    //   "&" +
    //   (isSearchingInSavedPeopleList
    //     ? `query=(spotlightParam:(selectedType:ALL),doFetchSpotlights:true,doFetchHits:true,doFetchFilters:false,pivotParam:(com.linkedin.sales.search.LeadListPivotRequest:(list:urn%3Ali%3Afs_salesList%3A${leadListId},sortCriteria:CREATED_TIME,sortOrder:DESCENDING)),list:(scope:LEAD,includeAll:false,excludeAll:false,includedValues:List((id:${leadListId}))))`
    //     : query
    //     ? `query=${query}`
    //     : savedSearchId
    //     ? `savedSearchId=${savedSearchId}`
    //     : `recentSearchId=${recentSearchId}`);

    // // This allows to scrape new results that appeared in a saved search
    // if (savedSearchId && lastViewedAt) {
    //   endpointUrl += "&lastViewedAt=" + lastViewedAt;
    // }
    const searchParams ={
      start: start.toString(),
      count:limit.toString(),
      decoration: this._craftSearchUrlDecoration()
    }

    const endpointUrl = this.appendLinkedinParams(sourceUrl, searchParams);

    let json: GetSalesNavSearchResponse | undefined = undefined;
    try {
      await this.sleepRandomDelayBetweenRequests();
      json = await this.fetchJson<GetSalesNavSearchResponse>(endpointUrl);
    } catch (error) {
      console.error(
        "_scrapeOneSearchResultPage error, cannot parse json content, see http response above",
        error
      );
      throw error;
    }
    if (json.status === undefined && !json.elements) {
      if (json?.status === 400 && start >= SEARCH_RESULT_MAX_ITEMS_COUNT) {
        return {
          elements: [],
          paging: { total: 0, count: 0 },
          metadata: {},
        };
      } else {
        // Elements should not be undefined, lets monitor this issue
        console.warn(
          "json.elements is undefined",
          "and here the full json",
          json
        );
        console.log("let's try again in few secs");
        await this.sleep(30000);
        console.log(
          "_scrapeOneSearchResultPage for the second time",
          endpointUrl
        );
        json = await this.fetchJson<GetSalesNavSearchResponse>(endpointUrl);

        if (json?.status !== 400 && !json.elements) {
          console.warn(
            "json.elements is still undefined after the second call and should not have been, here the http status code"
          );
          console.log("let's the app raise a failed extract");
        }
      }
    }
    if (json.status === 400) {
      return {
        elements: [],
        paging: { total: 0, count: 0 },
        metadata: {},
      };
    } else {
      const total = Math.min(2500, json?.paging?.total || 0);
      json.paging.total = total;
      json.paging.count = json.elements.length;
      return json;
    }
  }
  private overwriteHeaders(headers: Headers) {
    delete headers["content-encoding" as keyof typeof headers];
    headers.set("accept", "*/*");
  }
  private _getSearchPageUrlParams(sourceUrl: string) {
    const url = new URL(sourceUrl);
    const urlParams = new URLSearchParams(url.search);

    const isSearchingInSavedPeopleList = /^\/sales\/lists\/people\//i.test(
      url.pathname
    );
    const query = urlParams.get("query");
    const recentSearchId = urlParams.get("recentSearchId");
    const savedSearchId = urlParams.get("savedSearchId");
    const lastViewedAt = urlParams.get("lastViewedAt");
    const leadListId = url.pathname.split("/").pop();
    return {
      isSearchingInSavedPeopleList,
      query,
      recentSearchId,
      savedSearchId,
      leadListId,
      lastViewedAt,
    };
  }

  // "~" ask the api to join data "()" ask the api to project attributes
  // using this we can search anything we want in Sales Navigator DB
  private _craftSearchUrlDecoration(omitLeadData = false) {
    return encodeURIComponent(
      omitLeadData
        ? "(entityUrn)"
        : `(firstName,lastName,summary,degree,entityUrn~fs_salesProfile${this._craftProfileUrlDecoration(
          true
        )})`
    )
      .replace(/\(/g, "%28")
      .replace(/\)/g, "%29");
  }
  // "~" ask the api to join data "()" ask the api to project attributes
  // using this we can search anything we want in Sales Navigator DB
  private _craftProfileUrlDecoration(omitEncode = false) {
    let deco =
      "(entityUrn,firstName,lastName,birthDateOn,objectUrn,memberBadges,location,positions*(current,title,companyName,companyUrn~fs_salesCompany(industry,flagshipCompanyUrl,website,employeeCountRange)),educations*(degree,schoolName,fieldsOfStudy))";
    if (omitEncode !== true) {
      deco = encodeURIComponent(deco)
        .replace(/\(/g, "%28")
        .replace(/\)/g, "%29");
    }
    return deco;
  }


  private appendLinkedinParams(url: string, newParams: Record<string, string>) {
    // Remove existing decoration, start, count if present
    url = url.replace(/([?&])(decorationId|decoration|start|count)=[^&]*/g, '');

    // Remove trailing '&' or '?' if any
    url = url.replace(/([?&])$/, '');

    // Determine the separator for appending
    const separator = url.includes('?') ? '&' : '?';

    // Append new params without encoding
    const newQuery = Object.entries(newParams)
      .map(([k, v]) => `${k}=${v}`)
      .join('&');

    return url + (newQuery ? separator + newQuery : '');
  }
}
