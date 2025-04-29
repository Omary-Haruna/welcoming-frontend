import { API_BASE_URL } from '../config';
import { useState, FormEvent, useContext } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '../context/AuthContext';
import Swal from 'sweetalert2';
import styles from './HomePage.module.css';

const HomePage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false); // 👈 loading state for login

    const { login } = useContext(AuthContext);
    const router = useRouter();

    /* ───────── REGISTER ───────── */
    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            await Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Passwords do not match 🙅‍♂️',
                customClass: {
                    popup: styles.swalPopup,
                    title: styles.swalTitle,
                    htmlContainer: styles.swalContent,
                    confirmButton: styles.swalButton,
                },
                showClass: { popup: 'animate__animated animate__fadeInDown' },
                hideClass: { popup: 'animate__animated animate__fadeOutUp' },
            });
            return;
        }

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            if (res.ok) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Registered successfully! Please log in.',
                    customClass: {
                        popup: styles.swalPopup,
                        title: styles.swalTitle,
                        htmlContainer: styles.swalContent,
                        confirmButton: styles.swalButton,
                    },
                    showClass: { popup: 'animate__animated animate__fadeInDown' },
                    hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                });
                setIsLogin(true);
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            } else {
                const { error } = await res.json();
                await Swal.fire({
                    icon: 'error',
                    title: 'Registration Failed',
                    text: `Error: ${error}`,
                    customClass: {
                        popup: styles.swalPopup,
                        title: styles.swalTitle,
                        htmlContainer: styles.swalContent,
                        confirmButton: styles.swalButton,
                    },
                    showClass: { popup: 'animate__animated animate__fadeInDown' },
                    hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                });
            }
        } catch (err) {
            console.error(err);
            await Swal.fire({
                icon: 'error',
                title: 'Network Error',
                text: 'Make sure your backend is running.',
                customClass: {
                    popup: styles.swalPopup,
                    title: styles.swalTitle,
                    htmlContainer: styles.swalContent,
                    confirmButton: styles.swalButton,
                },
                showClass: { popup: 'animate__animated animate__fadeInDown' },
                hideClass: { popup: 'animate__animated animate__fadeOutUp' },
            });
        }
    };

    /* ───────── LOGIN ───────── */
    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true); // 👈 start loading

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                const { token, user } = await res.json();
                login(token);

                router.push({
                    pathname: '/dashboard',
                    query: { justLoggedIn: 'true', name: user.name },
                });
            } else {
                const { error } = await res.json();
                await Swal.fire({
                    icon: 'error',
                    title: 'Login Failed',
                    text: `Error: ${error}`,
                    customClass: {
                        popup: styles.swalPopup,
                        title: styles.swalTitle,
                        htmlContainer: styles.swalContent,
                        confirmButton: styles.swalButton,
                    },
                    showClass: { popup: 'animate__animated animate__fadeInDown' },
                    hideClass: { popup: 'animate__animated animate__fadeOutUp' },
                });
            }
        } catch (err) {
            console.error('🔴 Network error in handleLogin:', err);
            await Swal.fire({
                icon: 'error',
                title: 'Network Error',
                text: 'Make sure your backend is running.',
                customClass: {
                    popup: styles.swalPopup,
                    title: styles.swalTitle,
                    htmlContainer: styles.swalContent,
                    confirmButton: styles.swalButton,
                },
                showClass: { popup: 'animate__animated animate__fadeInDown' },
                hideClass: { popup: 'animate__animated animate__fadeOutUp' },
            });
        } finally {
            setLoading(false); // 👈 stop loading
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Welcome to My App</h1>

            <div className={styles.tabButtons}>
                <button
                    onClick={() => setIsLogin(false)}
                    className={`${styles.tabButton} ${!isLogin ? styles.active : ''}`}
                >
                    Register
                </button>
                <button
                    onClick={() => setIsLogin(true)}
                    className={`${styles.tabButton} ${isLogin ? styles.active : ''}`}
                >
                    Login
                </button>
            </div>

            {isLogin ? (
                <form onSubmit={handleLogin} className={styles.form}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                    <button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? "Logging in..." : "Log In"}
                    </button>
                </form>
            ) : (
                <form onSubmit={handleRegister} className={styles.form}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className={styles.input}
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className={styles.input}
                    />
                    <button type="submit" className={styles.submitButton}>
                        Sign Up
                    </button>
                </form>
            )}
        </div>
    );
};

HomePage.getLayout = (page: React.ReactNode) => page;
export default HomePage;
