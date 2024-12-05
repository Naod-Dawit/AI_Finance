import React from "react";

export default function Terms() {
  return (
    <>
    
    
    <div className="p-6 max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">
        Terms and Conditions of Finance Manager
      </h1>
      <ol className="list-decimal pl-6 space-y-4 text-gray-800">
        <li>
          <h2 className="font-semibold text-lg">Acceptance of Terms</h2>
          <p>
            By creating an account, you agree to comply with and be bound by
            these Terms and Conditions and our Privacy Policy. If you do not
            agree, please do not use our services.
          </p>
        </li>
        <li>
          <h2 className="font-semibold text-lg">User Responsibilities</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must provide accurate and complete information during signup.</li>
            <li>
              You are responsible for maintaining the confidentiality of your account
              credentials.
            </li>
            <li>You agree not to use the platform for any unlawful or harmful purposes.</li>
          </ul>
        </li>
        <li>
          <h2 className="font-semibold text-lg">Use of Services</h2>
          <p>
            Our platform is intended for personal use only and may not be used for
            commercial purposes without prior consent. We reserve the right to
            modify, suspend, or discontinue services at any time without notice.
          </p>
        </li>
        <li>
          <h2 className="font-semibold text-lg">Privacy</h2>
          <p>
            Your personal data will be handled in accordance with our Privacy Policy. By
            using our services, you consent to the collection, use, and storage of your
            information as described.
          </p>
        </li>
        <li>
          <h2 className="font-semibold text-lg">Prohibited Activities</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Upload or transmit malicious software or harmful content.</li>
            <li>Violate any applicable laws or regulations.</li>
            <li>
              Interfere with the operation of our platform or the accounts of other
              users.
            </li>
          </ul>
        </li>
        <li>
          <h2 className="font-semibold text-lg">Liability</h2>
          <p>
            Finance Manager is not responsible for any financial losses or decisions made
            based on data or insights provided by the platform. The platform is provided
            "as is" without warranties of any kind.
          </p>
        </li>
        <li>
          <h2 className="font-semibold text-lg">Termination of Account</h2>
          <p>
            We reserve the right to suspend or terminate your account at any time if you
            violate these terms.
          </p>
        </li>
        <li>
          <h2 className="font-semibold text-lg">Changes to Terms</h2>
          <p>
            We may update these Terms and Conditions from time to time. Continued use of
            our services after changes implies acceptance of the updated terms.
          </p>
        </li>
        <li>
          <h2 className="font-semibold text-lg">Governing Law</h2>
          <p>
            These Terms and Conditions are governed by the laws of [Your Jurisdiction].
            Any disputes will be resolved in the courts of [Your Jurisdiction].
          </p>
        </li>
      </ol>
      <p className="mt-6 text-center">
        By clicking <strong>"Sign Up"</strong>, you confirm that you have read and
        agreed to these Terms and Conditions.
      </p>
    </div>
    </>
  );
}
