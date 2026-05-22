import Link from "next/link";
import Image from "next/image";
import { signOutAction } from "@/app/actions/auth";
import { signInPath } from "@/app/lib/redirects";
import { getCurrentUser } from "@/app/lib/session";

type NavItem = {
  href: string;
  label: string;
};

type TabKey = "explore" | "trips" | "owner" | "account";

const navItems: NavItem[] = [
  { href: "/", label: "Explore" },
  { href: "/trips", label: "Trips" },
];

function getFirstName(fullName: string) {
  return fullName.trim().split(/\s+/)[0] || "Account";
}

function getPrimaryAccountLink(role: "renter" | "owner" | "admin") {
  if (role === "admin") {
    return { href: "/admin", label: "Operations" };
  }

  if (role === "owner") {
    return { href: "/owner/dashboard", label: "Listings" };
  }

  return { href: "/trips", label: "Trips" };
}

export async function TopNav() {
  const user = await getCurrentUser();
  const primaryAccountLink = user ? getPrimaryAccountLink(user.role) : null;

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-[#f7f7f5]/90 pt-[env(safe-area-inset-top)] backdrop-blur-2xl md:border-black/10 md:bg-white/95 md:pt-0">
      <nav className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4 sm:px-6 md:h-16 lg:px-8">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-normal md:text-xl">
          <Image src="/icon.svg" alt="" width={32} height={32} priority className="h-8 w-8" aria-hidden="true" />
          Carlink
        </Link>
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-black transition hover:bg-[#efefef]"
            >
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/owner"
            className="inline-flex min-h-10 items-center rounded-full bg-[#efefef] px-3 text-xs font-semibold text-black transition hover:bg-[#e2e2e2] md:px-4 md:text-sm"
          >
            Rent your car
          </Link>
          {user && primaryAccountLink ? (
            <details className="group relative">
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-3 rounded-full bg-black px-4 text-sm font-medium text-white transition hover:bg-[#282828] [&::-webkit-details-marker]:hidden">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
                  {user.fullName.trim().charAt(0).toUpperCase() || "A"}
                </span>
                <span className="hidden md:inline">{getFirstName(user.fullName)}</span>
                <span className="text-xs transition group-open:rotate-180" aria-hidden="true">
                  v
                </span>
              </summary>
              <div className="fixed left-3 right-3 top-[calc(4.25rem+env(safe-area-inset-top))] z-50 overflow-hidden rounded-2xl bg-white p-2 shadow-[0_18px_60px_rgba(0,0,0,0.18)] ring-1 ring-black/10 md:absolute md:left-auto md:right-0 md:top-auto md:mt-2 md:w-64">
                <div className="px-3 py-3">
                  <div className="truncate text-sm font-bold">{user.fullName}</div>
                  <div className="mt-1 truncate text-xs text-[#5e5e5e]">{user.email}</div>
                </div>
                <div className="border-t border-black/10 py-2">
                  <Link
                    href="/settings"
                    className="block rounded-xl px-3 py-2.5 text-sm font-medium text-black transition hover:bg-[#efefef]"
                  >
                    Settings
                  </Link>
                  <Link
                    href={primaryAccountLink.href}
                    className="block rounded-xl px-3 py-2.5 text-sm font-medium text-black transition hover:bg-[#efefef]"
                  >
                    {primaryAccountLink.label}
                  </Link>
                </div>
                <form action={signOutAction} className="border-t border-black/10 pt-2">
                  <button
                    type="submit"
                    className="block w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-black transition hover:bg-[#efefef]"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            </details>
          ) : (
            <>
              <Link
                href={signInPath("/settings")}
                className="hidden rounded-full px-4 py-2 text-sm font-medium text-black transition hover:bg-[#efefef] md:inline-flex"
              >
                Log in
              </Link>
              <Link
                href={signInPath("/settings")}
                className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-[#282828]"
              >
                <span className="md:hidden">Sign in</span>
                <span className="hidden md:inline">Get started</span>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

function MobileNavIcon({ tab }: { tab: TabKey }) {
  const baseProps = {
    className: "h-5 w-5",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
    viewBox: "0 0 24 24",
    "aria-hidden": true,
  };

  if (tab === "explore") {
    return (
      <svg {...baseProps}>
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5.5 10.5V20h13v-9.5" />
        <path d="M9.5 20v-5h5v5" />
      </svg>
    );
  }

  if (tab === "trips") {
    return (
      <svg {...baseProps}>
        <path d="M4 15.5H3a1 1 0 0 1-1-1v-3a2 2 0 0 1 1.7-2l1.9-.3L8 5.5A3 3 0 0 1 10.5 4h3A3 3 0 0 1 16 5.5l2.4 3.7 1.9.3a2 2 0 0 1 1.7 2v3a1 1 0 0 1-1 1h-1" />
        <path d="M7 15.5h10" />
        <circle cx="6" cy="16" r="2" />
        <circle cx="18" cy="16" r="2" />
      </svg>
    );
  }

  if (tab === "owner") {
    return (
      <svg {...baseProps}>
        <path d="M4 10.5 12 4l8 6.5" />
        <path d="M6 9.5V20h12V9.5" />
        <path d="M9.5 20v-6h5v6" />
        <path d="M9 10.5h6" />
      </svg>
    );
  }

  return (
    <svg {...baseProps}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </svg>
  );
}

export async function MobileTabBar({ active = "explore" }: { active?: TabKey }) {
  const user = await getCurrentUser();
  const baseItems: Array<NavItem & { key: TabKey }> = [
    { key: "explore", href: "/", label: "Explore" },
    { key: "trips", href: "/trips", label: "Trips" },
  ];
  const accountItem: NavItem & { key: TabKey } = {
    key: "account",
    href: user ? "/settings" : signInPath("/settings"),
    label: user ? "Settings" : "Account",
  };
  const mobileNavItems: Array<NavItem & { key: TabKey }> = [
    ...baseItems,
    ...(user?.role === "owner" || user?.role === "admin"
      ? [{ key: "owner" as const, href: "/owner/dashboard", label: "Listings" }]
      : []),
    accountItem,
  ];
  const gridClass = mobileNavItems.length === 3 ? "grid-cols-3" : "grid-cols-4";

  return (
    <nav className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-50 mx-auto max-w-md rounded-[2rem] border border-white/70 bg-white/85 p-2 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-2xl md:hidden">
      <div className={`grid ${gridClass} gap-1 text-center text-[11px] font-semibold text-[#6b6b6b]`}>
        {mobileNavItems.map((item) => {
          const isActive = active === item.key;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-[1.45rem] px-2 transition ${
                isActive ? "bg-black text-white shadow-[0_10px_30px_rgba(0,0,0,0.22)]" : "text-[#626262] hover:bg-black/5"
              }`}
            >
              <MobileNavIcon tab={item.key} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export async function Footer() {
  const user = await getCurrentUser();
  const accountHref = user ? "/settings" : signInPath("/settings");

  return (
    <footer className="hidden bg-black px-4 pb-12 pt-12 text-white md:block">
      <div className="mx-auto grid w-full max-w-7xl gap-10 md:grid-cols-[1.2fr_2fr]">
        <div>
          <div className="text-2xl font-bold">Carlink</div>
          <p className="mt-4 max-w-sm text-sm leading-6 text-[#afafaf]">
            A peer-to-peer car rental marketplace built for local launch and future expansion.
          </p>
        </div>
        <div className="grid gap-8 text-sm sm:grid-cols-3">
          <div className="space-y-3">
            <div className="font-medium">Marketplace</div>
            <Link href="/" className="block text-[#afafaf]">
              Explore cars
            </Link>
            <Link href="/owner" className="block text-[#afafaf]">
              List your car
            </Link>
          </div>
          <div className="space-y-3">
            <div className="font-medium">Account</div>
            <Link href={accountHref} className="block text-[#afafaf]">
              {user ? "Settings" : "Sign in"}
            </Link>
            <Link href="/cars/toyota-hilux-adventure" className="block text-[#afafaf]">
              Book a trip
            </Link>
          </div>
          <div className="space-y-3">
            <div className="font-medium">Operations</div>
            <span className="block text-[#afafaf]">Owner approvals</span>
            <span className="block text-[#afafaf]">Booking support</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
