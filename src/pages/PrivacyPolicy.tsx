import { SEOHead } from '@/components/SEOHead';
import { BackButton } from '@/components/ui/back-button';

export default function PrivacyPolicy() {
  return (
    <>
      <SEOHead 
        title="Privacy Policy"
        description="NAREIS Privacy Policy - Learn how we collect, use, and protect your personal information."
      />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton />
          <div className="bg-white rounded-lg shadow-lg p-8 mt-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
            <p className="text-sm text-gray-500 mb-8">Effective Date: November 25, 2025</p>

            <div className="space-y-8 text-gray-700">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p className="mb-3">The National Association of Real Estate Investors & Service Partners ("NAREIS," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website NAREIS.org and use our services.</p>
                <p>By accessing or using our services, you agree to this Privacy Policy. If you do not agree, please discontinue use immediately.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-2">2.1 Personal Information</h3>
                <p className="mb-3">We collect information you provide directly:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>Name, email address, phone number</li>
                  <li>Company name, job title, business address</li>
                  <li>Professional credentials and certifications</li>
                  <li>Profile photo and biography</li>
                  <li>Payment information (processed securely via Stripe)</li>
                  <li>Membership tier and preferences</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-2">2.2 Automatically Collected Information</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>IP address, browser type, device information</li>
                  <li>Pages visited, time spent, referring URLs</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Geolocation data (with consent)</li>
                  <li>Usage analytics and interaction patterns</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-2">2.3 Information from Third Parties</h3>
                <p>We may receive information from business partners, public databases, marketing providers, and social media platforms when you interact with us through those channels.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
                <p className="mb-3">We use collected information for:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Providing, maintaining, and improving our services</li>
                  <li>Processing membership applications and payments</li>
                  <li>Sending administrative communications and updates</li>
                  <li>Facilitating networking and member directory features</li>
                  <li>Providing educational content and certifications</li>
                  <li>Organizing events and managing registrations</li>
                  <li>Conducting analytics and research</li>
                  <li>Preventing fraud and ensuring security</li>
                  <li>Complying with legal obligations</li>
                  <li>Marketing our services (with consent)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Information Disclosure</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-2">4.1 Third-Party Service Providers</h3>
                <p className="mb-3">We share information with trusted service providers:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li><strong>Stripe:</strong> Payment processing (PCI-DSS compliant)</li>
                  <li><strong>Supabase:</strong> Database and authentication services</li>
                  <li><strong>Analytics Providers:</strong> Google Analytics, usage tracking</li>
                  <li><strong>Email Services:</strong> Transactional and marketing emails</li>
                  <li><strong>Cloud Hosting:</strong> Infrastructure and storage providers</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-2">4.2 Member Directory</h3>
                <p className="mb-4">Certain profile information (name, company, location, professional details) may be visible to other members through our directory feature. You control visibility settings in your profile.</p>

                <h3 className="text-xl font-semibold text-gray-800 mb-2">4.3 Legal Requirements</h3>
                <p className="mb-4">We may disclose information when required by law, subpoena, court order, or to protect our rights, property, or safety.</p>

                <h3 className="text-xl font-semibold text-gray-800 mb-2">4.4 Business Transfers</h3>
                <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Method of Disclosure</h2>
                <p className="mb-3">Information is disclosed through:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Secure API connections with encrypted data transmission</li>
                  <li>Encrypted database access with role-based permissions</li>
                  <li>Secure file transfer protocols for document sharing</li>
                  <li>Contractual agreements with data processing addendums</li>
                  <li>Member-controlled visibility settings in directory</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security</h2>
                <p className="mb-3">We implement comprehensive security measures:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li><strong>Encryption:</strong> TLS/SSL for data in transit, AES-256 for data at rest</li>
                  <li><strong>Access Controls:</strong> Multi-factor authentication, role-based access</li>
                  <li><strong>Infrastructure:</strong> Secure cloud hosting with regular backups</li>
                  <li><strong>Monitoring:</strong> 24/7 security monitoring and intrusion detection</li>
                  <li><strong>Compliance:</strong> Regular security audits and vulnerability assessments</li>
                  <li><strong>Payment Security:</strong> PCI-DSS compliant payment processing</li>
                </ul>
                <p className="text-sm italic">While we use industry-standard security measures, no system is 100% secure. We cannot guarantee absolute security.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Privacy Rights</h2>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-2">7.1 General Rights</h3>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update inaccurate or incomplete information</li>
                  <li><strong>Deletion:</strong> Request deletion of your data (subject to legal obligations)</li>
                  <li><strong>Portability:</strong> Receive your data in a structured format</li>
                  <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong>Restriction:</strong> Limit how we process your data</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-2">7.2 GDPR Rights (EU Residents)</h3>
                <p className="mb-4">If you are in the European Economic Area, you have additional rights under GDPR, including the right to object to processing and lodge complaints with supervisory authorities.</p>

                <h3 className="text-xl font-semibold text-gray-800 mb-2">7.3 CCPA Rights (California Residents)</h3>
                <p className="mb-4">California residents have the right to know what personal information is collected, request deletion, opt-out of sale (we do not sell personal information), and non-discrimination for exercising rights.</p>

                <p className="font-semibold">To exercise your rights, contact us at privacy@nareis.org</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies and Tracking Technologies</h2>
                <p className="mb-3">We use cookies and similar technologies for:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li><strong>Essential Cookies:</strong> Required for site functionality and authentication</li>
                  <li><strong>Analytics Cookies:</strong> Understanding usage patterns and improving services</li>
                  <li><strong>Preference Cookies:</strong> Remembering your settings and preferences</li>
                  <li><strong>Marketing Cookies:</strong> Delivering relevant advertisements (with consent)</li>
                </ul>
                <p>You can control cookies through your browser settings. Disabling certain cookies may limit functionality.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Data Retention</h2>
                <p className="mb-3">We retain personal information for as long as necessary to:</p>
                <ul className="list-disc pl-6 mb-4 space-y-1">
                  <li>Provide services and maintain your membership</li>
                  <li>Comply with legal, tax, and accounting obligations</li>
                  <li>Resolve disputes and enforce agreements</li>
                  <li>Maintain business records and analytics</li>
                </ul>
                <p>After termination of membership, we retain certain information for 7 years for legal compliance, then securely delete or anonymize data.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. International Data Transfers</h2>
                <p>Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place, including Standard Contractual Clauses approved by the European Commission for EU data transfers.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Children's Privacy</h2>
                <p>Our services are not directed to individuals under 18. We do not knowingly collect personal information from children. If we learn we have collected information from a child, we will promptly delete it.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Third-Party Links</h2>
                <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review their privacy policies.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to This Privacy Policy</h2>
                <p>We may update this Privacy Policy periodically. We will notify you of material changes via email or prominent notice on our website. Continued use after changes constitutes acceptance of the updated policy.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Information</h2>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <p className="mb-2"><strong>National Association of Real Estate Investors & Service Partners</strong></p>
                  <p className="mb-2">Email: <a href="mailto:privacy@nareis.org" className="text-blue-600 hover:underline">privacy@nareis.org</a></p>
                  <p className="mb-2">General Inquiries: <a href="mailto:info@nareis.org" className="text-blue-600 hover:underline">info@nareis.org</a></p>
                  <p className="mb-2">Phone: 717-725-1513</p>

                  <p>Address: 123 Main Street, Suite 100, City, State 12345</p>
                </div>
              </section>

              <section className="border-t pt-6 mt-8">
                <p className="text-sm text-gray-600">This Privacy Policy is effective as of November 25, 2025. By using NAREIS.org, you acknowledge that you have read and understood this Privacy Policy.</p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
