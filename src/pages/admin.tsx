import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function AdminPage() {
    const { token, role, loading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!token) {
                router.push('/login');
            } else if (role !== 'admin') {
                router.push('/dashboard');
            }
        }
    }, [token, role, loading, router]);

    if (loading) {
        return <p>Loading...</p>; // Show loading until AuthContext finishes
    }

    if (!token || role !== 'admin') {
        return null; // Optional: can keep showing nothing after redirect
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>Admin Area</h1>
            <p>Only admins can see this.</p>
        </div>
    );
}
