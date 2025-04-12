-- First create the default seller
INSERT INTO "User" (email, password, name, role, "createdAt", "updatedAt")
VALUES (
    'admin@store.com',
    'admin123',
    'Store Admin',
    'seller',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);

-- Get the seller ID
DO $$
DECLARE
    default_seller_id INTEGER;
BEGIN
    -- Get the ID of our default seller
    SELECT id INTO default_seller_id FROM "User" WHERE email = 'admin@store.com';

    -- Add sellerId column with a default value of our seller
    ALTER TABLE "Product" ADD COLUMN "sellerId" INTEGER DEFAULT default_seller_id;

    -- Remove the default constraint
    ALTER TABLE "Product" ALTER COLUMN "sellerId" DROP DEFAULT;

    -- Make sellerId required
    ALTER TABLE "Product" ALTER COLUMN "sellerId" SET NOT NULL;

    -- Add foreign key constraint
    ALTER TABLE "Product" ADD CONSTRAINT "Product_sellerId_fkey" 
        FOREIGN KEY ("sellerId") REFERENCES "User"(id) ON DELETE RESTRICT ON UPDATE CASCADE;
END $$;
