import { useState } from 'react'
import { League_Spartan } from "next/font/google";
import type { AppProps } from 'next/app'
// lib
import { AuthProvider } from '@lib/hook/useAuth';
// supabase
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
// layout
import MainLayout from '@layout/MainLayout'
// styles
import 'src/styles/globals.css'

const leagueSpartan = League_Spartan({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())

  return (
    <div className={leagueSpartan.className}>
      <AuthProvider>
        <SessionContextProvider
          supabaseClient={supabaseClient}
          initialSession={pageProps.initialSession}
        >
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </SessionContextProvider>
      </AuthProvider>
    </div>
  )
}
