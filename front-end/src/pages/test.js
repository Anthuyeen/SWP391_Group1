import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Box } from '@mui/material';

const sidebarOptions = [
    { id: 1, label: 'Dashboard', content: 'This is the dashboard' },
    { id: 2, label: 'Users Management', content: 'User management section' },
    { id: 3, label: 'Settings', content: 'Settings panel' },
];

const AdminPage = () => {
    const [selectedContent, setSelectedContent] = useState('Select an option from the sidebar');

    const handleListItemClick = (content) => {
        setSelectedContent(content);
    };

    return ( <
        Box sx = {
            { display: 'flex' } } > { /* Sidebar */ } <
        Drawer variant = "permanent"
        sx = {
            {
                width: 240,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 240,
                    boxSizing: 'border-box',
                },
            }
        } >
        <
        List > {
            sidebarOptions.map((option) => ( <
                ListItem button key = { option.id }
                onClick = {
                    () => handleListItemClick(option.content) } >
                <
                ListItemText primary = { option.label }
                /> <
                /ListItem>
            ))
        } <
        /List> <
        /Drawer>

        { /* Main Content Area */ } <
        Box sx = {
            { flexGrow: 1, p: 3 } } >
        <
        h2 > Content < /h2> <
        p > { selectedContent } < /p> <
        /Box> <
        /Box>
    );
};

export default AdminPage;