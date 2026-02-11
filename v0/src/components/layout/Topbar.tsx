import React from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Menu, LogOut, User, Bell, Search } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

interface TopbarProps {
  onMenuClick: () => void
}

export const Topbar: React.FC<TopbarProps> = ({ onMenuClick }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  // v0 hackathon-safe placeholders
  const userName = "User"
  const userEmail = "Authenticated"

  return (
    <header className="sticky top-0 z-30 h-16 bg-light-card/80 dark:bg-dark-card/80 backdrop-blur-xl border-b border-light-border dark:border-dark-border">
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <motion.button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl hover:bg-light-hover dark:hover:bg-dark-hover transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu size={20} />
          </motion.button>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-light-muted dark:text-dark-muted"
              />
              <input
                type="text"
                placeholder="Search..."
                className="w-64 lg:w-80 pl-10 pr-4 py-2 rounded-xl bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <motion.button
            className="relative p-2 rounded-xl text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text hover:bg-light-hover dark:hover:bg-dark-hover transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary-600 rounded-full" />
          </motion.button>

          {/* Divider */}
          <div className="hidden sm:block w-px h-8 bg-light-border dark:bg-dark-border mx-2" />

          {/* User info */}
          <motion.div
            className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-xl bg-light-bg dark:bg-dark-bg cursor-pointer hover:bg-light-hover dark:hover:bg-dark-hover transition-all"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center shadow-md">
              <User size={16} className="text-white" />
            </div>
            <div className="text-sm">
              <p className="font-medium leading-tight">{userName}</p>
              <p className="text-xs text-light-muted dark:text-dark-muted">
                {userEmail}
              </p>
            </div>
          </motion.div>

          {/* Logout button */}
          <motion.button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-light-muted dark:text-dark-muted hover:text-primary-600 dark:hover:text-primary-500 hover:bg-primary-600/10 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogOut size={18} />
            <span className="hidden sm:inline text-sm font-medium">Logout</span>
          </motion.button>
        </div>
      </div>
    </header>
  )
}
