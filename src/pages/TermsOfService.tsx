import { SEOHead } from '@/components/SEOHead';
import { BackButton } from '@/components/ui/back-button';

export default function TermsOfService() {
  return (
    <>
      <SEOHead 
        title="Terms of Service"
        description="NAREIS Terms of Service - Read our terms and conditions for using our platform."
      />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <BackButton />
          <div className="bg-white rounded-lg shadow-lg p-8 mt-6">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
            <p className="text-sm text-gray-500 mb-8">Last Updated: November 25, 2025</p>

            <div className="space-y-8 text-gray-700">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                <p className="mb-2">By accessing or using the National Association of Real Estate Investors & Service Partners (NAREIS.org) platform, you agree to be bound by these Terms of Service ("Terms"), our Privacy Policy, and all applicable laws and regulations.</p>
                <p>If you do not agree with any part of these Terms, you must not use our services.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Membership Terms</h2>
                <h3 className="text-lg font-semibold mt-4 mb-2">2.1 Eligibility</h3>
                <p className="mb-2">Membership is available to real estate investors, service providers, and related professionals. You must be at least 18 years old and provide accurate information during registration.</p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">2.2 Application Process</h3>
                <p className="mb-2">All membership applications are subject to review and approval by NAREIS. We reserve the right to accept or reject any application at our sole discretion.</p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">2.3 Membership Tiers</h3>
                <p>Different membership tiers (Basic, Professional, Enterprise) provide varying levels of access to resources, events, and services as described on our platform.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Payment Obligations</h2>
                <h3 className="text-lg font-semibold mt-4 mb-2">3.1 Membership Fees</h3>
                <p className="mb-2">Membership fees are charged according to the selected tier and billing cycle (monthly or annual). All fees are non-refundable except as required by law.</p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">3.2 Payment Processing</h3>
                <p className="mb-2">Payments are processed securely through Stripe. By providing payment information, you authorize NAREIS to charge the applicable fees to your payment method.</p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">3.3 Automatic Renewal</h3>
                <p className="mb-2">Memberships automatically renew at the end of each billing cycle unless canceled at least 48 hours before renewal. You will be charged the then-current membership fee.</p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">3.4 Fee Changes</h3>
                <p>NAREIS reserves the right to modify membership fees with 30 days' notice. Continued use after fee changes constitutes acceptance.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Intellectual Property Rights</h2>
                <h3 className="text-lg font-semibold mt-4 mb-2">4.1 NAREIS Content</h3>
                <p className="mb-2">All content on NAREIS.org, including text, graphics, logos, images, videos, software, and educational materials, is the property of NAREIS or its licensors and is protected by copyright, trademark, and other intellectual property laws.</p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">4.2 Limited License</h3>
                <p className="mb-2">Members are granted a limited, non-exclusive, non-transferable license to access and use platform content for personal, non-commercial purposes only. You may not reproduce, distribute, modify, or create derivative works without written permission.</p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">4.3 User-Generated Content</h3>
                <p className="mb-2">By posting content (forum posts, comments, resources), you grant NAREIS a worldwide, royalty-free license to use, reproduce, modify, and display such content in connection with our services.</p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">4.4 Certification Marks</h3>
                <p>NAREIS certification badges and credentials are proprietary marks. Unauthorized use or misrepresentation of certification status is prohibited and may result in legal action.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">5. User Conduct and Responsibilities</h2>
                <h3 className="text-lg font-semibold mt-4 mb-2">5.1 Code of Ethics</h3>
                <p className="mb-2">Members must adhere to NAREIS's Code of Ethics, conducting themselves professionally and ethically in all interactions.</p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">5.2 Prohibited Activities</h3>
                <p className="mb-2">You agree not to:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Violate any laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Post false, misleading, or defamatory content</li>
                  <li>Harass, threaten, or abuse other members</li>
                  <li>Spam or solicit members inappropriately</li>
                  <li>Attempt to hack, disrupt, or compromise platform security</li>
                  <li>Share login credentials or access accounts without authorization</li>
                </ul>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">5.3 Account Security</h3>
                <p>You are responsible for maintaining the confidentiality of your account credentials and all activities under your account.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Liability Limitations</h2>
                <h3 className="text-lg font-semibold mt-4 mb-2">6.1 Disclaimer of Warranties</h3>
                <p className="mb-2">NAREIS.org is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.</p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">6.2 Limitation of Liability</h3>
                <p className="mb-2">To the maximum extent permitted by law, NAREIS shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, arising from your use of our services.</p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">6.3 Maximum Liability</h3>
                <p className="mb-2">NAREIS's total liability for any claims arising from these Terms or your use of services shall not exceed the amount you paid to NAREIS in the twelve months preceding the claim.</p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">6.4 Educational Content</h3>
                <p>Educational materials and resources are for informational purposes only and do not constitute professional advice. Members should consult qualified professionals for specific situations.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Dispute Resolution</h2>
                <h3 className="text-lg font-semibold mt-4 mb-2">7.1 Informal Resolution</h3>
                <p className="mb-2">Before filing any formal claim, you agree to contact NAREIS at legal@nareis.org to attempt informal resolution. We will work in good faith to resolve disputes within 30 days.</p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">7.2 Binding Arbitration</h3>
                <p className="mb-2">Any disputes not resolved informally shall be resolved through binding arbitration administered by the American Arbitration Association (AAA) under its Commercial Arbitration Rules. Arbitration shall take place in [State], and judgment may be entered in any court of competent jurisdiction.</p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">7.3 Class Action Waiver</h3>
                <p className="mb-2">You agree to resolve disputes on an individual basis only. You waive any right to participate in class actions or class-wide arbitration.</p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">7.4 Governing Law</h3>
                <p>These Terms are governed by the laws of [State], without regard to conflict of law principles.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Termination Policies</h2>
                <h3 className="text-lg font-semibold mt-4 mb-2">8.1 Termination by Member</h3>
                <p className="mb-2">You may cancel your membership at any time through your account settings or by contacting support@nareis.org. Cancellation takes effect at the end of the current billing cycle. No refunds are provided for partial periods.</p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">8.2 Termination by NAREIS</h3>
                <p className="mb-2">NAREIS reserves the right to suspend or terminate your membership immediately, without notice, for:</p>
                <ul className="list-disc ml-6 space-y-1">
                  <li>Violation of these Terms or Code of Ethics</li>
                  <li>Non-payment of fees</li>
                  <li>Fraudulent or illegal activity</li>
                  <li>Conduct harmful to NAREIS or its members</li>
                </ul>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">8.3 Effect of Termination</h3>
                <p className="mb-2">Upon termination, your access to member-only content and services will cease immediately. Sections of these Terms that by nature should survive (intellectual property, liability limitations, dispute resolution) remain in effect.</p>
                
                <h3 className="text-lg font-semibold mt-4 mb-2">8.4 Data Retention</h3>
                <p>Following termination, NAREIS may retain your data as described in our Privacy Policy or as required by law.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">9. Privacy and Data Protection</h2>
                <p className="mb-2">Your use of NAREIS.org is subject to our Privacy Policy, which describes how we collect, use, and protect your personal information. By using our services, you consent to our data practices as described in the Privacy Policy.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">10. Modifications to Terms</h2>
                <p className="mb-2">NAREIS reserves the right to modify these Terms at any time. Material changes will be communicated via email or platform notification at least 30 days before taking effect. Continued use after changes constitutes acceptance of modified Terms.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">11. Indemnification</h2>
                <p className="mb-2">You agree to indemnify, defend, and hold harmless NAREIS, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of services, violation of these Terms, or infringement of any third-party rights.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">12. Severability</h2>
                <p className="mb-2">If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">13. Entire Agreement</h2>
                <p className="mb-2">These Terms, together with the Privacy Policy and any other legal notices published on NAREIS.org, constitute the entire agreement between you and NAREIS regarding your use of our services.</p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">14. Contact Information</h2>
                <p className="mb-2">For questions about these Terms of Service, please contact:</p>
                <div className="bg-gray-50 p-4 rounded-lg mt-3">
                  <p className="font-semibold">National Association of Real Estate Investors & Service Partners</p>
                  <p>Email: legal@nareis.org</p>
                  <p>Phone: 717-725-1513</p>
                  <p>Address: 5 Great Valley Pkwy Ste 275, Malvern, PA 19355</p>

                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
