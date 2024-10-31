import React, { useState, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemText, Box, Button } from '@mui/material';
import { useNavigate, Outlet, useLocation, Link } from 'react-router-dom';
import { fetchUserById } from '../../../service/profile-manage'; // Cập nhật đường dẫn

const sidebarOptions = [
    { id: 1, label: 'Approve subject', path: '/moderator/home/approve-subject' },
    { id: 2, label: 'Approve Lesson', path: '/moderator/home/approve-lesson' },
];

const AdminPage = () => {
    const [selectedContent, setSelectedContent] = useState('Select an option from the sidebar');
    const location = useLocation();
    const navigate = useNavigate();
    const [userName, setUserName] = useState(`Hi ${localStorage.getItem('name')}`);
    const userId = localStorage.getItem("id");
    const [user, setUser] = useState(null);

    const handleListItemClick = (path) => {
        navigate(path); // Điều hướng đến URL
    };
    useEffect(() => {
        const getUserData = async () => {
            try {
                console.log("Fetching user with ID:", userId);
                const data = await fetchUserById(userId);
                console.log("User data received:", data);
                setUser(data);
            } catch (err) {
            } finally {
            }
        };

        if (userId) {
            getUserData();
        } else {

        }
    }, [userId]);
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
                    <ListItem button component={Link} to="/moderator/home/user-profile">
                        <ListItemText primary={user ? `${user.firstName} ${user.midName} ${user.lastName}` : 'No Name'} />
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


