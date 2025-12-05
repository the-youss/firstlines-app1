import { getLinkedinCompanyUrlFromUniversalName } from "@/lib/linkedin.utils";
import { LinkedinClient } from "../core/client";
import { CompanySize } from "../entities/jobs.entity";
import { Education, SalesNavLead } from "../entities/leads.entity";
import { GetOwnProfileResponse } from "../responses";
import { format } from "date-fns";
import { findCountryIsoCode } from "../utils/country-utils";

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

    return response;
  }

  async getProfile({ profileHash }: { profileHash: string }): Promise<SalesNavLead | null> {
    const response = await this.client.request.profile.getProfile({ profileHash });
    const element = response?.elements?.[0];
    if (!element) {
      return null
    }
    const currentJobs = (element.profilePositionGroups?.elements || []).filter(pos => !pos.dateRange.end).map(el => ({
      companyName: el.company?.name,
      companyWebsite: undefined,
      companySize: (el.company?.employeeCountRange?.start === 1 &&
        el.company?.employeeCountRange?.end === 1
        ? "1"
        : `${el.company?.employeeCountRange?.start}-${el.company?.employeeCountRange?.end}`) as CompanySize,
      companyLinkedinUrl: getLinkedinCompanyUrlFromUniversalName(el.company?.universalName),
      jobTitle: el.title,
      industry: Object.values(el.company?.industry || {})?.[0]?.name,
    }));
    const { country, city } = await this.parseLocation(
      element.geoLocation?.geo.defaultLocalizedName
    );
    return {
      lead: {
        openToWork: false,
        firstName: element.firstName,
        lastName: element.lastName,
        headline: element.headline,
        profileHash : element.entityUrn.split(":").pop() || '',
        isLinkedinPremium: Boolean(element.premium === true),
        linkedinId: element.objectUrn.split(":").pop() || '',
        birthday: this._constructBirthday(element.birthDateOn),
        city,
        country,
        companyLinkedinUrl: currentJobs[0]?.companyLinkedinUrl,
        jobTitle: currentJobs[0]?.jobTitle,
        industry: currentJobs[0]?.industry,
        companySize: currentJobs[0]?.companySize,
        companyName: currentJobs[0]?.companyName,
        companyWebsite: currentJobs[0]?.companyWebsite,
        educations: (element.profileEducations?.elements || []).map<Education>(el => ({
          degree: el.degreeName,
          fieldsOfStudy: [el.fieldOfStudy],
          schoolName: el.schoolName,
        })),
        connection: 3
      },

      currentJobs: currentJobs[0]
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
