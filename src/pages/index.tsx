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
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('');

    const { login } = useContext(AuthContext);
    const router = useRouter();

    const showError = (title: string, message: string) => {
        return Swal.fire({
            icon: 'error',
            title,
            text: message,
            customClass: {
                popup: styles.swalPopup,
                title: styles.swalTitle,
                htmlContainer: styles.swalContent,
                confirmButton: styles.swalButton,
            },
        });
    };

    const showSuccess = (title: string, message: string) => {
        return Swal.fire({
            icon: 'success',
            title,
            text: message,
            customClass: {
                popup: styles.swalPopup,
                title: styles.swalTitle,
                htmlContainer: styles.swalContent,
                confirmButton: styles.swalButton,
            },
        });
    };

    const checkPasswordStrength = (pass: string) => {
        if (pass.length < 6) return 'Weak';
        const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        const medium = /^(?=.*[a-z])(?=.*\d).{6,}$/;
        if (strong.test(pass)) return 'Strong';
        if (medium.test(pass)) return 'Medium';
        return 'Weak';
    };

    const isStrongPassword = (pass: string) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(pass);

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();

        if (name.trim().length < 3) return showError('Invalid Name', 'Name must be at least 3 characters.');
        if (!email.includes('@') || !email.includes('.')) return showError('Invalid Email', 'Please enter a valid email address.');
        if (!isStrongPassword(password)) {
            return showError(
                'Weak Password',
                'Password must be at least 6 characters and include uppercase, lowercase, and a number.'
            );
        }
        if (password !== confirmPassword) return showError('Password Mismatch', 'Passwords do not match.');

        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                const message = data?.status === 'pending'
                    ? 'Account created. Please wait for admin approval.'
                    : 'Registered successfully! You can now log in.';
                await showSuccess('Success', message);
                setIsLogin(true);
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            } else {
                await showError('Registration Failed', data?.error || 'Something went wrong.');
            }
        } catch (err) {
            console.error(err);
            await showError('Network Error', 'Check your internet or backend server.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                const { token, user } = data;
                login(token, user);
                await showSuccess('Login Successful!', `Welcome back ${user?.name?.split(' ')[0] || 'User'}!`);
                router.push('/dashboard');
            } else {
                await showError('Login Failed', data?.error || 'Invalid credentials');
            }
        } catch (err) {
            console.error('Login error:', err);
            await showError('Network Error', 'Check your internet or backend server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Welcome to My App</h1>

            <div className={styles.tabButtons}>
                <button
                    onClick={() => setIsLogin(false)}
                    className={`${styles.tabButton} ${!isLogin ? styles.active : ''}`}
                    disabled={loading}
                >
                    Register
                </button>
                <button
                    onClick={() => setIsLogin(true)}
                    className={`${styles.tabButton} ${isLogin ? styles.active : ''}`}
                    disabled={loading}
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
                        autoComplete="current-password"
                    />
                    <button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? '⏳ Logging in...' : 'Log In'}
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
                        autoComplete="email"
                    />

                    {/* Password Field */}
                    <div className={styles.passwordContainer}>
                        <input
                            type={passwordVisible ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setPasswordStrength(checkPasswordStrength(e.target.value));
                            }}
                            required
                            className={styles.input}
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            className={styles.showHideBtn}
                            onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                            {passwordVisible ? '🙈 Hide' : '👁 Show'}
                        </button>

                        {/* Password Strength Feedback */}
                        {password && (
                            <>
                                <div className={styles.progressBarContainer}>
                                    <div
                                        className={`${styles.progressBar} ${passwordStrength === 'Strong' ? styles.strongBar :
                                                passwordStrength === 'Medium' ? styles.mediumBar :
                                                    styles.weakBar
                                            }`}
                                        style={{
                                            width: passwordStrength === 'Strong' ? '100%' : passwordStrength === 'Medium' ? '66%' : '33%',
                                        }}
                                    />
                                </div>
                                <p
                                    className={
                                        passwordStrength === 'Strong' ? styles.strong :
                                            passwordStrength === 'Medium' ? styles.medium :
                                                styles.weak
                                    }
                                >
                                    {passwordStrength} Password
                                </p>
                            </>
                        )}

                        {/* Password Hint */}
                        <p className={styles.passwordHint}>
                            A strong password has at least 6 characters, including an uppercase letter, a lowercase letter, and a number.
                        </p>
                    </div>

                    {/* Confirm Password */}
                    <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className={styles.input}
                        autoComplete="new-password"
                    />
                    <button type="submit" className={styles.submitButton} disabled={loading}>
                        {loading ? '⏳ Signing up...' : 'Sign Up'}
                    </button>
                </form>
            )}
        </div>
    );
};

HomePage.getLayout = (page: React.ReactNode) => page;
export default HomePage;
