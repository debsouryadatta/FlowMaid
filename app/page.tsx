'use client';

import { motion } from 'framer-motion';
import { MermaidContainer } from '@/components/mermaid/container';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mt-40 mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-4xl font-bold text-transparent sm:text-6xl">
            Transform Text into Visuals
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Create beautiful diagrams and flowcharts using Mermaid syntax. Start typing in
            the editor below to see your visualizations come to life.
          </p>
        </motion.div>
      </section>

      <MermaidContainer />
    </div>
  );
}