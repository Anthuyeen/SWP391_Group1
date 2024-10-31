import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardContent, CardMedia, Container } from '@mui/material';
import { fetchAllExperts } from '../../../../service/expert'; // Đảm bảo đường dẫn đúng
import { useNavigate } from 'react-router-dom'; // Import useNavigate để điều hướng

// Component hiển thị thông tin chi tiết một chuyên gia
const ExpertCard = ({ expert }) => {
    const navigate = useNavigate(); // Khởi tạo useNavigate

    const handleCardClick = () => {
        navigate(`/expert/${expert.id}`);
    };

    return (
        <Card
            sx={{
                cursor: 'pointer',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: 'none',
                backgroundColor: '#f7f7f7',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }} onClick={handleCardClick} 
        >
            <CardMedia
                component="img"
                image={expert.avatar || 'default_avatar.png'} // Hiển thị avatar mặc định nếu không có
                alt={`${expert.firstName} ${expert.lastName}`}
                sx={{
                    height: 140,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                    <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                        {`${expert.firstName} ${expert.midName || ''} ${expert.lastName}`}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {expert.email} {/* Hiển thị email */}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {expert.mobile} {/* Hiển thị số điện thoại */}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

// Component hiển thị danh sách các chuyên gia
const ExpertDisplay = () => {
    const [experts, setExperts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadExperts = async () => {
            try {
                const data = await fetchAllExperts();
                setExperts(data || []); // Đảm bảo rằng experts luôn là một mảng
            } catch (e) {
                setError('Unable to fetch experts');
            }
            setLoading(false);
        };

        loadExperts();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Danh sách chuyên gia
            </Typography>
            <Grid container spacing={2}>
                {experts
                    .filter(expert => expert.status === 'Active') // Chỉ hiển thị những expert có status là "Active"
                    .slice(0, 4)
                    .map((expert) => (
                        <Grid item key={expert.id} xs={12} sm={6} md={4} lg={3}>
                            <ExpertCard expert={expert} /> {/* Sử dụng ExpertCard cho từng chuyên gia */}
                        </Grid>
                    ))}
            </Grid>
        </Container>
    );
};

export default ExpertDisplay;
