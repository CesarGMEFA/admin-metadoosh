import { useState, useRef, FormEvent, useEffect } from 'react';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from 'next';
import Image from 'next/image'
import { useRouter } from 'next/router';
import { LockClosedIcon } from '@heroicons/react/24/solid';
// lib
import { useAuth } from '@lib/hook/useAuth';
// supabasse
import { supabase } from '@lib/supabase-browser';
//  component
import SpinLoader from '@components/common/SpinLoader';
// logo
import logoGiftcard from '@assets/logo-giftcard_black.png'

export default function LoginPage() {
  const { authState, setAuthState } = useAuth()
  const [errorLogin, setErrorLogin] = useState(null);
  const [loading, setLoading] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const router = useRouter();
  // e:FormEvent<HTMLFormElement>
  const submitHandler = async (e) => {
    e.preventDefault();
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    try {
      setErrorLogin(null);
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw new Error(error.message);
      if (data) {
        setAuthState({
          ...authState,
          user: data.user,
          session: data.session
        })
        router.push('/dashboard/products')
      }
    } catch (e) {
      console.error('Error in login => ', e)
    } finally {
      setLoading(false)
    }
    // auth
    // .signIn(email, password)
    //   .then(() => router.push('/dashboard'))
    //   .catch(function (error) {
    //     if (error.response.status === 401) {
    //       setErrorLogin('Usuario o password incorrecto.');
    //     } else if (error.request) {
    //       setErrorLogin('Tenemos unproblema');
    //     } else {
    //       setErrorLogin('Algo salió mal.');
    //     }
    //     setLoading(false);
    //   });
  };

  {
    errorLogin && (
      <div className="p-3 mb-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
        <span className="font-medium">Error!</span> {errorLogin}
      </div>
    );
  }

  return (
    <>
      <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <Image className="mx-auto h-12 w-auto" src={logoGiftcard} alt="logo of MetaDoosh" />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={submitHandler}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md sm:text-sm
                  focus:outline-none focus:ring-black focus:border-black focus:z-10"
                  placeholder="Email address"
                  ref={emailRef}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md
                  focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                  placeholder="Password"
                  ref={passwordRef}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              {/* <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div> */}

              {/* <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot your password?
                </a>
              </div> */}
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-doosh focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LockClosedIcon className="h-5 w-5 text-white group-hover:text-white" aria-hidden="true" />
                </span>
                {!loading && 'Sign in'}
                {loading && <SpinLoader />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
// ctx: GetServerSidePropsContext | { req: NextApiRequest; res: NextApiResponse; }
export async function getServerSideProps(ctx) {
	const serverSupabase = createServerSupabaseClient(ctx)

	const {
    data: { session }
  } = await serverSupabase.auth.getSession()

	if (session) {
    return {
      redirect: {
        destination: '/dashboard/products',
        permanent: false,
      },
    }
  }

  return {
    props: {
			nothing: 'n/a'
		}
  }
}