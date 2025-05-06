import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import styles from './ApproveUsers.module.css';

const PERMISSION_OPTIONS = [
    { label: 'Dashboard', value: '/dashboard' },
    { label: 'Customers', value: '/customer/CustomerManagement' },
    { label: 'Accomplishment', value: '/peoples/staff/StaffAccomplishment' },
    { label: 'Add Staff Member', value: '/peoples/staff/AddStaffForm' },
    { label: 'Add Product', value: '/inventory/add-products' },
    { label: 'View Products', value: '/inventory/views-products' },
    { label: 'Low Stocks', value: '/inventory/low-stocks' },
    { label: 'Out of Stocks', value: '/inventory/out-of-stocks' },
    { label: 'Expense', value: '/expenses/expenses' },
    { label: 'Income', value: '/expenses/income' },
    { label: 'New Sale', value: '/sales/new-sale' },
    { label: 'Sales List', value: '/sales/sales-list' },
    { label: 'Pending Carts', value: '/admin/PendingCartsPage' },
    { label: 'Approve Users', value: '/admin/ApproveUsers' },
    { label: 'Settings', value: '/settings' },
];

export default function ApproveUsersPage() {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [selectedPermissions, setSelectedPermissions] = useState({});
    const [showPermissions, setShowPermissions] = useState({});
    const [loading, setLoading] = useState(false);

    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    useEffect(() => {
        if (!token) {
            Swal.fire('Unauthorized', 'You must be logged in as admin.', 'warning');
            return;
        }
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/pending-users`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setPendingUsers(data.users || []);
    };

    const togglePermission = (userId, permission) => {
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

    const toggleShowPermissions = (userId) => {
        setShowPermissions((prev) => ({ ...prev, [userId]: !prev[userId] }));
    };

    const approveUser = async (userId) => {
        const permissions = selectedPermissions[userId] || [];
        if (permissions.length === 0) {
            Swal.fire('Missing Permissions', 'Please select at least one permission before approving.', 'warning');
            return;
        }

        setLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/approve/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ permissions }),
        });
        const data = await res.json();
        setLoading(false);

        if (res.ok) {
            Swal.fire('Approved', data.message, 'success');
            setPendingUsers((prev) => prev.filter(user => user._id !== userId));
            setSelectedPermissions((prev) => {
                const copy = { ...prev };
                delete copy[userId];
                return copy;
            });
        } else {
            Swal.fire('Error', data.error || 'Approval failed', 'error');
        }
    };

    const disapproveUser = async (userId) => {
        const confirm = await Swal.fire({
            title: 'Delete this user?',
            text: 'This cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
        });
        if (!confirm.isConfirmed) return;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/admin/disapprove/${userId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
            Swal.fire('Deleted', data.message, 'success');
            setPendingUsers((prev) => prev.filter(user => user._id !== userId));
        } else {
            Swal.fire('Error', data.error || 'Deletion failed', 'error');
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Pending Users</h2>
            {pendingUsers.length === 0 ? (
                <p className={styles.noUsers}>There are no pending users.</p>
            ) : (
                pendingUsers.map((user, index) => (
                    <div key={user._id} className={styles.userCard}>
                        <h3>{index + 1}. {user.name} ({user.email})</h3>
                        <button onClick={() => toggleShowPermissions(user._id)} className={styles.toggleButton}>
                            {showPermissions[user._id] ? '🔼 Hide Permissions' : '🔽 Show Permissions'}
                        </button>
                        {showPermissions[user._id] && (
                            <div className={styles.permissions}>
                                {PERMISSION_OPTIONS.map((opt) => (
                                    <label key={opt.value}>
                                        <input
                                            type="checkbox"
                                            checked={(selectedPermissions[user._id] || []).includes(opt.value)}
                                            onChange={() => togglePermission(user._id, opt.value)}
                                        /> {opt.label}
                                    </label>
                                ))}
                            </div>
                        )}
                        <div className={styles.buttonRow}>
                            <button onClick={() => approveUser(user._id)} disabled={loading} className={styles.approveButton}>✅ Approve</button>
                            <button onClick={() => disapproveUser(user._id)} disabled={loading} className={styles.disapproveButton}>❌ Disapprove</button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
