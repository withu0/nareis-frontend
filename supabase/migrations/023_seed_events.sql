-- Seed data for events table (8 upcoming events)

INSERT INTO events (id, title, description, event_type, start_date, end_date, location, virtual_link, is_virtual, max_attendees, registration_deadline, status, image_url)
VALUES
  ('e1111111-1111-1111-1111-111111111111', 'Monthly Insulation Industry Networking Mixer', 'Join fellow insulation professionals for an evening of networking, sharing insights, and building valuable connections. Light refreshments provided.', 'networking', '2025-12-15 18:00:00', '2025-12-15 21:00:00', 'The Grand Hotel, Downtown Austin', NULL, false, 80, '2025-12-13 23:59:59', 'upcoming', 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761066096715_8d520cf7.webp'),
  
  ('e2222222-2222-2222-2222-222222222222', 'Virtual Coffee Chat: Energy Efficiency Trends', 'Casual virtual networking session to discuss current energy efficiency trends and market opportunities. Bring your coffee and questions!', 'virtual', '2025-12-10 09:00:00', '2025-12-10 10:00:00', 'Online', 'https://zoom.us/j/narei-coffee', true, 50, NULL, 'upcoming', 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761066095928_f6836e42.webp'),
  
  ('e3333333-3333-3333-3333-333333333333', 'Local Chapter Meetup - West Coast', 'Monthly meetup for West Coast chapter members. Discuss local market conditions, share projects, and connect with nearby contractors.', 'meetup', '2025-12-18 17:30:00', '2025-12-18 19:30:00', 'Riverside Cafe, Portland OR', NULL, false, 25, '2025-12-17 23:59:59', 'upcoming', 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761066097497_c16fd1e8.webp'),
  
  ('e4444444-4444-4444-4444-444444444444', 'Speed Networking: Connect in 60 Seconds', 'Fast-paced networking event where you meet 20+ professionals in structured 3-minute sessions. Perfect for expanding your network quickly!', 'networking', '2025-12-20 18:00:00', '2025-12-20 20:30:00', 'Innovation Hub, Tech District Denver', NULL, false, 60, '2025-12-18 23:59:59', 'upcoming', 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761066099099_f1eac3a9.webp'),
  
  ('e5555555-5555-5555-5555-555555555555', 'Industry Leaders Panel & Networking', 'Hear from top insulation industry leaders followed by networking reception. Learn from the best and connect with industry pioneers.', 'conference', '2026-01-15 17:00:00', '2026-01-15 21:00:00', 'Convention Center, Main Hall Chicago', 'https://zoom.us/j/narei-panel', false, 150, '2026-01-12 23:59:59', 'upcoming', 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761066094619_3973b173.webp'),
  
  ('e6666666-6666-6666-6666-666666666666', 'Workshop: Spray Foam Best Practices', 'Interactive workshop on spray foam application techniques, safety protocols, and quality control. Includes hands-on demonstrations.', 'workshop', '2025-12-22 13:00:00', '2025-12-22 16:00:00', 'Training Center, Suite 200 Phoenix', NULL, false, 30, '2025-12-20 23:59:59', 'upcoming', 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761066098316_fa43003e.webp'),
  
  ('e7777777-7777-7777-7777-777777777777', 'Annual NAREI Conference 2026', 'The premier event for insulation professionals. Three days of education, networking, and industry innovation. Early bird pricing available!', 'conference', '2026-03-10 08:00:00', '2026-03-12 17:00:00', 'Las Vegas Convention Center', NULL, false, 500, '2026-02-28 23:59:59', 'upcoming', 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761066094619_3973b173.webp'),
  
  ('e8888888-8888-8888-8888-888888888888', 'Webinar: Building Code Updates 2026', 'Stay ahead of regulatory changes with this comprehensive webinar covering new building codes and energy efficiency requirements.', 'webinar', '2026-01-08 14:00:00', '2026-01-08 15:30:00', 'Online', 'https://zoom.us/j/narei-codes', true, 200, NULL, 'upcoming', 'https://d64gsuwffb70l.cloudfront.net/68f0b04a17bd9170fa489b6d_1761066095928_f6836e42.webp')
ON CONFLICT (id) DO NOTHING;
