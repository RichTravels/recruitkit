-- RecruitKit: add interviewQuota to User and create InterviewQuestion table

ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "interviewQuota" INTEGER NOT NULL DEFAULT 3;

CREATE TABLE IF NOT EXISTS "InterviewQuestion" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "seniority" TEXT NOT NULL,
    "questionCount" INTEGER NOT NULL,
    "categories" TEXT NOT NULL,
    "questions" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InterviewQuestion_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "InterviewQuestion_userId_idx" ON "InterviewQuestion"("userId");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'InterviewQuestion_userId_fkey'
    ) THEN
        ALTER TABLE "InterviewQuestion"
            ADD CONSTRAINT "InterviewQuestion_userId_fkey"
            FOREIGN KEY ("userId") REFERENCES "User"("id")
            ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;
