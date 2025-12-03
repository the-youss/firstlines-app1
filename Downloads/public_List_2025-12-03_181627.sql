CREATE TABLE public."List" (
  id text NOT NULL,
  name text NOT NULL,
  "createdAt" timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) without time zone NOT NULL,
  "userId" text NOT NULL
);

ALTER TABLE public."List" ADD CONSTRAINT "List_pkey" PRIMARY KEY (id);