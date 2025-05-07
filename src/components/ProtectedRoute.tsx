// src/components/ProtectedRoute.tsx
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
    requiredPermission?: string;
}

export default function ProtectedRoute({
    children,
    requireAdmin = false,
    requiredPermission,
}: ProtectedRouteProps) {
    const { token, user, loading } = useContext(AuthContext);
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        if (!loading) {
            if (!token || !user) {
                router.push('/'); // Not logged in
                return;
            }

            if (requireAdmin && user.role !== 'admin') {
                router.push('/not-authorized'); // Admin only
                return;
            }

            if (requiredPermission && !user.permissions?.includes(requiredPermission)) {
                router.push('/not-authorized'); // Permission denied
                return;
            }

            if (user.status !== 'active') {
                router.push('/pending-approval'); // Still waiting
                return;
            }

            setAuthorized(true); // All checks passed
        }
    }, [token, user, loading, router, requireAdmin, requiredPermission]);

    if (!authorized || loading) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
}
