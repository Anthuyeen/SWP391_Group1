import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Employee from './employee_manage'; // Import màn hình Employee

const sidebarOptions = [
    { id: 4, label: 'Expert Manager', content: <Employee /> }, // Thêm mục Expert Manager
];

const AdminPage = () => {
    const [selectedContent, setSelectedContent] = useState('Select an option from the sidebar');
    const navigate = useNavigate();

    const handleListItemClick = (content) => {
        setSelectedContent(content);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationTime');
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
                            backgroundColor: '#e69500',
                        },
                    }}
                >
                    Logout
                </Button>
            </Drawer>

            {/* Main Content Area */}
            <Box sx={{ flexGrow: 1, p: 3 }}>
                {typeof selectedContent === 'string' ? <p>{selectedContent}</p> : selectedContent}
            </Box>
        </Box>
    );
};

export default AdminPage;



