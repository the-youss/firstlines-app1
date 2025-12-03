import { checkLinkedInCookieStatusCron } from "./check-linkedin-cookie-status";

export function START_CRON_JOBS() {
  checkLinkedInCookieStatusCron()
}