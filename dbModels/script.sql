

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION "public"."nap_register_user"("email" varchar, "password" varchar)
  RETURNS "pg_catalog"."void" AS $BODY$
DECLARE
    hashed_password VARCHAR(100);
BEGIN
    -- Hash the password using bcrypt
    hashed_password := crypt(password, gen_salt('bf', 12));

    -- Insert the user into the users table
    INSERT INTO users (email, password, role, created_by) VALUES (email, hashed_password, 'Administrator', 'System');
END;
$$ LANGUAGE plpgsql;
