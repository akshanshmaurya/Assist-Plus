"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GestureCommandDisplayProps {
  gesture: string;
  feedback: string;
}

export function GestureCommandDisplay({ gesture, feedback }: GestureCommandDisplayProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Gesture Recognition</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Detected gesture:</h3>
          <p className="p-3 bg-muted rounded-md min-h-[50px]">
            {gesture || "No gesture detected"}
          </p>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">System response:</h3>
          <motion.div
            key={feedback}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-3 bg-secondary rounded-md min-h-[50px]"
          >
            {feedback || "Waiting for gesture..."}
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}