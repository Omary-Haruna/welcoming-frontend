import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useRouter } from 'next/router';

export default function AdminPage() {
    const { user } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!user) return router.push('/login');
        if (user.role !== 'admin') router.push('/dashboard');
    }, [user]);

    if (!user || user.role !== 'admin') return <p>Loading…</p>;

    return (
        <div style={{ padding: 20 }}>
            <h1>Admin Area</h1>
            <p>Only admins can see this.</p>
        </div>
    );
}
