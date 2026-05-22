import Image from "next/image";
import Link from "next/link";
import type { Doc } from "@/convex/_generated/dataModel";

export function VehicleCard({
  vehicle,
  bookingQuery = "",
}: {
  vehicle: Doc<"vehicles">;
  bookingQuery?: string;
}) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_16px_45px_rgba(0,0,0,0.06)] ring-1 ring-black/5 md:rounded-2xl md:shadow-none md:ring-black/10">
      <Link href={`/cars/${vehicle.slug}${bookingQuery}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#efefef]">
          <Image
            src={vehicle.image}
            alt={vehicle.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition duration-300 hover:scale-[1.03]"
          />
        </div>
        <div className="space-y-3 p-4 md:space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-bold leading-6">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h3>
              <p className="mt-1 text-sm leading-5 text-[#5e5e5e]">
                {vehicle.category} - {vehicle.location}
              </p>
            </div>
            <div className="rounded-full bg-[#f1f1ef] px-3 py-1 text-sm font-medium md:bg-[#efefef]">
              {vehicle.rating}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[vehicle.transmission, `${vehicle.seats} seats`, vehicle.gravelReady ? "Gravel ready" : "City ready"].map(
              (tag) => (
                <span key={tag} className="rounded-full bg-[#f1f1ef] px-3 py-2 text-xs font-medium md:bg-[#efefef]">
                  {tag}
                </span>
              ),
            )}
          </div>
          <div className="flex items-end justify-between border-t border-black/10 pt-4">
            <div>
              <p className="text-xs text-[#5e5e5e]">{vehicle.pickup}</p>
              <p className="mt-1 text-lg font-bold">N${vehicle.dailyRate}/day</p>
            </div>
            <span className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white">
              View
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
