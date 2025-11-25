
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { type GameArticles, gameArticles } from "@/lib/game-articles";

type GameArticlesProps = {
  game: keyof GameArticles;
};

export function GameArticles({ game }: GameArticlesProps) {
  const articles = gameArticles[game];

  return (
    <Card className="w-full max-w-lg mt-8">
      <CardHeader>
        <CardTitle className="text-xl font-headline text-center">
          Benefits of This Exercise
        </CardTitle>
      </CardHeader>
      <div className="px-6 pb-6">
        <Accordion type="single" collapsible className="w-full">
          {articles.map((article, index) => (
            <AccordionItem value={`item-${index}`} key={article.title}>
              <AccordionTrigger>{article.title}</AccordionTrigger>
              <AccordionContent>{article.content}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </Card>
  );
}
