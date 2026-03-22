import React from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { Header } from '../components/layout/Header';
import { Outlet } from 'react-router-dom';


export const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex flex-1 flex-col ml-64">
        <Header />

        <main className="flex-1 p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};