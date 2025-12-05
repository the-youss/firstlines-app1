import { LinkedInCollectionResponse } from '../entities/linkedin-collection-response.entity';
import { LinkedInCompany } from '../entities/linkedin-company.entity';
import { LinkedInProfile, ProfileUrn } from '../entities/linkedin-profile.entity';

export type GetProfileResponse = {
  elements: Array<{
    birthDateOn?: {
      month: number
      day: number
      year: number
    }
    objectUrn: string,
    entityUrn:string;
    profileEducations?: {
      elements: Array<{
        schoolName: string
        fieldOfStudy: string
        degreeName: string
      }>
    }

    firstName: string
    lastName: string
    premium: boolean
    headline: string
    profilePositionGroups?: {
      elements?: Array<{
        dateRange: {
          start: any
          end?: any
        },
        title: string
        company?: {
          industry: {
            "urn:li:fsd_industry:96": {
              name: string,
            }
          },
          url: string
          employeeCountRange?: {
            start: number
            $recipeType: string
            end?: number
          }
          name: string
          universalName: string
        }
      }>
    }

    geoLocation?: {
      geo: {
        defaultLocalizedName: string
      }
    }
  }>
  paging: {
    count: number
    start: number
    links: Array<any>
  }
}
