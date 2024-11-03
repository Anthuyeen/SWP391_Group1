import React, { useEffect, useState } from 'react';
import { fetchAllPosts } from './../../../service/post'; // Điều chỉnh đường dẫn đến file fetch của bạn
import { Card, CardContent, CardMedia, Typography, Grid, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Nhập useNavigate từ react-router-dom

const PostManage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Khởi tạo useNavigate

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = await fetchAllPosts();
                setPosts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, []);

    const handlePostClick = (id) => {
        navigate(`/moderator/home/post-for-moderator/${id}`); // Điều hướng đến PostDetail với ID bài viết
    };

    const handleAddPostClick = () => {
        navigate('/moderator/home/add-post'); // Điều hướng đến trang thêm bài viết
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <div>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={handleAddPostClick} 
                style={{ marginBottom: '16px', backgroundColor: 'orange', color: 'white' }} // Thay đổi màu sắc
            >
                Add Post
            </Button>
            <Grid container spacing={3}>
                {posts.map((post) => (
                    <Grid item xs={12} sm={6} md={4} key={post.id}>
                        <Card onClick={() => handlePostClick(post.id)} style={{ cursor: 'pointer' }}>
                            {post.images.$values.length > 0 && (
                                <CardMedia
                                    component="img"
                                    alt={post.title}
                                    height="140"
                                    image={post.images.$values[0].url} // Sử dụng hình ảnh đầu tiên
                                />
                            )}
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {post.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {post.briefInfo}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Danh mục: {post.categoryName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Trạng thái: {post.status}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default PostManage;
