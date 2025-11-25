import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutUsPage() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-4xl p-4 sm:p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold font-headline">About Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Welcome to Brain Training Hub, your personal gym for mental fitness.
            </p>
            <p>
              Our mission is to make cognitive enhancement accessible, engaging, and fun for everyone. We believe that a healthy mind is the key to a happy and fulfilling life. The suite of games are not only entertaining but are also designed to challenge and improve your memory, logic, and focus.
            </p>
            <p>
              We are committed to providing a clean, simple, and ad-supported experience that you can enjoy anytime, anywhere. Thank you for being a part of our community!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
