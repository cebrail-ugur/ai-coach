import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Panel — AI Koç',
  description: 'Koçluk paneli - Hedefler, Alışkanlıklar, Sohbet',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f13] via-[#1a1a2e] to-[#0f0f13]">
      <nav className="border-b border-neutral-800 bg-black/40 backdrop-blur sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-bold gradient-text">AI Koç</h1>
            <div className="hidden md:flex items-center gap-4">
              <a
                href="/dashboard/chat"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Sohbet
              </a>
              <a
                href="/dashboard/goals"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Hedefler
              </a>
              <a
                href="/dashboard/habits"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Alışkanlıklar
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              ⚙️
            </button>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
