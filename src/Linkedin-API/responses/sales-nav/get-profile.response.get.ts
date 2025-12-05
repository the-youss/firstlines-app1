import { GetSalesNavSearchError, GetSalesNavSearchSuccessResponse } from "./search-result.response.get";


export type GetSalesNavProfileResponse =
  | (GetSalesNavSearchSuccessResponse['elements'][number] & { status?: undefined })
  | GetSalesNavSearchError;