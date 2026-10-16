import React, { useState, type FormEvent } from 'react';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { AlertCircle, BookOpen, LoaderCircle } from 'lucide-react';
import { auth } from '../firebase';

interface AuthScreenProps {
  configurationError?: string;
  onContinueAsGuest: () => void;
}

type AuthMode = 'login' | 'signup' | 'reset';

function friendlyAuthError(error: unknown): string {
  const code = typeof error === 'object' && error !== null && 'code' in error
    ? String(error.code)
    : '';
  switch (code) {
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/user-not-found':
    case 'auth/invalid-credential':
      return 'The email or password is incorrect.';
    case 'auth/email-already-in-use':
      return 'An account already exists for this email. Try logging in.';
    case 'auth/weak-password':
      return 'Choose a password with at least 6 characters.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is disabled. Enable it under Authentication → Sign-in method in Firebase Console.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'A network error occurred. Check your connection and try again.';
    default:
      return 'Authentication failed. Please try again.';
  }
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ configurationError, onContinueAsGuest }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!auth || configurationError) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      if (mode === 'signup') {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await sendPasswordResetEmail(auth, email.trim());
        setNotice('Password reset email sent. Check your inbox.');
      }
    } catch (authError) {
      setError(friendlyAuthError(authError));
    } finally {
      setBusy(false);
    }
  };

  const selectMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError('');
    setNotice('');
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 flex items-center justify-center px-4 py-10 font-sans">
      <section className="w-full max-w-md bg-white border border-slate-300 shadow-sm">
        <div className="bg-[#172554] text-white px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-white text-[#172554] font-black text-xs">
            CA
          </div>
          <div>
            <p className="text-[11px] uppercase font-bold tracking-widest text-blue-100">Project UNO</p>
            <h1 className="text-lg font-black">Academic Marks Calculator</h1>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <h2 className="text-xl font-black text-[#172554]">
            {mode === 'signup' ? 'Create your account' : mode === 'reset' ? 'Reset your password' : 'Log in'}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {mode === 'reset'
              ? 'We’ll email you a link to choose a new password.'
              : 'Sign in to securely access your saved courses and GPA.'}
          </p>

          {(configurationError || error) && (
            <div className="mt-5 flex items-start gap-2.5 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-900" role="alert">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
              <span>{configurationError || error}</span>
            </div>
          )}
          {notice && (
            <p className="mt-5 border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-900" role="status">
              {notice}
            </p>
          )}

          {!configurationError && (
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="block text-xs font-bold uppercase tracking-wide text-[#172554] mb-1.5">Email address</span>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-[#172554]"
                  placeholder="you@example.com"
                />
              </label>

              {mode !== 'reset' && (
                <label className="block">
                  <span className="block text-xs font-bold uppercase tracking-wide text-[#172554] mb-1.5">Password</span>
                  <input
                    type="password"
                    autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    required
                    minLength={mode === 'signup' ? 6 : undefined}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full border border-slate-300 bg-white px-3 py-2.5 text-sm focus:border-[#172554]"
                    placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                  />
                </label>
              )}

              <button
                type="submit"
                disabled={busy || !auth}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#172554] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#1e3a8a] disabled:opacity-60 disabled:cursor-wait"
              >
                {busy ? <LoaderCircle className="w-4 h-4 animate-spin" aria-hidden="true" /> : <BookOpen className="w-4 h-4" aria-hidden="true" />}
                {busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : mode === 'reset' ? 'Send reset link' : 'Log in'}
              </button>
            </form>
          )}

          <div className={`${configurationError ? 'mt-6' : 'mt-5'} flex flex-col items-start gap-3 text-sm`}>
            <button
              type="button"
              onClick={onContinueAsGuest}
              className="w-full border border-[#172554] bg-white px-4 py-3 text-xs font-bold uppercase tracking-wider text-[#172554] hover:bg-slate-50"
            >
              Continue as guest
            </button>
            <p className="text-xs text-slate-500">
              Guest work is temporary and will be cleared when you reload or close this page.
            </p>
            {!configurationError && mode === 'login' && (
              <button type="button" onClick={() => selectMode('reset')} className="font-semibold text-[#1e3a8a] hover:underline">
                Forgot password?
              </button>
            )}
            {!configurationError && mode === 'reset' ? (
              <button type="button" onClick={() => selectMode('login')} className="font-semibold text-[#1e3a8a] hover:underline">
                Back to log in
              </button>
            ) : !configurationError ? (
              <p className="text-slate-600">
                {mode === 'signup' ? 'Already have an account?' : 'New to Project UNO?'}{' '}
                <button
                  type="button"
                  onClick={() => selectMode(mode === 'signup' ? 'login' : 'signup')}
                  className="font-bold text-[#1e3a8a] hover:underline"
                >
                  {mode === 'signup' ? 'Log in' : 'Create account'}
                </button>
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
};
