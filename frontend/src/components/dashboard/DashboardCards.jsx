import { motion } from 'framer-motion';
import { Search, FileText, Clock, TrendingUp } from 'lucide-react';

const DashboardCards = ({ stats }) => {
  const cards = [
    { label: 'Total Searches', value: stats?.searches || 0, icon: Search, color: 'from-cyan-500 to-blue-500', glow: 'shadow-cyan-500/20' },
    { label: 'Saved Notes', value: stats?.notes || 0, icon: FileText, color: 'from-purple-500 to-pink-500', glow: 'shadow-purple-500/20' },
    { label: 'Videos Analyzed', value: stats?.videos || 0, icon: Clock, color: 'from-amber-500 to-orange-500', glow: 'shadow-amber-500/20' },
    { label: 'Time Saved', value: `${stats?.timeSaved || 0}h`, icon: TrendingUp, color: 'from-green-500 to-emerald-500', glow: 'shadow-green-500/20' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg ${card.glow}`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.label}</p>
          </motion.div>
        );
      })}
    </div>
  );
};

export default DashboardCards;
