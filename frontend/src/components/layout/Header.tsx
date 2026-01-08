import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  Shield, 
  FileSearch, 
  LayoutDashboard, 
  Users, 
  BarChart3,
  Globe,
  ChevronDown,
  Zap,
  LogOut
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";

const navigation = [
  { name: "nav.verify", href: "/verify", icon: FileSearch },
  { name: "nav.dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "nav.community", href: "/community", icon: Users },
  { name: "nav.analytics", href: "/analytics", icon: BarChart3 },
];

const languages = [
  { code: "ne", name: "नेपाली", flag: "🇳🇵" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "mai", name: "मैथिली", flag: "🇳🇵" },
] as const;

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: "login" | "signup" }>({
    isOpen: false,
    mode: "login",
  });
  const { user, logout } = useAuth();

  const currentLang = languages.find(l => l.code === language) || languages[1];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card shadow-lg">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/5">
            <Shield className="h-5 w-5 text-primary/80" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-foreground">
              Satya<span className="text-primary">Check</span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Truth Engine v2.0
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <Link key={item.name} to={item.href}>
              <Button
                variant="ghost"
                className={`gap-2 transition-all ${
                  isActive(item.href) 
                    ? "bg-primary/10 text-primary border border-primary/15" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {t(item.name)}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className="hidden items-center gap-2 rounded-full border border-verified/15 bg-verified/5 px-3 py-1 sm:flex">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-verified/60 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-verified/80" />
            </span>
            <span className="text-xs font-mono text-verified/80">ONLINE</span>
          </div>

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline font-mono text-xs">{currentLang.code.toUpperCase()}</span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-primary/20 bg-card/95 backdrop-blur-xl">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => setLanguage(lang.code as any)}
                  className="gap-2 focus:bg-primary/10 focus:text-primary"
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Auth Buttons */}
          <div className="hidden items-center gap-2 sm:flex">
            {user ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      {user.username}
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setAuthModal({ isOpen: true, mode: "login" })}
                >
                  Sign In
                </Button>
                <Button 
                  size="sm" 
                  className="gap-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15"
                  onClick={() => setAuthModal({ isOpen: true, mode: "signup" })}
                >
                  <Zap className="h-4 w-4" />
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 border-border bg-background/95 backdrop-blur-xl">
              <div className="flex flex-col gap-6 pt-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/20 bg-primary/5">
                    <Shield className="h-5 w-5 text-primary/80" />
                  </div>
                  <span className="text-lg font-bold">
                    Satya<span className="text-primary">Check</span>
                  </span>
                </div>
                
                <nav className="flex flex-col gap-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className={`w-full justify-start gap-3 ${
                          isActive(item.href) 
                            ? "bg-primary/10 text-primary border border-primary/15" 
                            : "text-muted-foreground"
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Button>
                    </Link>
                  ))}
                </nav>

                <div className="flex flex-col gap-2 pt-4 border-t border-border">
                  {user ? (
                    <>
                      <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                        <Button variant="outline" className="w-full border-border hover:bg-muted/50">
                          Dashboard
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        className="w-full border-border hover:bg-muted/50 text-red-600"
                        onClick={() => {
                          handleLogout();
                          setMobileOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        variant="outline" 
                        className="w-full border-border hover:bg-muted/50"
                        onClick={() => {
                          setAuthModal({ isOpen: true, mode: "login" });
                          setMobileOpen(false);
                        }}
                      >
                        Sign In
                      </Button>
                      <Button 
                        className="w-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15"
                        onClick={() => {
                          setAuthModal({ isOpen: true, mode: "signup" });
                          setMobileOpen(false);
                        }}
                      >
                        <Zap className="mr-2 h-4 w-4" />
                        Get Started
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModal.isOpen} 
        onClose={() => setAuthModal({ ...authModal, isOpen: false })} 
        mode={authModal.mode} 
      />
    </header>
  );
}