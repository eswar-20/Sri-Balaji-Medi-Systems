-- Restrict is_super_owner flag only to the user sribalajimedisystemsofficial@gmail.com
UPDATE users SET is_super_owner = FALSE;
UPDATE users SET is_super_owner = TRUE WHERE email = 'sribalajimedisystemsofficial@gmail.com';
