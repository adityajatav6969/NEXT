import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Command, Search, X, Home, Users, Briefcase, MessageCircle, Bell, Compass, BarChart3 } from 'lucide-react';
import { useUI } from '../../context/UIContext';

const commands = [
  { id: 'home', icon: Home, label: 'Go to Home', shortcut: 'G H', path: '/' },
  { id: 'network', icon: Users, label: 'My Network', shortcut: 'G N', path: '/network' },
  { id: 'jobs', icon: Briefcase, label: 'Browse Jobs', shortcut: 'G J', path: '/jobs' },
  { id: 'messages', icon: MessageCircle, label: 'Messages', shortcut: 'G M', path: '/messages' },
  { id: 'notifications', icon: Bell, label: 'Notifications', path: '/notifications' },
  { id: 'explore', icon: Compass, label: 'Discover Developers', path: '/explore' },
  { id: 'dashboard', icon: BarChart3, label: 'Analytics Dashboard', path: '/dashboard' },
];

const CommandPalette = () => {
  const { commandPaletteOpen, toggleCommandPalette } = useUI();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const filtered = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        toggleCommandPalette();
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        toggleCommandPalette();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [commandPaletteOpen]);

  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelected(0);
    }
  }, [commandPaletteOpen]);

  const handleSelect = (cmd) => {
    navigate(cmd.path);
    toggleCommandPalette();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
    if (e.key === 'Enter' && filtered[selected]) { handleSelect(filtered[selected]); }
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={toggleCommandPalette}
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="w-full max-w-lg bg-white dark:bg-dark-800 rounded-2xl shadow-2xl border border-dark-200 dark:border-dark-700 overflow-hidden pointer-events-auto"
              onKeyDown={handleKeyDown}
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-dark-100 dark:border-dark-700">
                <Command className="w-4 h-4 text-brand-500" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search commands..."
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setSelected(0); }}
                  className="flex-1 bg-transparent text-dark-900 dark:text-dark-100 placeholder-dark-400 focus:outline-none text-sm"
                />
                <button onClick={toggleCommandPalette} className="p-1 rounded-lg hover:bg-dark-100 dark:hover:bg-dark-700 transition-colors">
                  <X className="w-4 h-4 text-dark-400" />
                </button>
              </div>
              <div className="py-2 max-h-80 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-dark-400">No commands found</p>
                ) : (
                  filtered.map((cmd, i) => (
                    <button
                      key={cmd.id}
                      onClick={() => handleSelect(cmd)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                        i === selected 
                          ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400' 
                          : 'text-dark-600 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-700'
                      }`}
                    >
                      <cmd.icon className="w-4 h-4" />
                      <span className="flex-1 text-left">{cmd.label}</span>
                      {cmd.shortcut && (
                        <span className="text-xs text-dark-300 dark:text-dark-500 font-mono">{cmd.shortcut}</span>
                      )}
                    </button>
                  ))
                )}
              </div>
              <div className="flex items-center gap-4 px-4 py-2.5 border-t border-dark-100 dark:border-dark-700 text-xs text-dark-400">
                <span className="flex items-center gap-1"><kbd className="font-mono">↑↓</kbd> navigate</span>
                <span className="flex items-center gap-1"><kbd className="font-mono">↵</kbd> select</span>
                <span className="flex items-center gap-1"><kbd className="font-mono">Esc</kbd> close</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
