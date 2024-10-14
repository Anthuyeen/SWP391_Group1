import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Box, Button } from '@mui/material';
import { useNavigate, Outlet, useLocation, Link } from 'react-router-dom';

const sidebarOptions = [
    { id: 5, label: 'Expert Manager', path: '/admin/home/employee-profile' },
];

const AdminPage = () => {
    const [selectedContent, setSelectedContent] = useState('Select an option from the sidebar');
    const location = useLocation();
    const navigate = useNavigate();
    const [userName, setUserName] = useState(`Hi ${localStorage.getItem('name')}`);
    const handleListItemClick = (path) => {
        navigate(path); // Điều hướng đến URL
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
        localStorage.clear();
        navigate('/');
    };

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Sidebar */}
            <Drawer
                variant="permanent"
                sx={{
                    width: 240,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 240,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <List>
                <ListItem button component={Link} to="/admin/home/user-profile">
                        <ListItemText primary={userName} /> {/* Sử dụng state userName */}
                    </ListItem>
                    {sidebarOptions.map((option) => (
                        <ListItem button key={option.id} onClick={() => handleListItemClick(option.path)}>
                            <ListItemText primary={option.label} />
                        </ListItem>
                    ))}
                </List>
                <Button
                    onClick={handleLogout}
                    sx={{
                        backgroundColor: '#ff5722',
                        color: 'white',
                        borderRadius: '20px',
                        padding: '10px 20px',
                        margin: '20px',
                        '&:hover': {
                            backgroundColor: '#e69500',
                        },
                    }}
                >
                    Logout
                </Button>
            </Drawer>
        </Box>
    );
};

export default AdminPage;


