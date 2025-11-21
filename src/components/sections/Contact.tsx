'use client'

import { motion } from 'framer-motion'
import { Mail, MapPin, Github, Linkedin, Calendar, Send, MessageCircle } from 'lucide-react'
import { contactInfo } from '@/lib/data/portfolio'

export default function Contact() {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email",
      value: contactInfo.email,
      description: "Best for detailed inquiries",
      action: `mailto:${contactInfo.email}`,
      gradient: "from-blue-500 to-cyan-500",
      isExternal: false
    },
    {
      icon: Calendar,
      title: "Schedule Meeting",
      value: "30-60 min slots available",
      description: "Let's discuss your project",
      action: contactInfo.calendar,
      gradient: "from-purple-500 to-pink-500",
      isExternal: true
    },
    {
      icon: Linkedin,
      title: "LinkedIn",
      value: contactInfo.linkedin.replace('linkedin.com/in/', ''),
      description: "Professional network",
      action: `https://${contactInfo.linkedin}`,
      gradient: "from-blue-600 to-blue-700",
      isExternal: true
    },
    {
      icon: Github,
      title: "GitHub",
      value: contactInfo.github.replace('github.com/', ''),
      description: "Open source & projects",
      action: `https://${contactInfo.github}`,
      gradient: "from-gray-700 to-gray-900",
      isExternal: true
    }
  ];

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-[var(--md-sys-color-primary)]/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-[var(--md-sys-color-tertiary)]/5 rounded-full blur-3xl"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--md-sys-color-tertiary-container)] rounded-full mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <MessageCircle size={16} className="text-[var(--md-sys-color-on-tertiary-container)]" />
            <span className="md3-label-medium text-[var(--md-sys-color-on-tertiary-container)] font-medium">
              Let's Connect
            </span>
          </motion.div>

          <h2 className="md3-headline-large mb-4">
            Get In Touch
          </h2>
          <p className="md3-body-large md3-on-surface-variant max-w-2xl mx-auto">
            Have a project in mind or want to discuss opportunities?
            I'm always open to interesting conversations and collaborations.
          </p>
        </motion.div>

        {/* Contact methods grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {contactMethods.map((method, index) => (
            <motion.a
              key={method.title}
              href={method.action}
              target={method.isExternal ? "_blank" : undefined}
              rel={method.isExternal ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="md3-card overflow-hidden group cursor-pointer"
            >
              <div className="relative p-6 bg-gradient-to-br from-[var(--md-sys-color-surface-container-low)] to-[var(--md-sys-color-surface-container)]">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-14 h-14 bg-gradient-to-br ${method.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                    <method.icon className="text-white" size={24} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="md3-title-large font-semibold mb-1">{method.title}</h3>
                    <p className="md3-body-medium text-[var(--md-sys-color-on-surface)] break-all mb-1">
                      {method.value}
                    </p>
                    <p className="md3-label-small text-[var(--md-sys-color-on-surface-variant)]">
                      {method.description}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Send size={20} className="text-[var(--md-sys-color-primary)]" />
                  </div>
                </div>
              </div>

              {/* Hover accent */}
              <div className={`h-1 bg-gradient-to-r ${method.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`}></div>
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="md3-body-large text-[var(--md-sys-color-on-surface-variant)] mb-6">
            Ready to start a conversation?
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <motion.a
              href={`mailto:${contactInfo.email}`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] rounded-full md3-label-large font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              <Mail size={20} />
              Send Me an Email
            </motion.a>

            <motion.a
              href={contactInfo.calendar}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--md-sys-color-surface-container-high)] text-[var(--md-sys-color-on-surface)] rounded-full md3-label-large font-semibold shadow-md hover:shadow-lg transition-shadow border-2 border-[var(--md-sys-color-outline-variant)]"
            >
              <Calendar size={20} />
              Book a Meeting
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}