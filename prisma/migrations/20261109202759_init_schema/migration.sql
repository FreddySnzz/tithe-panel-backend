-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'PARISH_ADMIN', 'TITHER');

-- CreateEnum
CREATE TYPE "CivilStatus" AS ENUM ('SINGLE', 'MARRIED', 'WIDOWED', 'OTHER');

-- CreateEnum
CREATE TYPE "ReturnStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('PIX', 'CREDIT_CARD', 'CASH', 'PAYMENT_TICKET');

-- CreateTable
CREATE TABLE "parishes" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255),
    "phone" VARCHAR(255) NOT NULL,
    "document" VARCHAR(255),
    "priest" VARCHAR(255),
    "theme_primary_color" VARCHAR(255),
    "theme_secondary_color" VARCHAR(255),
    "logo_url" VARCHAR(255),
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "parishes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "parish_id" UUID,
    "phone" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'TITHER',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tithers" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "parish_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "phone_secondary" VARCHAR(255),
    "birth_date" DATE NOT NULL,
    "ministry" VARCHAR(255),
    "civil_status" "CivilStatus" NOT NULL,
    "spouse_name" VARCHAR(255),
    "marriage_date" DATE,
    "community" VARCHAR(255),
    "street" VARCHAR(255),
    "neighborhood" VARCHAR(255),
    "city" VARCHAR(255),
    "state" VARCHAR(255),
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL,

    CONSTRAINT "tithers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "returns" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "parish_id" UUID NOT NULL,
    "value" BIGINT NOT NULL,
    "reference_month" INTEGER NOT NULL,
    "reference_year" INTEGER NOT NULL,
    "status" "ReturnStatus" NOT NULL DEFAULT 'PENDING',
    "payment_method" "PaymentMethod",
    "paid_at" TIMESTAMP,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "returns_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parishes_slug_key" ON "parishes"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "tithers_user_id_key" ON "tithers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "returns_user_id_parish_id_reference_month_reference_year_key" ON "returns"("user_id", "parish_id", "reference_month", "reference_year");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_parish_id_fkey" FOREIGN KEY ("parish_id") REFERENCES "parishes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tithers" ADD CONSTRAINT "tithers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tithers" ADD CONSTRAINT "tithers_parish_id_fkey" FOREIGN KEY ("parish_id") REFERENCES "parishes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "returns" ADD CONSTRAINT "returns_parish_id_fkey" FOREIGN KEY ("parish_id") REFERENCES "parishes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
