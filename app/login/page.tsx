// ./app/page.tsx
'use client';

import { PenTool, ThumbsUp, Rocket, Users, Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setHidden(latest > 50);
  });

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-x-hidden"
    >
      {/* Animated Sticky Navbar */}
      <motion.div
        animate={{ y: hidden ? -80 : 0 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 w-full bg-white bg-opacity-70 backdrop-blur border-b border-gray-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="text-lg font-bold text-blue-700">MyApp</div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-4">
            <Link
              href="/login"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition border ${
                pathname === '/login'
                  ? 'bg-blue-100 text-blue-700 border-blue-700'
                  : 'text-blue-600 border-blue-600 hover:bg-blue-50'
              }`}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                pathname === '/signup'
                  ? 'bg-blue-700 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-blue-600 rounded-lg hover:bg-blue-100"
            onClick={() => setNavOpen(!navOpen)}
          >
            {navOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav Drawer with animation */}
        <AnimatePresence>
          {navOpen && (
            <motion.div
              key="mobile-nav"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden px-4 pb-4 flex flex-col gap-2"
            >
              <Link
                href="/login"
                className={`w-full text-center px-4 py-2 rounded-lg border text-sm font-medium transition ${
                  pathname === '/login'
                    ? 'bg-blue-100 text-blue-700 border-blue-700'
                    : 'text-blue-600 border-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => setNavOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className={`w-full text-center px-4 py-2 rounded-lg text-sm font-medium transition ${
                  pathname === '/signup'
                    ? 'bg-blue-700 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                onClick={() => setNavOpen(false)}
              >
                Sign Up
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen space-y-4">
        <motion.div variants={itemVariants} className="text-center">
          <motion.div
            variants={itemVariants}
            className="flex justify-center mb-4"
          >
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
              <PenTool className="w-8 h-8 text-white" />
            </div>
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-3xl font-bold text-gray-900 mb-2">
            Welcome
          </motion.h1>
          <motion.p variants={itemVariants} className="text-gray-600 mb-6">
            Home page content goes here.
          </motion.p>

          <motion.div variants={itemVariants} className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-6 py-3 bg-white border border-blue-600 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200"
            >
              Sign Up
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 px-4 py-16 text-center bg-white shadow-inner"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-8">Why Choose Us?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-gray-700">
            <ThumbsUp className="w-10 h-10 text-blue-500 mb-2" />
            <h3 className="font-semibold text-lg">Easy to Use</h3>
            <p className="text-sm mt-2">Our interface is intuitive and user-friendly for all skill levels.</p>
          </div>
          <div className="flex flex-col items-center text-gray-700">
            <Rocket className="w-10 h-10 text-purple-500 mb-2" />
            <h3 className="font-semibold text-lg">Fast Progress</h3>
            <p className="text-sm mt-2">Improve your handwriting with guided exercises and real-time feedback.</p>
          </div>
          <div className="flex flex-col items-center text-gray-700">
            <Users className="w-10 h-10 text-green-500 mb-2" />
            <h3 className="font-semibold text-lg">Community Support</h3>
            <p className="text-sm mt-2">Join a community of learners and share your journey.</p>
          </div>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative z-10 px-4 py-16 text-center bg-gradient-to-br from-green-50 to-blue-100"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get Started Today</h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-6">
          Create your free account and start practicing with real-time feedback and expert guidance.
        </p>
        <Link
          href="/signup"
          className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-colors duration-200"
        >
          Sign Up Free
        </Link>
      </motion.section>
    </motion.div>
  );
}
