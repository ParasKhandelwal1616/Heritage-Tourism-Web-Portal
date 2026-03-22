import React from 'react';
import { getDashboardStats } from '@/app/actions/site';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <DashboardClient stats={stats} />
  );
}
