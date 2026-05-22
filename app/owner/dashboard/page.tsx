import Link from "next/link";
import { ownerBookingStatusAction } from "@/app/actions/bookings";
import { createVehicleListingAction } from "@/app/actions/owner";
import { Footer, MobileTabBar, TopNav } from "@/app/components/navigation";
import { api, getConvexClient } from "@/app/lib/convex-server";
import { requireOwner } from "@/app/lib/session";

export const dynamic = "force-dynamic";

type OwnerDashboardProps = {
  searchParams: Promise<{ created?: string; listingError?: string }>;
};

export const metadata = {
  title: "Owner dashboard",
  description: "Manage Carlink vehicle listings and booking requests.",
};

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

export default async function OwnerDashboard({ searchParams }: OwnerDashboardProps) {
  const { created, listingError } = await searchParams;
  const { sessionToken, user } = await requireOwner();
  const [vehicles, bookings] = await Promise.all([
    getConvexClient().query(api.vehicles.listMine, { sessionToken }),
    getConvexClient().query(api.bookings.ownerBookings, { sessionToken }),
  ]);

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-black md:bg-white">
      <TopNav />
      <main className="pb-[calc(7.5rem+env(safe-area-inset-bottom))] md:pb-0">
        <section className="mx-auto max-w-7xl px-4 py-5 sm:px-6 md:py-12 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium text-[#5e5e5e]">Owner dashboard</p>
              <h1 className="mt-2 text-4xl font-bold leading-tight md:text-5xl">Manage listings and requests</h1>
              <p className="mt-3 max-w-2xl text-base leading-6 text-[#5e5e5e]">
                Approved owner account for {user.fullName}. New cars stay pending until admin review.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex min-h-11 items-center rounded-full bg-[#efefef] px-5 text-sm font-medium text-black transition hover:bg-[#e2e2e2]"
            >
              View public marketplace
            </Link>
          </div>

          {created ? (
            <div className="mt-6 rounded-2xl bg-black p-5 text-white">
              <div className="text-lg font-bold">Listing sent for review</div>
              <p className="mt-1 text-sm text-[#afafaf]">It will appear in Explore after admin approval.</p>
            </div>
          ) : null}
          {listingError ? (
            <div className="mt-6 rounded-2xl bg-[#efefef] p-5">
              <div className="text-lg font-bold">Check the listing details</div>
              <p className="mt-1 text-sm text-[#5e5e5e]">Daily rate and seats must be greater than zero.</p>
            </div>
          ) : null}
        </section>

        <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <form action={createVehicleListingAction} className="rounded-[1.75rem] bg-[#efefef] p-4 md:rounded-2xl md:p-5">
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
            <button type="submit" className="mt-4 min-h-12 w-full rounded-full bg-black px-5 text-base font-medium text-white transition hover:bg-[#282828]">
              Send listing for review
            </button>
          </form>

          <div className="grid gap-5">
            <div className="rounded-[1.75rem] bg-white shadow-[0_16px_45px_rgba(0,0,0,0.06)] ring-1 ring-black/5 md:rounded-2xl md:shadow-none md:ring-black/10">
              <div className="border-b border-black/10 p-5">
                <h2 className="text-2xl font-bold">Your listings</h2>
              </div>
              {vehicles.length > 0 ? (
                <div className="divide-y divide-black/10">
                  {vehicles.map((vehicle) => (
                    <article key={vehicle._id} className="grid gap-3 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div>
                        <h3 className="text-lg font-bold">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h3>
                        <p className="mt-1 text-sm text-[#5e5e5e]">
                          {vehicle.location} - N${vehicle.dailyRate}/day
                        </p>
                      </div>
                      <span className="rounded-full bg-[#efefef] px-3 py-2 text-xs font-medium">{vehicle.status}</span>
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

            <div className="rounded-2xl bg-black p-5 text-white">
              <h2 className="text-2xl font-bold">Booking requests</h2>
              <div className="mt-5 divide-y divide-white/15">
                {bookings.length > 0 ? (
                  bookings.map((booking) => {
                    const actions = nextOwnerActions(booking.status);
                    return (
                      <article key={booking._id} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                        <div>
                          <h3 className="font-bold">
                            {booking.vehicle
                              ? `${booking.vehicle.year} ${booking.vehicle.make} ${booking.vehicle.model}`
                              : "Vehicle"}
                          </h3>
                          <p className="mt-1 text-sm text-[#afafaf]">
                            {booking.renter?.fullName ?? "Customer"} - {booking.startDate} to {booking.endDate}
                          </p>
                          <p className="mt-1 text-sm text-[#afafaf]">N${booking.pricingBreakdown.totalAmount}</p>
                        </div>
                        <div className="flex items-center gap-2 sm:justify-end">
                          <span className="rounded-full bg-white px-3 py-2 text-xs font-medium text-black">{booking.status}</span>
                          {actions.map((action) => (
                            <form key={action.status} action={ownerBookingStatusAction}>
                              <input type="hidden" name="bookingId" value={booking._id} />
                              <input type="hidden" name="status" value={action.status} />
                              <button type="submit" className="min-h-10 rounded-full bg-white px-4 text-xs font-medium text-black transition hover:bg-[#e2e2e2]">
                                {action.label}
                              </button>
                            </form>
                          ))}
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <p className="py-5 text-sm text-[#afafaf]">No owner booking requests yet.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileTabBar active="owner" />
    </div>
  );
}
