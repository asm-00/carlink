import Link from "next/link";
import { signOutAction } from "@/app/actions/auth";
import { updateProfileSettingsAction } from "@/app/actions/settings";
import { Footer, MobileTabBar, TopNav } from "@/app/components/navigation";
import { api, getConvexClient } from "@/app/lib/convex-server";
import { requireSignedIn } from "@/app/lib/session";

export const dynamic = "force-dynamic";

type SettingsPageProps = {
  searchParams: Promise<{ saved?: string; error?: string }>;
};

type OwnerStatus = "none" | "pending" | "approved" | "rejected";

export const metadata = {
  title: "Settings",
  description: "Manage your Carlink account settings.",
};

function accountTools(role: "renter" | "owner" | "admin") {
  if (role === "admin") {
    return {
      label: "Operations tools",
      detail: "Review requests and keep marketplace listings moving.",
    };
  }

  if (role === "owner") {
    return {
      label: "Listing tools",
      detail: "Manage cars and booking requests.",
    };
  }

  return {
    label: "Booking tools",
    detail: "Can request cars and manage trips.",
  };
}

function ownerStatusDetails(status: OwnerStatus) {
  if (status === "approved") {
    return { label: "Approved", detail: "Listing tools are available." };
  }

  if (status === "pending") {
    return { label: "Pending", detail: "Your owner application is in review." };
  }

  if (status === "rejected") {
    return { label: "Needs update", detail: "Update and resubmit your owner application." };
  }

  return { label: "Not started", detail: "Apply when you are ready to list a car." };
}

function formatDate(value: number) {
  return new Intl.DateTimeFormat("en-NA", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const { saved, error } = await searchParams;
  const { sessionToken, user } = await requireSignedIn("/settings");
  const application = await getConvexClient().query(api.ownerApplications.mine, { sessionToken });
  const tools = accountTools(user.role);
  const ownerStatus = ownerStatusDetails(user.ownerStatus);
  const phone = user.phone ?? application?.phone ?? "";
  const accessLinks = [
    { href: "/trips", label: "Trips", detail: "Bookings and payments" },
    user.role === "owner" || user.role === "admin"
      ? { href: "/owner/dashboard", label: "Listings", detail: "Cars and requests" }
      : { href: "/owner", label: "Rent your car", detail: ownerStatus.detail },
    user.role === "admin" ? { href: "/admin", label: "Operations", detail: "Approvals and reviews" } : null,
  ].filter((link): link is { href: string; label: string; detail: string } => Boolean(link));

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-black md:bg-white">
      <TopNav />
      <main className="pb-[calc(7.5rem+env(safe-area-inset-bottom))] md:pb-0">
        <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 md:py-12 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium text-[#5e5e5e]">Account</p>
              <h1 className="mt-2 text-4xl font-bold leading-tight md:text-5xl">Settings</h1>
              <p className="mt-3 text-sm text-[#5e5e5e]">{user.email}</p>
            </div>
            <form action={signOutAction}>
              <button
                type="submit"
                className="min-h-11 rounded-full bg-[#efefef] px-5 text-sm font-medium text-black transition hover:bg-[#e2e2e2]"
              >
                Sign out
              </button>
            </form>
          </div>

          {saved ? (
            <div className="mt-6 rounded-2xl bg-black p-4 text-sm font-medium text-white">
              Settings saved.
            </div>
          ) : null}
          {error ? (
            <div className="mt-6 rounded-2xl bg-[#efefef] p-4 text-sm font-medium">
              Enter your full name.
            </div>
          ) : null}
        </section>

        <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <aside className="grid gap-5 self-start">
            <div className="rounded-[1.75rem] bg-black p-5 text-white md:rounded-2xl">
              <p className="text-sm font-medium text-[#afafaf]">Account tools</p>
              <h2 className="mt-2 text-3xl font-bold">{tools.label}</h2>
              <p className="mt-3 text-sm leading-6 text-[#d6d6d6]">{tools.detail}</p>
              <div className="mt-5 grid gap-3 text-sm">
                <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/10 p-4">
                  <span className="text-[#d6d6d6]">Rental application</span>
                  <span className="font-medium">{ownerStatus.label}</span>
                </div>
                <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/10 p-4">
                  <span className="text-[#d6d6d6]">Verified</span>
                  <span className="font-medium">{user.isVerified ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-white p-5 ring-1 ring-black/10 md:rounded-2xl">
              <h2 className="text-2xl font-bold">Access</h2>
              <div className="mt-4 grid gap-3">
                {accessLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block rounded-2xl bg-[#efefef] p-4 transition hover:bg-[#e2e2e2]"
                  >
                    <div className="font-medium">{item.label}</div>
                    <p className="mt-1 text-sm text-[#5e5e5e]">{item.detail}</p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          <div className="grid gap-5">
            <form action={updateProfileSettingsAction} className="rounded-[1.75rem] bg-[#efefef] p-4 md:rounded-2xl md:p-5">
              <h2 className="text-2xl font-bold">Profile</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <label className="block rounded-lg bg-white p-4">
                  <span className="text-xs font-medium text-[#5e5e5e]">Full name</span>
                  <input
                    name="fullName"
                    required
                    defaultValue={user.fullName}
                    className="mt-1 w-full bg-transparent text-base font-medium outline-none"
                    placeholder="Your name"
                  />
                </label>
                <label className="block rounded-lg bg-white p-4">
                  <span className="text-xs font-medium text-[#5e5e5e]">Phone</span>
                  <input
                    name="phone"
                    defaultValue={phone}
                    className="mt-1 w-full bg-transparent text-base font-medium outline-none"
                    placeholder="+264 81 000 0000"
                  />
                </label>
                <label className="block rounded-lg bg-white p-4 sm:col-span-2">
                  <span className="text-xs font-medium text-[#5e5e5e]">Email</span>
                  <input
                    value={user.email}
                    readOnly
                    className="mt-1 w-full bg-transparent text-base font-medium text-[#5e5e5e] outline-none"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="mt-4 min-h-12 w-full rounded-full bg-black px-5 text-base font-medium text-white transition hover:bg-[#282828]"
              >
                Save settings
              </button>
            </form>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: "Joined", value: formatDate(user.createdAt) },
                { label: "Profile", value: user.isVerified ? "Verified" : "Not verified" },
                { label: "Rental application", value: ownerStatus.label },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-white p-5 ring-1 ring-black/10">
                  <div className="text-sm font-medium text-[#5e5e5e]">{item.label}</div>
                  <div className="mt-4 text-xl font-bold">{item.value}</div>
                </div>
              ))}
            </div>

            {application ? (
              <div className="rounded-[1.75rem] bg-white p-5 ring-1 ring-black/10 md:rounded-2xl">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Rent your car</h2>
                    <p className="mt-2 text-sm text-[#5e5e5e]">
                      {application.location} - {application.status}
                    </p>
                  </div>
                  <Link
                    href="/owner"
                    className="inline-flex min-h-11 items-center rounded-full bg-[#efefef] px-5 text-sm font-medium transition hover:bg-[#e2e2e2]"
                  >
                    Continue
                  </Link>
                </div>
                <p className="mt-5 text-sm leading-6">{application.vehicleSummary}</p>
              </div>
            ) : null}
          </div>
        </section>
      </main>
      <Footer />
      <MobileTabBar active="account" />
    </div>
  );
}
