export default function Terms() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-4 text-[var(--snap-green)]">Terms of Service</h1>
        <p className="text-gray-300">Effective Date: October 15, 2025</p>

        <p className="text-gray-300 mt-6">
          Welcome to <strong>SnapFIT</strong> (“we,” “us,” “our”). By accessing or using our website,
          mobile applications, AI meal scanner, or related services (the “Services”), you agree to be
          bound by these Terms of Service (“Terms”). If you do not agree, do not use the Services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">1. Eligibility</h2>
        <p className="text-gray-300">
          You must be at least 13 years old (or the minimum age of digital consent in your
          country) to use SnapFIT. If you are under 18, you may only use the Services with permission
          of a parent or legal guardian.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">2. Health Disclaimer</h2>
        <p className="text-gray-300">
          SnapFIT provides AI-assisted fitness and nutrition guidance for educational purposes only.
          We are <strong>not a medical service</strong> and do not provide medical advice, diagnosis, or treatment.
          Always consult with a qualified healthcare provider before making changes to your health,
          nutrition, or exercise routines. Use of SnapFIT is at your own risk.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">3. Accounts</h2>
        <p className="text-gray-300">
          You are responsible for maintaining the confidentiality of your account credentials and
          for all activity under your account. You agree to provide accurate registration information
          and notify us if you suspect unauthorized access.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">4. Acceptable Use</h2>
        <p className="text-gray-300">
          You agree not to misuse the Services. This includes:
        </p>
        <ul className="list-disc ml-6 text-gray-300 mt-2 space-y-2">
          <li>Uploading harmful or illegal content</li>
          <li>Attempting to reverse-engineer code or AI models</li>
          <li>Sharing fraudulent or misleading data</li>
          <li>Harassing or abusing others</li>
          <li>Trying to bypass security or system limits</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-2">5. AI Features</h2>
        <p className="text-gray-300">
          Some features use AI for meal analysis, nutrition estimates, or recommendations. AI
          results may be inaccurate, incomplete, or approximate. You agree not to rely solely on AI
          outputs for health decisions and understand AI-based estimates cannot be guaranteed.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">6. User Content</h2>
        <p className="text-gray-300">
          You retain ownership of content you upload, such as meal images or progress logs. By using
          SnapFIT, you grant us a license to process that content for the purpose of providing the
          Services (e.g. AI analysis, goal tracking, app improvements).
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">7. Subscriptions & Payments (Future Feature)</h2>
        <p className="text-gray-300">
          SnapFIT may offer paid plans in the future. Pricing, billing, refund policy, and
          cancellation terms will be updated in this section when paid services launch. If you
          subscribe through Apple or Google Play, billing will follow their platform policies.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">8. Data & Privacy</h2>
        <p className="text-gray-300">
          Your use of the Services is also governed by our{" "}
          <a href="/privacy" className="text-[var(--snap-green)] underline">Privacy Policy</a>. By using
          SnapFIT, you consent to data handling practices described there.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">9. Termination</h2>
        <p className="text-gray-300">
          We may suspend or terminate your account if you violate these Terms or use the Service in
          a harmful or illegal manner. You may also delete your account at any time by contacting us.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">10. Disclaimers</h2>
        <p className="text-gray-300">
          SnapFIT is provided “as is” without warranties of any kind. We do not guarantee that the
          Services will always be available, accurate, or secure. To the fullest extent permitted by
          law, we disclaim all warranties, express or implied.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">11. Limitation of Liability</h2>
        <p className="text-gray-300">
          To the maximum extent permitted by law, SnapFIT is not liable for indirect, incidental, or
          consequential damages including personal injury, data loss, or lost profits resulting from
          your use of the Services.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">12. Changes to Terms</h2>
        <p className="text-gray-300">
          We may update these Terms at any time. The latest version will always be available at{" "}
          <a href="/terms" className="text-[var(--snap-green)] underline">snapfit.app/terms</a>.
          Continued use after updates means you accept the new Terms.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">13. Contact</h2>
        <p className="text-gray-300">
          For questions about these Terms, contact us at{" "}
          <a href="mailto:snapfitai.app@gmail.com" className="text-[var(--snap-green)] underline">
            snapfitai.app@gmail.com
          </a>.
        </p>
      </div>
    </div>
  );
}
