import { NavLink, Outlet } from 'react-router-dom'

const navItems = [
  { to: '/', label: 'Главная', end: true },
  { to: '/diary', label: 'Дневник' },
  { to: '/weeks', label: 'Курс по неделям' },
  { to: '/practices', label: 'Практики' },
  { to: '/tests', label: 'Тесты' },
  { to: '/reports', label: 'Отчёты' },
  { to: '/data', label: 'Данные' },
]

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-cream-200 bg-cream-50/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <NavLink to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-xl" aria-hidden>
              🌿
            </span>
            <span className="font-semibold text-ink-900 tracking-tight">Интуитивное питание</span>
          </NavLink>
          <nav className="flex gap-1 overflow-x-auto scrollbar-thin -mx-4 px-4 sm:mx-0 sm:px-0">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `whitespace-nowrap text-sm px-3 py-1.5 rounded-full transition-colors ${
                    isActive ? 'bg-sage-500 text-white' : 'text-ink-500 hover:bg-sage-50'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Outlet />
      </main>
      <footer className="text-center text-xs text-ink-500/60 py-6 px-4">
        Эта тетрадь — инструмент для самостоятельной работы по методу интуитивного питания и не заменяет консультацию
        специалиста по РПП.
      </footer>
    </div>
  )
}
