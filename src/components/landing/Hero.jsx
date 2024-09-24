"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/Button";

export default function Hero() {
  const [animatedText, setAnimatedText] = useState("");
  const fullTexts = [
    "ads creator for web3 developers and brands.",
    "incentivize users with token, merch, and more.",
  ];
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    let i = 0;
    let isDeleting = false;
    const typingEffect = setInterval(() => {
      const currentText = fullTexts[textIndex];
      if (!isDeleting && i < currentText.length) {
        setAnimatedText(currentText.substring(0, i + 1));
        i++;
      } else if (isDeleting && i > 0) {
        setAnimatedText(currentText.substring(0, i - 1));
        i--;
      } else {
        isDeleting = !isDeleting;
        if (!isDeleting) {
          setTextIndex((prevIndex) => (prevIndex + 1) % fullTexts.length);
          i = 0;
        }
      }
    }, 100);

    return () => clearInterval(typingEffect);
  }, [textIndex]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="galaxy-bg"></div>
      </div>
      <div className="z-10 text-center max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Verxio Protocol
          </span>
        </h1>
        <h2 className="text-2xl md:text-4xl font-bold mb-8 h-24">
          {animatedText}
          <span className="animate-blink">|</span>
        </h2>
        <p className="text-xl mb-12 text-gray-300">
          Automatically run viral sweepstakes, raffles, giveaways,{" "}
          <br className="hidden md:inline" />
          and loyalty schemes, offering rewards.
        </p>
        <div className="flex justify-center space-x-4">
          <Button
            href="https://documenter.getpostman.com/view/22416364/2sA3kaCeiH"
            name="Read Docs"
            className="text-lg font-bold px-8 py-3 bg-white text-blue-600 hover:bg-gray-100"
          />
          {/* <Button
            href="https://documenter.getpostman.com/view/22416364/2sA3kaCeiH"
            name="Read Docs"
            shade={"bg-[#00ADEF]"}
            className="text-lg font-bold px-8 py-3 bg-transparent border border-red-500 text-white hover:bg-gray-100"
          /> */}
          <Button
            href="/dashboard/explore"
            name="Launch App"
            className="text-lg font-bold px-8 py-3"
          />
        </div>
      </div>
    </section>
  );
}
