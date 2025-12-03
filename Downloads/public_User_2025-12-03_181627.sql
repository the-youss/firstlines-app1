CREATE TABLE public."User" (
  id text NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  "emailVerified" boolean NOT NULL,
  image text NULL,
  "createdAt" timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) without time zone NOT NULL
);

ALTER TABLE public."User" ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);insert into "public"."User" ("createdAt", "email", "emailVerified", "id", "image", "name", "updatedAt") values ('2025-12-03 06:32:06.013', 'test@gmail.com', true, '3cb5147b-8ded-43e4-b89a-0552db8f82b4', NULL, 'Test', '2025-12-03 06:32:06.013');
insert into "public"."User" ("createdAt", "email", "emailVerified", "id", "image", "name", "updatedAt") values ('2025-12-03 10:09:56.258', 'rrsarwar109@gmail.com', false, 'uB9KAMMsoLAJ6cNWVgItIleWJXZvHvkb', NULL, 'Muhammad Sarwar', '2025-12-03 10:09:56.258');
