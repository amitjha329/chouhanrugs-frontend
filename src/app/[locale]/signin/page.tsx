import Image from '@/ui/components/OptimizedImage';
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import banner from "./banner.webp"
import getSiteData from "@/backend/serverActions/getSiteData";
import SigninForm from "./SigninForm";
import { getSession } from '@/lib/auth-server';
import Link from "next/link";
import { FiArrowLeft, FiShield, FiTruck } from "react-icons/fi";

const SignIn = async () => {
    await connection()
    const session = await getSession()
    if (session?.user != null) {
        redirect('/')
    }
    const siteInfo = await getSiteData()
    return (
        <main className="min-h-screen bg-base-200 text-base-content">
            <div className="grid min-h-screen lg:grid-cols-[minmax(0,1.05fr)_minmax(28rem,0.95fr)]">
                <section className="relative hidden overflow-hidden lg:block lg:min-h-screen">
                    <Image
                        fill
                        src={banner}
                        alt="Handcrafted rugs arranged in a warm interior"
                        className="!h-full !w-full object-fill"
                        sizes="(max-width: 1024px) 100vw, 56vw"
                        placeholder="blur"
                        loading="eager"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent lg:bg-gradient-to-r lg:from-primary/70 lg:via-primary/25 lg:to-transparent" />
                    <Link
                        href="/"
                        className="absolute left-8 top-8 inline-flex h-11 w-11 items-center justify-center rounded-full bg-base-100/90 text-primary shadow-lg backdrop-blur transition hover:bg-base-100"
                        aria-label="Back to home"
                    >
                        <FiArrowLeft className="h-5 w-5" aria-hidden="true" />
                    </Link>
                </section>

                <section className="relative min-h-screen bg-base-100 px-6 py-8 sm:px-6 lg:flex lg:min-h-screen lg:items-center lg:bg-base-100/95 lg:px-10 lg:py-10">
                    <Link
                        href="/"
                        className="absolute left-8 top-8 inline-flex h-11 w-11 items-center justify-center rounded-full bg-base-100/90 text-primary shadow-lg backdrop-blur transition hover:bg-base-100 max-sm:hidden"
                        aria-label="Back to home"
                    >
                        <FiArrowLeft className="h-5 w-5" aria-hidden="true" />
                    </Link>
                    <div className="mx-auto w-full max-w-md">
                        <div className="flex flex-row justify-start">
                            <Link
                                href="/"
                                className="mb-7 inline-flex h-11 w-11 items-center justify-center rounded-full bg-base-200 text-primary shadow-sm transition hover:bg-secondary lg:hidden"
                                aria-label="Back to home"
                            >
                                <FiArrowLeft className="h-5 w-5" aria-hidden="true" />
                            </Link>
                            <div className="mb-7 flex items-center gap-4">
                                {/* <Link
                                    href="/"
                                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-secondary bg-primary p-2 shadow-lg shadow-primary/15"
                                >
                                    <Image
                                        src={siteInfo.logoSrc}
                                        alt={siteInfo.title}
                                        width={56}
                                        height={56}
                                        className="h-full w-full object-contain"
                                    />
                                </Link> */}
                                <div className="min-w-0 ml-2">
                                    <p className="font-serif text-2xl leading-none text-primary">{siteInfo.title}</p>
                                    <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-accent">Home Decor | Handloom</p>
                                </div>
                            </div>

                        </div>

                        <div className="bg-base-100 sm:rounded-[1.75rem] sm:border sm:border-base-300 sm:p-7 sm:shadow-xl sm:shadow-primary/5">
                            <Suspense fallback={<div className="animate-pulse p-8">Loading...</div>}>
                                <SigninForm siteTitle={siteInfo.title} />
                            </Suspense>
                        </div>

                        <div className="mt-7 grid grid-cols-2 gap-3 text-xs font-semibold text-base-content/65 sm:mt-5 max-sm:hidden">
                            <div className="flex items-center gap-2 rounded-2xl bg-base-200 px-4 py-3">
                                <FiShield className="h-4 w-4 text-primary" aria-hidden="true" />
                                Secure sign in
                            </div>
                            <div className="flex items-center gap-2 rounded-2xl bg-base-200 px-4 py-3">
                                <FiTruck className="h-4 w-4 text-primary" aria-hidden="true" />
                                Order tracking
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

export default SignIn;
