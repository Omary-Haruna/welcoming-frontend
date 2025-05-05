// src/components/ProtectedRoute.tsx
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function ProtectedRoute({
    children,
    requireAdmin = false,
}: {
    children: React.ReactNode;
    requireAdmin?: boolean;
}) {
    const { token, user, loading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!token) {
                router.push('/'); // Not logged in
            } else if (requireAdmin && user?.role !== 'admin') {
                router.push('/not-authorized'); // Logged in but not admin
            }
        }
    }, [token, user, loading, router, requireAdmin]);

    if (loading || !token || (requireAdmin && user?.role !== 'admin')) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
}
