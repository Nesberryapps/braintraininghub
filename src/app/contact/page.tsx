import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactUsPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-4xl p-4 sm:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold font-headline">Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              We would love to hear from you! Whether you have a question, a suggestion, or just want to say hello, feel free to reach out.
            </p>
            <p>
              For support, feedback, or any other inquiries, please email us at:
            </p>
            <p className="text-lg font-semibold text-primary">
              support@braintraininghub.com
            </p>
            <p>
              We do our best to respond to all messages within 48 hours.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
