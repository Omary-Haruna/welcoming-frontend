import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // For decoding the JWT
import { useRouter } from 'next/router';

type AuthCtx = {
    token: string | null;
    role: 'admin' | 'user' | null;
    login: (t: string) => void;
    logout: () => void;
};

export const AuthContext = createContext<AuthCtx>(null!);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [role, setRole] = useState<'admin' | 'user' | null>(null);
    const router = useRouter();

    useEffect(() => {
        const t = localStorage.getItem('token');
        if (t) {
            try {
                const decoded = jwtDecode<{ role: 'admin' | 'user' }>(t);
                setToken(t);
                setRole(decoded.role);
            } catch (error) {
                console.error('Invalid token:', error);
                logout();
            }
        }
    }, []);

    const login = (t: string) => {
        try {
            const decoded = jwtDecode<{ role: 'admin' | 'user' }>(t);
            localStorage.setItem('token', t);
            setToken(t);
            setRole(decoded.role);
            // 🚫 No redirect here anymore — it's handled in index.tsx
        } catch (error) {
            console.error('Invalid token on login:', error);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setRole(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ token, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
