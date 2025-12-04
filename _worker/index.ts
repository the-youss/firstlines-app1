import 'dotenv/config'
import { getServerUTCDate } from "@/lib/utils";
import { initSalesNavExtractionQueue } from "@/queue/sales-nav-extraction";

const init = async () => {
  console.log(`[worker] Started at ${getServerUTCDate()}`);

  initSalesNavExtractionQueue();
}

init()