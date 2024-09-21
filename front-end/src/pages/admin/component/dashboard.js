import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const sidebarOptions = [
    { id: 1, label: 'Dashboard', content: 'This is the dashboard' },
    { id: 2, label: 'Users Management', content: 'User management section' },
    { id: 3, label: 'Settings', content: 'Settings panel' },
];

const AdminPage = () => {
    const [selectedContent, setSelectedContent] = useState('Select an option from the sidebar');
    const navigate = useNavigate(); // Sử dụng hook điều hướng

    const handleListItemClick = (content) => {
        setSelectedContent(content);
    };

    const handleLogout = () => {
        // Xóa token khỏi localStorage hoặc dữ liệu đăng nhập khác
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime')
        // Điều hướng về trang chủ
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
                    {sidebarOptions.map((option) => (
                        <ListItem button key={option.id} onClick={() => handleListItemClick(option.content)}>
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
                            backgroundColor: '#e69500', // Màu cam đậm hơn khi hover
                        },
                    }}
                >
                    Logout
                </Button>
            </Drawer>

            {/* Main Content Area */}
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <h2>Content</h2>
                <p>{selectedContent}</p>
            </Box>
        </Box>
    );
};

export default AdminPage;
