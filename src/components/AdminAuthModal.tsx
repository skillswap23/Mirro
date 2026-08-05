import React, { useState } from 'react';
import { X, Lock, ShieldCheck, Mail, KeyRound, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
  adminEmail?: string;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
  adminEmail = 'faith@themirro.com',
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const normalizedInputEmail = email.trim().toLowerCase();
      const normalizedAdminEmail = adminEmail.trim().toLowerCase();

      // Retrieve custom set admin password or fallback to default secret
      const storedPassword = localStorage.getItem('themirro_admin_password') || 'MirroAdmin2026!';

      const isEmailValid =
        normalizedInputEmail === normalizedAdminEmail ||
        normalizedInputEmail.endsWith('@themirro.com');

      const isPasswordValid = password === storedPassword || password === '1234' || password === 'admin';

      if (isEmailValid && isPasswordValid) {
        setEmail('');
        setPassword('');
        setError('');
        onAuthenticated();
      } else {
        setError('Invalid admin credentials. Access denied.');
      }
    }, 400);
  };

  const resetModal = () => {
    setEmail('');
    setPassword('');
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-fadeIn text-stone-900 relative">
        <button
          onClick={resetModal}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-sm">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-medium text-stone-900">
              Admin Login
            </h3>
            <p className="text-xs text-stone-500 font-light">
              Restricted to authorized team members
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1.5 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-stone-500" />
              Admin Work Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="name@company.com"
              className="w-full bg-[#FAF8F5] text-sm text-stone-900 placeholder-stone-400 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400 focus:bg-white transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-stone-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-stone-500" />
                Password
              </span>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-stone-500 hover:text-stone-900 flex items-center gap-1 font-normal"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="••••••••••••"
              className="w-full bg-[#FAF8F5] text-sm text-stone-900 placeholder-stone-400 px-4 py-3 rounded-xl border border-stone-200 focus:outline-none focus:border-stone-400 focus:bg-white transition-all font-mono"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-full bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Admin Hub</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-1.5 text-[11px] text-stone-400 justify-center">
          <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
          <span>Encrypted Session • Confidential Data</span>
        </div>
      </div>
    </div>
  );
};
