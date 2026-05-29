import {
  approveOwnerAction,
  approveVehicleAction,
  rejectOwnerAction,
  returnVehicleForChangesAction,
} from "@/app/actions/admin";
import { Footer, MobileAppHeader, MobileTabBar, TopNav } from "@/app/components/navigation";
import { api, getConvexClient } from "@/app/lib/convex-server";
import { requireAdmin } from "@/app/lib/session";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin dashboard",
  description: "Carlink marketplace operations dashboard.",
};

export default async function AdminPage() {
  const { sessionToken } = await requireAdmin();
  const overview = await getConvexClient().query(api.admin.overview, { sessionToken });
  const cards = [
    { name: "Owner requests", count: overview.queues.ownerApplications, label: "Applications" },
    { name: "Listing reviews", count: overview.queues.vehicleReviews, label: "Pending cars" },
    { name: "Booking requests", count: overview.queues.bookingRequests, label: "Owner action" },
    { name: "Active listings", count: overview.stats.activeListings, label: "Published" },
  ];

  return (
    <div className="min-h-screen bg-white text-black">
      <TopNav />
      <MobileAppHeader title="Operations" subtitle="Marketplace review" />
      <main className="pb-[calc(5rem+env(safe-area-inset-bottom))] md:pb-0">
        <section className="mx-auto max-w-7xl px-4 py-2 sm:px-6 md:py-12 lg:px-8">
          <div className="hidden flex-col gap-5 md:flex md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-medium text-[#5e5e5e]">Hidden admin dashboard</p>
              <h1 className="mt-2 text-4xl font-bold leading-tight md:text-5xl">Marketplace control room</h1>
            </div>
            <div className="rounded-full bg-black px-5 py-3 text-sm font-medium text-white">Admin verified</div>
          </div>

          <div className="mt-6 grid gap-3 md:mt-8 md:grid-cols-4 md:gap-4">
            {cards.map((queue) => (
              <article key={queue.name} className="rounded-[1.5rem] bg-[#efefef] p-4 md:rounded-2xl md:p-5">
                <div className="text-sm font-medium text-[#5e5e5e]">{queue.name}</div>
                <div className="mt-5 text-4xl font-bold">{queue.count}</div>
                <div className="mt-5 inline-flex rounded-full bg-white px-3 py-2 text-xs font-medium">{queue.label}</div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-5 px-4 pb-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div className="overflow-hidden rounded-[1.5rem] bg-white ring-1 ring-black/10 md:rounded-2xl">
            <div className="border-b border-black/10 p-5">
              <h2 className="text-2xl font-bold">Owner applications</h2>
            </div>
            {overview.applications.length > 0 ? (
              <div className="divide-y divide-black/10">
                {overview.applications.map((application) => (
                  <article key={application._id} className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                      <h3 className="text-lg font-bold">{application.fullName}</h3>
                      <p className="mt-1 text-sm text-[#5e5e5e]">{application.email}</p>
                      <p className="mt-3 text-sm leading-6">{application.vehicleSummary}</p>
                      <p className="mt-2 text-sm text-[#5e5e5e]">{application.location}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 md:justify-end">
                      <form action={approveOwnerAction}>
                        <input type="hidden" name="applicationId" value={application._id} />
                        <button type="submit" className="min-h-11 rounded-full bg-black px-5 text-sm font-medium text-white transition hover:bg-[#282828]">
                          Approve
                        </button>
                      </form>
                      <form action={rejectOwnerAction}>
                        <input type="hidden" name="applicationId" value={application._id} />
                        <button type="submit" className="min-h-11 rounded-full bg-[#efefef] px-5 text-sm font-medium text-black transition hover:bg-[#e2e2e2]">
                          Reject
                        </button>
                      </form>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <h3 className="text-xl font-bold">No pending owner applications</h3>
                <p className="mt-2 text-sm text-[#5e5e5e]">Applications submitted from `/owner` will appear here.</p>
              </div>
            )}
          </div>

          <div className="grid gap-5">
            <div className="rounded-2xl bg-black p-6 text-white">
              <h2 className="text-2xl font-bold">Vehicle reviews</h2>
              <div className="mt-5 divide-y divide-white/15 text-sm">
                {overview.vehicles.length > 0 ? (
                  overview.vehicles.map((vehicle) => (
                    <article key={vehicle._id} className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                      <div>
                        <div className="font-medium">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </div>
                        <p className="mt-1 text-[#afafaf]">
                          {vehicle.location} - N${vehicle.dailyRate}/day
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 sm:justify-end">
                        <form action={approveVehicleAction}>
                          <input type="hidden" name="vehicleId" value={vehicle._id} />
                          <button type="submit" className="min-h-10 rounded-full bg-white px-4 text-xs font-medium text-black">
                            Publish
                          </button>
                        </form>
                        <form action={returnVehicleForChangesAction}>
                          <input type="hidden" name="vehicleId" value={vehicle._id} />
                          <button type="submit" className="min-h-10 rounded-full bg-white/10 px-4 text-xs font-medium text-white ring-1 ring-white/20">
                            Return
                          </button>
                        </form>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="text-[#afafaf]">No pending vehicle listings.</p>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-[#efefef] p-6">
              <h2 className="text-2xl font-bold">Recent booking requests</h2>
              <div className="mt-5 divide-y divide-black/10 text-sm">
                {overview.bookings.length > 0 ? (
                  overview.bookings.map((booking) => (
                    <div key={booking._id} className="py-4">
                      <div className="flex items-center justify-between gap-4">
                        <span>{booking.startDate} to {booking.endDate}</span>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-black">{booking.status}</span>
                      </div>
                      <p className="mt-2 text-[#5e5e5e]">
                        {booking.vehicle
                          ? `${booking.vehicle.year} ${booking.vehicle.make} ${booking.vehicle.model}`
                          : "Vehicle"}{" "}
                        - N${booking.pricingBreakdown.totalAmount}
                      </p>
                      <p className="mt-1 text-[#5e5e5e]">
                        {booking.renter?.fullName ?? "Renter"} / {booking.vehicle?.ownerName ?? "Owner"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-[#5e5e5e]">No requested bookings yet.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileTabBar active="account" />
    </div>
  );
}
