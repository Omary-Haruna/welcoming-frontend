// pages/_app.tsx
import Head from "next/head";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Poppins } from "next/font/google";

import Layout from "../components/Layout";
import Loader from "../components/Loader";
import ProtectedRoute from "../components/ProtectedRoute";

import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";
import { SalesProvider } from "../context/SalesContext";
import { ThemeProvider } from "@/components/theme-provider";
import { MantineProvider } from "@mantine/core";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["300", "400", "600"],
    display: "swap",
});

// Define your public routes (e.g. login page only)
const PUBLIC_PATHS = ["/"];

export default function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleStart = () => setLoading(true);
        const handleStop = () => setLoading(false);

        router.events.on("routeChangeStart", handleStart);
        router.events.on("routeChangeComplete", handleStop);
        router.events.on("routeChangeError", handleStop);

        return () => {
            router.events.off("routeChangeStart", handleStart);
            router.events.off("routeChangeComplete", handleStop);
            router.events.off("routeChangeError", handleStop);
        };
    }, [router.events]);

    const getLayout =
        (Component as any).getLayout || ((page: React.ReactNode) => <Layout>{page}</Layout>);

    const isPublicRoute = PUBLIC_PATHS.includes(router.pathname);

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>

            <AuthProvider>
                <CartProvider>
                    <SalesProvider>
                        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
                            <MantineProvider withGlobalStyles withNormalizeCSS>
                                <style jsx global>{`
                  :root {
                    --font-poppins: ${poppins.style.fontFamily};
                  }
                `}</style>

                                <main className={poppins.className}>
                                    <ToastContainer position="top-right" autoClose={3000} />
                                    {loading && <Loader />}

                                    {/* Use ProtectedRoute only for protected paths */}
                                    {isPublicRoute ? (
                                        getLayout(<Component {...pageProps} />)
                                    ) : (
                                        <ProtectedRoute>
                                            {getLayout(<Component {...pageProps} />)}
                                        </ProtectedRoute>
                                    )}
                                </main>
                            </MantineProvider>
                        </ThemeProvider>
                    </SalesProvider>
                </CartProvider>
            </AuthProvider>
        </>
    );
}
