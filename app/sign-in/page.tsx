import Link from "next/link";
import { redirect } from "next/navigation";
import { signInAction } from "@/app/actions/auth";
import { MobileAppHeader, MobileTabBar } from "@/app/components/navigation";
import { DEFAULT_ACCOUNT_PATH, isAdminPath, sanitizeRedirectPath } from "@/app/lib/redirects";
import { getCurrentUser } from "@/app/lib/session";

export const dynamic = "force-dynamic";

type SignInPageProps = {
  searchParams: Promise<{ next?: string; mode?: string; error?: string }>;
};

export const metadata = {
  title: "Sign in",
  description: "Sign in to book cars and manage your Carlink account.",
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { next, mode, error } = await searchParams;
  const adminMode = mode === "admin" || (typeof next === "string" && isAdminPath(next));
  const nextPath = sanitizeRedirectPath(next, adminMode ? "/admin" : DEFAULT_ACCOUNT_PATH);
  const user = await getCurrentUser();

  if (user && (!adminMode || user.role === "admin")) {
    redirect(nextPath);
  }

  const errorMessage =
    error === "admin"
      ? "This account does not have admin access."
      : error
        ? "Enter your name and email."
        : null;

  return (
    <main className="flex min-h-screen flex-col bg-white text-black md:flex-row">
      <MobileAppHeader title={adminMode ? "Admin" : "Sign in"} subtitle="Continue to Carlink" backHref="/" />
      <section className="hidden flex-1 bg-black p-8 text-white lg:flex lg:flex-col lg:justify-between">
        <Link href="/" className="text-2xl font-bold">
          Carlink
        </Link>
        <div>
          <h1 className="mt-3 max-w-lg text-5xl font-bold leading-tight">
            Sign in when you are ready to request a car.
          </h1>
        </div>
      </section>
      <section className="flex flex-1 items-start justify-center px-4 pb-[calc(5rem+env(safe-area-inset-bottom))] pt-2 sm:px-6 md:min-h-screen md:items-center md:py-10 md:pb-10">
        <div className="w-full max-w-md">
          <Link href="/" className="hidden rounded-full bg-[#efefef] px-4 py-2 text-sm font-medium lg:hidden">
            Back to explore
          </Link>
          <form action={signInAction} className="mt-5 rounded-[1.5rem] bg-white p-4 ring-1 ring-black/10 sm:p-6 md:rounded-2xl md:bg-[#efefef] md:ring-0">
            <input type="hidden" name="next" value={nextPath} />
            <h1 className="text-3xl font-bold">{adminMode ? "Admin sign in" : "Sign in to continue"}</h1>
            {errorMessage ? (
              <div className="mt-4 rounded-2xl bg-white p-4 text-sm font-medium">{errorMessage}</div>
            ) : null}
            <div className="mt-6 grid gap-3">
              <label className="block rounded-lg bg-white p-4">
                <span className="text-xs font-medium text-[#5e5e5e]">Full name</span>
                <input
                  name="fullName"
                  required
                  className="mt-1 w-full bg-transparent text-base font-medium outline-none"
                  placeholder="Your name"
                />
              </label>
              <label className="block rounded-lg bg-white p-4">
                <span className="text-xs font-medium text-[#5e5e5e]">Email</span>
                <input
                  name="email"
                  type="email"
                  required
                  className="mt-1 w-full bg-transparent text-base font-medium outline-none"
                  placeholder="you@example.com"
                />
              </label>
            </div>
            <button type="submit" className="mt-4 min-h-12 w-full rounded-full bg-black px-5 text-base font-medium text-white transition hover:bg-[#282828]">
              {adminMode ? "Enter admin dashboard" : "Sign in"}
            </button>
          </form>
        </div>
      </section>
      <MobileTabBar active="account" />
    </main>
  );
}
