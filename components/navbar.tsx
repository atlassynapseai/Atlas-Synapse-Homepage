// Common component for the layout
export const Navbar = ({ user, onLogout }: { user: any | null; onLogout: () => void }) => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-transparent bg-transparent transition-all duration-300">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-4 py-0 sm:px-6 lg:px-10">
        <a href="/Atlas-Synapse-Homepage" className="flex h-10 items-center gap-2.5 rounded-full">
          <div className="h-8 w-8">
            <img src="/Atlas-Synapse-Homepage/logo.png" alt="Atlas Synapse" />
          </div>
        </a>
        <nav className="hidden flex-1 items-center justify-center gap-0.5 md:flex">
          <a href="/Atlas-Synapse-Homepage/" className="px-4 py-2 text-slate-300 hover:text-white">
            Home
          </a>
          <a href="/Atlas-Synapse-Homepage/about" className="px-4 py-2 text-slate-300 hover:text-white">
            About
          </a>
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-300">{user.email}</span>
              <button
                onClick={onLogout}
                className="rounded-full bg-gradient-to-r from-atlas-primary to-atlas-secondary px-6 py-2 text-sm font-semibold text-white"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <a
                href="/Atlas-Synapse-Homepage/login"
                className="hidden text-sm font-semibold text-slate-300 hover:text-white sm:inline-block"
              >
                Sign In
              </a>
              <a
                href="/Atlas-Synapse-Homepage/signup"
                className="rounded-full bg-gradient-to-r from-atlas-primary to-atlas-secondary px-6 py-2 text-sm font-semibold text-white"
              >
                Sign Up
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
