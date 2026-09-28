'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Shield,
  Server,
  Save,
  Palette,
  Sun,
  Moon,
  Monitor,
  Sparkles,
  Lock,
  Users,
  ChevronRight,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/providers/ToastProvider';
import { useTheme, Theme } from '@/providers/ThemeProvider';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { user, role } = useAuth();
  const toast = useToast();
  const { theme, resolvedTheme, setTheme } = useTheme();

  const [companyName, setCompanyName] = useState('Chit Fund & Loan Financial Services Ltd.');
  const [branch, setBranch] = useState('Chennai Main Corporate Branch');
  const [currency, setCurrency] = useState('INR (₹)');
  const [taxPan, setTaxPan] = useState('AAACF9876K');
  const [apiUrl, setApiUrl] = useState(
    process.env.NEXT_PUBLIC_API_URL || 'https://api.chitfund-loan.enterprise.local/api/v1'
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Configuration Saved', 'System settings and branch parameters updated successfully');
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    toast.info('Theme Updated', `Switched to ${newTheme.toUpperCase()} mode.`);
  };

  const themeOptions: {
    id: Theme;
    title: string;
    description: string;
    icon: typeof Sun;
  }[] = [
    {
      id: 'light',
      title: 'Light Mode',
      description: 'High-contrast financial tables and ledger reports',
      icon: Sun,
    },
    {
      id: 'dark',
      title: 'Dark Mode',
      description: 'Deep midnight blue tones for reduced eye strain',
      icon: Moon,
    },
    {
      id: 'system',
      title: 'System Automatic',
      description: 'Dynamically adapts to OS schedule',
      icon: Monitor,
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Enterprise Settings & System Config
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Configure visual themes, organization profile, API service connectors, and role security tiers.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleSave}
          variant="primary"
          size="sm"
          leftIcon={<Save className="w-4 h-4 stroke-[2]" />}
          className="text-sm font-semibold shadow-2xs self-start sm:self-auto whitespace-nowrap"
        >
          Save Changes
        </Button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 2-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Column 1: Organization Profile & API Connectors */}
          <div className="space-y-5">
            {/* Organization Profile Card */}
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-5 h-5 text-brand-600 dark:text-brand-400 stroke-[1.8]" />
                  <CardTitle className="text-base font-bold">Organization & Branch Profile</CardTitle>
                </div>
                <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                  Legal enterprise entity information printed on sanction vouchers and receipts.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Input
                    label="Registered Legal Entity Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                  />
                  <Input
                    label="Branch / Territory Code"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <Input
                    label="Company Tax PAN / CIN"
                    value={taxPan}
                    onChange={(e) => setTaxPan(e.target.value)}
                  />
                  <Input
                    label="Base Operating Currency"
                    value={currency}
                    disabled
                  />
                </div>
              </CardContent>
            </Card>

            {/* API & Backend Architecture Integration */}
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Server className="w-5 h-5 text-emerald-600 dark:text-emerald-400 stroke-[1.8]" />
                  <CardTitle className="text-base font-bold">Backend REST API Connector</CardTitle>
                </div>
                <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                  Axios endpoint configuration for switching between mock and live backend.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <Input
                  label="Backend REST API Base URL"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  helperText="Toggle NEXT_PUBLIC_USE_MOCK=false to connect live endpoints."
                />

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block text-sm">
                      Architecture Status
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 block">
                      Typed service abstractions active
                    </span>
                  </div>
                  <Badge variant="success" dot>100% API Ready</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Column 2: Appearance & Dynamic RBAC */}
          <div className="space-y-5">
            {/* Visual Theme & Appearance Preferences Card */}
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Palette className="w-5 h-5 text-brand-600 dark:text-brand-400 stroke-[1.8]" />
                  <CardTitle className="text-base font-bold">Appearance & Visual Theme</CardTitle>
                </div>
                <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                  Personalize interface contrast for day and night operations.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {themeOptions.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = theme === opt.id;

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleThemeChange(opt.id)}
                        className={cn(
                          'relative flex flex-col p-3 rounded-lg border text-left transition-all text-xs',
                          isSelected
                            ? 'border-brand-600 ring-2 ring-brand-600/20 bg-brand-50/30 dark:bg-brand-950/30'
                            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                        )}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <Icon
                            className={cn(
                              'w-4 h-4',
                              isSelected ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'
                            )}
                          />
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-brand-600" />
                          )}
                        </div>
                        <span className="font-semibold text-xs block text-slate-800 dark:text-slate-200">
                          {opt.title}
                        </span>
                        <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                          {opt.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Roles & Security Matrix */}
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      <CardTitle className="text-sm">Dynamic RBAC & Permissions</CardTitle>
                    </div>
                    <CardDescription className="text-xs">
                      Granular module access and user role provisioning.
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      href="/settings/roles"
                      variant="primary"
                      size="xs"
                      leftIcon={<Lock className="w-3 h-3" />}
                      rightIcon={<ChevronRight className="w-3 h-3" />}
                    >
                      Permissions
                    </Button>
                    <Button
                      href="/settings/users"
                      variant="outline"
                      size="xs"
                      leftIcon={<Users className="w-3 h-3" />}
                    >
                      Users
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 text-xs space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50/30 dark:bg-blue-950/30 space-y-1">
                    <span className="font-bold text-blue-700 dark:text-blue-400 block text-xs">ADMIN</span>
                    <p className="text-slate-600 dark:text-slate-400 text-[10px] leading-tight">
                      Full system access & root privileges.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-950/30 space-y-1">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 block text-xs">STAFF</span>
                    <p className="text-slate-600 dark:text-slate-400 text-[10px] leading-tight">
                      Onboarding, KYC, loans & collections.
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg border border-purple-200 dark:border-purple-900 bg-purple-50/30 dark:bg-purple-950/30 space-y-1">
                    <span className="font-bold text-purple-700 dark:text-purple-400 block text-xs">MANAGEMENT</span>
                    <p className="text-slate-600 dark:text-slate-400 text-[10px] leading-tight">
                      Executive oversight & audit reports.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
