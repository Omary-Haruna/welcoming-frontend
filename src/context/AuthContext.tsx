import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

// Define the user type
type User = {
    name: string;
    email: string;
    role: 'admin' | 'user';
    status: 'pending' | 'active';
};

// Define the AuthContext type
type AuthCtx = {
    token: string | null;
    user: User | null;
    login: (token: string, user: User) => void;
    logout: () => void;
    loading: boolean;
};

// Create the context
export const AuthContext = createContext<AuthCtx>(null!);

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Load data from localStorage on refresh
    useEffect(() => {
        try {
            const savedToken = localStorage.getItem('token');
            const savedUser = localStorage.getItem('user');

            if (savedToken && savedUser) {
                const parsedUser: User = JSON.parse(savedUser);
                setToken(savedToken);
                setUser(parsedUser);
            }
        } catch (err) {
            console.error('❌ Failed to load auth data:', err);
            logout(); // Clear bad data
        } finally {
            setLoading(false);
        }
    }, []);

    // Save token + user after login
    const login = (token: string, user: User) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setToken(token);
        setUser(user);
    };

    // Clear everything on logout
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook to safely use AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used inside AuthProvider');
    return context;
};
