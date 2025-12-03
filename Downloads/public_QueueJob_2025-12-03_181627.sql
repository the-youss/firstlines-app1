CREATE TABLE public."QueueJob" (
  id text NOT NULL,
  status "QueueJobStatus" NOT NULL DEFAULT 'todo'::"QueueJobStatus",
  type "QueueJobType" NOT NULL,
  input jsonb NOT NULL,
  "lastMessage" text NULL,
  logs text[] NULL,
  "isFailed" boolean NOT NULL DEFAULT false,
  "userId" text NOT NULL,
  "createdAt" timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) without time zone NOT NULL
);

ALTER TABLE public."QueueJob" ADD CONSTRAINT "QueueJob_pkey" PRIMARY KEY (id);