-- Add separate outreach quota to User

ALTER TABLE "User"
ADD COLUMN IF NOT EXISTS "outreachQuota" INTEGER NOT NULL DEFAULT 3;
