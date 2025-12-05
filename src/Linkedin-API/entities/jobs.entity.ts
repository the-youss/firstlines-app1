export enum CompanySize {
  "1-10" = "1-10",
  "11-50" = "11-50",
  "51-200" = "51-200",
  "201-500" = "201-500",
  "501-1000" = "501-1000",
  "1001-5000" = "1001-5000",
  "5001-10000" = "5001-10000",
  "10000+" = "10000+",
}
export interface Job {
  companyName?: string;
  companyWebsite?: string;
  companySize?: CompanySize;
  companyLinkedinUrl?: string;
  jobTitle?: string;
  industry?: string;
}
