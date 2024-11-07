import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPostById, fetchEditPost, fetchAllCategories } from './../../../service/post';
import { Card, CardContent, CardMedia, Typography, CircularProgress, Box, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { uploadImage } from './../../../service/subject'; // Đảm bảo import hàm uploadImage
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
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

    const getMaxDisplayOrder = (images, contents) => {
        const imageOrders = images.map(img => Number(img.displayOrder) || 0);
        const contentOrders = contents.map(content => Number(content.displayOrder) || 0);
        const allOrders = [...imageOrders, ...contentOrders];
        return allOrders.length > 0 ? Math.max(...allOrders) : 0;
    };

    useEffect(() => {
        const loadPost = async () => {
            try {
                const data = await fetchPostById(id);
                const images = data.images?.$values.map(image => ({
                    id: Number(image.id), // Đảm bảo id là number
                    displayOrder: Number(image.displayOrder),
                    url: image.url,
                })) || [];

                const contents = data.contents?.$values.map(content => ({
                    id: Number(content.id), // Đảm bảo id là number
                    displayOrder: Number(content.displayOrder),
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
                    status: 'Published'
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
        setFormData(prev => ({
            ...prev,
            images: updatedImages
        }));
    };

    const handleImageUpload = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        try {
            // Lấy displayOrder lớn nhất từ cả ảnh và content
            const currentMaxOrder = Math.max(
                ...formData.images.map(img => Number(img.displayOrder) || 0),
                ...formData.contents.map(content => Number(content.displayOrder) || 0)
            );

            // Lưu lại state hiện tại của images
            const currentImages = [...formData.images];

            // Xử lý từng file ảnh mới
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                try {
                    const uploadedImage = await uploadImage(file);
                    // Thêm ảnh mới vào mảng currentImages với id là 0 thay vì null
                    currentImages.push({
                        id: 0, // Đánh dấu là ảnh mới với id = 0
                        displayOrder: currentMaxOrder + i + 1,
                        url: uploadedImage.url
                    });
                } catch (error) {
                    console.error('Error uploading image:', error);
                }
            }

            // Cập nhật state với tất cả ảnh (cả cũ và mới)
            setFormData(prev => ({
                ...prev,
                images: currentImages.sort((a, b) =>
                    (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0)
                )
            }));
        } catch (err) {
            console.error('Error in image upload process:', err);
            setError('Lỗi khi tải ảnh lên.');
        }
    };

    const handleSave = async () => {
        const isValid = formData.images.every(image => image.url) && formData.status;

        if (!isValid) {
            setError('Vui lòng điền đầy đủ thông tin cần thiết.');
            return;
        }

        // Chuẩn bị dữ liệu gửi lên server
        const updatedPost = {
            ...post,
            title: formData.title,
            briefInfo: formData.briefInfo,
            categoryId: formData.categoryId,
            isFeatured: formData.isFeatured,
            status: formData.status,
            contents: formData.contents.map(content => ({
                ...content,
                id: Number(content.id) || 0
            })),
            images: formData.images.map(image => ({
                ...image,
                id: Number(image.id) || 0
            }))
        };

        try {
            await fetchEditPost(id, updatedPost);
            navigate(`/moderator/home/post-for-moderator/${id}`);
        } catch (err) {
            console.error(err);
            setError('Không thể cập nhật bài viết.');
        }
    };

    const handleAddContent = () => {
        // Lấy displayOrder lớn nhất từ cả ảnh và content hiện có
        const maxOrder = getMaxDisplayOrder(formData.images, formData.contents);

        const newContent = {
            displayOrder: maxOrder + 1,
            content: ''
        };

        setFormData(prev => ({
            ...prev,
            contents: [...prev.contents, newContent]
        }));
    };

    const handleAddImage = (imageUrl) => {
        // Lấy displayOrder lớn nhất từ cả ảnh và content hiện có
        const maxOrder = getMaxDisplayOrder(formData.images, formData.contents);

        const newImage = {
            displayOrder: maxOrder + 1,
            url: imageUrl
        };

        setFormData(prev => ({
            ...prev,
            images: [...prev.images, newImage]
        }));
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
                    {/* <Button variant="contained" onClick={handleAddContent}>Thêm Nội Dung</Button>
                    <Button variant="contained" component="label">Thêm Ảnh
                        <input type="file" multiple hidden onChange={handleImageUpload} />
                    </Button> */}
                    <Tooltip title="Thêm Nội Dung">
                        <IconButton onClick={handleAddContent}>
                            <AddIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Thêm Ảnh">
                        <IconButton component="label">
                            <CloudUploadIcon />
                            <input type="file" multiple hidden onChange={handleImageUpload} />
                        </IconButton>
                    </Tooltip>

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
