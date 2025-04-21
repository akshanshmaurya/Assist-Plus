"use client";

import { motion } from 'framer-motion';
import { Mic, Hand, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function ModeSelector() {
  const router = useRouter();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="w-full max-w-4xl"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <h2 className="text-3xl font-bold text-center mb-8">Choose Your Interaction Method</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={item}>
          <Card className="border-2 hover:border-primary transition-all h-full">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mic className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">Voice Control</CardTitle>
              <CardDescription>Navigate with voice commands</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <p>Use natural speech to control your experience.</p>
              <p className="text-muted-foreground text-sm">Say commands like "scroll down", "click button", or "open menu"</p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => router.push('/voice-mode')}
                className="w-full py-6 group"
              >
                Start Voice Mode
                <Sparkles className="ml-2 h-4 w-4 opacity-70 group-hover:opacity-100" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-2 hover:border-primary transition-all h-full">
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Hand className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">Sign Language</CardTitle>
              <CardDescription>Control with hand gestures</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-2">
              <p>Use hand gestures to navigate and interact.</p>
              <p className="text-muted-foreground text-sm">Gestures include pointing, swiping, and common sign language signs</p>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => router.push('/gesture-mode')}
                className="w-full py-6 group"
              >
                Start Gesture Mode
                <Sparkles className="ml-2 h-4 w-4 opacity-70 group-hover:opacity-100" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
      
      <motion.div 
        variants={item}
        className="mt-10 text-center"
      >
        <p className="text-muted-foreground mb-4">
          Both modes offer full accessibility features
        </p>
        <Button 
          variant="outline" 
          onClick={() => router.push('/settings')}
          className="mx-auto"
        >
          Customize Settings
        </Button>
      </motion.div>
    </motion.div>
  );
}