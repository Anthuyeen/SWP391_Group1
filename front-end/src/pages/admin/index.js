// AdminDash.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Dashboard from './component/dashboard'; 

function AdminDash() {
    return (
        <div style={{ display: 'flex' }}>
            <Dashboard />
            <div style={{ width: '100%', padding: '20px' }}>
                <Outlet />
            </div>
        </div>
    );
}

export default AdminDash;
