import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ArrowDownCircle, ArrowUpCircle, StickyNote } from 'lucide-react';

export function Navbar() {
  const links = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    {
      to: '/gastos',
      icon: <ArrowDownCircle size={20} className="text-red-400" />,
      label: 'Gastos',
    },
    {
      to: '/ingresos',
      icon: <ArrowUpCircle size={20} className="text-green-400" />,
      label: 'Ingresos',
    },
    { to: '/notas', icon: <StickyNote size={20} className="text-purple-400" />, label: 'Notas' },
  ];

  return (
    <>
      {/* Mobile Navbar (Bottom) */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50 glass-panel p-3 flex justify-around rounded-2xl">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                isActive ? 'bg-white/20 scale-110' : 'opacity-70 hover:opacity-100'
              }`
            }
          >
            {link.icon}
            <span className="text-[10px] font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Desktop Sidebar (Left) */}
      <nav className="hidden md:flex flex-col gap-4 w-64 p-6 glass-panel m-4 self-start sticky top-4">
        <div className="mb-8 px-4 flex items-center gap-3">
          <img
            src="/kipo-logo.jpg"
            alt="Kipo Logo"
            className="w-10 h-10 rounded-xl shadow-lg shadow-purple-900/20"
          />
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-emerald-400">
            Kipo
          </h1>
        </div>

        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-white/10 ${
                isActive
                  ? 'bg-white/20 border border-white/10 shadow-lg'
                  : 'opacity-70 hover:opacity-100'
              }`
            }
          >
            {link.icon}
            <span className="font-medium tracking-wide">{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
