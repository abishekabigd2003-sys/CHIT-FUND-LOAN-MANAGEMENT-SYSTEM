'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Mail, ShieldCheck, UserCheck, Briefcase, AlertCircle, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '@/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const loginSchema = z.object({
  email: z.string().min(1, 'Please enter your email ID').email('Please enter a valid email address'),
  password: z.string().min(1, 'Please enter your password'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    try {
      await login({
        email: data.email,
        password: data.password,
      });
    } catch (err: any) {
      setAuthError(err?.message || 'Authentication failed. Please verify your credentials.');
    }
  };

  const handleAutofill = (email: string, pass: string) => {
    setValue('email', email);
    setValue('password', pass);
    clearErrors();
    setAuthError(null);
  };

  return (
    <div className="relative min-h-screen bg-[#090d16] flex flex-col justify-center py-10 sm:py-16 px-4 sm:px-6 lg:px-8 text-slate-100 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-600/12 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top right theme toggle */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
        <ThemeToggle variant="dropdown" showLabel />
      </div>

      {/* Logo & Portal Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <div className="inline-flex items-center justify-center mb-4">
          <div className="relative h-18 w-18 sm:h-20 sm:w-20 rounded-2xl overflow-hidden bg-white/10 p-2 ring-1 ring-white/20 shadow-2xl shadow-purple-950/60 backdrop-blur-md">
            <Image
              src="/images/loans/chit-loan-logo.png"
              alt="Chit & Loan Enterprise Logo"
              width={80}
              height={80}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-brand-400 font-mono">
            Enterprise Financial Core
          </span>
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
          Chit & Loan Enterprise
        </h1>
        <p className="mt-1 text-xs text-slate-400 font-medium">
          Role-Based Access Control (RBAC) Banking Portal
        </p>
      </div>

      {/* Main Authentication Card */}
      <div className="mt-7 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="relative bg-[#0f172a]/90 backdrop-blur-2xl py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-slate-800/90 overflow-hidden">
          {/* Subtle top rim glow */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-500/50 to-transparent" />

          <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Error Message Alert */}
            {authError && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in-0 slide-in-from-top-1">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5 stroke-[2]" />
                <span className="leading-relaxed">{authError}</span>
              </div>
            )}

            <div>
              <Input
                label="Registered Email ID"
                type="email"
                startIcon={<Mail className="w-4 h-4" />}
                placeholder="e.g. admin@chitfund.com"
                {...register('email')}
                error={errors.email?.message}
                className="bg-slate-900/90 border-slate-700 text-white placeholder-slate-500 focus:border-brand-500 focus:ring-brand-500"
              />
            </div>

            <div>
              <Input
                label="Account Password"
                type="password"
                startIcon={<Lock className="w-4 h-4" />}
                placeholder="••••••••"
                {...register('password')}
                error={errors.password?.message}
                className="bg-slate-900/90 border-slate-700 text-white placeholder-slate-500 focus:border-brand-500 focus:ring-brand-500"
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-700 bg-slate-900 text-brand-600 focus:ring-brand-500 h-3.5 w-3.5 mr-2 cursor-pointer"
                />
                Remember terminal session
              </label>
              <span className="text-[11px] text-slate-500 font-mono">RBAC v2.4</span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full font-semibold text-sm h-11 gap-2 shadow-xs"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4 stroke-[2]" />}
            >
              Authenticate &amp; Enter System
            </Button>
          </form>

          {/* Quick Demo Credentials Autofill Helper */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                Demo Roles (Click to Autofill)
              </p>
              <span className="text-[10px] text-slate-500 font-mono">Instant Test Access</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleAutofill('admin@chitfund.com', 'Admin@123')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-900/70 hover:border-brand-500/70 hover:bg-brand-950/30 text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-lg bg-brand-600/20 text-brand-400 group-hover:bg-brand-600/30 shrink-0">
                    <ShieldCheck className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Admin Role</span>
                      <span className="text-[10px] bg-brand-950 text-brand-400 px-1.5 py-0.2 rounded border border-brand-800 font-mono">
                        /dashboard/admin
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block font-mono truncate">
                      admin@chitfund.com • Admin@123
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-brand-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                  Use →
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleAutofill('management@chitfund.com', 'Management@123')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-900/70 hover:border-purple-500/70 hover:bg-purple-950/30 text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-lg bg-purple-600/20 text-purple-400 group-hover:bg-purple-600/30 shrink-0">
                    <Briefcase className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Management Role</span>
                      <span className="text-[10px] bg-purple-950 text-purple-400 px-1.5 py-0.2 rounded border border-purple-800 font-mono">
                        /dashboard/management
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block font-mono truncate">
                      management@chitfund.com • Management@123
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-purple-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                  Use →
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleAutofill('staff@chitfund.com', 'Staff@123')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-800 bg-slate-900/70 hover:border-emerald-500/70 hover:bg-emerald-950/30 text-left transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 group-hover:bg-emerald-600/30 shrink-0">
                    <UserCheck className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Staff Role</span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-800 font-mono">
                        /dashboard/staff
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 block font-mono truncate">
                      staff@chitfund.com • Staff@123
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-emerald-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2">
                  Use →
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
