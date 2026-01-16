-- Seed data for resources table (remaining 6 resources)

INSERT INTO resources (id, title, description, resource_type, category, file_url, thumbnail_url, download_count, view_count, is_premium, tags)
VALUES
  ('r7777777-7777-7777-7777-777777777777', 'PropTech Adoption Guide', 'Strategic guide for implementing technology solutions, digital transformation, and software integration in insulation operations.', 'guide', 'Technology', '/resources/proptech-guide.pdf', 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761066720154_3934aa84.webp', 734, 1900, false, ARRAY['PropTech', 'Digital Transformation', 'Innovation']),
  
  ('r8888888-8888-8888-8888-888888888888', 'Business Tax Strategies for Contractors', 'Educational webinar on tax planning, deductions, depreciation strategies, and tax-efficient business structures.', 'webinar', 'Finance & Tax', '/resources/tax-strategies.mp4', 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761066723800_29655464.webp', 623, 1600, true, ARRAY['Tax Planning', 'Finance', 'Business']),
  
  ('r9999999-9999-9999-9999-999999999999', 'Energy Efficiency Standards Whitepaper', 'Policy analysis and practical strategies for meeting new energy efficiency standards with case studies.', 'report', 'Energy Efficiency', '/resources/energy-standards.pdf', 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761066713897_46e8720c.webp', 456, 1200, false, ARRAY['Energy Efficiency', 'Standards', 'Policy']),
  
  ('raaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Crisis Management for Contractors', 'Recorded webinar on handling emergencies, project delays, and crisis communication in contracting.', 'webinar', 'Risk Management', '/resources/crisis-management.mp4', 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761066725913_77311369.webp', 389, 980, false, ARRAY['Crisis Management', 'Emergency Response', 'Operations']),
  
  ('rbbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'NAREI E.P.I.C. Certification Program Guide', 'Comprehensive certification program covering Ethics, Professionalism, Industry Knowledge, and Competency standards.', 'guide', 'Certification', '/certification', 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1762917183435_29e2252d.webp', 3456, 8900, false, ARRAY['Certification', 'Professional Development', 'Ethics']),
  
  ('rcccccccc-cccc-cccc-cccc-cccccccccccc', 'Residential Insulation Best Practices', 'Complete guide to residential insulation installation, material selection, and quality assurance.', 'guide', 'Best Practices', '/resources/residential-guide.pdf', 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761066717726_aa78d710.webp', 2145, 5600, false, ARRAY['Residential', 'Installation', 'Quality'])
ON CONFLICT (id) DO NOTHING;
