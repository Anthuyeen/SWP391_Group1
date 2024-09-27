import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams để lấy id từ URL
import { fetchExpertById } from '../../../../service/expert';
import { Container, Typography, Avatar, Grid, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import Navbar from '../../../../layouts/navbar';
import Footer from '../../../../layouts/footer';
const ExpertDetail = () => {
    const { id } = useParams(); // Lấy id từ URL

    const [expert, setExpert] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadExpert = async () => {
            console.log('Fetching expert with id:', id); // Log id
            try {
                const data = await fetchExpertById(id);
                console.log('Expert data received:', data); // Log dữ liệu nhận được
                setExpert(data);
            } catch (err) {
                console.error('Error fetching expert:', err); // Log lỗi
                setError('Failed to fetch expert details.');
            } finally {
                setLoading(false);
            }
        };

        if (id) { // Chỉ gọi API khi id không phải undefined
            loadExpert();
        } else {
            console.log('No id found in URL'); // Log khi không có id
            setLoading(false); // Đặt loading về false nếu không có id
        }
    }, [id]);


    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (!expert) {
        return <Typography>No expert data found.</Typography>;
    }

    return (
        <>
            <Navbar />
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h4" gutterBottom>Expert Detail</Typography>

                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Avatar
                            alt="Expert Avatar"
                            src={expert.avatar || 'default-avatar.png'}
                            sx={{ width: 100, height: 100 }}
                        />
                    </Grid>
                    <Grid item>
                        <Typography variant="h6">
                            {`${expert.firstName} ${expert.midName} ${expert.lastName}`}
                        </Typography>
                        <Typography variant="body1"><strong>Email:</strong> {expert.email}</Typography>
                        <Typography variant="body1"><strong>Mobile:</strong> {expert.mobile}</Typography>
                        <Typography variant="body1"><strong>Gender:</strong> {expert.gender}</Typography>
                        <Typography variant="body1"><strong>Role:</strong> {expert.role}</Typography>
                        <Typography variant="body1"><strong>Status:</strong> {expert.status}</Typography>
                    </Grid>
                </Grid>

                <Typography variant="h5" gutterBottom>Subjects</Typography>

                {expert.subjects.length > 0 ? (
                    <List>
                        {expert.subjects.map((subject) => (
                            <ListItem key={subject.id}>
                                <ListItemText
                                    primary={subject.name}
                                    secondary={`Status: ${subject.status}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                ) : (
                    <Typography>No subjects available.</Typography>
                )}
            </Container>
            <Footer />
        </>
    );
};

export default ExpertDetail;
