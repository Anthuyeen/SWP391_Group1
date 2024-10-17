import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardMedia } from '@mui/material';
import { useParams } from 'react-router-dom';
import { fetchPostById } from '../../../../service/post'; // Điều chỉnh đường dẫn import nếu cần
import Navbar from '../../../../layouts/navbar';
import Footer from '../../../../layouts/footer';
const PostDetail = () => {
    const { id } = useParams(); // Lấy ID từ URL
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPost = async () => {
            try {
                const data = await fetchPostById(id);
                setPost(data); // Lưu dữ liệu bài viết vào state
            } catch (e) {
                setError('Không thể tải bài viết');
            }
            setLoading(false);
        };

        loadPost();
    }, [id]);

    if (loading) return <Box>Đang tải...</Box>;
    if (error) return <Box>{error}</Box>;

    if (!post) return <Box>Không tìm thấy bài viết.</Box>;

    return (
        <>
            <Navbar />
            <Box sx={{ maxWidth: 'lg', mx: 'auto', mt: 4, px: 2 }}>
                <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                    {post.title}
                </Typography>
                <Card sx={{ mb: 2 }}>
                    <CardMedia
                        component="img"
                        height="300"
                        image={post.images.$values.length > 0 ? post.images.$values[0].url : '/api/placeholder/300/300'}
                        alt={post.title}
                    />
                </Card>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    {post.briefInfo}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {post.contents.$values[0].content}
                </Typography>
            </Box>
            <Footer />
        </>
    );
};

export default PostDetail;
