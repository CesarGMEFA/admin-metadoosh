import { useState, useEffect, useContext, createContext } from "react";
import { supabase } from "@lib/supabase-browser";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    user: null,
    session: null,
    loading: true,
  });

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setAuthState({
        session: data.session,
        user: data.session?.user ?? null,
        loading: false,
      });
    })()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState({
          session: session,
          user: session?.user ?? null,
          loading: false,
        });
      }
    );

    return () => {
      authListener.subscription.unsubscribe()
    };
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data
  };

  const logOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    authState,
    setAuthState,
    login,
    logOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
