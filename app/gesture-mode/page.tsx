"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Hand, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AssistantHeader } from '@/components/assistant-header';
import { useToast } from '@/hooks/use-toast';
import { GestureCommandDisplay } from '@/components/gesture-command-display';
import { GestureCommandsHelp } from '@/components/gesture-commands-help';

// Define hand landmark connections for proper visualization
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],           // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8],           // Index finger
  [0, 9], [9, 10], [10, 11], [11, 12],      // Middle finger
  [0, 13], [13, 14], [14, 15], [15, 16],    // Ring finger
  [0, 17], [17, 18], [18, 19], [19, 20],    // Pinky
  [0, 5], [5, 9], [9, 13], [13, 17]         // Palm
];

export default function GestureMode() {
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gesture, setGesture] = useState('');
  const [feedback, setFeedback] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const router = useRouter();
  
  useEffect(() => {
    if (cameraActive && videoRef.current) {
      setLoading(true);
      
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            
            setTimeout(() => {
              setLoading(false);
              speakFeedback("Gesture recognition activated. Try making some gestures.");
              
              toast({
                title: "Camera Active",
                description: "Gesture recognition is now active.",
              });
              
              simulateGestureDetection();
            }, 2000);
          }
        })
        .catch(err => {
          console.error('Error accessing camera:', err);
          setCameraActive(false);
          setLoading(false);
          
          toast({
            title: "Camera Access Denied",
            description: "Please allow camera access to use gesture recognition.",
            variant: "destructive",
          });
        });
    }
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [cameraActive, toast]);
  
  const toggleCamera = () => {
    setCameraActive(prev => !prev);
    
    if (cameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      
      setGesture('');
      setFeedback('');
      speakFeedback("Gesture recognition deactivated.");
    }
  };
  
  const toggleTts = () => {
    setTtsEnabled(!ttsEnabled);
    toast({
      title: !ttsEnabled ? "Voice Feedback Enabled" : "Voice Feedback Disabled",
      description: !ttsEnabled ? "The assistant will now speak responses." : "The assistant will not speak responses.",
    });
  };
  
  const speakFeedback = (text: string) => {
    if (ttsEnabled && window.speechSynthesis) {
      const speech = new SpeechSynthesisUtterance(text);
      speech.rate = 1.0;
      speech.pitch = 1.0;
      window.speechSynthesis.speak(speech);
    }
  };

  const generateHandLandmarks = () => {
    // Generate realistic hand landmark positions
    const wrist = { x: Math.random() * 0.3 + 0.35, y: Math.random() * 0.3 + 0.35 };
    const landmarks = [wrist];
    
    // Generate finger joints with realistic constraints
    for (let finger = 0; finger < 5; finger++) {
      const baseAngle = (finger - 2) * 0.2; // Spread fingers naturally
      const length = 0.1; // Length between joints
      
      let prevPoint = wrist;
      for (let joint = 0; joint < 4; joint++) {
        const angle = baseAngle + joint * 0.2 + Math.random() * 0.1;
        const x = prevPoint.x + Math.cos(angle) * length;
        const y = prevPoint.y + Math.sin(angle) * length;
        landmarks.push({ x, y });
        prevPoint = { x, y };
      }
    }
    
    return landmarks;
  };
  
  const simulateGestureDetection = () => {
    if (!cameraActive) return;
    
    const gestures = [
      { name: 'Open palm', action: 'Scroll down command detected' },
      { name: 'Thumb up', action: 'Confirmation gesture detected' },
      { name: 'Pointing', action: 'Selection gesture detected' },
      { name: 'Wave', action: 'Navigation gesture detected' },
    ];
    
    let lastIndex = -1;
    
    const interval = setInterval(() => {
      if (!cameraActive) {
        clearInterval(interval);
        return;
      }
      
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * gestures.length);
      } while (randomIndex === lastIndex);
      
      lastIndex = randomIndex;
      const detectedGesture = gestures[randomIndex];
      
      setGesture(detectedGesture.name);
      setFeedback(detectedGesture.action);
      speakFeedback(detectedGesture.action);
      
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          
          // Generate and draw hand landmarks
          const landmarks = generateHandLandmarks();
          
          // Draw connections between landmarks
          ctx.strokeStyle = '#ff4d4f';
          ctx.lineWidth = 2;
          
          HAND_CONNECTIONS.forEach(([start, end]) => {
            const startPoint = landmarks[start];
            const endPoint = landmarks[end];
            
            ctx.beginPath();
            ctx.moveTo(startPoint.x * canvasRef.current!.width, startPoint.y * canvasRef.current!.height);
            ctx.lineTo(endPoint.x * canvasRef.current!.width, endPoint.y * canvasRef.current!.height);
            ctx.stroke();
          });
          
          // Draw landmark points
          ctx.fillStyle = '#ff4d4f';
          landmarks.forEach(point => {
            ctx.beginPath();
            ctx.arc(
              point.x * canvasRef.current!.width,
              point.y * canvasRef.current!.height,
              3,
              0,
              2 * Math.PI
            );
            ctx.fill();
          });
        }
      }
    }, 5000);
    
    return () => clearInterval(interval);
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
          <h1 className="text-3xl font-bold text-center mb-6">Gesture Recognition Mode</h1>
          
          <Card className="mb-6 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-md aspect-video bg-muted rounded-md overflow-hidden mb-6">
                  {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
                      <Loader2 className="h-8 w-8 text-primary animate-spin" />
                      <span className="ml-2 text-sm font-medium">Loading model...</span>
                    </div>
                  )}
                  
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                  />
                  
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full z-20 pointer-events-none"
                    width={640}
                    height={480}
                  />
                  
                  {!cameraActive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Camera className="h-12 w-12 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Camera access required for gesture recognition</p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 mb-4">
                  <Button
                    size="lg"
                    className={cameraActive ? "bg-destructive hover:bg-destructive/90" : ""}
                    onClick={toggleCamera}
                  >
                    {cameraActive ? "Stop Camera" : "Start Camera"}
                    <Hand className="ml-2 h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleTts}
                    aria-label={ttsEnabled ? "Disable voice feedback" : "Enable voice feedback"}
                  >
                    {ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <GestureCommandDisplay
            gesture={gesture}
            feedback={feedback}
          />
          
          <GestureCommandsHelp />
        </motion.div>
      </div>
    </main>
  );
}