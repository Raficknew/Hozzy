-- Step 1: Add new 'future_you' value to the existing enum (safe, non-destructive)
ALTER TYPE "public"."categories_of_expanse" ADD VALUE 'future_you';--> statement-breakpoint
COMMIT;

-- Step 2: Migrate all existing rows from 'future you' (space) → 'future_you' (underscore)
UPDATE "categories" SET "categoryType" = 'future_you' WHERE "categoryType" = 'future you';--> statement-breakpoint

-- Step 3: Cast column to text so we can drop and recreate the enum cleanly (without 'future you')
ALTER TABLE "categories" ALTER COLUMN "categoryType" SET DATA TYPE text;--> statement-breakpoint

-- Step 4: Drop the old enum (now safe — no column references it)
DROP TYPE "public"."categories_of_expanse";--> statement-breakpoint

-- Step 5: Recreate the enum without the obsolete 'future you' value
CREATE TYPE "public"."categories_of_expanse" AS ENUM('fixed', 'fun', 'future_you', 'incomes');--> statement-breakpoint

-- Step 6: Restore the column type using the new enum
ALTER TABLE "categories" ALTER COLUMN "categoryType" SET DATA TYPE "public"."categories_of_expanse" USING "categoryType"::"public"."categories_of_expanse";--> statement-breakpoint

-- Step 7: Change price column from double precision to numeric(12,2)
ALTER TABLE "transactions" ALTER COLUMN "price" SET DATA TYPE numeric(12, 2);