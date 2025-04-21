"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function VoiceCommandsHelp() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Available Voice Commands</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="navigation">
            <AccordionTrigger>Navigation Commands</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                <li><span className="font-medium">"Go home"</span> - Return to homepage</li>
                <li><span className="font-medium">"Go back"</span> - Go to previous page</li>
                <li><span className="font-medium">"Change mode"</span> - Switch to gesture mode</li>
                <li><span className="font-medium">"Open settings"</span> - Open settings page</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="page-control">
            <AccordionTrigger>Page Control Commands</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                <li><span className="font-medium">"Scroll down"</span> - Scroll page down</li>
                <li><span className="font-medium">"Scroll up"</span> - Scroll page up</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="system">
            <AccordionTrigger>System Commands</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                <li><span className="font-medium">"Help"</span> - List available commands</li>
                <li><span className="font-medium">"Stop listening"</span> - Pause voice recognition</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}