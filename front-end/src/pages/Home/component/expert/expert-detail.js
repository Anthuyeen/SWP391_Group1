import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchExpertById } from '../../../../service/expert';
import { fetchSubjectsByOwner } from '../../../../service/subject'; // Import hàm fetchSubjectsByOwner
import { Container, Typography, Avatar, Grid, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material';
import Navbar from '../../../../layouts/navbar';
import Footer from '../../../../layouts/footer';

const ExpertDetail = () => {
    const { id } = useParams();

    const [expert, setExpert] = useState(null);
    const [subjects, setSubjects] = useState([]); // Trạng thái cho subjects
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadExpert = async () => {
            console.log('Fetching expert with id:', id);
            try {
                const data = await fetchExpertById(id);
                console.log('Expert data received:', data);
                setExpert(data);

                // Gọi fetchSubjectsByOwner sau khi nhận được dữ liệu expert
                const subjectsData = await fetchSubjectsByOwner(data.id); // Giả sử `data.id` là ownerId
                setSubjects(subjectsData);
            } catch (err) {
                console.error('Error fetching expert:', err);
                setError('Failed to fetch expert details.');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadExpert();
        } else {
            console.log('No id found in URL');
            setLoading(false);
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
            <Container maxWidth="md" sx={{ mt: 4, minHeight: 'calc(100vh - 100px)' }}>
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

                {subjects.length > 0 ? ( // Thay expert.subjects thành subjects
                    <List>
                        {subjects.map((subject) => (
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
