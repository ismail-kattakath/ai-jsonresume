'use client'

import { motion } from 'framer-motion'
import { skills } from '@/lib/data/portfolio'
import { Brain, Cloud, Shield, Cog, Server, Code, Database, Network, Monitor, Sparkles } from 'lucide-react'

const iconMap: { [key: string]: any } = {
  'AI/ML Stack': Brain,
  'Cloud Services': Cloud,
  'Authentication & Security': Shield,
  'DevOps & CI/CD': Cog,
  'Backend & APIs': Server,
  'Programming / Scripting': Code,
  'Databases': Database,
  'Protocols': Network,
  'Web & Mobile UI': Monitor,
}

const colorMap: { [key: string]: string } = {
  'AI/ML Stack': 'from-purple-500 to-pink-500',
  'Cloud Services': 'from-blue-500 to-cyan-500',
  'Authentication & Security': 'from-orange-500 to-red-500',
  'DevOps & CI/CD': 'from-green-500 to-emerald-500',
  'Backend & APIs': 'from-indigo-500 to-purple-500',
  'Programming / Scripting': 'from-yellow-500 to-orange-500',
  'Databases': 'from-teal-500 to-green-500',
  'Protocols': 'from-pink-500 to-rose-500',
  'Web & Mobile UI': 'from-cyan-500 to-blue-500',
}

export default function Skills() {
  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[var(--md-sys-color-primary)]/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-[var(--md-sys-color-tertiary)]/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--md-sys-color-secondary-container)] rounded-full mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Sparkles size={16} className="text-[var(--md-sys-color-on-secondary-container)]" />
            <span className="md3-label-medium text-[var(--md-sys-color-on-secondary-container)] font-medium">
              Tech Stack
            </span>
          </motion.div>

          <h2 className="md3-headline-large mb-4">
            Technical Expertise
          </h2>
          <p className="md3-body-large md3-on-surface-variant max-w-3xl mx-auto">
            Comprehensive technical skills across AI/ML, cloud platforms,
            and modern development frameworks built over 15+ years of experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skillCategory, categoryIndex) => {
            const Icon = iconMap[skillCategory.category] || Code;
            const gradient = colorMap[skillCategory.category] || 'from-[var(--md-sys-color-primary)] to-[var(--md-sys-color-secondary)]';

            return (
              <motion.div
                key={skillCategory.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="md3-card overflow-hidden group"
              >
                {/* Header with gradient */}
                <div className="relative p-6 pb-4 bg-gradient-to-br from-[var(--md-sys-color-surface-container-low)] to-[var(--md-sys-color-surface-container)]">
                  <div className="flex items-center gap-3 mb-2">
                    {/* Icon with gradient background */}
                    <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="text-white" size={24} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="md3-title-medium font-semibold break-words">
                        {skillCategory.category}
                      </h3>
                      <p className="md3-label-small text-[var(--md-sys-color-on-surface-variant)]">
                        {skillCategory.items.length} technologies
                      </p>
                    </div>
                  </div>

                  {/* Accent line */}
                  <div className={`h-1 mt-4 bg-gradient-to-r ${gradient} rounded-full`}></div>
                </div>

                {/* Skills tags */}
                <div className="p-6 pt-4">
                  <div className="flex flex-wrap gap-2">
                    {skillCategory.items.map((skill, skillIndex) => (
                      <motion.span
                        key={skill}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: skillIndex * 0.02 }}
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        className="px-3 py-1.5 bg-[var(--md-sys-color-surface-container-high)] hover:bg-[var(--md-sys-color-surface-container-highest)] text-[var(--md-sys-color-on-surface-variant)] rounded-lg md3-label-small font-medium transition-colors cursor-default shadow-sm"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-8 px-8 py-6 md3-card">
            <div className="text-center">
              <div className="md3-headline-medium font-bold bg-gradient-to-r from-[var(--md-sys-color-primary)] to-[var(--md-sys-color-tertiary)] bg-clip-text text-transparent mb-1">
                {skills.length}
              </div>
              <div className="md3-label-medium text-[var(--md-sys-color-on-surface-variant)]">
                Skill Categories
              </div>
            </div>

            <div className="w-px h-12 bg-[var(--md-sys-color-outline-variant)]"></div>

            <div className="text-center">
              <div className="md3-headline-medium font-bold bg-gradient-to-r from-[var(--md-sys-color-primary)] to-[var(--md-sys-color-tertiary)] bg-clip-text text-transparent mb-1">
                {skills.reduce((acc, cat) => acc + cat.items.length, 0)}
              </div>
              <div className="md3-label-medium text-[var(--md-sys-color-on-surface-variant)]">
                Technologies Mastered
              </div>
            </div>

            <div className="w-px h-12 bg-[var(--md-sys-color-outline-variant)]"></div>

            <div className="text-center">
              <div className="md3-headline-medium font-bold bg-gradient-to-r from-[var(--md-sys-color-primary)] to-[var(--md-sys-color-tertiary)] bg-clip-text text-transparent mb-1">
                15+
              </div>
              <div className="md3-label-medium text-[var(--md-sys-color-on-surface-variant)]">
                Years of Practice
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}