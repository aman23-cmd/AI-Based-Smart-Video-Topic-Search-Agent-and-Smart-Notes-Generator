import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import SearchBox from '../components/home/SearchBox';
import Testimonials from '../components/home/Testimonials';
import Contact from '../components/home/Contact';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={{
        initial: { opacity: 0 },
        in: { opacity: 1 },
        out: { opacity: 0 }
      }}
      transition={{ duration: 0.3 }}
      className="min-h-screen flex flex-col"
    >
      <Header />
      <main className="flex-1">
        <Hero />
        <SearchBox />
        <Features />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </motion.div>
  );
};

export default Home;
