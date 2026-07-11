ALTER TABLE users ADD COLUMN blocked BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN is_super_owner BOOLEAN DEFAULT FALSE;

-- Mark first admin/owner account as super owner
UPDATE users SET is_super_owner = TRUE WHERE email = 'sribalajimedisystemsofficial@gmail.com' LIMIT 1;
