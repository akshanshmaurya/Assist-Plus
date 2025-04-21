"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function GestureCommandsHelp() {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Available Gesture Commands</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="basic">
            <AccordionTrigger>Basic Gestures</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                <li><span className="font-medium">Open palm</span> - Scroll down page</li>
                <li><span className="font-medium">Closed fist</span> - Scroll up page</li>
                <li><span className="font-medium">Pointing</span> - Select or click</li>
                <li><span className="font-medium">Thumbs up</span> - Confirm action</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="navigation">
            <AccordionTrigger>Navigation Gestures</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                <li><span className="font-medium">Swipe left</span> - Go back</li>
                <li><span className="font-medium">Swipe right</span> - Go forward</li>
                <li><span className="font-medium">Wave</span> - Return to home</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="asl">
            <AccordionTrigger>ASL Signs</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2">
                <li><span className="font-medium">ASL for "home"</span> - Return to homepage</li>
                <li><span className="font-medium">ASL for "help"</span> - Open help menu</li>
                <li><span className="font-medium">ASL for "settings"</span> - Open settings page</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}