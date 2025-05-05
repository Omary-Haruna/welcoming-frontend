import { useEffect, useState } from 'react';
import styles from './ApproveUsers.module.css';

const PERMISSION_OPTIONS = [
    'View Products',
    'Make Sales',
    'Manage Inventory',
    'View Reports',
    'Manage Customers',
    'Settings',
];

type User = {
    _id: string;
    name: string;
    email: string;
};

export default function ApproveUsersPage() {
    const [pendingUsers, setPendingUsers] = useState<User[]>([]);
    const [selectedPermissions, setSelectedPermissions] = useState<Record<string, string[]>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token'); // ✅ Get token from localStorage

        if (!token) {
            alert('You must be logged in as admin.');
            return;
        }

        fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/pending-users`, {
            headers: {
                Authorization: `Bearer ${token}`, // ✅ Send token
            },
        })
            .then((res) => {
                if (!res.ok) throw new Error('Not authorized');
                return res.json();
            })
            .then((data) => setPendingUsers(data.users)) // ✅ Set the list of users
            .catch((err) => {
                console.error('Failed to load users:', err);
                alert('❌ Failed to load pending users.');
            });

    }, []);

    const togglePermission = (userId: string, permission: string) => {
        setSelectedPermissions((prev) => {
            const userPerms = prev[userId] || [];
            return {
                ...prev,
                [userId]: userPerms.includes(permission)
                    ? userPerms.filter((p) => p !== permission)
                    : [...userPerms, permission],
            };
        });
    };

    const approveUser = async (userId: string) => {
        const token = localStorage.getItem('token'); // ✅ Reuse token here
        if (!token) return alert('You must be logged in');

        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/approve/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    permissions: selectedPermissions[userId] || [],
                }),
            });


            const data = await res.json();
            alert(data.message);
            setPendingUsers((users) => users.filter((u) => u._id !== userId));
        } catch (err) {
            console.error(err);
            alert('Error approving user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Pending Users</h2>

            {pendingUsers.length === 0 ? (
                <p>No users pending approval.</p>
            ) : (
                pendingUsers.map((user) => (
                    <div key={user._id} className={styles.userCard}>
                        <h3>
                            {user.name} ({user.email})
                        </h3>
                        <p>Select permissions:</p>
                        <div className={styles.permissions}>
                            {PERMISSION_OPTIONS.map((option) => (
                                <label key={option}>
                                    <input
                                        type="checkbox"
                                        checked={(selectedPermissions[user._id] || []).includes(option)}
                                        onChange={() => togglePermission(user._id, option)}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                        <button
                            className={styles.button}
                            onClick={() => approveUser(user._id)}
                            disabled={loading}
                        >
                            ✅ Approve
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}
