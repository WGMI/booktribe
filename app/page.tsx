"use client"

import Footer from "@/components/footer";
import Header from "@/components/header";
import LandingPage from "@/components/landing-page";
import { useAuth } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect authenticated users to the dashboard
    if (isLoaded && userId) {
      router.push("/home");
    }
  }, [isLoaded, userId, router]);
  
  return (
    <LandingPage />
  );
}
