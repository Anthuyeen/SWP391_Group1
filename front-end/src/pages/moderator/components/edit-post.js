// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { fetchPostById, fetchEditPost } from './../../../service/post'; // Nhập hàm fetchUpdatePost
// import { Card, CardContent, CardMedia, Typography, CircularProgress, Box, TextField, Button } from '@mui/material';

// const EditPost = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();
//     const [post, setPost] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [formData, setFormData] = useState({
//         title: '',
//         briefInfo: '',
//         contents: [],
//         images: []
//     });

//     useEffect(() => {
//         const loadPost = async () => {
//             try {
//                 const data = await fetchPostById(id);
//                 const images = data.images?.$values.map(image => ({
//                     type: 'image',
//                     displayOrder: image.displayOrder,
//                     content: image.url,
//                 })) || [];

//                 const contents = data.contents?.$values.map(content => ({
//                     type: 'content',
//                     displayOrder: content.displayOrder,
//                     content: content.content,
//                 })) || [];

//                 // Hợp nhất và sắp xếp theo displayOrder
//                 const combined = [...images, ...contents].sort((a, b) => a.displayOrder - b.displayOrder);

//                 setPost(data);
//                 setFormData({
//                     title: data.title,
//                     briefInfo: data.briefInfo,
//                     contents: contents.map(c => c.content),
//                     images: images.map(i => i.content)
//                 });
//             } catch (err) {
//                 setError(err.message);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         loadPost();
//     }, [id]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value
//         }));
//     };

//     const handleContentChange = (index, value) => {
//         const updatedContents = [...formData.contents];
//         updatedContents[index] = value;
//         setFormData((prev) => ({
//             ...prev,
//             contents: updatedContents
//         }));
//     };

//     const handleSave = async () => {
//         try {
//             await fetchEditPost(id, { ...formData }); // Gọi hàm cập nhật
//             navigate(`/moderator/home/post-for-moderator/${id}`); // Quay lại trang chi tiết bài viết
//         } catch (err) {
//             console.error(err);
//             setError('Không thể cập nhật bài viết.');
//         }
//     };

//     if (loading) {
//         return <CircularProgress />;
//     }

//     if (error) {
//         return <Typography color="error">{error}</Typography>;
//     }

//     if (!post) {
//         return <Typography>Không tìm thấy bài viết.</Typography>;
//     }

//     return (
//         <Box sx={{ padding: 2 }}>
//             <Card>
//                 <CardContent>
//                     <Typography variant="h4" component="div" gutterBottom>
//                         Chỉnh sửa bài viết
//                     </Typography>
//                     <TextField
//                         label="Tiêu đề"
//                         name="title"
//                         value={formData.title}
//                         onChange={handleChange}
//                         fullWidth
//                         margin="normal"
//                     />
//                     <TextField
//                         label="Mô tả ngắn"
//                         name="briefInfo"
//                         value={formData.briefInfo}
//                         onChange={handleChange}
//                         fullWidth
//                         margin="normal"
//                     />
//                     <Typography variant="body2" color="text.secondary" paragraph>
//                         Nội dung:
//                     </Typography>
//                     {formData.contents.map((content, index) => (
//                         <TextField
//                             key={index}
//                             value={content}
//                             onChange={(e) => handleContentChange(index, e.target.value)}
//                             fullWidth
//                             margin="normal"
//                             multiline
//                             rows={4}
//                         />
//                     ))}
//                     <Typography variant="body2" color="text.secondary" paragraph>
//                         Hình ảnh:
//                     </Typography>
//                     {formData.images.map((image, index) => (
//                         <CardMedia
//                             key={index}
//                             component="img"
//                             alt={post.title}
//                             height="300"
//                             image={image}
//                             sx={{ mb: 2 }}
//                         />
//                     ))}
//                     <Button variant="contained" color="primary" onClick={handleSave} sx={{ mt: 2 }}>
//                         Lưu
//                     </Button>
//                 </CardContent>
//             </Card>
//         </Box>
//     );
// };

// export default EditPost;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPostById, fetchEditPost, fetchAllCategories } from './../../../service/post';
import { Card, CardContent, CardMedia, Typography, CircularProgress, Box, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { uploadImage } from './../../../service/subject'; // Đảm bảo import hàm uploadImage

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        briefInfo: '',
        contents: [],
        images: [],
        categoryId: '',
        isFeatured: false,
        status: 'Published' // Đặt giá trị mặc định cho status
    });
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const loadPost = async () => {
            try {
                const data = await fetchPostById(id);
                const images = data.images?.$values.map(image => ({
                    displayOrder: image.displayOrder,
                    url: image.url, // Chuyển đổi thành 'url' thay vì 'content'
                })) || [];

                const contents = data.contents?.$values.map(content => ({
                    displayOrder: content.displayOrder,
                    content: content.content,
                })) || [];

                setPost(data);
                setFormData({
                    title: data.title,
                    briefInfo: data.briefInfo,
                    contents: contents,
                    images: images,
                    categoryId: data.categoryId || '',
                    isFeatured: data.isFeatured || false,
                    status: 'Published' // Đặt lại giá trị status
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const loadCategories = async () => {
            try {
                const allCategories = await fetchAllCategories();
                const categoriesList = allCategories.$values || [];
                if (Array.isArray(categoriesList)) {
                    const postCategories = categoriesList.filter(category => category.type === 'Post');
                    setCategories(postCategories);
                } else {
                    throw new Error('Danh sách danh mục không hợp lệ.');
                }
            } catch (err) {
                console.error(err);
                setError('Không thể tải danh sách danh mục.');
            }
        };
        loadPost();
        loadCategories();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleContentChange = (index, value) => {
        const updatedContents = [...formData.contents];
        updatedContents[index].content = value;
        setFormData((prev) => ({
            ...prev,
            contents: updatedContents
        }));
    };

    const handleOrderChange = (index, value) => {
        const updatedContents = [...formData.contents];
        updatedContents[index].displayOrder = value;
        setFormData((prev) => ({
            ...prev,
            contents: updatedContents
        }));
    };

    const handleImageOrderChange = (index, value) => {
        const updatedImages = [...formData.images];
        updatedImages[index].displayOrder = value;
        setFormData((prev) => ({
            ...prev,
            images: updatedImages
        }));
    };

    const handleDeleteContent = (index) => {
        const updatedContents = formData.contents.filter((_, i) => i !== index);
        setFormData((prev) => ({
            ...prev,
            contents: updatedContents
        }));
    };

    const handleDeleteImage = (index) => {
        const updatedImages = formData.images.filter((_, i) => i !== index);
        setFormData((prev) => ({
            ...prev,
            images: updatedImages
        }));
    };
    const handleImageUpload = async (event) => {
        const files = event.target.files;
        const newImages = []; // Tạo một mảng mới để chứa các ảnh mới
    
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            try {
                const uploadedImage = await uploadImage(file);
                newImages.push({ displayOrder: formData.images.length + newImages.length + 1, url: uploadedImage.url }); // Đảm bảo số thứ tự tăng dần
            } catch (err) {
                console.error('Error uploading image:', err);
                setError('Lỗi khi tải ảnh lên.');
            }
        }
    
        // Cập nhật lại formData mà không xóa ảnh đã có
        setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...newImages] // Ghép các ảnh mới vào ảnh đã có
        }));
    };
    

    const handleSave = async () => {
        // Kiểm tra xem các trường bắt buộc đã được thiết lập
        const isValid = formData.images.every(image => image.url) && formData.status;

        if (!isValid) {
            setError('Vui lòng điền đầy đủ thông tin cần thiết.');
            return;
        }

        try {
            await fetchEditPost(id, { ...formData });
            navigate(`/moderator/home/post-for-moderator/${id}`);
        } catch (err) {
            console.error(err);
            setError('Không thể cập nhật bài viết.');
        }
    };

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
                        Chỉnh sửa bài viết
                    </Typography>
                    <TextField
                        label="Tiêu đề"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Mô tả ngắn"
                        name="briefInfo"
                        value={formData.briefInfo}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Danh mục</InputLabel>
                        <Select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Đặc biệt</InputLabel>
                        <Select
                            name="isFeatured"
                            value={formData.isFeatured ? 'true' : 'false'}
                            onChange={handleChange}
                        >
                            <MenuItem value="false">Không</MenuItem>
                            <MenuItem value="true">Có</MenuItem>
                        </Select>
                    </FormControl>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Nội dung:
                    </Typography>
                    {formData.contents.map((content, index) => (
                        <div key={index} style={{ marginBottom: '20px' }}>
                            <Typography variant="body2" color="text.secondary">
                                Order: 
                                <TextField
                                    type="number"
                                    value={content.displayOrder}
                                    onChange={(e) => handleOrderChange(index, e.target.value)}
                                    style={{ marginLeft: '10px', width: '60px' }}
                                />
                                <Button variant="outlined" color="error" onClick={() => handleDeleteContent(index)} style={{ marginLeft: '10px' }}>
                                    Xóa
                                </Button>
                            </Typography>
                            <ReactQuill
                                value={content.content}
                                onChange={(value) => handleContentChange(index, value)}
                            />
                        </div>
                    ))}
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Hình ảnh:
                    </Typography>
                    <input type="file" multiple onChange={handleImageUpload} />
                    {formData.images.map((image, index) => (
                        <div key={index} style={{ marginBottom: '20px' }}>
                            <Typography variant="body2" color="text.secondary">
                                Order: 
                                <TextField
                                    type="number"
                                    value={image.displayOrder}
                                    onChange={(e) => handleImageOrderChange(index, e.target.value)}
                                    style={{ marginLeft: '10px', width: '60px' }}
                                />
                                <Button variant="outlined" color="error" onClick={() => handleDeleteImage(index)} style={{ marginLeft: '10px' }}>
                                    Xóa
                                </Button>
                            </Typography>
                            {image.url && <CardMedia component="img" image={image.url} alt={`Image ${index + 1}`} />}
                        </div>
                    ))}
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Lưu
                    </Button>
                </CardContent>
            </Card>
        </Box>
    );
};

export default EditPost;
