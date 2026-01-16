-- Seed data for resources table (first 6 resources)

INSERT INTO resources (id, title, description, resource_type, category, file_url, thumbnail_url, download_count, view_count, is_premium, tags)
VALUES
  ('r1111111-1111-1111-1111-111111111111', '2025 Insulation Industry Market Report', 'Comprehensive analysis of market trends, investment opportunities, and economic forecasts for the insulation industry.', 'report', 'Market Analysis', '/resources/market-report-2025.pdf', 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761066709657_c1e0fbc7.webp', 1247, 3500, false, ARRAY['Market Trends', 'Industry Analysis', 'Economics']),
  
  ('r2222222-2222-2222-2222-222222222222', 'Contractor Agreement Template', 'Legally vetted template for contractor agreements with customizable clauses and best practices.', 'template', 'Legal & Compliance', '/resources/contractor-agreement.docx', 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761066714756_82ae8160.webp', 2341, 5200, false, ARRAY['Legal', 'Contracts', 'Templates']),
  
  ('r3333333-3333-3333-3333-333333333333', 'Sustainable Building Practices Guide', 'Complete guide to implementing eco-friendly insulation methods, green certifications, and energy-efficient designs.', 'guide', 'Sustainability', '/resources/sustainable-guide.pdf', 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761066717726_aa78d710.webp', 892, 2100, false, ARRAY['Green Building', 'Sustainability', 'Best Practices']),
  
  ('r4444444-4444-4444-4444-444444444444', 'Mastering Spray Foam Applications', 'Expert webinar recording covering techniques, common pitfalls, and quality control for spray foam insulation.', 'webinar', 'Professional Development', '/resources/spray-foam-webinar.mp4', 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761066721998_b838b99f.webp', 567, 1800, true, ARRAY['Spray Foam', 'Training', 'Techniques']),
  
  ('r5555555-5555-5555-5555-555555555555', 'Commercial Insulation Investment Analysis', 'In-depth report on commercial insulation market dynamics, ROI analysis, and investment strategies.', 'report', 'Market Analysis', '/resources/commercial-analysis.pdf', 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761066711411_bc49cc44.webp', 1089, 2800, false, ARRAY['Commercial', 'Investment', 'Analytics']),
  
  ('r6666666-6666-6666-6666-666666666666', 'Safety Compliance Checklist', 'Comprehensive checklist for workplace safety including OSHA requirements and best practices.', 'template', 'Safety & Compliance', '/resources/safety-checklist.xlsx', 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761066716813_83aa810e.webp', 1876, 4200, false, ARRAY['Safety', 'OSHA', 'Compliance'])
ON CONFLICT (id) DO NOTHING;
