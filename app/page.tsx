'use client';

import { motion } from 'framer-motion';
import { MermaidContainer } from '@/components/mermaid/container';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-black">
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gray-50 dark:bg-[#030014]" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-black dark:via-black/90 dark:to-transparent" />
        <div className="absolute inset-0 bg-[url('/hero-pattern.svg')] bg-center opacity-20 dark:opacity-30" />
        <div className="absolute inset-0 bg-[url('/dots.svg')] bg-repeat opacity-5" />
        
        {/* Animated shapes */}
        <div className="absolute -left-40 top-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="h-[500px] w-[500px] rounded-full bg-gray-200/30 dark:bg-indigo-500/10 blur-[100px]"
          />
        </div>
        <div className="absolute -right-40 bottom-0">
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="h-[500px] w-[500px] rounded-full bg-gray-200/30 dark:bg-purple-500/10 blur-[100px]"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl text-center mt-48">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            {/* Decorative SVG elements */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2">
              <motion.svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <circle cx="60" cy="60" r="30" stroke="url(#gradient1)" strokeWidth="0.5" />
                <circle cx="60" cy="60" r="45" stroke="url(#gradient1)" strokeWidth="0.5" />
                <circle cx="60" cy="60" r="60" stroke="url(#gradient1)" strokeWidth="0.5" />
                <defs>
                  <linearGradient id="gradient1" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4F46E5" />
                    <stop offset="1" stopColor="#9333EA" />
                  </linearGradient>
                </defs>
              </motion.svg>
            </div>

            <h1 className="font-display relative text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
              <span className="inline-block">
                Transform Text into
                <motion.svg
                  aria-hidden="true"
                  viewBox="0 0 418 42"
                  className="absolute left-0 top-2/3 h-[0.58em] w-full fill-purple-800/40"
                  preserveAspectRatio="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                </motion.svg>
              </span>
              <br />
              <span className="mt-4 inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Beautiful Visuals
              </span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-white/50"
            >
              Create stunning diagrams and flowcharts using Mermaid syntax. Start typing in
              the editor below to see your visualizations come to life instantly.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 w-[400px] sm:w-[600px] md:w-[800px] lg:w-[1000px] mx-auto px-4"
            >
              <MermaidContainer />
            </motion.div>

            {/* Bottom decorative elements */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex items-center gap-2"
              >
                <div className="h-px w-12 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                <div className="rounded-full bg-white/5 p-1">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1" strokeOpacity="0.3" />
                  </svg>
                </div>
                <div className="h-px w-12 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}