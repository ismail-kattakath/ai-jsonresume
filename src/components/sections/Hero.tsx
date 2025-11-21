'use client'

import { motion } from 'framer-motion'
import { ChevronDown, Linkedin, Github, Mail, Calendar, Download, Sparkles } from 'lucide-react'
import DefaultResumeData from '@/components/resume-builder/utility/DefaultResumeData'
import { contactInfo } from '@/lib/data/portfolio'

export default function Hero() {
  const linkedInProfile = DefaultResumeData.socialMedia.find(s => s.socialMedia === "LinkedIn");
  const githubProfile = DefaultResumeData.socialMedia.find(s => s.socialMedia === "Github");
  const linkedInUrl = linkedInProfile?.link.startsWith("http")
    ? linkedInProfile.link
    : `https://${linkedInProfile?.link}`;
  const githubUrl = githubProfile?.link.startsWith("http")
    ? githubProfile.link
    : `https://${githubProfile?.link}`;
  const profileImage = DefaultResumeData.profilePicture || "./images/profile.jpg";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section className="min-h-screen flex items-center relative overflow-hidden">
      {/* Floating gradient orbs for depth */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-[var(--md-sys-color-primary)]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[var(--md-sys-color-tertiary)]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-6xl mx-auto px-6 py-24 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Profile Image with enhanced styling */}
          <motion.div
            variants={itemVariants}
            className="relative inline-block mb-8"
          >
            <div className="relative">
              {/* Animated ring */}
              <motion.div
                className="absolute -inset-4 rounded-full bg-gradient-to-r from-[var(--md-sys-color-primary)] via-[var(--md-sys-color-secondary)] to-[var(--md-sys-color-tertiary)] opacity-75 blur-lg"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear"
                }}
              ></motion.div>

              {/* Profile image */}
              <motion.img
                src={profileImage}
                alt={`${DefaultResumeData.name} - ${DefaultResumeData.position}`}
                className="relative w-40 h-40 rounded-full object-cover shadow-2xl"
                style={{
                  border: '6px solid var(--md-sys-color-surface)',
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />

              {/* Status badge */}
              <motion.div
                className="absolute bottom-2 right-2 flex items-center gap-1.5 px-3 py-1.5 bg-[var(--md-sys-color-primary-container)] rounded-full shadow-lg border-2 border-[var(--md-sys-color-surface)]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="md3-label-small text-[var(--md-sys-color-on-primary-container)] font-medium">Available</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Name with gradient text effect */}
          <motion.h1
            variants={itemVariants}
            className="md3-display-large mb-4 font-bold bg-gradient-to-r from-[var(--md-sys-color-primary)] via-[var(--md-sys-color-secondary)] to-[var(--md-sys-color-tertiary)] bg-clip-text text-transparent"
          >
            {DefaultResumeData.name}
          </motion.h1>

          {/* Position with icon */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <Sparkles className="text-[var(--md-sys-color-primary)]" size={20} />
            <p className="md3-headline-small text-[var(--md-sys-color-on-surface)] font-medium">
              {DefaultResumeData.position}
            </p>
          </motion.div>

          {/* Tagline/Summary first sentence */}
          <motion.p
            variants={itemVariants}
            className="md3-body-large md3-on-surface-variant mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            {DefaultResumeData.summary.split('.')[0]}.
          </motion.p>

          {/* Primary CTAs */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-4 mb-8"
          >
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] rounded-full md3-label-large font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              <Mail size={20} />
              Get In Touch
            </motion.a>

            <motion.a
              href="/resume"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] rounded-full md3-label-large font-semibold shadow-md hover:shadow-lg transition-shadow border-2 border-[var(--md-sys-color-outline-variant)]"
            >
              <Download size={20} />
              View Resume
            </motion.a>
          </motion.div>

          {/* Social links */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-3"
          >
            <motion.a
              href={linkedInUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 flex items-center justify-center bg-[var(--md-sys-color-surface-container-high)] rounded-full shadow-md hover:shadow-lg transition-shadow"
              title="LinkedIn Profile"
            >
              <Linkedin size={20} className="text-[var(--md-sys-color-primary)]" />
            </motion.a>

            <motion.a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 flex items-center justify-center bg-[var(--md-sys-color-surface-container-high)] rounded-full shadow-md hover:shadow-lg transition-shadow"
              title="GitHub Profile"
            >
              <Github size={20} className="text-[var(--md-sys-color-primary)]" />
            </motion.a>

            <motion.a
              href={contactInfo.calendar}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 flex items-center justify-center bg-[var(--md-sys-color-surface-container-high)] rounded-full shadow-md hover:shadow-lg transition-shadow"
              title="Schedule a Meeting"
            >
              <Calendar size={20} className="text-[var(--md-sys-color-primary)]" />
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            y: [0, 8, 0]
          }}
          transition={{
            opacity: { delay: 1.5 },
            y: { repeat: Infinity, duration: 2, ease: "easeInOut" }
          }}
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="md3-label-small text-[var(--md-sys-color-on-surface-variant)] uppercase tracking-wider">Scroll</span>
            <ChevronDown className="text-[var(--md-sys-color-primary)]" size={24} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}