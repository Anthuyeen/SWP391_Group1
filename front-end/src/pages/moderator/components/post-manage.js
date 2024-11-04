import React, { useEffect, useState } from 'react';
import { fetchAllPosts, fetchDeletePost } from './../../../service/post';
import { Card, CardContent, CardMedia, Typography, Grid, CircularProgress, Button, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit'; // Nhập EditIcon
import { useNavigate } from 'react-router-dom';

const PostManage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const navigate = useNavigate();

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
        navigate(`/moderator/home/post-for-moderator/${id}`);
    };

    const handleAddPostClick = () => {
        navigate('/moderator/home/add-post');
    };

    const handleOpenDialog = (postId) => {
        setPostToDelete(postId);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setPostToDelete(null);
    };

    const confirmDeletePost = async () => {
        if (postToDelete) {
            try {
                await fetchDeletePost(postToDelete);
                setPosts(posts.filter(post => post.id !== postToDelete));
                handleCloseDialog();
            } catch (error) {
                console.error('Error deleting post:', error);
                setError('Failed to delete the post.');
                handleCloseDialog();
            }
        }
    };

    const handleEditPostClick = (id) => {
        navigate(`/moderator/home/edit-post/${id}`); // Điều hướng đến trang chỉnh sửa bài viết
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
                style={{ marginBottom: '16px', backgroundColor: '#ff5722', color: 'white' }}
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
                                    image={post.images.$values[0].url}
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
                                <IconButton onClick={(e) => { e.stopPropagation(); handleEditPostClick(post.id); }} color="primary">
                                    <EditIcon />
                                </IconButton>
                                <IconButton onClick={(e) => { e.stopPropagation(); handleOpenDialog(post.id); }} color="error">
                                    <DeleteIcon />
                                </IconButton>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Dialog xác nhận xóa */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa bài viết này không?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={confirmDeletePost} color="error">
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PostManage;
