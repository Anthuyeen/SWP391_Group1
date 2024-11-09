import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, TextField, Autocomplete } from '@mui/material';
import Navbar from '../../../../layouts/navbar';
import Footer from '../../../../layouts/footer';
import { fetchAllPosts } from '../../../../service/post'; // Điều chỉnh đường dẫn import nếu cần
import { useNavigate } from 'react-router-dom'; 

const PostCard = ({ post }) => {
    const navigate = useNavigate(); // Khởi tạo useNavigate

    const handleClick = () => {
        navigate(`/post/${post.id}`); // Điều hướng đến trang chi tiết bài viết
    };

    return (
        <Card onClick={handleClick} sx={{ display: 'flex', mb: 2, height: 140 }}>
            <CardMedia
                component="img"
                sx={{ width: 140, objectFit: 'cover' }}
                image={post.images.$values.length > 0 ? post.images.$values[0].url : '/api/placeholder/140/140'}
                alt={post.title}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <CardContent sx={{ flex: '1 0 auto', py: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {post.categoryName.toUpperCase()}
                    </Typography>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {post.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {post.briefInfo}
                    </Typography>
                </CardContent>
            </Box>
        </Card>
    );
};

const ListPost = () => {
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = await fetchAllPosts();
                setPosts(data || []);
                setFilteredPosts(data || []);
            } catch (e) {
                setError('Không thể tải bài viết');
            }
            setLoading(false);
        };
 
        loadPosts();
    }, []);

    useEffect(() => {
        const filtered = posts.filter(post =>
            post.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredPosts(filtered.slice(0,5));
        // setFilteredPosts(filtered.slice(0,5));
    }, [searchTerm, posts]);

    if (loading) return <Box>Đang tải...</Box>;
    if (error) return <Box>{error}</Box>;

    return (
        <>
            <Navbar />
            <Box sx={{ maxWidth: 'lg', mx: 'auto', mt: 4, px: 2, minHeight: 'calc(100vh - 100px)' }}>
                <Autocomplete
                    freeSolo
                    options={posts.map((post) => post.title)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Tìm kiếm bài viết"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                        />
                    )}
                    onInputChange={(event, newInputValue) => {
                        setSearchTerm(newInputValue);
                    }}
                />
                {filteredPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </Box>
            <Footer />
        </>
    );
};

export default ListPost;