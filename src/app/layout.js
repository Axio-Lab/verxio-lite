import localFont from "next/font/local";
import "./globals.css";
import React from "react";
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
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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
