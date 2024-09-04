import '@/styles/globals.scss';
import React from 'react';
import { NextSessionProider } from './providers';
import getSiteData from '@/lib/actions/getSiteData';
import { Metadata } from 'next';
import getThemeData from '@/lib/actions/getThemeData';
import getAnalyticsData from '@/lib/actions/getAnalyticsData';
import WebVitals from '@/Meterics/WebVitals';
import NextTopLoader from "nextjs-toploader";



export async function generateMetadata(): Promise<Metadata> {
  const data = await getSiteData()
  return {
    metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
    icons: data.logoSrc,
    authors: {
      name: "Chouhan Rugs",
      url: "https://www.chouhanrugs.com"
    }
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [themeData, googleTagData] = await Promise.all([getThemeData(), getAnalyticsData("GTM")])
  return (
    <html lang='en' data-theme={themeData.theme}>
      <head>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${googleTagData.code}`}></script>

        <script dangerouslySetInnerHTML={{
          __html: `window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${googleTagData.code}');`
        }}>
        </script>
      </head>
      <body className="overflow-y-scroll">
        <div className="notification-box flex flex-col items-center justify-start fixed w-screen h-screen z-50 p-3 pt-24 pointer-events-none">
          <div className="bg-red-500 hidden" />
          <div className="bg-yellow-500 hidden" />
          <div className="bg-blue-500 hidden" />
          <div className="bg-green-500 hidden" />
          {/* Notification container */}
        </div>
        <NextTopLoader speed={500} color='#954a2b' />
        <NextSessionProider>
          {children}
        </NextSessionProider>
        <WebVitals />
      </body>
    </html>
  );
}
