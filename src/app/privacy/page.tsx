import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicyPage() {
  const lastUpdatedDate = "October 26, 2024";
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-4xl p-4 sm:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold font-headline">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              <strong>Last Updated: {lastUpdatedDate}</strong>
            </p>
            <p>
              Your privacy is important to us. This Privacy Policy explains how Brain Training Hub handles user information.
            </p>
            <h2 className="text-xl font-semibold text-card-foreground pt-4">
              1. No Data Collection
            </h2>
            <p>
              Brain Training Hub does not collect, store, or share any personal data. All gameplay progress is stored locally on your device using browser storage and is never transmitted to us or any third party.
            </p>
            <h2 className="text-xl font-semibold text-card-foreground pt-4">
              2. Data You Provide
            </h2>
            <p>
              We do not ask you to provide any personal information to use our app.
            </p>
            <h2 className="text-xl font-semibold text-card-foreground pt-4">
              3. Children’s Privacy
            </h2>
            <p>
              Brain Training Hub is safe for all ages. Since we do not collect any personal data, we comply with privacy regulations including the Children’s Online Privacy Protection Act (COPPA) and the General Data Protection Regulation (GDPR).
            </p>
            <h2 className="text-xl font-semibold text-card-foreground pt-4">
              4. Third-Party Services
            </h2>
             <p>
              Our app displays advertisements through Google AdSense. Google may use cookies to serve ads based on a user's prior visits to this website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet. Users may opt out of personalized advertising by visiting{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Ads Settings
              </a>.
            </p>
            <h2 className="text-xl font-semibold text-card-foreground pt-4">
              5. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be reflected on this page. Your continued use of the app indicates your acceptance of the revised policy.
            </p>
            <h2 className="text-xl font-semibold text-card-foreground pt-4">
              6. Contact Us
            </h2>
            <p>
              If you have any questions or concerns about this Privacy Policy, please contact us at: support@braintraininghub.com
            </p>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
