import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  FileSpreadsheet,
  Calculator,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Shield,
  Zap,
  Mail,
  MessageSquare,
  Phone,
  ArrowUpRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import Navbar from '../components/ui/Navbar';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const features = [
  {
    icon: TrendingUp,
    title: 'Track Income',
    description: 'Effortlessly record and categorize all your income sources in one place.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10'
  },
  {
    icon: Calculator,
    title: 'Compute Tax',
    description: 'Automatic GST calculations and estimated tax liability tracking.',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10'
  },
  {
    icon: BarChart3,
    title: 'Generate Reports',
    description: 'Comprehensive financial reports with income vs expense breakdowns.',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10'
  },
  {
    icon: FileSpreadsheet,
    title: 'CSV Import',
    description: 'Bulk upload transactions via CSV files with smart validation.',
    color: 'text-orange-400',
    bg: 'bg-orange-400/10'
  },
];

const benefits = [
  { icon: Zap, text: 'Automatic GST calculation' },
  { icon: Shield, text: 'Secure & private' },
  { icon: Sparkles, text: 'Financial year tracking' },
  { icon: CheckCircle2, text: 'Category-wise breakdown' },
  { icon: BarChart3, text: 'Export-ready reports' },
  { icon: TrendingUp, text: 'Mobile responsive' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-text-primary selection:bg-highlight/30 overflow-x-hidden">
      <Navbar />

      {/* Hero Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-highlight/10 rounded-full blur-[120px] opacity-30" />
        <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] opacity-20" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-highlight/20 bg-highlight/5 text-highlight text-sm font-medium mb-8 backdrop-blur-sm">
              <Sparkles size={14} />
              <span>Smart Tax Management v2.0</span>
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]"
          >
            Your intelligent <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/50">
              tax companion.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Track income, compute taxes, and generate reports effortlessly.
            The modern financial stack for freelancers and small businesses.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/register">
              <Button size="lg" className="rounded-full px-8 py-4 text-lg">
                Start Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="secondary" size="lg" className="rounded-full px-8 py-4 text-lg">
                View Demo
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Dashboard Preview Glass Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="mt-24 max-w-6xl mx-auto relative perspective-1000"
        >
          <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0A]/80 backdrop-blur-2xl shadow-2xl shadow-highlight/5">
            {/* Window Controls */}
            <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 text-center">
                <div className="inline-block px-3 py-1 rounded-md bg-white/5 text-[10px] text-text-muted font-mono tracking-wider">
                  ANTIGRAVITY.OS
                </div>
              </div>
            </div>

            <div className="p-8 lg:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[
                  { label: 'Total Income', value: '₹1,25,000', color: 'text-emerald-400' },
                  { label: 'Total Expense', value: '₹45,000', color: 'text-red-400' },
                  { label: 'Net Profit', value: '₹80,000', color: 'text-blue-400' },
                ].map((stat, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors cursor-pointer group">
                    <p className="text-sm text-text-muted mb-2 font-medium">{stat.label}</p>
                    <p className={`text-3xl font-bold ${stat.color} group-hover:scale-105 transition-transform origin-left`}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="h-64 md:h-80 w-full rounded-2xl bg-white/[0.02] border border-white/5 p-6">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { name: 'Jan', income: 4000, expense: 2400 },
                    { name: 'Feb', income: 3000, expense: 1398 },
                    { name: 'Mar', income: 9000, expense: 2800 },
                    { name: 'Apr', income: 2780, expense: 3908 },
                    { name: 'May', income: 1890, expense: 4800 },
                    { name: 'Jun', income: 2390, expense: 3800 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.2} />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#666', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#666', fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#111',
                        borderColor: '#222',
                        borderRadius: '12px',
                        color: '#fff'
                      }}
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                    <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={50} />
                    <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-32 px-4 sm:px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Features that <span className="text-highlight">empower</span> you.
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Everything you need to manage your finances without the complexity.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card variant="hover" className="h-full p-8 flex flex-col items-start gap-4 group">
                  <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={feature.color} size={28} />
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-4 sm:px-6 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">modern businesses</span>.
            </h2>
            <p className="text-text-secondary text-lg mb-10 leading-relaxed">
              Whether you're a freelancer, consultant, or small business owner,
              TaxMate helps you stay on top of your finances with minimal effort.
            </p>

            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-highlight/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={12} className="text-highlight" />
                  </div>
                  <span className="text-text-primary/80 font-medium">{benefit.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <Link to="/register">
                <Button variant="secondary" className="gap-2">
                  Explore All Features <ArrowUpRight size={16} />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-1">
              <div className="absolute inset-0 bg-noise opacity-20"></div>
              <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-highlight/20 blur-[100px] rounded-full" />

              <div className="relative h-full w-full rounded-[2.9rem] bg-[#080808] overflow-hidden flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-20 h-20 bg-highlight/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-highlight animate-pulse-soft">
                    <Zap size={40} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Lightning Fast</h3>
                  <p className="text-text-muted">Real-time calculations as you type.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-[3rem] bg-gradient-to-b from-white/10 to-white/5 border border-white/10 p-12 md:p-20 relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-highlight/10 blur-[100px]" />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to take control?
              </h2>
              <p className="text-text-secondary text-xl mb-10 max-w-2xl mx-auto">
                Join thousands of users who trust TaxMate for their tax management needs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register">
                  <Button size="lg" className="rounded-full px-10 py-4 shadow-xl shadow-highlight/20">
                    Get Started Free
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-text-muted text-sm">
                  <Shield size={14} />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-[#020202]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-highlight to-orange-600 flex items-center justify-center text-white font-bold shadow-lg shadow-highlight/20">
              T
            </div>
            <span className="font-bold text-xl tracking-tight">TaxMate</span>
          </div>

          <div className="flex gap-8 text-sm text-text-muted">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Contact Support</a>
          </div>

          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} TaxMate Inc.
          </p>
        </div>
      </footer>
    </div>
  );
};
