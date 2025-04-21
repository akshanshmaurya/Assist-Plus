"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Play, Volume2, VolumeX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AssistantHeader } from '@/components/assistant-header';
import { useToast } from '@/hooks/use-toast';
import { VoiceCommandDisplay } from '@/components/voice-command-display';
import { VoiceCommandsHelp } from '@/components/voice-commands-help';

export default function VoiceMode() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const recognition = useRef<any>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Commands the system recognizes
  const commands = {
    'go home': () => router.push('/'),
    'go back': () => router.back(),
    'scroll down': () => window.scrollBy(0, 300),
    'scroll up': () => window.scrollBy(0, -300),
    'change mode': () => router.push('/gesture-mode'),
    'open settings': () => router.push('/settings'),
    'stop listening': () => stopListening(),
  };

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Try using Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition.current = new SpeechRecognition();
    recognition.current.continuous = true;
    recognition.current.interimResults = true;
    
    recognition.current.onresult = (event: any) => {
      const current = event.resultIndex;
      const result = event.results[current];
      const transcriptText = result[0].transcript.toLowerCase().trim();
      
      setTranscript(transcriptText);

      // If we have a final result, check against commands
      if (result.isFinal) {
        processCommand(transcriptText);
      }
    };

    recognition.current.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'no-speech') {
        // Silent error for no speech detected
        return;
      }
      
      toast({
        title: "Recognition Error",
        description: `Error: ${event.error}. Please try again.`,
        variant: "destructive",
      });
      
      setIsListening(false);
    };

    // Welcome message
    speakFeedback("Voice control mode activated. Say 'help' for available commands.");

    return () => {
      if (recognition.current) {
        recognition.current.abort();
      }
    };
  }, [toast, router]);

  const startListening = () => {
    try {
      recognition.current.start();
      setIsListening(true);
      speakFeedback("Listening for commands.");
      
      toast({
        title: "Voice Recognition Active",
        description: "Speak clearly for best results.",
      });
    } catch (error) {
      console.error('Failed to start listening:', error);
      toast({
        title: "Failed to Start",
        description: "Could not start speech recognition. Please try again.",
        variant: "destructive",
      });
    }
  };

  const stopListening = () => {
    if (recognition.current) {
      recognition.current.stop();
    }
    setIsListening(false);
    speakFeedback("Voice recognition paused.");
  };

  const processCommand = (command: string) => {
    // Check for help command
    if (command.includes('help')) {
      setFeedback("Available commands: go home, go back, scroll down, scroll up, change mode, open settings, stop listening");
      speakFeedback("Here are some available commands: go home, go back, scroll down, scroll up, change mode, open settings, stop listening");
      return;
    }

    // Check for commands
    for (const [phrase, action] of Object.entries(commands)) {
      if (command.includes(phrase)) {
        setFeedback(`Executing: ${phrase}`);
        speakFeedback(`Executing: ${phrase}`);
        action();
        return;
      }
    }

    // No matching command found
    setFeedback("Command not recognized. Say 'help' for available commands.");
    speakFeedback("I didn't understand that command. Say 'help' for available commands.");
  };

  const speakFeedback = (text: string) => {
    if (ttsEnabled && window.speechSynthesis) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.rate = 1.0;
      speech.pitch = 1.0;
      window.speechSynthesis.speak(speech);
    }
  };

  const toggleTts = () => {
    setTtsEnabled(!ttsEnabled);
    toast({
      title: !ttsEnabled ? "Voice Feedback Enabled" : "Voice Feedback Disabled",
      description: !ttsEnabled ? "The assistant will now speak responses." : "The assistant will not speak responses.",
    });
  };

  return (
    <main className="flex min-h-screen flex-col">
      <AssistantHeader />
      
      <div className="container flex flex-col items-center flex-1 px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl"
        >
          <h1 className="text-3xl font-bold text-center mb-6">Voice Control Mode</h1>
          
          <Card className="mb-6 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={isListening ? { 
                    scale: [1, 1.1, 1],
                    backgroundColor: ['rgba(239, 68, 68, 0.1)', 'rgba(239, 68, 68, 0.2)', 'rgba(239, 68, 68, 0.1)'],
                  } : {}}
                  transition={{ 
                    repeat: isListening ? Infinity : 0, 
                    duration: 1.5 
                  }}
                  className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4"
                >
                  {isListening ? (
                    <Mic className="h-12 w-12 text-primary" />
                  ) : (
                    <MicOff className="h-12 w-12 text-muted-foreground" />
                  )}
                </motion.div>
                
                <h2 className="text-xl font-medium mb-4">
                  {isListening ? "Listening..." : "Click to Start"}
                </h2>
                
                <Button
                  size="lg"
                  className={isListening ? "bg-destructive hover:bg-destructive/90" : ""}
                  onClick={isListening ? stopListening : startListening}
                >
                  {isListening ? "Stop Listening" : "Start Listening"}
                  {isListening ? <MicOff className="ml-2 h-4 w-4" /> : <Play className="ml-2 h-4 w-4" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="mt-4"
                  onClick={toggleTts}
                  aria-label={ttsEnabled ? "Disable voice feedback" : "Enable voice feedback"}
                >
                  {ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <VoiceCommandDisplay
            transcript={transcript}
            feedback={feedback}
          />
          
          <VoiceCommandsHelp />
        </motion.div>
      </div>
    </main>
  );
}