'use client'

import { motion } from 'framer-motion'
import { summary } from '@/lib/data/portfolio'
import { Award, Users, Rocket, TrendingUp, Code2, Globe } from 'lucide-react'

export default function About() {
  // Parse summary into sentences for better display
  const sentences = summary.split(/\.(?!\d)/).filter(s => s.trim())
  const mainSummary = sentences.slice(0, 2).join('.') + '.'
  const achievements = sentences.slice(2).join('.') + (sentences.length > 2 ? '' : '')

  const stats = [
    {
      icon: Code2,
      value: "15+",
      label: "Years Experience",
      color: "text-[var(--md-sys-color-primary)]"
    },
    {
      icon: Rocket,
      value: "50+",
      label: "Projects Delivered",
      color: "text-[var(--md-sys-color-secondary)]"
    },
    {
      icon: Users,
      value: "100K+",
      label: "Users Impacted",
      color: "text-[var(--md-sys-color-tertiary)]"
    },
    {
      icon: TrendingUp,
      value: "99.5%",
      label: "System Uptime",
      color: "text-[var(--md-sys-color-primary)]"
    }
  ];

  return (
    <section id="about" className="py-24 backdrop-blur-sm relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-[var(--md-sys-color-secondary)]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[var(--md-sys-color-primary)]/5 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--md-sys-color-primary-container)] rounded-full mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Globe size={16} className="text-[var(--md-sys-color-on-primary-container)]" />
            <span className="md3-label-medium text-[var(--md-sys-color-on-primary-container)] font-medium">
              Principal Software Engineer
            </span>
          </motion.div>

          <h2 className="md3-headline-large mb-4">
            About Me
          </h2>
          <p className="md3-body-medium md3-on-surface-variant max-w-2xl mx-auto">
            Transforming ideas into scalable, high-performance solutions
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Main summary card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="md3-card overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--md-sys-color-primary)] to-[var(--md-sys-color-tertiary)] rounded-xl flex items-center justify-center shadow-lg">
                  <Award className="text-white" size={24} />
                </div>
                <h3 className="md3-title-large font-semibold">Professional Journey</h3>
              </div>

              <p className="md3-body-large leading-relaxed text-[var(--md-sys-color-on-surface)] mb-4">
                {mainSummary}
              </p>

              {achievements && (
                <p className="md3-body-medium leading-relaxed text-[var(--md-sys-color-on-surface-variant)]">
                  {achievements}
                </p>
              )}
            </div>

            {/* Bottom accent */}
            <div className="h-1 bg-gradient-to-r from-[var(--md-sys-color-primary)] via-[var(--md-sys-color-secondary)] to-[var(--md-sys-color-tertiary)]"></div>
          </motion.div>

          {/* Stats grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className="md3-card p-6 text-center group cursor-default"
              >
                <div className="flex justify-center mb-3">
                  <div className="w-14 h-14 bg-[var(--md-sys-color-surface-container-high)] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <stat.icon className={stat.color} size={28} />
                  </div>
                </div>

                <div className="md3-display-small font-bold mb-1 bg-gradient-to-r from-[var(--md-sys-color-primary)] to-[var(--md-sys-color-tertiary)] bg-clip-text text-transparent">
                  {stat.value}
                </div>

                <div className="md3-label-medium text-[var(--md-sys-color-on-surface-variant)]">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Key highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="md3-card p-8"
        >
          <h3 className="md3-title-large font-semibold mb-6 text-center">Core Competencies</h3>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "GenAI & LLMOps",
                description: "Production-grade AI inference infrastructure with vLLM, Kubernetes, and multi-GPU optimization",
                icon: Rocket
              },
              {
                title: "Full-Stack Development",
                description: "Modern web applications with Next.js, React, Node.js, and cloud-native architectures",
                icon: Code2
              },
              {
                title: "Technical Leadership",
                description: "Leading teams, mentoring developers, and establishing engineering best practices at scale",
                icon: Users
              }
            ].map((competency, index) => (
              <motion.div
                key={competency.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative p-6 bg-[var(--md-sys-color-surface-container-low)] rounded-2xl"
              >
                <competency.icon className="text-[var(--md-sys-color-primary)] mb-4" size={24} />
                <h4 className="md3-title-medium font-semibold mb-2">{competency.title}</h4>
                <p className="md3-body-small text-[var(--md-sys-color-on-surface-variant)] leading-relaxed">
                  {competency.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}