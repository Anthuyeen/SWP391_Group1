import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, Card, CardContent, CardMedia, Container } from '@mui/material';
import { fetchAllPosts } from '../../../../service/post'; // Đảm bảo đường dẫn đúng
import { useNavigate } from 'react-router-dom';

// Component hiển thị thông tin chi tiết một bài viết
const PostCard = ({ post }) => {
    const navigate = useNavigate(); // Khởi tạo useNavigate

    const handleClick = () => {
        navigate(`/post/${post.id}`); // Điều hướng đến trang chi tiết
    };

    return (
        <Card
            onClick={handleClick} // Thêm sự kiện click
            sx={{
                cursor: 'pointer',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: 'none',
                backgroundColor: '#f7f7f7',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
            }}
        >
            <CardMedia
                component="img"
                image={post.images.$values.length > 0 ? post.images.$values[0].url : 'default_image.jpg'}
                alt={post.title}
                sx={{
                    height: 140,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Box>
                    <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
                        {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {post.briefInfo}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {post.categoryName}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
};

// Component hiển thị danh sách các bài viết
const PostDisplay = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = await fetchAllPosts();
                setPosts(data || []); // Đảm bảo rằng posts luôn là một mảng
            } catch (e) {
                setError('Unable to fetch posts');
            }
            setLoading(false);
        };

        loadPosts();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Danh sách bài viết
            </Typography>
            <Grid container spacing={2}>
                {posts.map((post) => (
                    <Grid item key={post.id} xs={12} sm={6} md={4} lg={3}>
                        <PostCard post={post} /> {/* Sử dụng PostCard cho từng bài viết */}
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default PostDisplay;
