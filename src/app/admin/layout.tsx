'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/admin/members', label: 'Members', icon: '👥' },
    { href: '/admin/directive', label: 'Directive', icon: '🏛️' },
    { href: '/admin/referrals', label: 'Referrals', icon: '🎁' },
    { href: '/admin/generator', label: 'Generator', icon: '🎰' },
    { href: '/admin/predictions', label: 'Predictions', icon: '🎯' },
    { href: '/admin/tickets', label: 'Tickets', icon: '📸' },
    { href: '/admin/payments', label: 'Payments', icon: '💰' },
    { href: '/admin/calculator', label: 'Calculator', icon: '🧮' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900">
      <nav className="bg-black/20 backdrop-blur-sm border-b border-white/10 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                  🤖 Super Agent Anbel AI
                </h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-300">Admin Panel</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <aside className="w-64 flex-shrink-0">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 shadow-xl">
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      pathname === item.href
                        ? 'bg-green-500/30 text-green-300 font-semibold border border-green-400/50 shadow-lg'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                ))}
                
                {/* Public Pages */}
                <div className="pt-4 mt-4 border-t border-white/20">
                  <p className="text-xs text-gray-400 px-4 mb-2">PUBLIC</p>
                  <Link
                    href="/team"
                    target="_blank"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-300 hover:bg-white/10 hover:text-white"
                  >
                    <span className="text-xl">🌐</span>
                    <span>Our Team</span>
                    <span className="text-xs ml-auto">↗</span>
                  </Link>
                  <Link
                    href="/contract"
                    target="_blank"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-300 hover:bg-white/10 hover:text-white"
                  >
                    <span className="text-xl">📜</span>
                    <span>Contract</span>
                    <span className="text-xs ml-auto">↗</span>
                  </Link>
                </div>
              </nav>
            </div>
          </aside>

          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

