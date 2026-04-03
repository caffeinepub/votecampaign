import { Megaphone } from "lucide-react";
import { SiFacebook, SiInstagram, SiX } from "react-icons/si";

const FOOTER_LINKS = [
  { label: "Our Progress", href: "#progress" },
  { label: "Donate", href: "#donate" },
  { label: "Pledge", href: "#pledge" },
  { label: "Survey", href: "#survey" },
  { label: "Share", href: "#share" },
  { label: "Admin", href: "/admin" },
];

export function CampaignFooter() {
  const year = new Date().getFullYear();
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;

  return (
    <footer className="bg-charcoal text-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange flex items-center justify-center">
                <Megaphone className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg">
                VOICE <span className="text-orange">2026</span>
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Fighting corruption. Demanding healthcare for kids, women &amp;
              youth. Building better education for all.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-4">
              Quick Links
            </h4>
            <nav className="flex flex-col gap-2">
              {FOOTER_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-white/70 hover:text-white text-sm transition-colors"
                  data-ocid="footer.link"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-4">
              Follow Us
            </h4>
            <div className="flex items-center gap-3">
              {[
                { icon: SiFacebook, href: "#", label: "Facebook" },
                { icon: SiX, href: "#", label: "X / Twitter" },
                { icon: SiInstagram, href: "#", label: "Instagram" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-orange flex items-center justify-center transition-colors"
                  data-ocid="footer.link"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <div className="mt-6 p-3 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white/40 text-xs uppercase tracking-widest font-semibold mb-1">
                Donate
              </p>
              <p className="text-white/80 text-xs font-mono">DIGI NAZ</p>
              <p className="text-white/60 text-xs font-mono">
                YES Bank · YESB0000151
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <p>&copy; {year} VOICE 2026 Campaign. All rights reserved.</p>
          <p>
            Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange hover:text-orange-dark transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
