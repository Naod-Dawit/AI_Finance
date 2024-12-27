import React from "react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center py-12 px-6">
      <div className="p-8 max-w-4xl bg-gradient-to-b from-gray-800 to-gray-700 rounded-2xl shadow-2xl">
        <h1 className="text-4xl font-extrabold text-green-400 mb-8 text-center">
          Terms and Conditions of Finance Manager
        </h1>
        <ol className="list-decimal pl-6 space-y-6 text-gray-300">
          <li>
            <h2 className="font-semibold text-lg text-green-400">Acceptance of Terms</h2>
            <p className="text-gray-300">
              By creating an account, you agree to comply with and be bound by
              these Terms and Conditions and our Privacy Policy. If you do not
              agree, please do not use our services.
            </p>
          </li>
          <li>
            <h2 className="font-semibold text-lg text-green-400">User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>You must provide accurate and complete information during signup.</li>
              <li>
                You are responsible for maintaining the confidentiality of your account
                credentials.
              </li>
              <li>You agree not to use the platform for any unlawful or harmful purposes.</li>
            </ul>
          </li>
          <li>
            <h2 className="font-semibold text-lg text-green-400">Use of Services</h2>
            <p className="text-gray-300">
              Our platform is intended for personal use only and may not be used for
              commercial purposes without prior consent. We reserve the right to
              modify, suspend, or discontinue services at any time without notice.
            </p>
          </li>
          <li>
            <h2 className="font-semibold text-lg text-green-400">Privacy</h2>
            <p className="text-gray-300">
              Your personal data will be handled in accordance with our Privacy Policy. By
              using our services, you consent to the collection, use, and storage of your
              information as described.
            </p>
          </li>
          <li>
            <h2 className="font-semibold text-lg text-green-400">Prohibited Activities</h2>
            <p className="text-gray-300">You agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li>Upload or transmit malicious software or harmful content.</li>
              <li>Violate any applicable laws or regulations.</li>
              <li>
                Interfere with the operation of our platform or the accounts of other
                users.
              </li>
            </ul>
          </li>
          <li>
            <h2 className="font-semibold text-lg text-green-400">Liability</h2>
            <p className="text-gray-300">
              Finance Manager is not responsible for any financial losses or decisions made
              based on data or insights provided by the platform. The platform is provided
              "as is" without warranties of any kind.
            </p>
          </li>
          <li>
            <h2 className="font-semibold text-lg text-green-400">Termination of Account</h2>
            <p className="text-gray-300">
              We reserve the right to suspend or terminate your account at any time if you
              violate these terms.
            </p>
          </li>
          <li>
            <h2 className="font-semibold text-lg text-green-400">Changes to Terms</h2>
            <p className="text-gray-300">
              We may update these Terms and Conditions from time to time. Continued use of
              our services after changes implies acceptance of the updated terms.
            </p>
          </li>
          <li>
            <h2 className="font-semibold text-lg text-green-400">Governing Law</h2>
            <p className="text-gray-300">
              These Terms and Conditions are governed by the laws of [Your Jurisdiction].
              Any disputes will be resolved in the courts of [Your Jurisdiction].
            </p>
          </li>
        </ol>
        <p className="mt-8 text-center text-gray-300">
          By clicking <strong className="text-green-400">"Sign Up"</strong>, you confirm that you have read and
          agreed to these Terms and Conditions.
        </p>
      </div>
    </div>
  );
}
