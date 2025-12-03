CREATE TABLE public."Account" (
  id text NOT NULL,
  "userId" text NOT NULL,
  "accountId" text NOT NULL,
  "providerId" text NOT NULL,
  "accessToken" text NULL,
  "refreshToken" text NULL,
  "accessTokenExpiresAt" timestamp(3) without time zone NULL,
  "refreshTokenExpiresAt" timestamp(3) without time zone NULL,
  scope text NULL,
  "idToken" text NULL,
  password text NULL,
  "createdAt" timestamp(3) without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp(3) without time zone NOT NULL
);

ALTER TABLE public."Account" ADD CONSTRAINT "Account_pkey" PRIMARY KEY (id);insert into "public"."Account" ("accessToken", "accessTokenExpiresAt", "accountId", "createdAt", "id", "idToken", "password", "providerId", "refreshToken", "refreshTokenExpiresAt", "scope", "updatedAt", "userId") values (NULL, NULL, 'uB9KAMMsoLAJ6cNWVgItIleWJXZvHvkb', '2025-12-03 10:09:56.321', '3271kEOpYOWu09LI9NWjG6ZWHFiU7Qkr', NULL, '$2b$10$p4up9Xz9MaSxFHoWCx49OO2EuXsqNpWcT2hxDUqFEksC3ZRbFq4bW', 'credential', NULL, NULL, NULL, '2025-12-03 10:09:56.321', 'uB9KAMMsoLAJ6cNWVgItIleWJXZvHvkb');
