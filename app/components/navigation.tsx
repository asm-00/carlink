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

type TopNavProps = {
  showSignOut?: boolean;
};

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

export async function TopNav({ showSignOut = true }: TopNavProps = {}) {
  const user = await getCurrentUser();
  const primaryAccountLink = user ? getPrimaryAccountLink(user.role) : null;

  return (
    <header className="hidden bg-white/90 backdrop-blur-xl md:sticky md:top-0 md:z-40 md:block">
      <nav className="flex min-h-[4.75rem] w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-10 xl:px-12">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 rounded-full py-2 pr-3 text-lg font-bold tracking-normal transition hover:bg-[#f3f3f3] md:text-xl"
        >
          <Image src="/icon.svg" alt="" width={36} height={36} priority className="h-9 w-9" aria-hidden="true" />
          Carlink
        </Link>
        <div className="hidden flex-1 justify-center md:flex">
          <div className="flex items-center gap-1 rounded-full bg-[#f3f3f3] p-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-white"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/owner"
            className="inline-flex min-h-11 items-center rounded-full bg-[#efefef] px-4 text-sm font-semibold text-black transition hover:bg-[#e2e2e2]"
          >
            Rent your car
          </Link>
          {user && primaryAccountLink ? (
            <details className="group relative">
              <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-full bg-black py-1.5 pl-2 pr-3 text-sm font-semibold text-white transition hover:bg-[#282828] [&::-webkit-details-marker]:hidden">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-black">
                  {user.fullName.trim().charAt(0).toUpperCase() || "A"}
                </span>
                <span className="hidden max-w-28 truncate md:inline">{getFirstName(user.fullName)}</span>
                <svg
                  className="h-4 w-4 transition group-open:rotate-180"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </summary>
              <div className="fixed left-3 right-3 top-[calc(4.25rem+env(safe-area-inset-top))] z-50 overflow-hidden rounded-2xl bg-white p-2 ring-1 ring-black/10 md:absolute md:left-auto md:right-0 md:top-auto md:mt-2 md:w-64">
                <div className="px-3 py-3">
                  <div className="truncate text-sm font-bold">{user.fullName}</div>
                  <div className="mt-1 truncate text-xs text-[#5e5e5e]">{user.email}</div>
                </div>
                <div className="space-y-1 py-1">
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
                {showSignOut ? (
                  <form action={signOutAction} className="pt-1">
                    <button
                      type="submit"
                      className="block w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-black transition hover:bg-[#efefef]"
                    >
                      Sign out
                    </button>
                  </form>
                ) : null}
              </div>
            </details>
          ) : (
            <>
              <Link
                href={signInPath("/settings")}
                className="hidden min-h-11 items-center rounded-full px-4 text-sm font-semibold text-black transition hover:bg-[#efefef] md:inline-flex"
              >
                Log in
              </Link>
              <Link
                href={signInPath("/settings")}
                className="inline-flex min-h-11 items-center rounded-full bg-black px-4 text-sm font-semibold text-white transition hover:bg-[#282828]"
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

export async function MobileAppHeader({
  title,
  subtitle,
  backHref,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
}) {
  const user = await getCurrentUser();
  const accountHref = user ? "/settings" : signInPath("/settings");

  return (
    <header className="w-full max-w-full overflow-hidden bg-white px-4 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))] md:hidden">
      <div className="flex min-h-11 w-full min-w-0 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {backHref ? (
            <Link
              href={backHref}
              aria-label="Back"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f2f2f2] text-black"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Link>
          ) : null}
          <div className="min-w-0">
            <h1 className="truncate text-[28px] font-bold leading-8 tracking-normal">{title}</h1>
            {subtitle ? <p className="mt-0.5 truncate text-sm text-[#5e5e5e]">{subtitle}</p> : null}
          </div>
        </div>
        <Link
          href={accountHref}
          aria-label={user ? "Open account" : "Sign in"}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f2f2f2] text-sm font-bold text-black"
        >
          {user ? (
            user.fullName.trim().charAt(0).toUpperCase() || "A"
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="3.5" />
              <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
            </svg>
          )}
        </Link>
      </div>
    </header>
  );
}

function MobileNavIcon({ tab }: { tab: TabKey }) {
  const baseProps = {
    className: "h-6 w-6",
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
    { key: "explore", href: "/", label: "Cars" },
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
    <nav className="ios-tabbar z-50 rounded-[2rem] border border-black/10 bg-white/90 px-2 py-1.5 backdrop-blur-xl md:hidden">
      <div className={`grid h-14 ${gridClass} text-center text-[11px] font-medium text-[#8e8e93]`}>
        {mobileNavItems.map((item) => {
          const isActive = active === item.key;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={`flex h-14 flex-col items-center justify-center gap-0.5 px-2 transition-colors ${
                isActive ? "font-semibold text-black" : "text-[#8e8e93] active:text-black"
              }`}
            >
              <MobileNavIcon tab={item.key} />
              <span>{item.label}</span>
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
