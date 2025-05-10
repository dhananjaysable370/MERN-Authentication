import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { LogOut, Menu, X, Shield } from "lucide-react";
import PropTypes from "prop-types";

const NavLink = ({ to, children, className = "", onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`text-white hover:text-emerald-300 transition-colors duration-200 ${className}`}
  >
    {children}
  </Link>
);

NavLink.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
};

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef(null);

  const isAuthenticated = Boolean(user);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await onLogout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderLinks = (isMobile = false) => (
    <>
      {isAuthenticated ? (
        <>
          <NavLink
            to="/home"
            onClick={() => isMobile && setIsMenuOpen(false)}
            className={
              isMobile ? "block px-4 py-3 rounded-lg hover:bg-gray-800/50" : ""
            }
          >
            Dashboard
          </NavLink>
          {!user.emailVerified && (
            <NavLink
              to="/verify-email"
              onClick={() => isMobile && setIsMenuOpen(false)}
              className={`${
                isMobile
                  ? "block px-4 py-3 text-yellow-300 hover:text-yellow-200 rounded-lg hover:bg-gray-800/50"
                  : "text-yellow-300 hover:text-yellow-200"
              }`}
            >
              Verify Email
            </NavLink>
          )}
          <div className={`${isMobile ? "px-4 py-2" : ""} text-white/80`}>
            Hi, {user.name || user.email.split("@")[0]}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`${
              isMobile
                ? "w-full flex items-center justify-center space-x-2 px-4 py-3"
                : "flex items-center space-x-2 px-4 py-2"
            } bg-red-500/90 hover:bg-red-600 rounded-lg transition-colors disabled:opacity-70`}
          >
            {isLoggingOut ? (
              <span className="animate-pulse">Logging out...</span>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </>
            )}
          </motion.button>
        </>
      ) : (
        <>
          <NavLink
            to="/login"
            onClick={() => isMobile && setIsMenuOpen(false)}
            className={
              isMobile ? "block px-4 py-3 rounded-lg hover:bg-gray-800/50" : ""
            }
          >
            Sign In
          </NavLink>
          <Link
            to="/register"
            onClick={() => isMobile && setIsMenuOpen(false)}
            className={`${
              isMobile
                ? "block text-center px-4 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg transition-all"
                : "px-6 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-full transition-all"
            } font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
          >
            Get Started
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav
      ref={menuRef}
      className="fixed w-full top-0 left-0 z-50 bg-transparent backdrop-blur-md"
    >
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 group">
            <Shield className="w-8 h-8 text-emerald-500 group-hover:text-emerald-400 transition-colors" />
            <span className="text-xl font-bold text-emerald-500">
              MERN-Auth
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {renderLinks()}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden text-white hover:text-emerald-400 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, maxHeight: 0 }}
              animate={{ opacity: 1, maxHeight: 500 }}
              exit={{ opacity: 0, maxHeight: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-4 space-y-4 pb-4 overflow-hidden"
            >
              {renderLinks(true)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  user: PropTypes.object,
  onLogout: PropTypes.func.isRequired,
};

export default Navbar;
