
"use client";

import { useState, useEffect } from "react";
import { Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { brainHealthTips } from "@/lib/brain-health-tips";

export function DailyTipCard() {
  const [tip, setTip] = useState("");

  useEffect(() => {
    // This logic ensures the tip changes on every refresh
    const tipIndex = Math.floor(Math.random() * brainHealthTips.length);
    setTip(brainHealthTips[tipIndex]);
  }, []);

  return (
    <Card className="bg-primary/10 border-primary/20 text-left">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Lightbulb className="w-8 h-8 text-primary" />
        <CardTitle className="text-xl font-headline">Daily Brain Boost</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{tip}</p>
      </CardContent>
    </Card>
  );
}
