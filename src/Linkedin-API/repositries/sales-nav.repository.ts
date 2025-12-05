import { format } from "date-fns";
import { LinkedinClient } from "../core/client";
import { CompanySize, Job } from "../entities/jobs.entity";
import { Education, SalesNavLead } from "../entities/leads.entity";
import { GetSalesNavProfileResponse } from "../responses/sales-nav/get-profile.response.get";
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
  }): Promise<SalesNavLead | null> {
    const response = await this.client.request.salesnav.getProfile({
      profileHash,
    });
    if (response.status === 400) {
      return null
    }
    return this._formatSalesNavResponse(response);
  }
  private async _formatSalesNavResponse(json: GetSalesNavProfileResponse) {
    if (json.status === 400) {
      return null;
    }
    const element = json;
    const profileHash = element.entityUrn
      .split(",")[0]
      .replace("urn:li:fs_salesProfile:(", "");
    const { country, city } = await this.parseLocation(
      element.entityUrnResolutionResult.location
    );

    const currentJobs: Job[] = (
      element.entityUrnResolutionResult.positions || []
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

    return {
      lead: {
        firstName: element.entityUrnResolutionResult.firstName || element.firstName, // elem.entityUrnResolutionResult is most trustworthy but sometimes undefined
        lastName: element.entityUrnResolutionResult.lastName || element.lastName, // elem.entityUrnResolutionResult is most trustworthy but sometimes undefined, elem.lastname can sometimes be shorten by linkedin (eg: Charly .B)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        linkedinId: element.entityUrnResolutionResult.objectUrn
          .split(":")
          .pop()!,
        profileHash,
        headline: element.summary || "",
        city,
        country,
        connection: element.degree,
        birthday: this._constructBirthday(element.entityUrnResolutionResult.birthDateOn),
        isLinkedinPremium: Boolean(element.entityUrnResolutionResult.memberBadges?.premium === true),
        openToWork: Boolean(element.entityUrnResolutionResult.memberBadges?.openLink === true),
        companyName: currentJobs[0]?.companyName,
        companyWebsite: currentJobs[0]?.companyWebsite,
        companySize: currentJobs[0]?.companySize,
        jobTitle: currentJobs[0]?.jobTitle,
        industry: currentJobs[0]?.industry,
        companyLinkedinUrl: currentJobs[0]?.companyLinkedinUrl,
        educations: (element.entityUrnResolutionResult?.educations || []).map<Education>((edu) => ({
          degree: edu.degree,
          fieldsOfStudy: edu.fieldsOfStudy,
          schoolName: edu.schoolName,
        })),
      },
      currentJobs: currentJobs[0],
    }
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
  private _constructBirthday = (birthDateOn?: {
    month?: number;
    day?: number;
    year?: number;
  }) => {
    if (!birthDateOn) return undefined;

    const { day, month, year } = birthDateOn;

    // If everything is missing → nothing to show
    if (!day && !month && !year) return undefined;

    // If only year → "1999"
    if (year && !month && !day) {
      return `${year}`;
    }

    // If month only → "Mar"
    if (month && !day && !year) {
      const d = new Date(2000, month - 1, 1);
      return format(d, "MMM");
    }

    // If month + year → "Mar 1999"
    if (month && year && !day) {
      const d = new Date(year, month - 1, 1);
      return format(d, "MMM yyyy");
    }

    // If day + month → "11 Mar"
    if (day && month && !year) {
      const d = new Date(2000, month - 1, day);
      return format(d, "dd MMM");
    }

    // FULL DATE → "11 Mar 1999"
    if (day && month && year) {
      const d = new Date(year, month - 1, day);
      return format(d, "dd MMM yyyy");
    }

    // If we reach here, the data was weird → just return nothing
    return undefined;
  };
}
