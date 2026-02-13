import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Upload,
  BarChart3,
  TrendingUp,
  X
} from 'lucide-react';

// ... (existing imports)

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/records', label: 'Records', icon: FileText },
  { path: '/upload', label: 'Upload', icon: Upload },
  { path: '/erl', label: 'Economic Reality', icon: TrendingUp },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const NavItem = ({ item }: { item: typeof navItems[0] }) => {
    const isActive = location.pathname === item.path ||
      (item.path === '/records' && location.pathname.startsWith('/records'));

    return (
      <NavLink
        to={item.path}
        onClick={onClose}
        onMouseEnter={() => setHoveredItem(item.path)}
        onMouseLeave={() => setHoveredItem(null)}
        className={cn(
          'relative flex items-center justify-center p-3 rounded-xl transition-colors duration-200',
          isActive
            ? 'bg-primary-600/10 text-primary-600 dark:text-primary-500'
            : 'text-light-muted dark:text-dark-muted hover:bg-light-hover dark:hover:bg-dark-hover hover:text-light-text dark:hover:text-dark-text'
        )}
      >
        <item.icon size={22} />

        {/* Tooltip */}
        {hoveredItem === item.path && (
          <div className="absolute left-full ml-3 px-3 py-2 bg-dark-card text-dark-text text-sm rounded-lg shadow-xl whitespace-nowrap z-50">
            {item.label}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-dark-card" />
          </div>
        )}
      </NavLink>
    );
  };

  return (
    <>
      {/* Desktop Sidebar - Always collapsed/icon only */}
      <aside className="hidden lg:flex fixed top-0 left-0 z-40 h-full w-16 flex-col bg-light-card dark:bg-dark-card border-r border-light-border dark:border-dark-border">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 border-b border-light-border dark:border-dark-border">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-600/30">
            <span className="text-white font-bold">T</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col items-center px-2 py-4 gap-1">
          {navItems.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar - Full width when open */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={onClose}
            />

            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed top-0 left-0 z-50 h-full w-[280px] bg-light-card dark:bg-dark-card border-r border-light-border dark:border-dark-border lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-6 border-b border-light-border dark:border-dark-border">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-600/30">
                      <span className="text-white font-bold">T</span>
                    </div>
                    <span className="font-semibold text-lg">TaxMate</span>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                  {navItems.map((item) => {
                    const isActive = location.pathname === item.path ||
                      (item.path === '/records' && location.pathname.startsWith('/records'));

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200',
                          isActive
                            ? 'bg-primary-600/10 text-primary-600 dark:text-primary-500 font-medium'
                            : 'text-light-muted dark:text-dark-muted hover:bg-light-hover dark:hover:bg-dark-hover hover:text-light-text dark:hover:text-dark-text'
                        )}
                      >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </nav>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
