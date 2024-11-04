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
            } catch (e) {
                setError('Không thể tải bài viết');
            }
            setLoading(false);
        };

        loadPost();
    }, [id]);

    if (loading) return <Box sx={{ textAlign: 'center' }}>Đang tải...</Box>;
    if (error) return <Box sx={{ color: 'red', textAlign: 'center' }}>{error}</Box>;

    if (!post) return <Box>Không tìm thấy bài viết.</Box>;

    return (
        <>
            <Navbar />
            <Box sx={{ maxWidth: 'lg', mx: 'auto', mt: 4, px: 2 }}>
                <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
                    {post.title}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                    {post.briefInfo}
                </Typography>
                {post.combined.map((item, index) => (
                    item.type === 'image' ? (
                        <Card key={index} sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
                            <CardMedia
                                component="img"
                                height="300"
                                image={item.content}
                                alt={post.title}
                            />
                        </Card>
                    ) : (
                        <Typography
                            key={index}
                            variant="body2"
                            paragraph
                            dangerouslySetInnerHTML={{ __html: item.content }}
                        />
                    )
                ))}
            </Box>
            <Footer />
        </>
    );
};

export default PostDetail;
