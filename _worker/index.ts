import 'dotenv/config'
import { getServerUTCDate } from "@/lib/utils";
import { initSalesNavExtractionQueue } from "@/queue/sales-nav-extraction";
import initSocketServer from '@/socket';

const init = async () => {
  console.log(`[worker] Started at ${getServerUTCDate()}`);
  initSocketServer()
  initSalesNavExtractionQueue();
}

init()
