import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from '@/components/ui/accordion';
  
  const educationalContent = [
    {
      value: 'item-1',
      title: 'How to Spot Fake News',
      content:
        "Look for unusual URLs, check for author credentials, and verify information with other trusted sources. Be wary of emotionally charged headlines and look for evidence to support claims.",
    },
    {
      value: 'item-2',
      title: 'Understanding Online Scams',
      content:
        "Common scams include phishing emails asking for personal information, and offers that seem too good to be true. Never share passwords or financial details unless you are certain the site is secure and legitimate.",
    },
    {
      value: 'item-3',
      title: 'Checking for Outdated Content',
      content:
        "Check the publication date of articles. Old news can be reshared and presented as current, which can be misleading. Always look for the most recent information on a topic.",
    },
    {
      value: 'item-4',
      title: 'Identifying Manipulative Tactics',
      content:
        "Be aware of clickbait headlines designed to get your attention, appeals to emotion over logic, and the use of 'fake experts' to lend false authority to a claim.",
    },
  ];
  
  export function LearnContent() {
    return (
      <Accordion type="single" collapsible className="w-full">
        {educationalContent.map((item) => (
          <AccordionItem value={item.value} key={item.value}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  }
  