import localFont from "next/font/local";
import "./globals.css";
import React from "react";
import Head from "next/head";
import { ToastContainer } from "react-toastify";
import ReduxProvider from "@/providers/reduxProvider";
import DatePickerProvider from "@/providers/datePickerProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Verxio Protocol",
  description: "Ads creator for web3 developers and brands",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <DatePickerProvider>
          <ReduxProvider>{children}</ReduxProvider>
          <ToastContainer />
        </DatePickerProvider>
      </body>
    </html>
  );
}
