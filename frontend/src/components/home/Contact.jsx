import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, User, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section id="contact" className="relative py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-sm font-medium mb-4">Contact</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Get in <span className="gradient-text">Touch</span></h2>
          <p className="text-gray-400">Have questions or feedback? We'd love to hear from you.</p>
        </motion.div>
        <motion.form initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} onSubmit={handleSubmit} className="glass-card p-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="text" placeholder="Your Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="glass-input w-full pl-11" required id="contact-name" />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input type="email" placeholder="Your Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="glass-input w-full pl-11" required id="contact-email" />
            </div>
          </div>
          <div className="relative">
            <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-gray-500" />
            <textarea placeholder="Your Message" rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="glass-input w-full pl-11 resize-none" required id="contact-message" />
          </div>
          <button type="submit" className="glass-button w-full flex items-center justify-center gap-2">
            {sent ? '✓ Message Sent!' : <><Send className="w-4 h-4" /> Send Message</>}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;
