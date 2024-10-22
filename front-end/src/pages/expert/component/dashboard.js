import React, { useState, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemText, Box, Button } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';

const sidebarOptions = [
    { id: 4, label: 'Subject Manager', path: '/Expert/Home/subject-manage' },
    { label: 'Lesson Manager', path: '/Expert/Home/lesson-manage' },
    { label: 'Quiz Manager', path: '/Expert/Home/quiz-manage' },


];

const ExpertPage = () => {
    const [userName, setUserName] = useState(`Hi ${localStorage.getItem('name')}`); // Tạo state để lưu tên người dùng
    const navigate = useNavigate();

    useEffect(() => {
        const name = localStorage.getItem('name');
        if (name) {
            setUserName(`Hi ${name}`); // Cập nhật state khi component được mount
        }
    }, []); // Chỉ chạy một lần khi component được mount

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
                    {/* Cập nhật tên người dùng trong sidebarOptions */}
                    <ListItem button component={Link} to="/Expert/Home/user-profile">
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

export default ExpertPage;
