"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Type, 
  Sun, 
  Volume, 
  Sliders, 
  Languages 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AssistantHeader } from '@/components/assistant-header';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const [highContrast, setHighContrast] = useState(false);
  const [textToSpeech, setTextToSpeech] = useState(true);
  const [speechRecognition, setSpeechRecognition] = useState(true);
  const [gestureRecognition, setGestureRecognition] = useState(true);
  const [fontSizeValue, setFontSizeValue] = useState([100]);
  const [speechRate, setSpeechRate] = useState([100]);
  const [theme, setTheme] = useState('system');
  const [language, setLanguage] = useState('en-US');
  const { toast } = useToast();

  // Load saved settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('assistPlusSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      setHighContrast(settings.highContrast);
      setTextToSpeech(settings.textToSpeech);
      setSpeechRecognition(settings.speechRecognition);
      setGestureRecognition(settings.gestureRecognition);
      setFontSizeValue([settings.fontSize]);
      setSpeechRate([settings.speechRate]);
      setTheme(settings.theme);
      setLanguage(settings.language);

      // Apply settings
      applySettings(settings);
    }
  }, []);

  const applySettings = (settings: any) => {
    // Apply font size
    document.documentElement.style.fontSize = `${settings.fontSize}%`;

    // Apply high contrast
    if (settings.highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }

    // Apply theme
    document.documentElement.setAttribute('data-theme', settings.theme);
  };

  const handleSave = () => {
    const settings = {
      highContrast,
      textToSpeech,
      speechRecognition,
      gestureRecognition,
      fontSize: fontSizeValue[0],
      speechRate: speechRate[0],
      theme,
      language,
    };

    // Save to localStorage
    localStorage.setItem('assistPlusSettings', JSON.stringify(settings));

    // Apply settings
    applySettings(settings);

    toast({
      title: "Settings Saved",
      description: "Your accessibility preferences have been updated.",
    });
    
    // Announce changes to screen readers
    const message = new SpeechSynthesisUtterance("Settings updated successfully.");
    if (textToSpeech) {
      window.speechSynthesis.speak(message);
    }
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
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-full">
              <SettingsIcon className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Accessibility Settings</h1>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Customize Your Experience</CardTitle>
              <CardDescription>
                Adjust these settings to make Assist+ work best for you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="visual">Visual</TabsTrigger>
                  <TabsTrigger value="voice">Voice</TabsTrigger>
                  <TabsTrigger value="gestures">Gestures</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="py-4 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="language">Language</Label>
                        <p className="text-sm text-muted-foreground">
                          Set your preferred language
                        </p>
                      </div>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-52">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en-US">English (US)</SelectItem>
                          <SelectItem value="en-GB">English (UK)</SelectItem>
                          <SelectItem value="es-ES">Spanish</SelectItem>
                          <SelectItem value="fr-FR">French</SelectItem>
                          <SelectItem value="de-DE">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="high-contrast">High Contrast Mode</Label>
                        <p className="text-sm text-muted-foreground">
                          Increase contrast for better visibility
                        </p>
                      </div>
                      <Switch
                        id="high-contrast"
                        checked={highContrast}
                        onCheckedChange={setHighContrast}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="tts">Text-to-Speech</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable voice feedback for actions
                        </p>
                      </div>
                      <Switch
                        id="tts" 
                        checked={textToSpeech}
                        onCheckedChange={setTextToSpeech}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="visual" className="py-4 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="font-size">Font Size ({fontSizeValue}%)</Label>
                        <Type className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Slider
                        id="font-size"
                        min={75}
                        max={200}
                        step={5}
                        value={fontSizeValue}
                        onValueChange={setFontSizeValue}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="theme">Color Theme</Label>
                        <p className="text-sm text-muted-foreground">
                          Choose your preferred theme
                        </p>
                      </div>
                      <Select value={theme} onValueChange={setTheme}>
                        <SelectTrigger className="w-52">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="system">System</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="voice" className="py-4 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="speech-recognition">Speech Recognition</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable or disable voice commands
                        </p>
                      </div>
                      <Switch
                        id="speech-recognition"
                        checked={speechRecognition}
                        onCheckedChange={setSpeechRecognition}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="speech-rate">Speech Rate ({speechRate}%)</Label>
                        <Volume className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <Slider
                        id="speech-rate"
                        min={50}
                        max={200}
                        step={10}
                        value={speechRate}
                        onValueChange={setSpeechRate}
                        disabled={!textToSpeech}
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="gestures" className="py-4 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <Label htmlFor="gesture-recognition">Gesture Recognition</Label>
                        <p className="text-sm text-muted-foreground">
                          Enable or disable gesture controls
                        </p>
                      </div>
                      <Switch
                        id="gesture-recognition"
                        checked={gestureRecognition}
                        onCheckedChange={setGestureRecognition}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end mt-6 space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    localStorage.removeItem('assistPlusSettings');
                    window.location.reload();
                  }}
                >
                  Reset to Defaults
                </Button>
                <Button onClick={handleSave}>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}