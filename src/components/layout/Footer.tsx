'use client'

import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Zap, Globe } from 'lucide-react'
import { contactInfo } from '@/lib/data/portfolio'
import DefaultResumeData from '@/components/resume-builder/utility/DefaultResumeData'
import { Logo } from '@/components/Logo'
import { navItems } from '@/config/navigation'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  // Extract first sentence from summary
  const firstSentence = DefaultResumeData.summary.split('.')[0] + '.'

  return (
    <footer className="backdrop-blur-md bg-[var(--md-sys-color-surface-container)]/60 border-t border-[var(--md-sys-color-outline-variant)]/30">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md:col-span-2"
          >
            <div className="mb-4">
              <div className="w-48 h-27 mb-2">
                <Logo width={192} height={108} fill="var(--md-sys-color-primary)" />
              </div>
              <h3 className="md3-title-large">{DefaultResumeData.position}</h3>
            </div>
            <p className="md3-body-medium text-[var(--md-sys-color-on-surface-variant)] mb-6 max-w-md leading-relaxed">
              {firstSentence}
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              <motion.a
                href={`https://${contactInfo.github}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl bg-[var(--md-sys-color-surface-container-high)] hover:bg-[var(--md-sys-color-primary-container)] transition-all"
                aria-label="GitHub"
              >
                <Github size={20} className="text-[var(--md-sys-color-on-surface)]" />
              </motion.a>
              <motion.a
                href={`https://${contactInfo.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl bg-[var(--md-sys-color-surface-container-high)] hover:bg-[var(--md-sys-color-primary-container)] transition-all"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} className="text-[var(--md-sys-color-on-surface)]" />
              </motion.a>
              <motion.a
                href={`mailto:${contactInfo.email}`}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 rounded-xl bg-[var(--md-sys-color-surface-container-high)] hover:bg-[var(--md-sys-color-primary-container)] transition-all"
                aria-label="Email"
              >
                <Mail size={20} className="text-[var(--md-sys-color-on-surface)]" />
              </motion.a>
              {contactInfo.website && (
                <motion.a
                  href={`https://${contactInfo.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-xl bg-[var(--md-sys-color-surface-container-high)] hover:bg-[var(--md-sys-color-primary-container)] transition-all"
                  aria-label="Website"
                >
                  <Globe size={20} className="text-[var(--md-sys-color-on-surface)]" />
                </motion.a>
              )}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="md3-title-medium mb-4 text-[var(--md-sys-color-primary)]">Navigate</h4>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => {
                      if (item.href.startsWith('#')) {
                        // Anchor link - scroll to section
                        const element = document.querySelector(item.href)
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' })
                        }
                      } else {
                        // Full page navigation
                        window.location.href = item.href
                      }
                    }}
                    className="md3-body-medium text-[var(--md-sys-color-on-surface-variant)] hover:text-[var(--md-sys-color-primary)] transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-[var(--md-sys-color-primary)] transition-all"></span>
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t border-[var(--md-sys-color-outline-variant)]/30 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="md3-body-small text-[var(--md-sys-color-on-surface-variant)]">
              © {currentYear} {contactInfo.name}. All rights reserved.
            </p>
            <p className="md3-body-small text-[var(--md-sys-color-on-surface-variant)] flex items-center gap-2">
              Built with <span className="text-[var(--md-sys-color-primary)]">Next.js</span>
              <span className="text-[var(--md-sys-color-on-surface-variant)]">•</span>
              Hosted on <span className="text-[var(--md-sys-color-primary)]">GitHub Pages</span>
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}