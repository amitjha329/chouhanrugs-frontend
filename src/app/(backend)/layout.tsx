import React from 'react';
import clientPromise from '@/lib/mongodb/clientPromise';
import SiteDataModel from '@/lib/types/SiteDataModel';
import AdminNavigation from '@/ui/backend/NavigationAdmin/AdminNavigation';
import { AdminDataPointsProvider, AdminPageHeadingProvider } from '../providers';
import { getServerSession } from 'next-auth';
import AuthOpts from '@/lib/adapters/AuthOptions';

async function getSiteData(): Promise<SiteDataModel> {
  try {
    const data = await (await clientPromise).db(process.env.MONGODB_DB).collection("site_data").findOne({ data_type: "siteData" })
    return JSON.parse(JSON.stringify(data)) as SiteDataModel
  } catch (error) {
    console.error(error)
    throw new Error(error?.toString())
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteData = await getSiteData()
  const session = await getServerSession(AuthOpts)
  return (
    <AdminDataPointsProvider>
      <AdminPageHeadingProvider>
        <AdminNavigation siteData={siteData} session={session}>
          {children}
        </AdminNavigation>
      </AdminPageHeadingProvider>
    </AdminDataPointsProvider>
  );
}
