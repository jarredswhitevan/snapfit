export default function Privacy() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-4 text-[var(--snap-green)]">Privacy Policy</h1>
        <p className="text-gray-300">Effective date: October 15, 2025</p>

        <p className="text-gray-300 mt-6">
          This Privacy Policy explains how <strong>SnapFIT</strong> (“we,” “us,” “our”) collects,
          uses, and discloses information when you use our websites, mobile and web applications,
          and related services (collectively, the “Services”). By using the Services, you agree to
          this Policy.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">Who we are & how to contact us</h2>
        <p className="text-gray-300">
          Business name: <strong>SnapFIT</strong><br />
          Contact email: <a className="text-[var(--snap-green)]" href="mailto:snapfitai.app@gmail.com">snapfitai.app@gmail.com</a><br />
          Business location: Toledo, Ohio, USA
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">Information we collect</h2>
        <ul className="list-disc ml-6 text-gray-300 space-y-2">
          <li>
            <strong>Account & identity data</strong>: email address, display name, authentication
            tokens (via Firebase Authentication).
          </li>
          <li>
            <strong>Profile & goals</strong>: sex/gender (optional or “prefer not to say”), age,
            height/weight, activity level, fitness goals, target weight/body type.
          </li>
          <li>
            <strong>Fitness content</strong>: meal images you upload, AI analysis outputs (e.g.,
            estimated calories/macros), logged meals, water intake, and (if you opt in later)
            progress photos/body-scan metrics.
          </li>
          <li>
            <strong>Usage & device data</strong>: app interactions, pages viewed, timestamps,
            approximate location from IP, device/browser information, crash/diagnostic logs.
          </li>
          <li>
            <strong>Cookies & local storage</strong>: used for session management, preferences, and
            saving logs/goals on your device. You can control cookies in your browser settings.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-2">How we use information</h2>
        <ul className="list-disc ml-6 text-gray-300 space-y-2">
          <li>Provide the Services (authentication, goal setup, nutrition analysis, logging).</li>
          <li>Run AI features (e.g., analyze meal images to estimate calories and macros).</li>
          <li>Improve accuracy, performance, and safety of the Services.</li>
          <li>Communicate with you about updates, security, and support.</li>
          <li>Comply with legal obligations and enforce our Terms.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-2">AI processing & third parties</h2>
        <p className="text-gray-300">
          Certain features use third-party AI providers to process content you choose to submit
          (e.g., meal photos). For example, we may send resized versions of images to an AI model
          to identify foods and estimate calories/macros, and we store the AI’s output with your
          account. We currently use service providers including (but not limited to):
        </p>
        <ul className="list-disc ml-6 text-gray-300 space-y-2 mt-2">
          <li>
            <strong>Firebase</strong> (Google) for authentication and (later) data storage.
          </li>
          <li>
            <strong>Vercel</strong> for hosting our web app.
          </li>
          <li>
            <strong>AI model provider(s)</strong> for image understanding and text generation/analysis.
          </li>
          <li>
            Optional analytics and crash reporting tools to improve reliability.
          </li>
        </ul>
        <p className="text-gray-300 mt-2">
          Content you submit to AI features may be processed by those providers under their terms
          and privacy policies. We take steps to minimize data sent (e.g., compressing images) and
          to avoid sending unnecessary identifiers with content.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">Legal bases (EEA/UK users)</h2>
        <p className="text-gray-300">
          Where GDPR or similar laws apply, we process personal data based on one or more of:
          performance of a contract (providing the Services), legitimate interests (e.g., security,
          service improvement), consent (where required, e.g., certain analytics/notifications),
          and legal obligations.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">Sharing of information</h2>
        <ul className="list-disc ml-6 text-gray-300 space-y-2">
          <li>
            <strong>Service providers</strong> (hosting, authentication, AI processing, analytics,
            customer support) under agreements that restrict their use of your data.
          </li>
          <li>
            <strong>Legal, safety, and compliance</strong> when required by law or to protect rights,
            safety, and the integrity of the Services.
          </li>
          <li>
            <strong>Business changes</strong>: if we undergo a merger, acquisition, or asset sale,
            your data may be transferred as part of that transaction.
          </li>
        </ul>
        <p className="text-gray-300 mt-2">
          We do not engage in unexpected advertising use of your meal photos or fitness content.
          We do not enable third parties to identify you from AI training content. We may
          use de-identified/aggregated data to improve features and performance.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">Data retention</h2>
        <p className="text-gray-300">
          We retain personal data for as long as needed to provide the Services and for legitimate
          business or legal purposes (e.g., security, fraud prevention). You can request deletion of
          your account and associated data (see “Your rights” below). Some residual or backup copies
          may remain for a limited period.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">Security</h2>
        <p className="text-gray-300">
          We use reasonable technical and organizational measures to protect information. No system
          is 100% secure, and you are responsible for safeguarding your login credentials and using
          strong passwords.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">Children’s privacy</h2>
        <p className="text-gray-300">
          The Services are not directed to children under 13 (or the applicable age in your
          jurisdiction). We do not knowingly collect personal information from children under that
          age. If you believe a child has provided personal information, contact us to request
          deletion.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">International data transfers</h2>
        <p className="text-gray-300">
          We may process and store information in the United States and other countries where we or
          our providers operate. By using the Services, you understand your data may be transferred
          to jurisdictions with different data protection laws than your own. Where required, we use
          appropriate safeguards (e.g., standard contractual clauses).
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">Your choices</h2>
        <ul className="list-disc ml-6 text-gray-300 space-y-2">
          <li>
            <strong>Access, update, delete</strong>: manage your account data in the app; contact us
            to request account deletion.
          </li>
          <li>
            <strong>Notifications</strong>: you can enable/disable reminders in your device or app settings.
          </li>
          <li>
            <strong>Cookies</strong>: control cookies in your browser settings; some features may rely on them.
          </li>
          <li>
            <strong>AI content</strong>: only upload content you have the right to share; you may delete
            your meal logs/images from your account where supported.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-2">Rights for certain regions</h2>
        <p className="text-gray-300">
          Depending on your location, you may have rights to request access, correction, deletion,
          portability, restriction, or to object to processing. You may also have the right to lodge
          a complaint with a supervisory authority. To exercise rights, contact{" "}
          <a className="text-[var(--snap-green)]" href="mailto:snapfitai.app@gmail.com">snapfitai.app@gmail.com</a>.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">Third-party links & integrations</h2>
        <p className="text-gray-300">
          The Services may link to third-party sites or allow optional integrations (e.g., Apple
          Health/Google Fit in the future). Your use of third-party services is governed by their
          policies. We are not responsible for their practices.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">Changes to this policy</h2>
        <p className="text-gray-300">
          We may update this Policy from time to time. We will post the updated version with a new
          effective date. If changes are material, we will provide additional notice where required.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">Contact</h2>
        <p className="text-gray-300">
          Questions or requests? Email us at{" "}
          <a className="text-[var(--snap-green)]" href="mailto:snapfitai.app@gmail.com">snapfitai.app@gmail.com</a>.
        </p>
      </div>
    </div>
  );
}

