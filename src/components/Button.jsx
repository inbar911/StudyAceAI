import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30',
  ghost: 'bg-slate-800/60 hover:bg-slate-700/60 text-slate-100 border border-slate-700',
  danger: 'bg-rose-600 hover:bg-rose-500 text-white',
  soft: 'bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/30'
};

export default function Button({ variant = 'primary', className = '', children, ...rest }) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
