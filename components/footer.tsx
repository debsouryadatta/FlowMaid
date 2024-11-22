import { Github, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/5 bg-black/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600" />
                <div className="absolute inset-0.5 rounded-lg bg-black" />
                <div className="absolute inset-1 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600" />
              </div>
              <h3 className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-lg font-bold text-transparent">
                FlowMaid
              </h3>
            </div>
            <p className="text-sm text-white/60">
              Transform your ideas into beautiful visuals with our AI-powered
              generator.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-medium text-white/80">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-white/60 transition-colors hover:text-white"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-white/60 transition-colors hover:text-white"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-white/60 transition-colors hover:text-white"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-medium text-white/80">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/privacy"
                  className="text-white/60 transition-colors hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-white/60 transition-colors hover:text-white"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-medium text-white/80">Connect</h4>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-white/5 p-2 text-white/60 transition-all hover:bg-white/10 hover:text-white"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-white/5 p-2 text-white/60 transition-all hover:bg-white/10 hover:text-white"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-white/5 p-2 text-white/60 transition-all hover:bg-white/10 hover:text-white"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-8 text-center text-sm text-white/40">
          <p>&copy; {new Date().getFullYear()} FlowMaid. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}