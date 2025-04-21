"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VoiceCommandDisplayProps {
  transcript: string;
  feedback: string;
}

export function VoiceCommandDisplay({ transcript, feedback }: VoiceCommandDisplayProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Voice Recognition</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">I heard:</h3>
          <p className="p-3 bg-muted rounded-md min-h-[50px]">
            {transcript || "Waiting for speech..."}
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
            {feedback || "No response yet"}
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}