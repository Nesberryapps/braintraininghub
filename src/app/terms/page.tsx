import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsAndConditionsPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-4xl p-4 sm:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold font-headline">Terms and Conditions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              <strong>Last Updated: July 15th, 2025</strong>
            </p>
            <p>
              Welcome to Brain Training Hub. By downloading, installing, or using this app, you agree to be bound by the following Terms and Conditions. Please read them carefully before using the app.
            </p>
            <h2 className="text-xl font-semibold text-card-foreground pt-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using Brain Training Hub, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, please do not use the app.
            </p>
            <h2 className="text-xl font-semibold text-card-foreground pt-4">
              2. User Data and Privacy
            </h2>
            <p>
              We respect your privacy. Brain Training Hub does not collect, store, or share any personal data. All gameplay progress is stored locally on your device. Please review our Privacy Policy for more details.
            </p>
             <h2 className="text-xl font-semibold text-card-foreground pt-4">
              3. Intellectual Property
            </h2>
            <p>
              All content, graphics, gameplay features, and other intellectual property associated with Brain Training Hub are the property of Maven Equities LLC and are protected by applicable copyright and trademark laws. You may not reproduce, distribute, or modify any part of the app without prior written consent.
            </p>
             <h2 className="text-xl font-semibold text-card-foreground pt-4">
              4. User Conduct
            </h2>
            <p>
              You agree to use the app only for lawful purposes and in a manner that does not violate any applicable laws or regulations. Misuse of the app or any attempt to reverse-engineer, hack, or otherwise interfere with its operation is strictly prohibited.
            </p>
            <h2 className="text-xl font-semibold text-card-foreground pt-4">
              5. Disclaimer of Warranty
            </h2>
            <p>
              Brain Training Hub is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that the app will be error-free, uninterrupted, or free of viruses or other harmful components. The app is for entertainment and educational purposes only and is not a substitute for professional medical advice.
            </p>
            <h2 className="text-xl font-semibold text-card-foreground pt-4">
              6. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, Maven Equities LLC shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of or inability to use the app.
            </p>
            <h2 className="text-xl font-semibold text-card-foreground pt-4">
              7. Changes to Terms
            </h2>
            <p>
              We reserve the right to modify or update these Terms and Conditions at any time. Any changes will be effective immediately upon posting on this page. Continued use of the app after changes means you accept the updated terms.
            </p>
            <h2 className="text-xl font-semibold text-card-foreground pt-4">
              8. Contact Us
            </h2>
            <p>
              If you have any questions or concerns about these Terms and Conditions, please contact us at: support@braintraininghub.com
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
