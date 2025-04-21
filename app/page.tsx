"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronRightIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AssistantHeader } from '@/components/assistant-header';
import { ModeSelector } from '@/components/mode-selector';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showModes, setShowModes] = useState(false);
  const { toast } = useToast();

  // Initial welcome animation sequence
  useEffect(() => {
    // Auto-play welcome message for screen readers
    const welcomeSpeech = new SpeechSynthesisUtterance(
      "Welcome to Assist Plus, your virtual personal assistant. Press Start to begin."
    );
    window.speechSynthesis.speak(welcomeSpeech);

    const timer = setTimeout(() => {
      setShowWelcome(false);
      setShowModes(true);
    }, 2500);

    return () => {
      clearTimeout(timer);
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleStart = () => {
    setShowWelcome(false);
    setShowModes(true);
    
    toast({
      title: "Welcome to Assist+",
      description: "Choose an interaction mode to begin",
    });

    // Announce for screen readers
    const startSpeech = new SpeechSynthesisUtterance(
      "Please select an interaction mode. You can use Voice Control or Sign Language."
    );
    window.speechSynthesis.speak(startSpeech);
  };

  return (
    <main className="flex min-h-screen flex-col items-center">
      <AssistantHeader />
      
      <div className="container flex flex-col items-center justify-center flex-1 px-4 py-16">
        {showWelcome && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Welcome to <span className="text-primary">Assist+</span>
            </h1>
            <p className="text-lg md:text-xl mb-10 text-muted-foreground max-w-md mx-auto">
              Your personal accessibility assistant for navigating digital content
            </p>
            <Button 
              size="lg" 
              onClick={handleStart}
              className="group text-lg px-8 py-6 rounded-xl"
            >
              Start Assistant
              <ChevronRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        )}

        {showModes && (
          <ModeSelector />
        )}
      </div>
    </main>
  );
}