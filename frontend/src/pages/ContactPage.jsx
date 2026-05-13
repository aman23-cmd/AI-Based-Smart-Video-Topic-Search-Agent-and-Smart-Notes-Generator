import React from 'react';
import { motion } from 'framer-motion';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Contact from '../components/home/Contact';

const ContactPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col bg-dark-500"
    >
      <Header />
      <main className="flex-1 pt-20">
        <Contact />
      </main>
      <Footer />
    </motion.div>
  );
};

export default ContactPage;
