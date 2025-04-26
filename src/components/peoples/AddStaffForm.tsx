import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';
import Joyride from 'react-joyride';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import styles from './AddStaffForm.module.css';

export default function AddStaffForm({ onAddStaff }: { onAddStaff: (data: any) => void }) {
  // Generate stable initial values
  const initialEmployeeId = `EMP-${uuidv4().slice(0, 8)}`;
  const initialStartDate = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: '',
    department: '',
    permissions: [],
    employeeId: initialEmployeeId,
    startDate: initialStartDate,
    status: 'Active',
  });

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [runTour, setRunTour] = useState(false);
  const [hasOpenedDropdown, setHasOpenedDropdown] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null);
  const [isMounted, setIsMounted] = useState(false); // Track client-side mounting

  const permissionOptions = [
    'Make Sale',
    'Add Staff Member',
    'Add Products',
    'View-only',
    'Edit Access',
    'Can Delete Records',
    'Admin Rights',
  ];

  const tourSteps = [
    {
      target: '[data-tour="personal"]',
      content: 'Step 1: Enter the staff member’s full name, email, and phone number here.',
    },
    {
      target: '[data-tour="account"]',
      content: 'Step 2: Choose a username and password for their account.',
    },
    {
      target: '[data-tour="role"]',
      content: 'Step 3: Select their role and the department they belong to.',
    },
    {
      target: '[data-tour="permissions-toggle"]',
      content: 'Step 4: Click here to open the permissions list.',
    },
    {
      target: '[data-tour="permissions"]',
      content: 'Step 5: Now choose what actions this staff member is allowed to perform.',
    },
    {
      target: '[data-tour="employment"]',
      content: 'Step 6: Review the employee ID, start date, and status here.',
    },
    {
      target: '[data-tour="submit"]',
      content: 'Final Step: Click this button to save and add the staff member.',
    },
  ];

  // Set mounted state on client-side only
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox' && name === 'permission') {
      setForm((prev) => ({
        ...prev,
        permissions: checked
          ? [...prev.permissions, value]
          : prev.permissions.filter((perm) => perm !== value),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    onAddStaff(form);

    Swal.fire({
      icon: 'success',
      title: 'Staff Added',
      html: `
        <p><strong>You hired</strong> <span style="color:#4f46e5">${form.username || form.fullName}</span></p>
        <p><strong>On:</strong> ${form.startDate}</p>
        <p><strong>As:</strong> ${form.role}</p>
      `,
      confirmButtonColor: '#4f46e5',
    });

    setForm({
      fullName: '',
      email: '',
      phone: '',
      username: '',
      password: '',
      confirmPassword: '',
      role: '',
      department: '',
      permissions: [],
      employeeId: `EMP-${uuidv4().slice(0, 8)}`, // Reset with new value
      startDate: new Date().toISOString().split('T')[0], // Reset with new value
      status: 'Active',
    });
    setDropdownOpen(false);
    setHasOpenedDropdown(false);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      {isMounted && (
        <Joyride
          steps={tourSteps}
          run={runTour}
          continuous
          scrollToFirstStep
          showProgress
          showSkipButton
          styles={{
            options: { zIndex: 10000, primaryColor: '#4f46e5' },
          }}
          callback={(data) => {
            setCurrentStepIndex(data.index);
            if (data.type === 'step:after') {
              if (data.index === 3 && !hasOpenedDropdown) {
                setDropdownOpen(true);
                setHasOpenedDropdown(true);
              }
              if (data.index === 6) {
                setDropdownOpen(false);
              }
            }
          }}
        />
      )}

      <h2 className={styles.formTitle}>Add New Staff Member</h2>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          type="button"
          className={styles.tutorialButton}
          onClick={() => {
            setRunTour(false);
            setTimeout(() => setRunTour(true), 100);
          }}
        >
          <Info size={16} style={{ marginRight: '0.4rem' }} />
          Show Me How To Fill This Form
        </button>
      </div>

      {(currentStepIndex === null || currentStepIndex < 5) && (
        <>
          <h3 className={styles.sectionTitle}>1. Personal Information</h3>
          <div className={styles.inputGroup} data-tour="personal">
            <div className={styles.inputField}>
              <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" required />
            </div>
            <div className={styles.inputField}>
              <input name="email" value={form.email} onChange={handleChange} placeholder="Email Address" required />
            </div>
            <div className={styles.inputField}>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number" required />
            </div>
          </div>

          <h3 className={styles.sectionTitle}>2. Account Information</h3>
          <div className={styles.inputGroup} data-tour="account">
            <div className={styles.inputField}>
              <input name="username" value={form.username} onChange={handleChange} placeholder="Username" />
            </div>
            <div className={styles.inputField}>
              <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Password" required />
            </div>
            <div className={styles.inputField}>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />
            </div>
          </div>

          <h3 className={styles.sectionTitle}>3. Role / Position</h3>
          <div className={styles.inputGroup} data-tour="role">
            <div className={styles.inputField}>
              <select name="role" value={form.role} onChange={handleChange} required>
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Sales">Sales</option>
                <option value="Stock Keeper">Stock Keeper</option>
                <option value="Technician">Technician</option>
                <option value="Support">Support</option>
              </select>
            </div>
            <div className={styles.inputField}>
              <input name="department" value={form.department} onChange={handleChange} placeholder="Department / Team" />
            </div>
          </div>

          <h3 className={styles.sectionTitle}>4. Permissions</h3>
          <div className={styles.dropdownContainer}>
            <div
              className={styles.dropdownToggle}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              data-tour="permissions-toggle"
            >
              {form.permissions.length > 0
                ? `Permissions: ${form.permissions.join(', ')}`
                : 'Select Permissions'}
              {dropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            {dropdownOpen && (
              <div className={styles.dropdownMenu} data-tour="permissions">
                {permissionOptions.map((perm) => (
                  <label key={perm}>
                    <input
                      type="checkbox"
                      name="permission"
                      value={perm}
                      checked={form.permissions.includes(perm)}
                      onChange={handleChange}
                    />
                    {perm}
                  </label>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      <h3 className={styles.sectionTitle}>5. Employment Details</h3>
      <div className={styles.inputGroup} data-tour="employment">
        <div className={styles.inputField}>
          <input name="employeeId" value={form.employeeId} readOnly />
        </div>
        <div className={styles.inputField}>
          <input type="date" name="startDate" value={form.startDate} readOnly />
        </div>
        <div className={styles.inputField}>
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      <button type="submit" className={styles.submitButton} data-tour="submit">
        Add Staff
      </button>
    </form>
  );
}