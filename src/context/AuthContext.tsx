import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/router';

// Define the type for your AuthContext
type AuthCtx = {
    token: string | null;
    role: 'admin' | 'user' | null;
    login: (t: string) => void;
    logout: () => void;
    loading: boolean;
};

// Create the actual context
export const AuthContext = createContext<AuthCtx>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<'admin' | 'user' | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const savedToken = localStorage.getItem('token');
        if (savedToken) {
            try {
                const decoded = jwtDecode<{ role: 'admin' | 'user' }>(savedToken);
                setToken(savedToken);
                setRole(decoded.role);
            } catch (error) {
                console.error('Invalid token:', error);
                // ✅ Just clear locally, do not logout
                localStorage.removeItem('token');
                setToken(null);
                setRole(null);
            }
        }
        setLoading(false);
    }, [router]);

    const login = (newToken: string) => {
        try {
            const decoded = jwtDecode<{ role: 'admin' | 'user' }>(newToken);
            localStorage.setItem('token', newToken);
            setToken(newToken);
            setRole(decoded.role);
        } catch (error) {
            console.error('Invalid token on login:', error);
            logout();
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setRole(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ token, role, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
