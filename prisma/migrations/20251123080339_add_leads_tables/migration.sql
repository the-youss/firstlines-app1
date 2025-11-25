-- CreateTable
CREATE TABLE "List" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "isLinkedinPremium" BOOLEAN NOT NULL DEFAULT false,
    "linkedinId" TEXT,
    "linkedinHash" TEXT,
    "jobTitle" TEXT,
    "industry" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "companyId" TEXT,
    "listId" TEXT NOT NULL,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "companyName" TEXT,
    "companyWebsite" TEXT,
    "companySize" TEXT,
    "companyLinkedinUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "List_userId_idx" ON "List"("userId");

-- CreateIndex
CREATE INDEX "List_id_userId_idx" ON "List"("id", "userId");

-- CreateIndex
CREATE INDEX "Lead_firstName_lastName_idx" ON "Lead"("firstName", "lastName");

-- CreateIndex
CREATE INDEX "Lead_firstName_lastName_country_idx" ON "Lead"("firstName", "lastName", "country");

-- CreateIndex
CREATE INDEX "Lead_firstName_lastName_city_idx" ON "Lead"("firstName", "lastName", "city");

-- CreateIndex
CREATE INDEX "Lead_firstName_lastName_isLinkedinPremium_idx" ON "Lead"("firstName", "lastName", "isLinkedinPremium");

-- CreateIndex
CREATE INDEX "Lead_country_idx" ON "Lead"("country");

-- CreateIndex
CREATE INDEX "Lead_city_idx" ON "Lead"("city");

-- CreateIndex
CREATE INDEX "Lead_isLinkedinPremium_idx" ON "Lead"("isLinkedinPremium");

-- CreateIndex
CREATE INDEX "Company_companyName_idx" ON "Company"("companyName");

-- CreateIndex
CREATE INDEX "Company_companyWebsite_idx" ON "Company"("companyWebsite");

-- CreateIndex
CREATE INDEX "Company_companyName_companyWebsite_idx" ON "Company"("companyName", "companyWebsite");

-- CreateIndex
CREATE INDEX "Company_companySize_idx" ON "Company"("companySize");

-- AddForeignKey
ALTER TABLE "List" ADD CONSTRAINT "List_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_listId_fkey" FOREIGN KEY ("listId") REFERENCES "List"("id") ON DELETE CASCADE ON UPDATE CASCADE;
