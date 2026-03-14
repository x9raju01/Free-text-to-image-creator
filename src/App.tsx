/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { generateImage } from './services/geminiService';
import { Image as ImageIcon, Loader2, Download, Sparkles, Send, Maximize2, Zap, Gamepad2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9"); // Default to 16:9 for thumbnails
  const [quality, setQuality] = useState("Enhanced");
  const [isGamingMode, setIsGamingMode] = useState(true);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      let finalPrompt = prompt;

      if (isGamingMode) {
        // Specific enhancement for Free Fire / Gaming thumbnails
        finalPrompt = `Garena Free Fire style gaming thumbnail, ${prompt}, highly detailed character, epic action pose, vibrant cinematic lighting, 4k resolution, professional gaming poster, battle royale theme, sharp focus, intense colors`;
      } else if (quality === "Enhanced") {
        finalPrompt = `${prompt}, high resolution, detailed, masterpiece, 4k, professional photography`;
      }
        
      const imageUrl = await generateImage(finalPrompt, aspectRatio);
      setImage(imageUrl);
    } catch (err) {
      setError('Failed to generate image. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.download = `dreamcanvas-${Date.now()}.png`;
    link.click();
  };

  const aspectRatios: { label: string; value: AspectRatio }[] = [
    { label: '1:1 Square', value: '1:1' },
    { label: '16:9 Wide', value: '16:9' },
    { label: '9:16 Portrait', value: '9:16' },
    { label: '4:3 Classic', value: '4:3' },
    { label: '3:4 Tall', value: '3:4' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-12 flex flex-col min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">DreamCanvas <span className="text-emerald-500">AI</span></h1>
          </div>
          <div className="hidden sm:block text-xs font-mono text-zinc-500 uppercase tracking-widest">
            Free Tier Mode
          </div>
        </header>

        <main className="flex-grow grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Input Section */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
                Create <span className="italic text-emerald-400">stunning</span> visuals.
              </h2>
            </div>

            <div className="space-y-6">
              {/* Settings Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Maximize2 className="w-3 h-3" /> Aspect Ratio
                  </label>
                  <select 
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-emerald-500 outline-none appearance-none cursor-pointer"
                  >
                    {aspectRatios.map(ar => (
                      <option key={ar.value} value={ar.value}>{ar.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-3 h-3" /> Quality
                  </label>
                  <select 
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-emerald-500 outline-none appearance-none cursor-pointer"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Enhanced">Enhanced (HD)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                    <Gamepad2 className="w-3 h-3" /> Gaming Mode
                  </label>
                  <button
                    onClick={() => setIsGamingMode(!isGamingMode)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all text-sm ${
                      isGamingMode 
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                        : 'bg-zinc-900 border-white/10 text-zinc-500'
                    }`}
                  >
                    <span>{isGamingMode ? 'ON' : 'OFF'}</span>
                    <div className={`w-2 h-2 rounded-full ${isGamingMode ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-700'}`} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleGenerate} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500" />
                <div className="relative bg-zinc-900 border border-white/10 rounded-2xl p-2 flex flex-col gap-2">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your vision..."
                    className="flex-grow bg-transparent border-none focus:ring-0 p-4 text-lg resize-none min-h-[100px] placeholder:text-zinc-600"
                  />
                  <div className="flex justify-between items-center p-2 border-t border-white/5">
                    <div className="text-[10px] font-mono text-zinc-600 px-2">
                      {prompt.length} characters
                    </div>
                    <button
                      type="submit"
                      disabled={isLoading || !prompt.trim()}
                      className="bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-bold px-8 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <span>Generate</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}

            <div className="flex flex-wrap gap-3">
              {['Alok character with AK47', 'Cobra MP40 skin action', 'Free Fire squad in Bermuda', 'Heroic rank push poster'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setPrompt(suggestion)}
                  className="px-4 py-2 bg-zinc-900/50 border border-white/5 hover:border-emerald-500/30 rounded-full text-xs text-zinc-400 hover:text-emerald-400 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Display Section */}
          <div className="space-y-6 w-full max-w-lg mx-auto lg:mx-0">
            <div className="relative aspect-square w-full bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden flex items-center justify-center shadow-2xl">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                      <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-emerald-500 animate-pulse" />
                    </div>
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Generating...</p>
                  </motion.div>
                ) : image ? (
                  <motion.div
                    key="image"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative w-full h-full"
                  >
                    <img
                      src={image}
                      alt="Generated"
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-4 text-zinc-700"
                  >
                    <ImageIcon className="w-20 h-20 opacity-20" />
                    <p className="font-mono text-[10px] uppercase tracking-[0.2em]">Ready for input</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Action Buttons Below Image */}
            <AnimatePresence>
              {image && !isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <button
                    onClick={downloadImage}
                    className="flex-grow flex items-center justify-center gap-3 bg-white text-black font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-colors shadow-lg"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Image</span>
                  </button>
                  <button
                    onClick={() => setImage(null)}
                    className="px-6 bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white rounded-2xl transition-colors"
                  >
                    Clear
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>

        <footer className="mt-auto pt-12 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-zinc-500 text-[10px] font-mono tracking-widest">
          <p>© 2026 DREAMCANVAS AI. FREE TIER MODE ACTIVE.</p>
          <div className="flex gap-6">
            <span className="hover:text-emerald-500 cursor-pointer transition-colors">PRIVACY</span>
            <span className="hover:text-emerald-500 cursor-pointer transition-colors">TERMS</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
