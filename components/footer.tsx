export default function Footer() {
    return (
      <footer className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center space-y-4 md:flex-row md:justify-between md:space-y-0">
            {/* Footer Links */}
            <nav className="flex space-x-6">
              <a href="/" className="hover:text-blue-500">
                Home
              </a>
            </nav>
  
            {/* Footer Text */}
            <p className="text-sm text-slate-400">
              &copy; {new Date().getFullYear()} MySite. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    );
  }
  