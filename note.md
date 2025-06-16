## generate module

nest generate module modules/users

## generate controller

nest generate controller modules/users

## generate service

nest generate service modules/users

## generate resource
nest g resource modules/categories	

## chạy migration

npm run migration:run

## generate migration
npm run migration:create



 ## xoá hết dữ liệu để chạy lại migrate 

 DO $$ DECLARE
    r RECORD;
BEGIN
    -- Disable all constraints temporarily
    EXECUTE 'SET session_replication_role = replica';

    -- Drop all tables
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;

    -- Re-enable constraints
    EXECUTE 'SET session_replication_role = origin';
END $$;
