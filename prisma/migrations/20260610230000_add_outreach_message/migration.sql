-- RecruitKit: add OutreachMessage table

CREATE TABLE IF NOT EXISTS "OutreachMessage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "keySkills" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "linkedinDm" TEXT NOT NULL,
    "coldEmailSubject" TEXT NOT NULL,
    "coldEmailBody" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutreachMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "OutreachMessage_userId_idx" ON "OutreachMessage"("userId");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'OutreachMessage_userId_fkey'
    ) THEN
        ALTER TABLE "OutreachMessage"
            ADD CONSTRAINT "OutreachMessage_userId_fkey"
            FOREIGN KEY ("userId") REFERENCES "User"("id")
            ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;
