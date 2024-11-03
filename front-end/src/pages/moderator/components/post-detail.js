import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Thư viện để lấy params từ URL
import { fetchPostById } from './../../../service/post'; // Đường dẫn đến file fetch của bạn
import { Card, CardContent, CardMedia, Typography, CircularProgress, Box, Grid } from '@mui/material';

const PostDetail = () => {
    const { id } = useParams(); // Lấy ID từ URL params
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPost = async () => {
            try {
                const data = await fetchPostById(id); // Gọi hàm để lấy bài viết theo ID
                setPost(data); // Lưu dữ liệu vào state
            } catch (err) {
                setError(err.message); // Lưu thông báo lỗi nếu có
            } finally {
                setLoading(false); // Đánh dấu đã tải xong
            }
        };

        loadPost();
    }, [id]); // Chạy lại khi ID thay đổi

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    // Nếu không có bài viết
    if (!post) {
        return <Typography>Không tìm thấy bài viết.</Typography>;
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Card>
                {post.images.$values.length > 0 && (
                    <CardMedia
                        component="img"
                        alt={post.title}
                        height="300" // Đặt chiều cao cho hình ảnh
                        image={post.images.$values[0].url} // Sử dụng hình ảnh đầu tiên
                    />
                )}
                <CardContent>
                    <Typography variant="h4" component="div" gutterBottom>
                        {post.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                        Danh mục: {post.categoryName} | Trạng thái: {post.status}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        {post.briefInfo}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Nội dung:
                    </Typography>
                    {post.contents.$values.map((content) => (
                        <Typography key={content.id} variant="body2" paragraph>
                            {content.content}
                        </Typography>
                    ))}
                </CardContent>
            </Card>
        </Box>
    );
};

export default PostDetail;
