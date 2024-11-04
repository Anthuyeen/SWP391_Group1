import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPostById } from './../../../service/post';
import { Card, CardContent, CardMedia, Typography, CircularProgress, Box } from '@mui/material';

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadPost = async () => {
            try {
                const data = await fetchPostById(id);
                const images = data.images?.$values.map(image => ({
                    type: 'image',
                    displayOrder: image.displayOrder,
                    content: image.url,
                })) || [];

                const contents = data.contents?.$values.map(content => ({
                    type: 'content',
                    displayOrder: content.displayOrder,
                    content: content.content,
                })) || [];

                // Hợp nhất và sắp xếp theo displayOrder
                const combined = [...images, ...contents].sort((a, b) => a.displayOrder - b.displayOrder);

                setPost({ ...data, combined }); // Lưu dữ liệu hợp nhất vào state
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadPost();
    }, [id]);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    if (!post) {
        return <Typography>Không tìm thấy bài viết.</Typography>;
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Card>
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
                    {post.combined.map((item, index) => (
                        item.type === 'image' ? (
                            <CardMedia
                                key={index}
                                component="img"
                                alt={post.title}
                                height="300"
                                image={item.content}
                                sx={{ mb: 2 }}
                            />
                        ) : (
                            <Typography
                                key={index}
                                variant="body2"
                                paragraph
                                dangerouslySetInnerHTML={{ __html: item.content }}
                            />
                        )
                    ))}
                </CardContent>
            </Card>
        </Box>
    );
};

export default PostDetail;
