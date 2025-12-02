export interface GetSalesNavProfileResponse {
  lastName: string;
  objectUrn: string;
  positions: Position[];
  firstName: string;
  entityUrn: string;
  flagshipProfileUrl: string;
  location: string;
}

export interface Position {
  new: boolean;
  companyName: string;
  description?: string;
  title: string;
  companyUrnResolutionResult?: CompanyUrnResolutionResult;
  companyUrn?: string;
  current: boolean;
  location?: string;
  startedOn: StartedOn;
  endedOn?: EndedOn;
}

export interface CompanyUrnResolutionResult {
  employeeCountRange: string;
  entityUrn: string;
  name: string;
  industry: string;
}

export interface StartedOn {
  month: number;
  year: number;
}

export interface EndedOn {
  month: number;
  year: number;
}
