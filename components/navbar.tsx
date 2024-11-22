'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/theme-toggle';
import { SavedCodesSheet } from './saved-codes-sheet';
import { LLMSettingsDialog } from '@/components/llm-settings-dialog';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2 text-xl font-bold"
          >
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600" />
              <div className="absolute inset-0.5 rounded-lg bg-black" />
              <div className="absolute inset-1 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600" />
            </div>
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              FlowMaid
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-1 md:flex">
            <Link
              href="/"
              className="rounded-lg px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="rounded-lg px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
            >
              About
            </Link>
            <div className="px-2">
              <LLMSettingsDialog />
            </div>
            <SavedCodesSheet 
              triggerElement={
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 rounded-lg text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <Save className="h-4 w-4" />
                  Saved Codes
                </Button>
              }
            />
            <div className="pl-2">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              className="text-white/70 hover:bg-white/5 hover:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-t border-white/5 bg-black/95 md:hidden"
          >
            <div className="flex flex-col space-y-1 p-4">
              <Link
                href="/"
                className="rounded-lg px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="rounded-lg px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
              <div className="px-4 py-2">
                <LLMSettingsDialog />
              </div>
              <SavedCodesSheet 
                triggerElement={
                  <Button
                    variant="ghost"
                    className="w-full justify-start rounded-lg px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Saved Codes
                  </Button>
                }
              />
              <div className="px-4 py-2">
                <ThemeToggle />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
}