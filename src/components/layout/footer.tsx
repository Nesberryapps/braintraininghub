import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto bg-card/50 border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-sm text-muted-foreground">
        <div className="flex justify-center items-center space-x-4 flex-wrap">
          <Link href="/about" className="hover:text-primary transition-colors">
            About Us
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <Link href="/blog" className="hover:text-primary transition-colors">
            Blog
          </Link>
          <Separator orientation="vertical" className="h-4" />
           <Link href="/contact" className="hover:text-primary transition-colors">
            Contact Us
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <Link href="/terms" className="hover:text-primary transition-colors">
            Terms & Conditions
          </Link>
          <Separator orientation="vertical" className="h-4" />
          <Link href="/privacy" className="hovertext-primary transition-colors">
            Privacy Policy
          </Link>
        </div>
        <p className="mt-2">
          &copy; {currentYear} Brain Training Hub. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
