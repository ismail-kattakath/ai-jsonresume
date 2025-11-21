'use client'

import { motion } from 'framer-motion'
import { experience } from '@/lib/data/portfolio'
import { Calendar, Briefcase, Sparkles } from 'lucide-react'

export default function Experience() {
  return (
    <section id="experience" className="py-24 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="md3-headline-large mb-4">
            Professional Experience
          </h2>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          {experience.map((exp, index) => (
            <motion.div
              key={`${exp.company}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="relative mb-12 last:mb-0 group"
            >
              {/* Timeline line - connecting to next card */}
              {index < experience.length - 1 && (
                <div className="absolute left-[22px] top-20 w-0.5 h-[calc(100%+48px)] bg-gradient-to-b from-[var(--md-sys-color-primary)] via-[var(--md-sys-color-primary)]/30 to-transparent"></div>
              )}

              {/* Modern card with left accent border */}
              <div className="relative">
                {/* Animated left accent */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--md-sys-color-primary)] to-[var(--md-sys-color-tertiary)] rounded-l-2xl"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.15 + 0.3 }}
                  viewport={{ once: true }}
                ></motion.div>

                {/* Timeline marker with icon */}
                <div className="absolute -left-[23px] top-6 z-10">
                  <motion.div
                    className="w-11 h-11 bg-[var(--md-sys-color-primary-container)] rounded-full flex items-center justify-center shadow-lg border-4 border-[var(--md-sys-color-surface-container-lowest)]"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Briefcase className="text-[var(--md-sys-color-on-primary-container)]" size={20} />
                  </motion.div>
                </div>

                {/* Card content */}
                <motion.div
                  className="ml-8 md3-card overflow-hidden"
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Header section with gradient background */}
                  <div className="relative bg-gradient-to-br from-[var(--md-sys-color-surface-container-low)] to-[var(--md-sys-color-surface-container)] p-6 pb-5 border-b border-[var(--md-sys-color-outline-variant)]/30">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="md3-headline-small text-[var(--md-sys-color-primary)] font-semibold mb-1.5 break-words">
                          {exp.company}
                        </h3>
                        <h4 className="md3-title-large text-[var(--md-sys-color-on-surface)] font-normal mb-3 break-words">
                          {exp.title}
                        </h4>
                      </div>

                      {/* Duration badge */}
                      <div className="flex items-center gap-2 px-3 py-2 bg-[var(--md-sys-color-surface-container-highest)] rounded-full shadow-sm whitespace-nowrap flex-shrink-0">
                        <Calendar size={14} className="text-[var(--md-sys-color-primary)]" />
                        <span className="md3-label-medium text-[var(--md-sys-color-on-surface-variant)]">
                          {exp.duration}
                        </span>
                      </div>
                    </div>

                    {/* Company description */}
                    {exp.summary && (
                      <div className="mt-3 pt-3 border-t border-[var(--md-sys-color-outline-variant)]/20">
                        <p className="md3-body-medium text-[var(--md-sys-color-on-surface-variant)]/90 italic leading-relaxed">
                          {exp.summary}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Key achievements section */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Sparkles size={16} className="text-[var(--md-sys-color-primary)]" />
                      <h5 className="md3-title-medium text-[var(--md-sys-color-on-surface)]">
                        Key Achievements
                      </h5>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {exp.description.map((desc, descIndex) => (
                        <motion.li
                          key={descIndex}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: descIndex * 0.08 }}
                          viewport={{ once: true }}
                          className="flex items-start gap-3 group/item"
                        >
                          <div className="relative flex-shrink-0 mt-1.5">
                            <div className="w-1.5 h-1.5 bg-[var(--md-sys-color-primary)] rounded-full group-hover/item:scale-125 transition-transform"></div>
                            <div className="absolute inset-0 w-1.5 h-1.5 bg-[var(--md-sys-color-primary)] rounded-full animate-ping opacity-20"></div>
                          </div>
                          <span className="md3-body-medium text-[var(--md-sys-color-on-surface)] leading-relaxed flex-1">
                            {desc}
                          </span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* Technologies section */}
                    <div className="pt-4 border-t border-[var(--md-sys-color-outline-variant)]/30">
                      <h5 className="md3-label-large text-[var(--md-sys-color-on-surface-variant)] uppercase tracking-wider mb-3">
                        Tech Stack
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech, techIndex) => (
                          <motion.span
                            key={tech}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: techIndex * 0.03 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            className="relative px-3 py-1.5 bg-[var(--md-sys-color-surface-container-high)] hover:bg-[var(--md-sys-color-surface-container-highest)] text-[var(--md-sys-color-on-surface-variant)] rounded-lg md3-label-medium font-medium transition-colors cursor-default shadow-sm"
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}