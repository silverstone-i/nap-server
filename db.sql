

CREATE EXTENSION IF NOT EXISTS pgcrypto;



CREATE OR REPLACE FUNCTION register_user(email VARCHAR, password VARCHAR) RETURNS VOID AS $$
DECLARE
    hashed_password VARCHAR;
BEGIN
    -- Hash the password using bcrypt
    hashed_password := crypt(password, gen_salt('bf', 12));

    - Insert the user into the users table
    INSERT INTO users (email, password) VALUES (email, hashed_password);
END;
$$ LANGUAGE plpgsql;
