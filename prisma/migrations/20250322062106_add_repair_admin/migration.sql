-- CreateTable
CREATE TABLE "Repair" (
    "id" SERIAL NOT NULL,
    "customer" TEXT NOT NULL,
    "phoneModel" TEXT NOT NULL,
    "issue" TEXT NOT NULL,
    "partsUsed" TEXT,
    "status" TEXT NOT NULL DEFAULT 'รอซ่อม',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Repair_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_username_key" ON "Admin"("username");
