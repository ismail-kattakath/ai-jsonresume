'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Home, ArrowLeft, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--md-sys-color-background)]">
      <Header />

      <main className="flex min-h-screen flex-col items-center justify-center px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl text-center"
        >
          {/* 404 Number */}
          <motion.h1
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 100 }}
            className="mb-8 bg-gradient-to-r from-[var(--md-sys-color-primary)] to-[var(--md-sys-color-tertiary)] bg-clip-text text-9xl font-bold text-transparent md:text-[12rem]"
          >
            404
          </motion.h1>

          {/* Message */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="md3-display-small mb-4 text-[var(--md-sys-color-on-surface)]"
          >
            Page Not Found
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="md3-body-large mb-12 text-[var(--md-sys-color-on-surface-variant)]"
          >
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved. Let&apos;s get you back on track.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/"
              className="md3-btn-filled group flex w-full items-center justify-center gap-2 sm:w-auto"
            >
              <Home
                size={20}
                className="transition-transform group-hover:-translate-y-0.5"
              />
              Go Home
            </Link>

            <button
              onClick={() => window.history.back()}
              className="md3-btn-outlined group flex w-full items-center justify-center gap-2 sm:w-auto"
            >
              <ArrowLeft
                size={20}
                className="transition-transform group-hover:-translate-x-1"
              />
              Go Back
            </button>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-16"
          >
            <div className="mx-auto flex max-w-md items-center justify-center gap-4 rounded-2xl border border-[var(--md-sys-color-outline-variant)] bg-[var(--md-sys-color-surface-container)] p-6">
              <Search
                className="text-[var(--md-sys-color-primary)]"
                size={24}
              />
              <div className="text-left">
                <p className="md3-label-large text-[var(--md-sys-color-on-surface)]">
                  Looking for something specific?
                </p>
                <p className="md3-body-small text-[var(--md-sys-color-on-surface-variant)]">
                  Try navigating from the menu above
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
