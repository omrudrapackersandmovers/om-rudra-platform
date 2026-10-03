-- Rename the domain in saved company contact settings and website links.
UPDATE company_settings
SET data = replace(data, '1stompackersandmovers.com', 'omrudrapackersandmovers.com'),
    updated_at = CURRENT_TIMESTAMP
WHERE key = 'company_config'
  AND json_valid(data)
  AND instr(data, '1stompackersandmovers.com') > 0;
