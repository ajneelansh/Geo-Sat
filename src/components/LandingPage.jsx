"use client"

import { useState, useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ArrowRight, Satellite, Map, Bell, Database, ChevronDown, Menu, X } from 'lucide-react'
import { useNavigate } from "react-router-dom";
import StarBackground from '../components/particle';

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const controls = useAnimation()
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const navigate = useNavigate()


  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleGetStarted = () => {
    navigate('/maintool')
  }
  

  return (
    
    <div className="flex flex-col min-h-screen bg-black text-white font-sans">
      <header className="sticky top-0 z-10 bg-black bg-opacity-90 backdrop-blur-md border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <motion.div 
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Satellite className="h-6 w-6 text-white" />
              <span className="text-xl font-semibold text-white">LandsatCompare</span>
            </motion.div>
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                {['Features', 'About', 'Use Cases', 'Contact'].map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <button
                      onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                      className="hover:text-gray-300 transition-colors"
                    >
                      {item}
                    </button>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <motion.button 
              className="md:hidden text-white hover:text-gray-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
        {isMenuOpen && (
          <motion.div 
            className="md:hidden bg-black bg-opacity-90 backdrop-blur-md mt-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="flex flex-col items-center py-4">
              {['Features', 'About', 'Use Cases', 'Contact'].map((item) => (
                <li key={item} className="py-2">
                  <button
                    onClick={() => {
                      scrollToSection(item.toLowerCase().replace(' ', '-'))
                      setIsMenuOpen(false)
                    }}
                    className="hover:text-gray-300 transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </header>
      
      <main className="flex-grow">
        <section className="h-screen flex items-center justify-center px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <StarBackground/>
            <motion.h1 
              className="text-4xl md:text-5xl font-bold mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Compare Ground Observations with Landsat Data
            </motion.h1>
            <motion.p 
              className="text-xl mb-10 max-w-2xl mx-auto text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Define locations, get notifications, and analyze Landsat SR data with ease.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <button
                onClick={handleGetStarted}
                className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors inline-flex items-center"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </motion.div>
          </div>
        </section>

        <section id="features" className="min-h-screen py-16 px-4" ref={ref}>
          <div className="container mx-auto max-w-4xl">
            <motion.h2 
              className="text-3xl font-bold text-center mb-12 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={controls}
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 20 }
              }}
              transition={{ duration: 0.8 }}
            >
              Key Features
            </motion.h2>
            <motion.div 
              className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0 md:space-x-8"
              initial="hidden"
              animate={controls}
              variants={{
                visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
                hidden: { opacity: 0, y: 20 }
              }}
            >
              <FeatureCard
                icon={<Map className="h-10 w-10 text-white" />}
                title="Define Target Locations"
                description="Set and manage your areas of interest."
              />
              <FeatureCard
                icon={<Bell className="h-10 w-10 text-white" />}
                title="Landsat Pass Notifications"
                description="Get alerts for scheduled passes."
              />
              <FeatureCard
                icon={<Database className="h-10 w-10 text-white" />}
                title="Access SR Data"
                description="Retrieve and visualize Landsat data."
              />
            </motion.div>
          </div>
        </section>

        <section id="about" className="min-h-screen py-16 px-4 bg-gray-900">
          <div className="container mx-auto max-w-4xl">
            <motion.h2 
              className="text-3xl font-bold text-center mb-12 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              About Landsat
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h3 className="text-2xl font-semibold mb-4 text-white">Landsat Scene Extents (WRS-2)</h3>
                <p className="text-gray-300">Each Landsat scene covers 185 km x 180 km, organized into paths and rows based on the WRS-2 system.</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <h3 className="text-2xl font-semibold mb-4 text-white">Landsat Acquisitions</h3>
                <p className="text-gray-300">Landsat 8 and 9 orbit at 705 km altitude, completing about 14 orbits daily, providing measurements every 8 days.</p>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="use-cases" className="min-h-screen py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.h2 
              className="text-3xl font-bold text-center mb-12 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Landsat Data Use Cases
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <UseCaseCard
                title="Environmental Monitoring"
                description="Track changes in land use and deforestation."
              />
              <UseCaseCard
                title="Agricultural Management"
                description="Assess crop health and optimize irrigation."
              />
              <UseCaseCard
                title="Disaster Response"
                description="Rapidly assess damage from natural disasters."
              />
              <UseCaseCard
                title="Climate Change Research"
                description="Study long-term environmental changes."
              />
            </div>
          </div>
        </section>

        <section id="contact" className="min-h-screen py-16 px-4 bg-gray-900">
          <div className="container mx-auto max-w-4xl text-center">
            <motion.h2 
              className="text-3xl font-bold mb-8 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Ready to Get Started?
            </motion.h2>
            <motion.p 
              className="text-xl mb-10 max-w-2xl mx-auto text-gray-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Join us in leveraging the power of Landsat data for your research and applications.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <button
                onClick={handleGetStarted}
                className="bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-200 transition-colors inline-flex items-center"
              >
                Contact Us <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 py-8 border-t border-gray-800">
        <div className="container mx-auto text-center px-4">
          <p className="text-gray-400">&copy; 2023 LandsatCompare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div 
      className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center text-center transition-all duration-300 ease-in-out hover:bg-gray-700"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  )
}

function UseCaseCard({ title, description }) {
  return (
    <motion.div 
      className="bg-gray-800 p-6 rounded-lg shadow-lg"
      whileHover={{ scale: 1.05 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-300 mb-4">{description}</p>
      <button className="text-white hover:text-gray-300 inline-flex items-center">
        Learn more <ChevronDown className="ml-1 h-4 w-4" />
      </button>
    </motion.div>
  )
}