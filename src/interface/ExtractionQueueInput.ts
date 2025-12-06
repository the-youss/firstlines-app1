import { List } from "@/lib/db";
import { StartExtractionProps } from "./StartExtractionProps";

export interface ExtractionQueueInput {
  list: List;
  linkedinPayload: StartExtractionProps;
  shouldAddToCampaign: boolean
}