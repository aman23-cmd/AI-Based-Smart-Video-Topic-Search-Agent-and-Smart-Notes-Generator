import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Priya Sharma', role: 'CS Student',
    text: "Saved me hours during exam prep. I find DSA topics in lectures instantly!",
    rating: 5, avatar: 'PS', color: 'from-cyan-500 to-blue-500',
  },
  {
    name: 'Rahul Mehta', role: 'Developer',
    text: "AI notes are incredible. Perfect summaries from 3-hour tutorials in seconds.",
    rating: 5, avatar: 'RM', color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Ananya Verma', role: 'Researcher',
    text: "Semantically searching through academic lectures is a game-changer.",
    rating: 5, avatar: 'AV', color: 'from-amber-500 to-orange-500',
  },
];

const Testimonials = () => (
  <section className="relative py-24 overflow-hidden">
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
        <span className="inline-block px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-medium mb-4">Testimonials</span>
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Loved by <span className="gradient-text">Students Worldwide</span></h2>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div key={t.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card p-6 relative">
            <Quote className="w-8 h-8 text-white/5 absolute top-4 right-4" />
            <div className="flex gap-1 mb-4">{Array.from({ length: t.rating }, (_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}</div>
            <p className="text-sm text-gray-300 leading-relaxed mb-6 italic">"{t.text}"</p>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-sm font-bold`}>{t.avatar}</div>
              <div><p className="text-sm font-semibold text-white">{t.name}</p><p className="text-xs text-gray-500">{t.role}</p></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
