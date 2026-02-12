import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './Button';

const Navbar: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Records', path: '/records' },
        { name: 'Analytics', path: '/analytics' },
    ];

    return (
        <nav
            className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled ? 'py-4' : 'py-6'}
      `}
        >
            <div className="container mx-auto px-6">
                <div
                    className={`
            mx-auto max-w-5xl rounded-full border border-white/5 
            backdrop-blur-xl transition-all duration-300
            ${isScrolled ? 'bg-[#060606]/80 shadow-2xl shadow-black/50' : 'bg-transparent border-transparent'}
            px-6 py-3 flex items-center justify-between
          `}
                >
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-highlight to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-highlight/20 group-hover:shadow-highlight/40 transition-all">
                            T
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">TaxMate</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                    ${isActive
                                            ? 'text-white bg-white/10'
                                            : 'text-text-secondary hover:text-white hover:bg-white/5'}
                  `}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <Link to="/login">
                            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                                Log in
                            </Button>
                        </Link>
                        <Link to="/add-record">
                            <Button variant="primary" size="sm">
                                Add Record
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
