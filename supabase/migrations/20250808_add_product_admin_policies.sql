-- Add policies for products table to allow data insertion
-- This migration allows admins or service roles to insert products

-- Add INSERT policy for products (allow service role or admin users)
CREATE POLICY "Service role can insert products"
ON public.products
FOR INSERT
USING (true);

-- Add UPDATE policy for products (allow service role or admin users)  
CREATE POLICY "Service role can update products"
ON public.products
FOR UPDATE
USING (true);

-- Add DELETE policy for products (allow service role or admin users)
CREATE POLICY "Service role can delete products"
ON public.products
FOR DELETE
USING (true);
