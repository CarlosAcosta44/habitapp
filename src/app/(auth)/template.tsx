'use client'

import { motion } from 'framer-motion'
import React from 'react'

export default function AuthTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="w-full min-h-screen"
    >
      {children}
    </motion.div>
  )
}
