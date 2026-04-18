import { Link, Outlet } from "react-router-dom";
import { Building2, Menu, X, LogIn, LogOut, Globe } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { useAuth } from "./AuthProvider";
import { useTranslation } from "react-i18next";

export default function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signIn, logOut } = useAuth();
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 max-w-[200px] md:max-w-[250px]">
            <img src="https://i.postimg.cc/zBbdPKJb/logo.png" alt="" className="h-10 w-auto object-contain" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/eligibility" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              {t('nav.checkEligibility')}
            </Link>
            <Link to="/membership" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
              {t('nav.membership')}
            </Link>
            {user && (
              <Link to="/dashboard" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                {t('nav.dashboard')}
              </Link>
            )}
            
            <div className="flex items-center gap-1 border-l pl-4 border-gray-200 ml-2">
              <Globe className="w-4 h-4 text-gray-400" />
              <select 
                title="Change language"
                className="bg-transparent text-sm font-medium text-gray-600 border-none outline-none cursor-pointer focus:ring-0"
                value={i18n.language.split('-')[0]} 
                onChange={handleLanguageChange}
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="sw">Kiswahili</option>
                <option value="es">Español</option>
                <option value="zh">中文</option>
                <option value="ar">العربية</option>
                <option value="hi">हिन्दी</option>
                <option value="pt">Português</option>
                <option value="de">Deutsch</option>
              </select>
            </div>

            {user ? (
              <Button onClick={logOut} variant="outline" size="sm" className="gap-2 ml-2">
                <LogOut className="w-4 h-4" /> {t('nav.logOut')}
              </Button>
            ) : (
              <Button onClick={signIn} variant="default" size="sm" className="gap-2 ml-2">
                <LogIn className="w-4 h-4" /> {t('nav.signIn')}
              </Button>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <select 
              title="Change language"
              className="bg-transparent text-sm font-medium text-gray-600 border border-gray-200 rounded p-1 outline-none cursor-pointer max-w-[100px] truncate"
              value={i18n.language.split('-')[0]} 
              onChange={handleLanguageChange}
            >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="sw">Kiswahili</option>
                <option value="es">Español</option>
                <option value="zh">中文</option>
                <option value="ar">العربية</option>
                <option value="hi">हिन्दी</option>
                <option value="pt">Português</option>
                <option value="de">Deutsch</option>
            </select>
            <button
              className="p-2 text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white px-4 py-4 space-y-4">
            <Link
              to="/eligibility"
              className="block text-sm font-medium text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.checkEligibility')}
            </Link>
            <Link
              to="/membership"
              className="block text-sm font-medium text-gray-600"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('nav.membership')}
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className="block text-sm font-medium text-gray-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav.dashboard')}
              </Link>
            )}
            {user ? (
              <Button 
                onClick={() => { logOut(); setIsMenuOpen(false); }} 
                variant="outline" 
                className="w-full gap-2 justify-center"
              >
                <LogOut className="w-4 h-4" /> {t('nav.logOut')}
              </Button>
            ) : (
              <Button 
                onClick={() => { signIn(); setIsMenuOpen(false); }} 
                className="w-full gap-2 justify-center"
              >
                <LogIn className="w-4 h-4" /> {t('nav.signIn')}
              </Button>
            )}
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 max-w-[200px] md:max-w-[250px]">
              <img src="https://i.postimg.cc/zBbdPKJb/logo.png" alt="" className="h-10 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-sm text-gray-400 max-w-sm mb-4">
              Powered by Upfrica.africa. {t('footer.description')}
            </p>
            <p className="text-xs text-gray-500 font-medium">
              Disclaimer: DealBridge AI does not provide loans or capital directly. We are a matching and preparation platform.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/eligibility" className="hover:text-white transition-colors">Eligibility Check</Link></li>
              <li><Link to="/membership" className="hover:text-white transition-colors">Memberships</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 mt-12 pt-8 border-t border-gray-800 text-sm text-center text-gray-500">
          <span dangerouslySetInnerHTML={{ __html: t('footer.rights') }} />
        </div>
      </footer>
    </div>
  );
}
