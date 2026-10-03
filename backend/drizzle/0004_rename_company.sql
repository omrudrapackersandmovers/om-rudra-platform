-- Update saved company branding while preserving contact and payment identifiers.
UPDATE company_settings
SET data = replace(
  replace(
    replace(
      replace(data,
        '1st Om Packers and Movers', 'Om Rudra Packers and Movers'),
      '1st Om Packers & Movers', 'Om Rudra Packers and Movers'),
    '1ST OM PACKERS AND MOVERS', 'OM RUDRA PACKERS AND MOVERS'),
  '1st Om', 'Om Rudra'),
  updated_at = CURRENT_TIMESTAMP
WHERE key = 'company_config'
  AND json_valid(data)
  AND (instr(data, '1st Om') > 0 OR instr(data, '1ST OM') > 0);
