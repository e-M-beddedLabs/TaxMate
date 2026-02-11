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
  Phone
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
import { Button } from '../components/ui';

const features = [
  {
    icon: TrendingUp,
    title: 'Track Income',
    description: 'Effortlessly record and categorize all your income sources in one place.',
    color: 'from-primary-500 to-primary-700',
  },
  {
    icon: Calculator,
    title: 'Compute Tax',
    description: 'Automatic GST calculations and estimated tax liability tracking.',
    color: 'from-secondary-400 to-secondary-600',
  },
  {
    icon: BarChart3,
    title: 'Generate Reports',
    description: 'Comprehensive financial reports with income vs expense breakdowns.',
    color: 'from-accent-800 to-accent-950',
  },
  {
    icon: FileSpreadsheet,
    title: 'CSV Import',
    description: 'Bulk upload transactions via CSV files with smart validation.',
    color: 'from-primary-600 to-secondary-500',
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
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-light-card/80 dark:bg-dark-card/80 backdrop-blur-xl border-b border-light-border dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-600/30">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <span className="font-bold text-xl">TaxMate</span>
            </motion.div>
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <a href="#contact">
                <Button variant="ghost" size="sm">Contact</Button>
              </a>
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">Get Started</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-600/10 text-primary-600 dark:text-primary-500 text-sm font-medium mb-6">
                <Sparkles size={14} />
                Smart Tax Management
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6"
            >
              Your intelligent{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-500 to-accent-800 whitespace-nowrap">
                tax companion
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-light-muted dark:text-dark-muted mb-8 leading-relaxed"
            >
              Track income, compute taxes, and generate reports effortlessly.
              TaxMate simplifies your financial record-keeping with automatic
              GST calculations and comprehensive analytics.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/register">
                <Button variant="primary" size="lg" className="gap-2 shadow-xl shadow-primary-600/30">
                  Start Free <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg">
                  Sign In
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 max-w-5xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden border border-light-border dark:border-dark-border shadow-2xl bg-light-card dark:bg-dark-card">
              {/* Browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-light-border dark:border-dark-border bg-light-bg dark:bg-dark-bg">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 ml-4">
                  <div className="max-w-md mx-auto px-4 py-1.5 rounded-lg bg-light-card dark:bg-dark-card text-xs text-light-muted dark:text-dark-muted">
                    taxmate.app/dashboard
                  </div>
                </div>
              </div>

              <div className="p-6 lg:p-8">
                {/* Mock dashboard */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: 'Total Income', value: '₹1,25,000', color: 'text-green-500', bg: 'bg-green-500/10' },
                    { label: 'Total Expense', value: '₹45,000', color: 'text-primary-600', bg: 'bg-primary-600/10' },
                    { label: 'Estimated Tax', value: '₹16,250', color: 'text-secondary-500', bg: 'bg-secondary-500/10' },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      className={`p-4 rounded-xl ${stat.bg}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                    >
                      <p className="text-xs text-light-muted dark:text-dark-muted mb-1">{stat.label}</p>
                      <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="h-48 rounded-xl bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { name: 'Jan', income: 4000, expense: 2400 },
                      { name: 'Feb', income: 3000, expense: 1398 },
                      { name: 'Mar', income: 2000, expense: 9800 },
                      { name: 'Apr', income: 2780, expense: 3908 },
                      { name: 'May', income: 1890, expense: 4800 },
                      { name: 'Jun', income: 2390, expense: 3800 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.3} />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--muted)', fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--muted)', fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'var(--card)',
                          borderColor: 'var(--border)',
                          borderRadius: '8px',
                          color: 'var(--foreground)'
                        }}
                        itemStyle={{ color: 'var(--foreground)' }}
                        cursor={{ fill: 'var(--muted)', opacity: 0.1 }}
                      />
                      <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-light-card dark:bg-dark-card border-y border-light-border dark:border-dark-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need
            </h2>
            <p className="text-light-muted dark:text-dark-muted max-w-2xl mx-auto">
              Powerful features to help you manage your taxes efficiently
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group p-6 rounded-2xl bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border hover:border-primary-500/30 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="text-white" size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Built for modern businesses
              </h2>
              <p className="text-light-muted dark:text-dark-muted mb-8 text-lg leading-relaxed">
                Whether you're a freelancer, consultant, or small business owner,
                TaxMate helps you stay on top of your finances with minimal effort.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-secondary-500/10 flex items-center justify-center">
                      <benefit.icon className="text-secondary-600 dark:text-secondary-400" size={16} />
                    </div>
                    <span className="text-sm font-medium">{benefit.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary-500/20 via-secondary-500/20 to-accent-500/20 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-transparent" />
                <Calculator size={120} className="text-primary-600/40 dark:text-primary-500/40" />
              </div>
              {/* Floating elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl bg-primary-600 shadow-xl shadow-primary-600/30 flex items-center justify-center"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <TrendingUp className="text-white" size={32} />
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -left-4 w-16 h-16 rounded-2xl bg-secondary-500 shadow-xl shadow-secondary-500/30 flex items-center justify-center"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                <BarChart3 className="text-white" size={24} />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-light-card dark:bg-dark-card border-y border-light-border dark:border-dark-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Get in Touch
            </h2>
            <p className="text-light-muted dark:text-dark-muted max-w-2xl mx-auto">
              Have questions about TaxMate? We'd love to hear from you.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <motion.a
              href="mailto:hello@taxmate.app"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center p-6 rounded-2xl bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border hover:border-primary-500/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-primary-600/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mail className="text-primary-600" size={24} />
              </div>
              <h3 className="font-semibold mb-1">Email Us</h3>
              <p className="text-sm text-light-muted dark:text-dark-muted">hello@taxmate.app</p>
            </motion.a>

            <motion.a
              href="#"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center p-6 rounded-2xl bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border hover:border-secondary-500/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-secondary-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="text-secondary-600" size={24} />
              </div>
              <h3 className="font-semibold mb-1">Live Chat</h3>
              <p className="text-sm text-light-muted dark:text-dark-muted">Chat with support</p>
            </motion.a>

            <motion.a
              href="tel:+911234567890"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center p-6 rounded-2xl bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border hover:border-accent-500/30 transition-all group"
            >
              <div className="w-14 h-14 rounded-xl bg-accent-800/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Phone className="text-accent-800" size={24} />
              </div>
              <h3 className="font-semibold mb-1">Call Us</h3>
              <p className="text-sm text-light-muted dark:text-dark-muted">+91 123 456 7890</p>
            </motion.a>
          </div>

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <a href="mailto:hello@taxmate.app">
              <Button variant="primary" size="lg" className="gap-2">
                <Mail size={18} />
                Send us an Enquiry
              </Button>
            </a>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-primary-600/10 via-secondary-500/10 to-accent-500/10 border border-primary-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/5 to-transparent" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to simplify your taxes?
              </h2>
              <p className="text-light-muted dark:text-dark-muted mb-8 text-lg">
                Join thousands of users who trust TaxMate for their tax management needs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register">
                  <Button variant="primary" size="lg" className="gap-2 shadow-xl shadow-primary-600/30">
                    Get Started Free <ArrowRight size={18} />
                  </Button>
                </Link>
                <a href="#contact">
                  <Button variant="secondary" size="lg" className="gap-2">
                    <MessageSquare size={18} />
                    Contact Us
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-light-border dark:border-dark-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="font-semibold">TaxMate</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-light-muted dark:text-dark-muted">
            <a href="#contact" className="hover:text-light-text dark:hover:text-dark-text transition-colors">Contact</a>
            <a href="#" className="hover:text-light-text dark:hover:text-dark-text transition-colors">Privacy</a>
            <a href="#" className="hover:text-light-text dark:hover:text-dark-text transition-colors">Terms</a>
          </div>
          <p className="text-sm text-light-muted dark:text-dark-muted">
            &copy; {new Date().getFullYear()} TaxMate. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};
