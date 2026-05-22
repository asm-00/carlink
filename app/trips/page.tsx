import Link from "next/link";
import { payBookingAction } from "@/app/actions/bookings";
import { signOutAction } from "@/app/actions/auth";
import { Footer, MobileTabBar, TopNav } from "@/app/components/navigation";
import { api, getConvexClient } from "@/app/lib/convex-server";
import { requireSignedIn } from "@/app/lib/session";

export const dynamic = "force-dynamic";

type TripsPageProps = {
  searchParams: Promise<{ created?: string }>;
};

export const metadata = {
  title: "Trips",
  description: "Manage your Carlink booking requests and trips.",
};

export default async function TripsPage({ searchParams }: TripsPageProps) {
  const { created } = await searchParams;
  const { sessionToken } = await requireSignedIn("/trips");
  const bookings = await getConvexClient().query(api.bookings.myBookings, { sessionToken });

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-black md:bg-white">
      <TopNav />
      <main className="mx-auto w-full max-w-7xl px-4 pb-[calc(7.5rem+env(safe-area-inset-bottom))] pt-5 sm:px-6 md:py-12 md:pb-12 lg:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">Your trips</h1>
            <p className="mt-3 max-w-xl text-base leading-6 text-[#5e5e5e]">
              Booking requests, approvals, payments, and active trips live here.
            </p>
          </div>
          <form action={signOutAction}>
            <button type="submit" className="min-h-11 rounded-full bg-[#efefef] px-5 text-sm font-medium text-black transition hover:bg-[#e2e2e2]">
              Sign out
            </button>
          </form>
        </div>

        {created ? (
          <div className="mt-6 rounded-2xl bg-black p-5 text-white">
            <div className="text-lg font-bold">Booking request sent</div>
            <p className="mt-1 text-sm text-[#afafaf]">The owner can approve it before payment is collected.</p>
          </div>
        ) : null}

        <section className="mt-6 md:mt-8">
          <div className="rounded-[1.75rem] bg-white shadow-[0_16px_45px_rgba(0,0,0,0.06)] ring-1 ring-black/5 md:rounded-2xl md:shadow-none md:ring-black/10">
            <div className="flex flex-col gap-3 border-b border-black/10 p-5 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-2xl font-bold">Booking activity</h2>
              <Link
                href="/"
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-black px-5 text-sm font-medium text-white transition hover:bg-[#282828]"
              >
                Book another car
              </Link>
            </div>
            {bookings.length > 0 ? (
              <div className="divide-y divide-black/10">
                {bookings.map((booking) => (
                  <article key={booking._id} className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                      <h3 className="text-lg font-bold">
                        {booking.vehicle
                          ? `${booking.vehicle.year} ${booking.vehicle.make} ${booking.vehicle.model}`
                          : "Vehicle"}
                      </h3>
                      <p className="mt-1 text-sm text-[#5e5e5e]">
                        {booking.startDate} to {booking.endDate} - {booking.totalDays} days
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 md:justify-end">
                      <span className="rounded-full bg-[#efefef] px-3 py-2 text-xs font-medium">{booking.status}</span>
                      <span className="font-bold">N${booking.pricingBreakdown.totalAmount}</span>
                      {booking.status === "approved" ? (
                        <form action={payBookingAction}>
                          <input type="hidden" name="bookingId" value={booking._id} />
                          <button type="submit" className="min-h-10 rounded-full bg-black px-4 text-xs font-medium text-white">
                            Pay now
                          </button>
                        </form>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <h3 className="text-xl font-bold">No trips yet</h3>
                <p className="mt-2 text-sm text-[#5e5e5e]">Explore cars and request your first booking.</p>
                <Link
                  href="/"
                  className="mt-5 inline-flex min-h-12 items-center rounded-full bg-black px-5 text-base font-medium text-white"
                >
                  Explore cars
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <MobileTabBar active="trips" />
    </div>
  );
}
