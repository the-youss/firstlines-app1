import { LinkedinClient } from "../core/client";
import { CompanySize, Job } from "../entities/jobs.entity";
import { SalesNavLead } from "../entities/leads.entity";
import { findCountryIsoCode } from "../utils/country-utils";

export class SalesNavRepository {
  private client: LinkedinClient;

  constructor({ client }: { client: LinkedinClient }) {
    this.client = client;
  }

  async getProfile({
    profileHash,
  }: {
    profileHash: string;
  }): Promise<SalesNavLead> {
    const response = await this.client.request.salesnav.getProfile({
      profileHash,
    });

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const linkedinId = response?.objectUrn.split(":").pop()!;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const commonLinkedinProfileHash = profileHash;
    const { country, city } = await this.parseLocation(response?.location);

    // To find current position we need to go through position view en get the first element id
    const positionEntityUrnList = response?.positions || [];
    const jobs: Job[] = positionEntityUrnList
      .filter((position) => {
        // Only one job, keep it as current job even if there is an ending date
        if (positionEntityUrnList.length <= 1) {
          return true;
        }
        return position?.endedOn ? false : true;
      })
      .map((position) => {
        const job: Job = {};
        if (position) {
          job.jobTitle = position.title || undefined;
          job.companyName = position.companyName || undefined;
          if (position.companyUrnResolutionResult) {
            job.industry = position.companyUrnResolutionResult.industry;
            job.companySize = position.companyUrnResolutionResult
              .employeeCountRange as CompanySize;
            job.companyLinkedinUniversalName = position.companyUrn
              ?.split(":")
              .pop();
          }
        }
        return job;
      });

    const result: SalesNavLead = {
      lead: {
        firstName: response?.firstName || "",
        lastName: response?.lastName || "",
        linkedinId,
        profileHash: commonLinkedinProfileHash,
        country,
        city,
        jobTitle: jobs[0]?.jobTitle,
        companyName: jobs[0]?.companyName,
        industry: jobs[0]?.industry,
        companySize: jobs[0]?.companySize,
        companyLinkedinUrl: this._getLinkedinCompanyUrlFromUniversalName(
          jobs[0]?.companyLinkedinUniversalName
        ),
      },
      currentJobs: jobs[0],
    };
    return result;
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

  private _getLinkedinCompanyUrlFromUniversalName(universalName?: string) {
    if (!universalName) {
      return undefined;
    }
    return `https://linkedin.com/company/${universalName}`;
  }
}
