import React, { useEffect, useState } from 'react';
import { Grid, Card, CardContent, Typography, Avatar, CircularProgress } from '@mui/material';
import { fetchAllExperts } from '../../../../service/expert';
import Navbar from '../../../../layouts/navbar';
import Footer from '../../../../layouts/footer';
import { useNavigate } from 'react-router-dom';

const ListAllExpert = () => {
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const getExperts = async () => {
            try {
                const data = await fetchAllExperts();
                setExperts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getExperts();
    }, []);

    const handleExpertClick = (expertId) => {
        navigate(`/expert/${expertId}`);
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{`Error: ${error}`}</Typography>;
    }

    return (
        <>
            <Navbar />
            <Grid container spacing={2} sx={{ padding: 8, minHeight: 'calc(100vh - 100px)' }}>
                {experts
                    .filter((expert) => expert.status === 'Active') // Lọc chỉ các chuyên gia có status là "Active"
                    .map((expert) => (
                        <Grid item xs={12} sm={6} md={3} key={expert.id}>
                            <Card
                                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 2, cursor: 'pointer' }}
                                onClick={() => handleExpertClick(expert.id)}
                            >
                                {expert.avatar ? (
                                    <Avatar alt={`${expert.firstName} ${expert.lastName}`} src={expert.avatar} sx={{ width: 56, height: 56 }} />
                                ) : (
                                    <Avatar sx={{ width: 56, height: 56 }}>{`${expert.firstName[0]}${expert.lastName[0]}`}</Avatar>
                                )}
                                <Typography variant="body1" sx={{ marginTop: 1 }}>
                                    {`Chuyên gia: ${expert.firstName} ${expert.midName || ''} ${expert.lastName}`}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {`Email: ${expert.email}`}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
            </Grid>
            <Footer />
        </>
    );
};

export default ListAllExpert;
