"use client"

import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { SignedIn, SignUpButton } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

export default function Header() {
    const { isSignedIn } = useUser()

    return (
        <header className="bg-slate-900 text-white">
            <div className="container mx-auto flex items-center justify-between px-4">
                {/* Logo */}
                <Link href="/">
                    <div className="flex items-center">
                        <Image src="/logo.png" alt="Site Logo" width={80} height={80} />
                        <span className="ml-2 text-xl font-bold">Booktribe</span>
                    </div>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex space-x-6 mr-4 items-center">
                    <Link href="/">
                        Home
                    </Link>
                    <SignedIn>
                        <Link href="/community">
                            Community
                        </Link>
                    </SignedIn>
                    <Link href="#about">
                        About
                    </Link>

                    {isSignedIn ? (
                        <UserButton afterSignOutUrl="/" />
                    ) : (
                        <SignUpButton mode="modal">
                            <Button className="bg-blue-600 text-white hover:bg-blue-700">
                                Sign In
                            </Button>
                        </SignUpButton>
                    )}
                    {/* <Link href="/contact">
            Contact
          </Link> */}
                </nav>

                {/* Mobile Menu Button */}
                <button className="md:hidden">
                    <span className="sr-only">Open menu</span>
                    {/* Add a menu icon here if needed */}
                    ☰
                </button>
            </div>
        </header>
    );
}
