// pages/dashboard.tsx
import React from "react";
import Main from "../components/Main";
import ProtectedRoute from "../components/ProtectedRoute";

const DashboardPage: React.FC = () => {
    return (
        <ProtectedRoute requireAdmin>
            <Main />
        </ProtectedRoute>
    );
};

export default DashboardPage;
