CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION "public"."nap_register_user"("email" varchar, "password" varchar)
  RETURNS "pg_catalog"."void" AS $BODY$
DECLARE
    hashed_password VARCHAR(100);
BEGIN
    -- Hash the password using bcrypt
    hashed_password := crypt(password, gen_salt('bf', 12));

    -- Insert the user into the users table
    INSERT INTO employees (first_name, last_name, email, is_user, name, password_hash, role, created_by) 
		VALUES ('nap', 'user', email, true, 'nap user', hashed_password, 'administrator', 'System');
END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100