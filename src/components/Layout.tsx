// src/components/Layout.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <header>
        <h1>Movie Discovery</h1>
      </header>
      <main>{children}</main>
      <footer>© 2023 Movie Discovery</footer>
    </motion.div>
  );
};

export default Layout;