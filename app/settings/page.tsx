import Link from "next/link";
import { signOutAction } from "@/app/actions/auth";
import { updateProfileSettingsAction, updateTripPreferencesAction } from "@/app/actions/settings";
import { Footer, MobileAppHeader, MobileTabBar, TopNav } from "@/app/components/navigation";
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

function savedMessage(saved?: string) {
  if (saved === "preferences") {
    return "Trip preferences saved.";
  }

  if (saved === "profile") {
    return "Profile saved.";
  }

  return "Settings saved.";
}

function errorMessage(error?: string) {
  if (error === "preferences") {
    return "Check the trip preference values.";
  }

  return "Enter your full name.";
}

function exploreHref(settings: {
  defaultPickupArea: string;
  preferredVehicleType: string;
  gravelReadyOnly: boolean;
}) {
  const params = new URLSearchParams();

  if (settings.defaultPickupArea !== "Any area") {
    params.set("location", settings.defaultPickupArea);
  }

  if (settings.preferredVehicleType !== "Any car") {
    params.set("vehicleType", settings.preferredVehicleType);
  }

  if (settings.gravelReadyOnly) {
    params.set("gravelReady", "true");
  }

  return params.size ? `/?${params.toString()}` : "/";
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const { saved, error } = await searchParams;
  const { sessionToken } = await requireSignedIn("/settings");
  const overview = await getConvexClient().query(api.settings.overview, { sessionToken });
  const { user, settings, summary } = overview;
  const application = overview.ownerApplication;
  const tools = accountTools(user.role);
  const ownerStatus = ownerStatusDetails(user.ownerStatus);
  const phone = user.phone ?? application?.phone ?? "";
  const preferenceHref = exploreHref(settings);
  const accessLinks = [
    { href: "/trips", label: "Trips", detail: "Bookings and payments" },
    user.role === "owner" || user.role === "admin"
      ? { href: "/owner/dashboard", label: "Listings", detail: "Cars and requests" }
      : { href: "/owner", label: "Rent your car", detail: ownerStatus.detail },
    user.role === "admin" ? { href: "/admin", label: "Operations", detail: "Approvals and reviews" } : null,
  ].filter((link): link is { href: string; label: string; detail: string } => Boolean(link));

  return (
    <div className="min-h-screen bg-white text-black">
      <TopNav />
      <MobileAppHeader title="Account" subtitle={user.email} />
      <main className="pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        <section className="mx-auto max-w-7xl px-4 py-2 sm:px-6 md:py-12 lg:px-8">
          <div className="hidden flex-col gap-5 md:flex md:flex-row md:items-end md:justify-between">
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
              {savedMessage(saved)}
            </div>
          ) : null}
          {error ? (
            <div className="mt-6 rounded-2xl bg-[#efefef] p-4 text-sm font-medium">
              {errorMessage(error)}
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
                <div className="flex items-center justify-between gap-4 rounded-2xl bg-white/10 p-4">
                  <span className="text-[#d6d6d6]">Joined</span>
                  <span className="font-medium">{formatDate(user.createdAt)}</span>
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

            <form action={updateTripPreferencesAction} className="rounded-[1.75rem] bg-white p-4 ring-1 ring-black/10 md:rounded-2xl md:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Trip preferences</h2>
                  <p className="mt-2 text-sm text-[#5e5e5e]">Default search and trip length.</p>
                </div>
                <Link
                  href={preferenceHref}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#efefef] px-5 text-sm font-medium transition hover:bg-[#e2e2e2]"
                >
                  Search with defaults
                </Link>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <label className="block rounded-lg bg-[#efefef] p-4">
                  <span className="text-xs font-medium text-[#5e5e5e]">Pickup area</span>
                  <select
                    name="defaultPickupArea"
                    defaultValue={settings.defaultPickupArea}
                    className="mt-1 w-full appearance-none bg-transparent text-base font-medium outline-none"
                  >
                    <option>Any area</option>
                    <option>Windhoek</option>
                    <option>Swakopmund</option>
                  </select>
                </label>
                <label className="block rounded-lg bg-[#efefef] p-4">
                  <span className="text-xs font-medium text-[#5e5e5e]">Car type</span>
                  <select
                    name="preferredVehicleType"
                    defaultValue={settings.preferredVehicleType}
                    className="mt-1 w-full appearance-none bg-transparent text-base font-medium outline-none"
                  >
                    <option>Any car</option>
                    <option>Compact</option>
                    <option>SUV</option>
                    <option>4x4</option>
                  </select>
                </label>
                <label className="block rounded-lg bg-[#efefef] p-4">
                  <span className="text-xs font-medium text-[#5e5e5e]">Default trip length</span>
                  <input
                    name="defaultTripDays"
                    type="number"
                    min="1"
                    max="30"
                    required
                    defaultValue={settings.defaultTripDays}
                    className="mt-1 w-full bg-transparent text-base font-medium outline-none"
                  />
                </label>
                <label className="flex min-h-20 items-center justify-between gap-4 rounded-lg bg-[#efefef] p-4 text-sm font-medium">
                  Gravel-ready cars first
                  <input
                    name="gravelReadyOnly"
                    type="checkbox"
                    defaultChecked={settings.gravelReadyOnly}
                    className="h-5 w-5"
                  />
                </label>
              </div>
              <button
                type="submit"
                className="mt-4 min-h-12 w-full rounded-full bg-black px-5 text-base font-medium text-white transition hover:bg-[#282828]"
              >
                Save trip preferences
              </button>
            </form>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: "Bookings", value: summary.totalBookings, detail: "Latest account records" },
                { label: "Needs action", value: summary.needsActionBookings, detail: "Requests or payments" },
                user.role === "owner" || user.role === "admin"
                  ? { label: "Listings", value: summary.totalListings, detail: `${summary.publishedListings} published` }
                  : { label: "Completed", value: summary.completedTrips, detail: "Closed trips" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-white p-5 ring-1 ring-black/10">
                  <div className="text-sm font-medium text-[#5e5e5e]">{item.label}</div>
                  <div className="mt-4 text-xl font-bold">{item.value}</div>
                  <div className="mt-1 text-sm text-[#5e5e5e]">{item.detail}</div>
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
