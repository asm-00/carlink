import Image from "next/image";
import Link from "next/link";
import { Footer, MobileTabBar, TopNav } from "@/app/components/navigation";
import { VehicleCard } from "@/app/components/vehicle-card";
import { api, getConvexClient } from "@/app/lib/convex-server";

export const dynamic = "force-dynamic";

type HomeProps = {
  searchParams: Promise<{
    location?: string;
    vehicleType?: "Compact" | "SUV" | "4x4";
    gravelReady?: string;
    startDate?: string;
    endDate?: string;
  }>;
};

const bookingStatuses = ["Request", "Owner review", "Pay", "Drive", "Return"];

function formatCount(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10_000 ? 0 : 1)}k`;
  }

  return String(value);
}

export default async function Home({ searchParams }: HomeProps) {
  const { location, vehicleType, gravelReady, startDate, endDate } = await searchParams;
  const selectedVehicleType = vehicleType === "Compact" || vehicleType === "SUV" || vehicleType === "4x4" ? vehicleType : undefined;
  const wantsGravel = gravelReady === "true";
  const selectedStartDate = startDate ?? "2026-06-02";
  const selectedEndDate = endDate ?? "2026-06-06";
  const bookingQueryParams = new URLSearchParams();

  if (selectedStartDate) {
    bookingQueryParams.set("startDate", selectedStartDate);
  }
  if (selectedEndDate) {
    bookingQueryParams.set("endDate", selectedEndDate);
  }

  const bookingQuery = bookingQueryParams.size ? `?${bookingQueryParams.toString()}` : "";
  const convex = getConvexClient();
  const [vehicles, stats] = await Promise.all([
    convex.query(api.vehicles.listPublished, {
      location,
      vehicleType: selectedVehicleType,
      gravelReady: wantsGravel || undefined,
    }),
    convex.query(api.marketplace.stats, {}),
  ]);
  const featured = vehicles[0] ?? null;

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-black md:bg-white">
      <TopNav />
      <main className="pb-[calc(7.5rem+env(safe-area-inset-bottom))] md:pb-0">
        <section className="mx-auto grid w-full max-w-7xl gap-5 px-4 pb-5 pt-4 sm:px-6 md:grid-cols-[0.95fr_1.05fr] md:gap-8 md:py-12 lg:px-8">
          <div className="flex flex-col justify-center gap-5 md:gap-8">
            <div className="space-y-3 md:space-y-5">
              <h1 className="max-w-xl text-3xl font-bold leading-[1.06] tracking-normal sm:text-6xl">
                Find the right car for the trip.
              </h1>
              <p className="max-w-lg text-sm leading-5 text-[#5e5e5e] md:text-lg md:leading-7">
                Browse local cars, compare real daily rates, and request a booking only when the vehicle fits your plans.
              </p>
            </div>

            <form action="/" method="get" className="rounded-[1.75rem] bg-white p-3 shadow-[0_18px_55px_rgba(0,0,0,0.08)] ring-1 ring-black/5 md:rounded-2xl md:p-4 md:shadow-[0_4px_16px_rgba(0,0,0,0.16)] md:ring-0">
              <div className="grid grid-cols-2 gap-2.5 md:gap-3">
                <label className="block rounded-2xl bg-[#f1f1ef] p-3.5 md:rounded-lg md:bg-[#efefef] md:p-4">
                  <span className="text-xs font-medium text-[#5e5e5e]">Pickup area</span>
                  <select
                    name="location"
                    className="mt-1 w-full appearance-none bg-transparent text-base font-medium text-black outline-none"
                    aria-label="Pickup area"
                    defaultValue={location ?? "Any area"}
                  >
                    <option>Any area</option>
                    <option>Windhoek</option>
                    <option>Swakopmund</option>
                  </select>
                </label>
                <label className="block rounded-2xl bg-[#f1f1ef] p-3.5 md:rounded-lg md:bg-[#efefef] md:p-4">
                  <span className="text-xs font-medium text-[#5e5e5e]">Vehicle type</span>
                  <select
                    name="vehicleType"
                    className="mt-1 w-full appearance-none bg-transparent text-base font-medium text-black outline-none"
                    aria-label="Vehicle type"
                    defaultValue={selectedVehicleType ?? "Any car"}
                  >
                    <option value="">Any car</option>
                    <option value="Compact">Compact</option>
                    <option value="SUV">SUV</option>
                    <option value="4x4">4x4</option>
                  </select>
                </label>
                <label className="block rounded-2xl bg-[#f1f1ef] p-3.5 md:rounded-lg md:bg-[#efefef] md:p-4">
                  <span className="text-xs font-medium text-[#5e5e5e]">Start</span>
                  <input
                    name="startDate"
                    className="mt-1 w-full bg-transparent text-base font-medium text-black outline-none"
                    type="date"
                    defaultValue={selectedStartDate}
                    aria-label="Start date"
                  />
                </label>
                <label className="block rounded-2xl bg-[#f1f1ef] p-3.5 md:rounded-lg md:bg-[#efefef] md:p-4">
                  <span className="text-xs font-medium text-[#5e5e5e]">Return</span>
                  <input
                    name="endDate"
                    className="mt-1 w-full bg-transparent text-base font-medium text-black outline-none"
                    type="date"
                    defaultValue={selectedEndDate}
                    aria-label="Return date"
                  />
                </label>
              </div>
              <button type="submit" className="mt-3 min-h-12 w-full rounded-full bg-black px-5 py-3 text-base font-medium text-white transition hover:bg-[#282828]">
                Search available cars
              </button>
            </form>

          </div>

          {featured ? (
            <div className="relative hidden overflow-hidden rounded-[1.75rem] bg-black text-white md:block md:rounded-2xl">
              <div className="relative aspect-[1.08/1] md:aspect-auto md:min-h-[620px]">
                <Image
                  src={featured.image}
                  alt={featured.imageAlt}
                  fill
                  loading="eager"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-x-0 bottom-0 p-3 sm:p-8">
                  <div className="max-w-md rounded-[1.4rem] bg-white p-4 text-black shadow-[0_4px_16px_rgba(0,0,0,0.16)] md:rounded-2xl md:p-5">
                    <p className="text-sm font-medium text-[#5e5e5e]">Ready to book</p>
                    <h2 className="mt-2 text-2xl font-bold">
                      {featured.year} {featured.make} {featured.model}
                    </h2>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="text-sm text-[#5e5e5e]">
                        {featured.location} - {featured.range}
                      </span>
                      <span className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white">
                        N${featured.dailyRate}/day
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden min-h-[300px] items-center justify-center rounded-[1.75rem] bg-[#efefef] p-8 text-center md:flex md:min-h-[420px] md:rounded-2xl">
              <div>
                <h2 className="text-2xl font-bold">No cars available yet</h2>
                <p className="mt-2 text-[#5e5e5e]">Try a different area or check back soon.</p>
              </div>
            </div>
          )}
        </section>

        <section className="bg-[#f7f7f5] px-4 py-3 sm:px-6 md:border-y md:border-black/10 md:bg-[#f3f3f3] md:py-5 lg:px-8">
          <div className="app-scrollbar-none mx-auto flex max-w-7xl gap-3 overflow-x-auto md:grid md:grid-cols-3 md:overflow-visible">
            {[
              { label: "Cars available", value: stats.activeListings },
              { label: "Completed trips", value: stats.completedTrips },
              { label: "Owners under review", value: stats.ownerApplications },
            ].map((stat) => (
              <div key={stat.label} className="min-w-[152px] flex-1 rounded-[1.4rem] bg-white p-4 shadow-[0_14px_35px_rgba(0,0,0,0.05)] md:rounded-2xl md:p-5 md:shadow-none">
                <div className="text-2xl font-bold md:text-3xl">{formatCount(stat.value)}</div>
                <div className="mt-1 text-sm text-[#5e5e5e]">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:py-10 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold leading-tight md:text-3xl">Available cars</h2>
              <p className="mt-2 hidden text-base text-[#5e5e5e] md:block">
                Browse first. Sign in only when you want to request a booking.
              </p>
            </div>
            <div className="app-scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
              {[
                { label: "All", href: "/" },
                { label: "Compact", href: "/?vehicleType=Compact" },
                { label: "SUV", href: "/?vehicleType=SUV" },
                { label: "4x4", href: "/?vehicleType=4x4" },
                { label: "Gravel ready", href: "/?gravelReady=true" },
              ].map((filter) => (
                <Link
                  key={filter.label}
                  href={filter.href}
                  className="min-h-11 shrink-0 rounded-full bg-[#efefef] px-4 text-sm font-medium transition hover:bg-[#e2e2e2]"
                >
                  <span className="flex min-h-11 items-center">{filter.label}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:mt-6 md:grid-cols-3 md:gap-5">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} bookingQuery={bookingQuery} />
            ))}
          </div>
        </section>

        <section className="hidden bg-black px-4 py-12 text-white sm:px-6 md:block lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
            <div>
              <p className="text-sm font-medium text-[#afafaf]">How booking works</p>
              <h2 className="mt-3 text-4xl font-bold leading-tight">A clear trip flow from request to return.</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-5">
              {bookingStatuses.map((status, index) => (
                <div key={status} className="rounded-2xl bg-white p-4 text-black">
                  <div className="text-sm font-bold">0{index + 1}</div>
                  <div className="mt-8 text-sm font-medium">{status}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto hidden max-w-7xl gap-5 px-4 py-10 sm:px-6 md:grid md:grid-cols-2 lg:px-8">
          <div className="rounded-2xl bg-[#efefef] p-6 sm:p-8">
            <h2 className="text-3xl font-bold">Need a car for a few days?</h2>
            <p className="mt-3 max-w-md text-base leading-6 text-[#5e5e5e]">
              Use Carlink for errands, airport pickup, family travel, or a longer road trip without visiting a rental counter first.
            </p>
            <Link
              href={featured ? `/cars/${featured.slug}` : "/"}
              className="mt-6 inline-flex min-h-12 items-center rounded-full bg-black px-5 text-base font-medium text-white transition hover:bg-[#282828]"
            >
              {featured ? "View a car" : "Reset search"}
            </Link>
          </div>
          <div className="rounded-2xl bg-white p-6 ring-1 ring-black/10 sm:p-8">
            <h2 className="text-3xl font-bold">Already own a vehicle?</h2>
            <p className="mt-3 max-w-md text-base leading-6 text-[#5e5e5e]">
              Apply when you are ready to list your car.
            </p>
            <Link
              href="/owner"
              className="mt-6 inline-flex min-h-12 items-center rounded-full bg-[#efefef] px-5 text-base font-medium text-black transition hover:bg-[#e2e2e2]"
            >
              Apply to list
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <MobileTabBar active="explore" />
    </div>
  );
}
