
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type FeatureCardProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <Card className="bg-card/50 border-0 shadow-none text-center flex flex-col items-center">
            <CardHeader className="items-center pb-4">
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                    {icon}
                </div>
                <CardTitle className="text-xl font-headline">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>{description}</CardDescription>
            </CardContent>
        </Card>
    );
}
