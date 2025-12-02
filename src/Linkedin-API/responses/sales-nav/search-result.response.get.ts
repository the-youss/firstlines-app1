export interface GetSalesNavSearchSuccessResponse {
  elements: {
    entityUrn: string;
    firstName: string;
    lastName: string;
    // Profile info
    entityUrnResolutionResult: {
      // firstName: string; // They are locked by LK if the profile is not 1st, 2nd or 3rd connection
      // lastName: string; // They are locked by LK if the profile is not 1st, 2nd or 3rd connection
      location: string;
      objectUrn: string;
      firstName?: string;
      lastName?: string;
      memberBadges?: {
        premium: boolean;
        jobSeeker: boolean;
      };
      positions?: {
        current: boolean;
        title: string;
        companyName: string;
        companyUrnResolutionResult?: {
          employeeCountRange: string;
          website: string;
          industry: string;
          flagshipCompanyUrl: string;
        };
      }[];
    };
  }[];
  paging: {
    total: number;
    count:number
  };
  metadata?: {
    keywords?: string;
    filters?: {
      singleFilterMetadata?: {
        values: {
          displayValue: string;
          selectionType?: "INCLUDED";
        }[];
        type: "INDUSTRY";
      };
      aggregatedFilterMetadata?: {
        values: {
          type: "REGION" | "POSTAL_CODE";
          values?: {
            displayValue: string;
            selectionType?: "INCLUDED";
          }[];
        }[];
        selected: "REGION" | "POSTAL_CODE";
        type: "GEOGRAPHY";
      };
    }[];
    pivot?: {
      "com.linkedin.sales.search.ListPivotResponse"?: {
        name?: string;
      };
    };
  };
}

export interface GetSalesNavSearchError {
  status: 400;
}

export type GetSalesNavSearchResponse =
  | (GetSalesNavSearchSuccessResponse & { status?: undefined })
  | GetSalesNavSearchError;
