import { db } from '@/lib/db';
import { getServerUTCDate } from '@/lib/utils';
import Queue, { worker } from 'fastq';



const __WORKER__: worker<any, { queueId: string }, boolean> = async (arg, cb) => {
  console.log('queueId', arg.queueId);
  const queue = await db.queueJob.findUnique({
    where: {
      id: arg.queueId,
      type: 'sales_nav_extraction'
    },
  });
  if (!queue) {
    return cb(new Error(`Queue not found`), false)
  }
  if (queue.status !== 'todo') {
    return cb(new Error(`Queue is not in todo state`), false)
  }

  await db.queueJob.update({
    data: {
      status: 'processing',
      logs: {
        push: `Extraction Started at ${getServerUTCDate()}`
      }
    },
    where: {
      id: arg.queueId,
    }
  })
  cb(null, true)
}

const salesNavExtractionQueue = Queue(__WORKER__, 5);

export const addSalesNavExtractionJob = (queueId: string) => {
  salesNavExtractionQueue.push({ queueId })
}
