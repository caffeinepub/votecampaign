import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Heart, Megaphone, Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Our Progress", href: "#progress" },
  { label: "Pledge", href: "#pledge" },
  { label: "Survey", href: "#survey" },
  { label: "Share", href: "#share" },
];

export function CampaignHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.267 0.072 244.0), oklch(0.231 0.065 244.0))",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center gap-2 group"
          data-ocid="header.link"
        >
          <div className="w-9 h-9 rounded-lg bg-orange flex items-center justify-center shadow-md">
            <Megaphone className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-display font-bold text-xl tracking-tight">
            VOICE <span className="text-orange">2026</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
              data-ocid="header.link"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a href="/admin" className="hidden md:block">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/70 hover:text-white hover:bg-white/10 text-xs"
              data-ocid="header.link"
            >
              Admin
            </Button>
          </a>
          <Button
            size="sm"
            className="bg-orange hover:bg-orange-dark text-white font-bold uppercase tracking-wide px-5 shadow-md"
            asChild
            data-ocid="header.primary_button"
          >
            <a href="#pledge">
              <Heart className="w-3.5 h-3.5 mr-1.5" />
              Donate
            </a>
          </Button>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:bg-white/10"
                data-ocid="header.toggle"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-72 p-0 border-0"
              style={{ background: "oklch(0.267 0.072 244.0)" }}
              data-ocid="nav.sheet"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <span className="text-white font-display font-bold text-lg">
                  VOICE <span className="text-orange">2026</span>
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/10"
                  onClick={() => setMobileOpen(false)}
                  data-ocid="nav.close_button"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <nav className="flex flex-col p-4 gap-1">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg px-4 py-3 text-base font-medium transition-colors"
                    data-ocid="nav.link"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="mt-4 pt-4 border-t border-white/10">
                  <a href="/admin" onClick={() => setMobileOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-white/70 hover:text-white hover:bg-white/10"
                      data-ocid="nav.link"
                    >
                      Admin Panel
                    </Button>
                  </a>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
