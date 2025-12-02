import countryAndTimezone from "countries-and-timezones";
import { countryListAllIsoData } from "../const/CountryListAllIsoData";

const _cleanName = (query: string) =>
  query
    .trim()
    .toLocaleLowerCase()
    .replace(/-/g, " ")
    .replace(/'/g, " ")
    .replace(/,/g, " ")
    .replace(/ \(.*\)/g, "")
    .replace(/ \[.*\]/g, "");

export const findCountryIsoCode = (query: string) => {
  let result: string | undefined;

  let cleanQuery = query;
  if (/^United States$/i.test(cleanQuery)) {
    cleanQuery = "United States of America";
  }

  for (const country of countryListAllIsoData) {
    if (new RegExp(_cleanName(cleanQuery)).test(_cleanName(country.name))) {
      result = country.code;
      break;
    }
    if (new RegExp(_cleanName(country.name)).test(_cleanName(cleanQuery))) {
      result = country.code;
      break;
    }
  }
  return result?.toLocaleUpperCase();
};

export const findCountryNameFromCode = (code: string) => {
  let name: undefined | string;
  for (const country of countryListAllIsoData) {
    if (country.code.toLocaleLowerCase() === code.toLocaleLowerCase()) {
      name = country.nameShort || country.name;
      break;
    }
  }
  return name;
};

export const getAllCountries = () =>
  countryListAllIsoData.map((v) => ({
    code: v.code.toLocaleUpperCase(),
    name: v.nameShort || v.name,
  }));

export const getUserCountryBasedOnDeviceTimezone = () => {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const countries = countryAndTimezone.getCountriesForTimezone(timeZone);
    for (const tzCountry of countries) {
      for (const country of getAllCountries()) {
        if (
          tzCountry.id.toLocaleUpperCase() === country.code.toLocaleUpperCase()
        ) {
          return tzCountry.id.toLocaleUpperCase();
        }
      }
    }
  } catch (e) {
    /* na */
  }
  return;
};
