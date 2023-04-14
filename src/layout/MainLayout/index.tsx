import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// lib
import { useAuth } from '@lib/hook/useAuth';
// components
import Header from '@components/Header';
import BreadPath from '@components/common/BreadPath';
import { supabase } from '@lib/supabase-browser';

export default function MainLayout({ children }: any) {
  const { authState }: any = useAuth();


  return (
    <>
      <div className="min-h-full">
        {authState.user && (
          <>
            <Header />
            <BreadPath />
          </>
        )}
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
      {/* <div className="min-h-full">
        {auth.user && (
          <Header />
          )}
          <Header />
        <Nav />
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div> */}
    </>
  );
}