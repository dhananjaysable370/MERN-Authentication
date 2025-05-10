import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  LogIn,
  LogOut,
  Key,
  GitBranch,
  Gauge,
  Lock,
  Users,
  CheckCircle,
  Shield,
} from "lucide-react";
import axios from "axios";

const animations = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 },
    },
  },
  item: {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 120 },
    },
  },
  staggered: (i = 0) => ({
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, delay: i * 0.15 },
    },
  }),
};

const features = [
  {
    title: "JWT Security",
    description:
      "Secure token-based authentication with refresh capabilities and token rotation.",
    icon: Key,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    title: "OAuth Integration",
    description: "Seamless social login support with Google, GitHub, and more.",
    icon: GitBranch,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Rate Limiting",
    description:
      "Advanced brute-force protection and throttling on all endpoints.",
    icon: Gauge,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
];

const benefits = [
  {
    title: "Secure by Design",
    description: "Built from the ground up with security in mind.",
    icon: Lock,
  },
  {
    title: "User Friendly",
    description: "Designed for smooth and intuitive user experiences.",
    icon: Users,
  },
  {
    title: "Production Ready",
    description: "Robust error handling and deploy-ready architecture.",
    icon: CheckCircle,
  },
];

const LandingPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/check-auth`,
          { withCredentials: true }
        );
        setIsAuthenticated(data.success);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/logout`,
        {},
        { withCredentials: true }
      );
      setIsAuthenticated(false);
    } catch {
      setIsAuthenticated(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen mt-7 bg-gradient-to-br from-gray-900 to-emerald-900 text-white">
      <main className="container mx-auto px-4 sm:px-6 pt-16 pb-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={animations.container}
          className="text-center"
        >
          <motion.span
            variants={animations.item}
            className="inline-block px-4 py-1.5 mb-6 bg-emerald-500/10 text-emerald-400 rounded-full text-sm font-medium"
          >
            MERN Authentication Solution
          </motion.span>

          <motion.h1
            variants={animations.item}
            className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6"
          >
            <span className="text-emerald-500">Secure Authentication</span>
            <br />
            <span className="text-white">Made Simple</span>
          </motion.h1>

          <motion.p
            variants={animations.item}
            className="text-lg sm:text-xl text-gray-300 mb-16 max-w-2xl mx-auto"
          >
            Empower your application with robust authentication built on the
            MERN stack. Fast, secure, and developer-friendly.
          </motion.p>

          <motion.div
            variants={animations.item}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 bg-emerald-500 rounded-full hover:bg-emerald-600 transition-all font-semibold text-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  Get Started Free
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 border border-emerald-500 rounded-full hover:bg-emerald-500/10 transition-all font-semibold text-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full sm:w-auto px-8 py-4 bg-red-500 rounded-full hover:bg-red-600 transition-all font-semibold text-lg flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            )}
          </motion.div>
        </motion.div>
      </main>

      <section className="bg-gray-900/50 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 mb-4 bg-emerald-500/10 text-emerald-400 rounded-full text-sm font-medium">
              Features
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">
              Built for <span className="text-emerald-500">Developers</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={animations.staggered(index)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                whileHover={{ y: -10 }}
                className="p-6 sm:p-8 rounded-2xl bg-gray-800/30 backdrop-blur-lg border border-emerald-500/20 hover:border-emerald-500/40 transition-all group"
              >
                <div
                  className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block px-4 py-1.5 mb-4 bg-emerald-500/10 text-emerald-400 rounded-full text-sm font-medium">
              Benefits
            </span>
            <h2 className="text-3xl md:text-4xl font-bold">
              Why Choose <span className="text-emerald-500">MERN-Auth</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                variants={animations.staggered(index)}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 mb-6">
                  <benefit.icon className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 text-center">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 mb-4 bg-emerald-500/10 text-emerald-400 rounded-full text-sm font-medium">
              Get Started
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to secure your application?
            </h2>
            <p className="text-gray-300 mb-8">
              Join thousands of developers who trust our authentication solution
              for their apps.
            </p>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full hover:from-emerald-600 hover:to-green-700 transition-all font-semibold text-lg"
              >
                Start Your Journey Today
                <ChevronRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-gray-900/80 py-8">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="w-6 h-6 text-emerald-500" />
            <span className="font-semibold text-white">MERN-Auth</span>
          </div>
          <p className="text-gray-400 text-sm">
            © {currentYear} All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
