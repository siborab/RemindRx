"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell, Camera, Clock, CheckCircle2 } from "lucide-react";

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-purple-50 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-8 text-center">
            <div className="space-y-4 max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                Never Miss a Medication Again
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Stay on top of your health with RemindRx. We make managing your medications simple, 
                safe, and stress-free with reminders and prescription tracking.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 min-[400px]:flex-row">
              <Link href="/signup">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  Get Started
                </Button>
              </Link>
              <Link href="/signin">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-sm border">
              <Camera className="h-12 w-12 text-purple-600" />
              <h3 className="text-xl font-bold">Prescription Scanning</h3>
              <p className="text-center text-gray-500">
                Simply scan your prescription labels with your phone's camera. Our smart system will do the rest.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-sm border">
              <Clock className="h-12 w-12 text-purple-600" />
              <h3 className="text-xl font-bold">Smart Scheduling</h3>
              <p className="text-center text-gray-500">
                Get personalized recommendations for the best times to take your medications.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-sm border">
              <Bell className="h-12 w-12 text-purple-600" />
              <h3 className="text-xl font-bold">SMS Reminders</h3>
              <p className="text-center text-gray-500">
                Never forget a dose with timely SMS notifications when it's time to take your medication.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center space-y-8 text-center">
            <div className="space-y-2 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                Why Choose RemindRx?
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg">
                Designed with input from healthcare professionals and built with advanced technology 
                to ensure you stay healthy and on track.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto w-full justify-center">
              <div className="flex items-center space-x-4 justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                <span>Easy to use interface</span>
              </div>
              <div className="flex items-center space-x-4 justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                <span>Privacy focused</span>
              </div>
              <div className="flex items-center space-x-4 justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                <span>24/7 reminder system</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 bg-purple-600">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6 text-center text-white max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Ready to Take Control of Your Health?
            </h2>
            <p className="mx-auto max-w-[600px] text-purple-100 md:text-lg">
              Join thousands of users who trust RemindRx to manage their medications effectively.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-purple-50">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}