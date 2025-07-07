-- Insert sample vaccines data
INSERT INTO vaccines (vaccine_name, disease_targeted, manufacturer, description, recommended_age_group) VALUES
('MMR', 'Measles, Mumps, Rubella', 'Merck & Co.', 'Combined vaccine for measles, mumps, and rubella', 'Children 12-15 months'),
('DTaP', 'Diphtheria, Tetanus, Pertussis', 'GlaxoSmithKline', 'Combined vaccine for diphtheria, tetanus, and pertussis', 'Children 2 months - 6 years'),
('Polio (IPV)', 'Poliomyelitis', 'Sanofi Pasteur', 'Inactivated poliovirus vaccine', 'Children 2 months - 18 years'),
('Hepatitis B', 'Hepatitis B', 'Merck & Co.', 'Hepatitis B virus vaccine', 'All ages'),
('Varicella', 'Chickenpox', 'Merck & Co.', 'Varicella (chickenpox) vaccine', 'Children 12-15 months'),
('Influenza', 'Seasonal Flu', 'Various manufacturers', 'Annual flu vaccine', 'All ages 6 months and older'),
('HPV', 'Human Papillomavirus', 'Merck & Co.', 'Human papillomavirus vaccine', 'Adolescents 11-12 years'),
('Meningococcal', 'Meningococcal disease', 'Sanofi Pasteur', 'Meningococcal conjugate vaccine', 'Adolescents 11-12 years'),
('Tdap', 'Tetanus, Diphtheria, Pertussis', 'GlaxoSmithKline', 'Tetanus, diphtheria, acellular pertussis booster', 'Adolescents and adults'),
('COVID-19', 'COVID-19', 'Various manufacturers', 'COVID-19 vaccine', 'All ages as recommended');

-- If you want to check if the data was inserted
-- SELECT * FROM vaccines;
