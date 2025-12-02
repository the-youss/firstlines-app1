import { LinkedinClient } from "../core/client";
import { CompanySize, Job } from "../entities/jobs.entity";
import { SalesNavLead } from "../entities/leads.entity";
import {
  MAX_PAGE_SIZE,
  SEARCH_RESULT_MAX_ITEMS_COUNT,
} from "../requests/sales-nav-search-request";
import { GetSalesNavSearchResponse } from "../responses/sales-nav/search-result.response.get";
import { findCountryIsoCode } from "../utils/country-utils";

export class SalesNavSearchRepository {
  private client: LinkedinClient;

  constructor({ client }: { client: LinkedinClient }) {
    this.client = client;
  }
  async scrapeSearchResult(
    sourceUrl: string,
    onProgress: (args: {
      scrapedLeads: SalesNavLead[];
      progress: number;
      total: number;
      scrapedPage?: number;
    }) => Promise<boolean>,
    opts?: {
      leadsLimit?: number;
      offset?: number;
    }
  ): Promise<boolean> {
    let resultsScrappedCount = 0;
    let start = opts?.offset || 0;
    let progress = 0;
    let page = Math.floor(opts?.offset || 0 / MAX_PAGE_SIZE);

    // 🚨 Guard against invalid offset
    if (start >= SEARCH_RESULT_MAX_ITEMS_COUNT) {
      console.warn(
        `Offset ${start} is >= max allowed ${SEARCH_RESULT_MAX_ITEMS_COUNT}. Stopping scraper.`
      );
      return false;
    }

    // 🚨 trim leadsLimit so we never exceed 2500
    if (
      opts?.leadsLimit &&
      start + opts.leadsLimit > SEARCH_RESULT_MAX_ITEMS_COUNT
    ) {
      const allowed = SEARCH_RESULT_MAX_ITEMS_COUNT - start;
      console.warn(
        `Requested leadsLimit ${opts.leadsLimit} with offset ${start} goes past ${SEARCH_RESULT_MAX_ITEMS_COUNT}.` +
          ` Trimming to ${allowed}.`
      );
      opts.leadsLimit = allowed;
    }
    const fn = this.client.request.salesnavSearch.getSalesNavSearch;
    const _initialRes = await fn(sourceUrl, {
      start: 0,
      limit: 1,
    });

    const initialPagingResults =
      _initialRes.status === undefined ? _initialRes.paging : { total: 0 };

    const status = await onProgress({
      scrapedLeads: [],
      progress: 0,
      total: initialPagingResults.total,
    });

    if (!status) {
      return false;
    }
    let forceExitCpt = 0;
    do {
      const result = await fn(sourceUrl, {
        start,
        // Limit results for the last page, so we do not scraper more than what we need
        limit:
          opts?.leadsLimit && start + MAX_PAGE_SIZE > opts?.leadsLimit
            ? opts?.leadsLimit - start
            : undefined,
      });
      // It can happen that SalesNav says there is X results but it returns less results
      // let's add this catch to break and avoid infinite search
      if (result.status === 400) {
        console.log(
          `no leads found for the page ${page}, sounds like there is no more content, lets stop this search here`
        );
        progress = 1;
      } else if (result.paging.count === 0) {
        console.log(
          `no leads found for the page ${page}, sounds like there is no more content, lets stop this search here`
        );
        progress = 1;
      } else {
        start += result.paging.count;
        resultsScrappedCount += result.paging.count;
        // If we reach our goal, then we can stop, save remaining scrapped lead and stop
        if (opts?.leadsLimit && resultsScrappedCount >= opts.leadsLimit) {
          console.log(
            "scrapeSearchResult limit of",
            opts.leadsLimit,
            "leads reached so we can stop the scraper. (we've scrapped",
            resultsScrappedCount,
            "leads)"
          );
          progress = 1;
        } else {
          progress = resultsScrappedCount / result.paging.total;
        }
      }
      const formatRes = await this._formatSalesNavResponse(result);
      if (
        !(await onProgress({
          progress: resultsScrappedCount,
          scrapedLeads: formatRes,
          scrapedPage: page,
          total: result.status === undefined ? result.paging.total : 0,
        }))
      ) {
        return false;
      }

      page++;
      forceExitCpt++;
      if (forceExitCpt > 2500) {
        console.log("forceExitCpt", forceExitCpt);
        break;
      }
    } while (progress < 1);

    return true;
  }

  private async _formatSalesNavResponse(json: GetSalesNavSearchResponse) {
    if (json.status === 400) {
      return [];
    }
    const elements = json?.elements || [];
    const scrapedProfiles: SalesNavLead[] = [];

    for (const elem of elements) {
      const profileHash = elem.entityUrn
        .split(",")[0]
        .replace("urn:li:fs_salesProfile:(", "");
      const { country, city } = await this.parseLocation(
        elem.entityUrnResolutionResult.location
      );

      const currentJobs: Job[] = (
        elem.entityUrnResolutionResult.positions || []
      )
        .filter((pos) => pos.current)
        .map((pos) => {
          return {
            jobTitle: pos.title,
            companyName: pos.companyName,
            companyWebsite: pos.companyUrnResolutionResult?.website,
            companyLinkedinUrl:
              pos.companyUrnResolutionResult?.flagshipCompanyUrl,
            companySize: (pos.companyUrnResolutionResult?.employeeCountRange ===
            "myself only"
              ? "1"
              : pos.companyUrnResolutionResult
                  ?.employeeCountRange) as CompanySize,
            industry: pos.companyUrnResolutionResult?.industry,
          };
        });

      scrapedProfiles.push({
        lead: {
          firstName: elem.entityUrnResolutionResult.firstName || elem.firstName, // elem.entityUrnResolutionResult is most trustworthy but sometimes undefined
          lastName: elem.entityUrnResolutionResult.lastName || elem.lastName, // elem.entityUrnResolutionResult is most trustworthy but sometimes undefined, elem.lastname can sometimes be shorten by linkedin (eg: Charly .B)
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          linkedinId: elem.entityUrnResolutionResult.objectUrn
            .split(":")
            .pop()!,
          profileHash,
          country,
          city,
          isLinkedinPremium:
            elem.entityUrnResolutionResult.memberBadges?.premium,
          companyName: currentJobs[0]?.companyName,
          companyWebsite: currentJobs[0]?.companyWebsite,
          companySize: currentJobs[0]?.companySize,
          jobTitle: currentJobs[0]?.jobTitle,
          industry: currentJobs[0]?.industry,
          companyLinkedinUrl: currentJobs[0]?.companyLinkedinUrl,
        },
        currentJobs: currentJobs[0],
      });
    }

    return scrapedProfiles;
  }

  protected async parseLocation(
    rawLocalizedLocation: string | undefined, // eg "France" or "Paris, France" or "Paris, Iles de France, France" or "Area Paris, France", or "Paris"
    countryLocalized?: string | undefined,
    countryCode?: string | undefined
  ): Promise<{
    city?: string;
    country?: string;
  }> {
    let city: string | undefined;
    let countryISOCode: string | undefined;

    // City
    const rawLocalizedLocationSplit = rawLocalizedLocation?.split(", ");
    if (rawLocalizedLocationSplit?.length) {
      city = this._cleanCityFromLinkedinDetails(rawLocalizedLocationSplit[0]);
    }
    // Country
    if (countryCode && countryCode.toLocaleLowerCase() !== "oo") {
      countryISOCode = countryCode.toLocaleUpperCase();
    } else if (countryLocalized) {
      countryISOCode =
        findCountryIsoCode(countryLocalized)?.toLocaleUpperCase();
    }
    // Case "Paris" or "France"
    else if (
      rawLocalizedLocationSplit &&
      rawLocalizedLocationSplit.length === 1
    ) {
      const location = rawLocalizedLocationSplit[0];
      // This might be a country (eg: "France");
      countryISOCode = findCountryIsoCode(location);

      // Country found, then it is a country not a city, clean city
      if (countryISOCode) {
        city = undefined;
      }

      // Country not found? Then it might be a city (eg: "Paris")
      if (!countryISOCode) {
        // Use our DB to find country from city
        // countryISOCode = await findCountryCodeFromCity(
        //   this._cleanCityFromLinkedinDetails(location)
        // );
      }
    }
    // Case "Paris, Ile de France, France"
    else if (rawLocalizedLocationSplit && rawLocalizedLocationSplit[2]) {
      countryISOCode = findCountryIsoCode(
        rawLocalizedLocationSplit[2]
      )?.toLocaleUpperCase();
    }
    // Case "Paris, France" or "Austin, Texas Metropolitan Area"
    else if (rawLocalizedLocationSplit && rawLocalizedLocationSplit[1]) {
      const secondParam = rawLocalizedLocationSplit[1];
      // Let's try to see if it is a country
      countryISOCode = findCountryIsoCode(secondParam)?.toLocaleUpperCase();
      // Country not found? Then it might be the region, use the city to find the country
      if (!countryISOCode && city) {
        // Use our DB to find country from city
        // countryISOCode = await findCountryCodeFromCity(city);
      }
    }

    // Manual fallback
    if (countryISOCode === "HK" && !city) {
      city = "Hong Kong";
    }

    if (countryISOCode === "SG" && !city) {
      city = "Singapore";
    }

    return { city, country: countryISOCode };
  }

  private _cleanCityFromLinkedinDetails = (_city: string) => {
    let city = _city;

    const suffixes =
      / ((Metropolitan Area)|(Metropolitan Region)|(Metroplex)|(Bay Area)|(Area)|(Metro)|(Region))$/;

    // case "Raleigh-Durham-Chapel Hill Area"
    if (/^([\w ]+-){2}/i.test(city) && suffixes.test(city)) {
      city = city.replace(/^([\w ]+-){2}/i, "");
    }

    // case "lowa City-Cedar Rapids Area" or "Washington DC-Baltimore Area"
    if (/^[\w ]+?-/i.test(city) && suffixes.test(city)) {
      city = city.replace(/^[\w ]+?-/i, "");
    }

    // case "Greensboro--Winston-Salem--High Point Area"
    if (/--/i.test(city) && suffixes.test(city)) {
      city = city.split("--").pop() || city;
    }

    city = city.replace(/Greater /i, "");
    city = city.replace(suffixes, "");

    // case "Greater Minneapolis-St. Paul Area"
    city = city.replace(/st\. /gi, "Saint ").replace(/ st\./gi, " Saint");

    return city;
  };
}
