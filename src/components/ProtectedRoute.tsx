// src/components/ProtectedRoute.tsx
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';
import Loader from './Loader';

const PUBLIC_ROUTES = ['/'];

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { token, loadingUser } = useContext(AuthContext);
    const router = useRouter();
    const isPublic = PUBLIC_ROUTES.includes(router.pathname);

    useEffect(() => {
        if (!loadingUser && !token && !isPublic) {
            router.replace('/');
        }
    }, [loadingUser, token, isPublic, router]);

    if (loadingUser) return <Loader />;
    if (!token && !isPublic) return null;

    return <>{children}</>;
}
