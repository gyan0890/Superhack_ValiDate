import React from "react";
import AuthKitDemo from "../components/AuthKitDemo";

export default function Home() {
  return (
    <div className="relative isolate pt-14">
      <div className="flex flex-col-reverse mx-auto max-w-7xl px-6 py-18 sm:py-24 md:flex-row lg:items-center lg:gap-x-10 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto items-center">
          <h1 className="mt-8 max-w-lg text-2xl font-krona tracking-tight text-gray-900 sm:text-4xl">
          Start Chatting
          </h1>
          <p className="mt-6 mb-4 text-lg leading-8 text-gray-600">
          Validate, Where trust meets romance
          Connect your, validate your profile, and embark on a journey of speed dating.
          Rediscover classic, blind romance as you step into a world of authentic connections.
          </p>
          <AuthKitDemo />
        </div>
        <div className="mt-8 mx-auto max-w-xl sm:mt-24 lg:mt-0  lg:flex-shrink-0 lg:flex-grow">
          <img
          src="landing.png" 
          alt="" />
        </div>
    </div>
  </div>
  );
}