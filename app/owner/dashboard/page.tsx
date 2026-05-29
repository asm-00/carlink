import Link from "next/link";
import { ownerBookingStatusAction } from "@/app/actions/bookings";
import {
  createVehicleListingAction,
  submitVehicleListingForReviewAction,
  updateVehicleListingAction,
  updateVehicleListingStatusAction,
} from "@/app/actions/owner";
import { Footer, MobileAppHeader, MobileTabBar, TopNav } from "@/app/components/navigation";
import { api, getConvexClient } from "@/app/lib/convex-server";
import { requireOwner } from "@/app/lib/session";

export const dynamic = "force-dynamic";

type OwnerDashboardProps = {
  searchParams: Promise<{
    bookingError?: string;
    bookingUpdated?: string;
    created?: string;
    listingError?: string;
    listingSaved?: string;
    listingStatus?: string;
  }>;
};

export const metadata = {
  title: "Owner dashboard",
  description: "Manage Carlink vehicle listings and booking requests.",
};

const currencyFormatter = new Intl.NumberFormat("en-NA", {
  maximumFractionDigits: 0,
  style: "currency",
  currency: "NAD",
});

const dateFormatter = new Intl.DateTimeFormat("en-NA", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value).replace("NAD", "N$").trim();
}

function formatDate(value: string) {
  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return dateFormatter.format(date);
}

function formatStatus(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function statusClassName(status: string) {
  if (status === "requested" || status === "pending") {
    return "bg-[#fff4cc] text-[#6f5300]";
  }
  if (status === "published" || status === "paid" || status === "approved") {
    return "bg-black text-white";
  }
  if (status === "active") {
    return "bg-[#dff7e8] text-[#126b35]";
  }
  if (status === "completed") {
    return "bg-[#e9f0ff] text-[#244c9f]";
  }
  return "bg-[#efefef] text-[#5e5e5e]";
}

function nextOwnerActions(status: string) {
  if (status === "requested") {
    return [
      { label: "Approve", status: "approved" },
      { label: "Decline", status: "cancelled" },
    ];
  }
  if (status === "paid") {
    return [
      { label: "Start trip", status: "active" },
      { label: "Dispute", status: "disputed" },
    ];
  }
  if (status === "active") {
    return [
      { label: "Complete", status: "completed" },
      { label: "Dispute", status: "disputed" },
    ];
  }
  return [];
}

function noticeForSearchParams(params: Awaited<OwnerDashboardProps["searchParams"]>) {
  if (params.created) {
    return {
      title: "Listing sent for review",
      body: "It will appear in Explore after admin approval.",
      className: "bg-black text-white",
      bodyClassName: "text-[#afafaf]",
    };
  }
  if (params.listingSaved) {
    return {
      title: "Listing saved",
      body: "The owner dashboard and marketplace data were refreshed.",
      className: "bg-black text-white",
      bodyClassName: "text-[#afafaf]",
    };
  }
  if (params.listingStatus) {
    const title =
      params.listingStatus === "paused"
        ? "Listing paused"
        : params.listingStatus === "pending"
          ? "Listing sent for review"
          : "Listing reactivated";

    return {
      title,
      body: "The listing status was saved in Convex.",
      className: "bg-black text-white",
      bodyClassName: "text-[#afafaf]",
    };
  }
  if (params.bookingUpdated) {
    return {
      title: "Booking updated",
      body: `Status changed to ${formatStatus(params.bookingUpdated)}.`,
      className: "bg-black text-white",
      bodyClassName: "text-[#afafaf]",
    };
  }
  if (params.bookingError) {
    return {
      title: "Booking could not be updated",
      body: "Check the current status or trip dates and try again.",
      className: "bg-[#efefef] text-black",
      bodyClassName: "text-[#5e5e5e]",
    };
  }
  if (params.listingError) {
    return {
      title: "Listing could not be saved",
      body: "Daily rate and seats must be greater than zero.",
      className: "bg-[#efefef] text-black",
      bodyClassName: "text-[#5e5e5e]",
    };
  }
  return null;
}

export default async function OwnerDashboard({ searchParams }: OwnerDashboardProps) {
  const params = await searchParams;
  const { sessionToken, user } = await requireOwner();
  const overview = await getConvexClient().query(api.ownerDashboard.overview, { sessionToken });
  const notice = noticeForSearchParams(params);
  const metricCards = [
    { label: "Open requests", value: overview.metrics.openRequests, detail: "Need approve / decline" },
    { label: "Ready to start", value: overview.metrics.readyToStart, detail: "Paid bookings" },
    { label: "Active trips", value: overview.metrics.activeTrips, detail: "Currently out" },
    { label: "Confirmed revenue", value: formatCurrency(overview.metrics.confirmedRevenue), detail: "Paid and completed" },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <TopNav />
      <MobileAppHeader title="Owner" subtitle="Listings and bookings" />
      <main className="pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        <section className="mx-auto max-w-7xl px-4 py-2 sm:px-6 md:py-12 lg:px-8">
          <div className="hidden flex-col gap-5 md:flex md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium text-[#5e5e5e]">Owner dashboard</p>
              <h1 className="mt-2 text-4xl font-bold leading-tight md:text-5xl">Bookings, cars, earnings.</h1>
              <p className="mt-3 max-w-2xl text-base leading-6 text-[#5e5e5e]">
                Approved owner account for {user.fullName}. Changes on this page save to Convex.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/trips"
                className="inline-flex min-h-11 items-center rounded-full bg-[#efefef] px-5 text-sm font-medium text-black transition hover:bg-[#e2e2e2]"
              >
                View renter trips
              </Link>
              <Link
                href="/"
                className="inline-flex min-h-11 items-center rounded-full bg-black px-5 text-sm font-medium text-white transition hover:bg-[#282828]"
              >
                Marketplace
              </Link>
            </div>
          </div>

          {notice ? (
            <div className={`mt-6 rounded-2xl p-5 ${notice.className}`}>
              <div className="text-lg font-bold">{notice.title}</div>
              <p className={`mt-1 text-sm ${notice.bodyClassName}`}>{notice.body}</p>
            </div>
          ) : null}

          <div className="mt-6 grid gap-3 sm:grid-cols-2 md:mt-8 lg:grid-cols-4">
            {metricCards.map((metric) => (
              <article key={metric.label} className="rounded-[1.5rem] bg-[#efefef] p-5 md:rounded-2xl">
                <div className="text-sm font-medium text-[#5e5e5e]">{metric.label}</div>
                <div className="mt-3 text-3xl font-bold">{metric.value}</div>
                <div className="mt-2 text-sm text-[#5e5e5e]">{metric.detail}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-6 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
          <div className="rounded-[1.5rem] bg-black p-5 text-white md:rounded-2xl">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Action queue</h2>
                <p className="mt-1 text-sm text-[#afafaf]">Approve requests, start paid trips, and close returns.</p>
              </div>
              <span className="rounded-full bg-white px-3 py-2 text-xs font-medium text-black">
                {overview.actionQueue.length} open
              </span>
            </div>

            <div className="mt-5 divide-y divide-white/15">
              {overview.actionQueue.length > 0 ? (
                overview.actionQueue.map((booking) => {
                  const actions = nextOwnerActions(booking.status);
                  const vehicleTitle = booking.vehicle
                    ? `${booking.vehicle.year} ${booking.vehicle.make} ${booking.vehicle.model}`
                    : "Vehicle";

                  return (
                    <article key={booking._id} className="grid gap-4 py-5 md:grid-cols-[1fr_auto] md:items-center">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold">{vehicleTitle}</h3>
                          <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-black">
                            {formatStatus(booking.status)}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-[#afafaf]">
                          {booking.renter?.fullName ?? "Customer"} - {formatDate(booking.startDate)} to {formatDate(booking.endDate)}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#d6d6d6]">
                          <span>{booking.totalDays} days</span>
                          <span>{formatCurrency(booking.pricingBreakdown.totalAmount)}</span>
                          {booking.renter?.email ? <span>{booking.renter.email}</span> : null}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 md:justify-end">
                        {actions.map((action) => (
                          <form key={action.status} action={ownerBookingStatusAction}>
                            <input type="hidden" name="bookingId" value={booking._id} />
                            <input type="hidden" name="status" value={action.status} />
                            <button
                              type="submit"
                              className="min-h-10 rounded-full bg-white px-4 text-xs font-medium text-black transition hover:bg-[#e2e2e2]"
                            >
                              {action.label}
                            </button>
                          </form>
                        ))}
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="py-8 text-center">
                  <h3 className="text-xl font-bold">No owner actions</h3>
                  <p className="mt-2 text-sm text-[#afafaf]">New booking requests and paid trips will appear here.</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-white ring-1 ring-black/10 md:rounded-2xl">
            <div className="border-b border-black/10 p-5">
              <h2 className="text-2xl font-bold">Recent bookings</h2>
            </div>
            {overview.bookings.length > 0 ? (
              <div className="divide-y divide-black/10">
                {overview.bookings.slice(0, 8).map((booking) => (
                  <article key={booking._id} className="p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate font-bold">
                          {booking.vehicle
                            ? `${booking.vehicle.year} ${booking.vehicle.make} ${booking.vehicle.model}`
                            : "Vehicle"}
                        </h3>
                        <p className="mt-1 text-sm text-[#5e5e5e]">
                          {formatDate(booking.startDate)} to {formatDate(booking.endDate)}
                        </p>
                      </div>
                      <span className={`rounded-full px-3 py-1.5 text-xs font-medium ${statusClassName(booking.status)}`}>
                        {formatStatus(booking.status)}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#5e5e5e]">
                      <span>{booking.renter?.fullName ?? "Customer"}</span>
                      <span>{formatCurrency(booking.pricingBreakdown.totalAmount)}</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <h3 className="text-xl font-bold">No bookings yet</h3>
                <p className="mt-2 text-sm text-[#5e5e5e]">Published listings can receive renter requests.</p>
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-12 sm:px-6 lg:grid-cols-[1fr_0.82fr] lg:px-8">
          <div className="rounded-[1.5rem] bg-white ring-1 ring-black/10 md:rounded-2xl">
            <div className="flex flex-col gap-3 border-b border-black/10 p-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Your listings</h2>
                <p className="mt-1 text-sm text-[#5e5e5e]">
                  {overview.metrics.publishedListings} published, {overview.metrics.pendingListings} pending, {overview.metrics.pausedListings} paused, {overview.metrics.draftListings} draft.
                </p>
              </div>
            </div>
            {overview.vehicles.length > 0 ? (
              <div className="divide-y divide-black/10">
                {overview.vehicles.map((vehicle) => (
                  <article key={vehicle._id} className="p-5">
                    <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold">
                            {vehicle.year} {vehicle.make} {vehicle.model}
                          </h3>
                          <span className={`rounded-full px-3 py-1.5 text-xs font-medium ${statusClassName(vehicle.status)}`}>
                            {formatStatus(vehicle.status)}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-[#5e5e5e]">
                          {vehicle.location} - {formatCurrency(vehicle.dailyRate)}/day - {vehicle.trips} trips
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 lg:justify-end">
                        {vehicle.status === "published" || vehicle.status === "paused" ? (
                          <form action={updateVehicleListingStatusAction}>
                            <input type="hidden" name="vehicleId" value={vehicle._id} />
                            <input type="hidden" name="status" value={vehicle.status === "published" ? "paused" : "published"} />
                            <button
                              type="submit"
                              className="min-h-10 rounded-full bg-[#efefef] px-4 text-xs font-medium text-black transition hover:bg-[#e2e2e2]"
                            >
                              {vehicle.status === "published" ? "Pause" : "Reactivate"}
                            </button>
                          </form>
                        ) : null}
                        {vehicle.status === "draft" ? (
                          <form action={submitVehicleListingForReviewAction}>
                            <input type="hidden" name="vehicleId" value={vehicle._id} />
                            <button
                              type="submit"
                              className="min-h-10 rounded-full bg-black px-4 text-xs font-medium text-white transition hover:bg-[#282828]"
                            >
                              Send for review
                            </button>
                          </form>
                        ) : null}
                        {vehicle.status === "pending" ? (
                          <span className="inline-flex min-h-10 items-center rounded-full bg-[#efefef] px-4 text-xs font-medium text-[#5e5e5e]">
                            In admin review
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <form action={updateVehicleListingAction} className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                      <input type="hidden" name="vehicleId" value={vehicle._id} />
                      <label className="block rounded-lg bg-[#efefef] p-3">
                        <span className="text-xs font-medium text-[#5e5e5e]">Daily rate</span>
                        <input
                          name="dailyRate"
                          type="number"
                          min="1"
                          defaultValue={vehicle.dailyRate}
                          required
                          className="mt-1 w-full bg-transparent text-sm font-medium outline-none"
                        />
                      </label>
                      <label className="block rounded-lg bg-[#efefef] p-3">
                        <span className="text-xs font-medium text-[#5e5e5e]">Seats</span>
                        <input
                          name="seats"
                          type="number"
                          min="1"
                          defaultValue={vehicle.seats}
                          required
                          className="mt-1 w-full bg-transparent text-sm font-medium outline-none"
                        />
                      </label>
                      <label className="block rounded-lg bg-[#efefef] p-3">
                        <span className="text-xs font-medium text-[#5e5e5e]">Pickup</span>
                        <input
                          name="pickup"
                          defaultValue={vehicle.pickup}
                          required
                          className="mt-1 w-full bg-transparent text-sm font-medium outline-none"
                        />
                      </label>
                      <label className="block rounded-lg bg-[#efefef] p-3">
                        <span className="text-xs font-medium text-[#5e5e5e]">Best for</span>
                        <input
                          name="range"
                          defaultValue={vehicle.range}
                          required
                          className="mt-1 w-full bg-transparent text-sm font-medium outline-none"
                        />
                      </label>
                      <label className="block rounded-lg bg-[#efefef] p-3 sm:col-span-2 lg:col-span-1">
                        <span className="text-xs font-medium text-[#5e5e5e]">Image URL</span>
                        <input
                          name="image"
                          defaultValue={vehicle.image}
                          className="mt-1 w-full bg-transparent text-sm font-medium outline-none"
                        />
                      </label>
                      <button
                        type="submit"
                        className="min-h-11 rounded-full bg-black px-4 text-sm font-medium text-white transition hover:bg-[#282828] sm:col-span-2 lg:col-span-5"
                      >
                        Save listing
                      </button>
                    </form>
                  </article>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <h3 className="text-xl font-bold">No listings yet</h3>
                <p className="mt-2 text-sm text-[#5e5e5e]">Create your first vehicle listing for admin review.</p>
              </div>
            )}
          </div>

          <form action={createVehicleListingAction} className="self-start rounded-[1.75rem] bg-[#efefef] p-4 md:rounded-2xl md:p-5">
            <h2 className="text-2xl font-bold">Create vehicle listing</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {[
                ["make", "Make", "Toyota"],
                ["model", "Model", "Hilux"],
                ["year", "Year", "2024"],
                ["category", "Listing category", "SUV with camping kit"],
                ["location", "Location", "Windhoek"],
                ["pickup", "Pickup", "Airport delivery available"],
                ["dailyRate", "Daily rate", "850"],
                ["seats", "Seats", "5"],
                ["range", "Best for", "Weekend trips"],
                ["image", "Image URL", "Optional image URL"],
              ].map(([name, label, placeholder]) => (
                <label key={name} className="block rounded-lg bg-white p-4">
                  <span className="text-xs font-medium text-[#5e5e5e]">{label}</span>
                  <input
                    name={name}
                    required={name !== "image"}
                    className="mt-1 w-full bg-transparent text-sm font-medium outline-none"
                    placeholder={placeholder}
                  />
                </label>
              ))}
              <label className="block rounded-lg bg-white p-4">
                <span className="text-xs font-medium text-[#5e5e5e]">Vehicle type</span>
                <select
                  name="vehicleType"
                  className="mt-1 w-full appearance-none bg-transparent text-sm font-medium outline-none"
                  defaultValue="SUV"
                >
                  <option>Compact</option>
                  <option>SUV</option>
                  <option>4x4</option>
                </select>
              </label>
              <label className="block rounded-lg bg-white p-4">
                <span className="text-xs font-medium text-[#5e5e5e]">Transmission</span>
                <select
                  name="transmission"
                  className="mt-1 w-full appearance-none bg-transparent text-sm font-medium outline-none"
                  defaultValue="Automatic"
                >
                  <option>Automatic</option>
                  <option>Manual</option>
                </select>
              </label>
              <label className="flex min-h-20 items-center justify-between rounded-lg bg-white p-4 text-sm font-medium">
                Gravel ready
                <input name="gravelReady" type="checkbox" className="h-5 w-5" />
              </label>
              <label className="block rounded-lg bg-white p-4 sm:col-span-2">
                <span className="text-xs font-medium text-[#5e5e5e]">Review notes</span>
                <textarea
                  name="vehicleNotes"
                  className="mt-1 min-h-24 w-full resize-none bg-transparent text-sm font-medium outline-none"
                  placeholder="Insurance, service history, special pickup rules"
                />
              </label>
            </div>
            <button
              type="submit"
              className="mt-4 min-h-12 w-full rounded-full bg-black px-5 text-base font-medium text-white transition hover:bg-[#282828]"
            >
              Send listing for review
            </button>
          </form>
        </section>
      </main>
      <Footer />
      <MobileTabBar active="owner" />
    </div>
  );
}
