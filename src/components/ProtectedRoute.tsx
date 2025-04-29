// src/components/ProtectedRoute.tsx
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { token, loading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!loading && !token) {
            router.push('/');
        }
    }, [token, loading, router]);

    if (loading) {
        // You can show a loading spinner or nothing
        return <div>Loading...</div>;
    }

    return <>{children}</>;
}
