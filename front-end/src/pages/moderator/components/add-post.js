import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import kiểu giao diện Quill
import { fetchAddPost, fetchAllCategories } from './../../../service/post';
import { uploadImage } from '../../../service/subject';
import {
    TextField,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    CircularProgress,
    Typography,
    Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AddPost = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [briefInfo, setBriefInfo] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [error, setError] = useState(null);

    // State cho nội dung và hình ảnh
    const [contents, setContents] = useState([{ id: 1, content: '', displayOrder: 1 }]);
    const [images, setImages] = useState([]);
    const [currentDisplayOrder, setCurrentDisplayOrder] = useState(2);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchAllCategories();
                const postCategories = data.$values.filter(category => category.type === 'Post');
                setCategories(postCategories);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoadingCategories(false);
            }
        };

        loadCategories();
    }, []);

    const handleAddContent = () => {
        setContents([...contents, { id: contents.length + 1, content: '', displayOrder: currentDisplayOrder }]);
        setCurrentDisplayOrder(currentDisplayOrder + 1);
    };

    const handleContentChange = (index, value) => {
        const newContents = [...contents];
        newContents[index].content = value;
        setContents(newContents);
    };

    const handleImageUpload = async (event) => {
        const files = Array.from(event.target.files);
        const newImages = [];

        for (const file of files) {
            try {
                const uploadedImage = await uploadImage(file);
                if (uploadedImage.url) {
                    newImages.push({ id: newImages.length + 1, url: uploadedImage.url, displayOrder: currentDisplayOrder });
                    setCurrentDisplayOrder(currentDisplayOrder + 1);
                }
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }

        setImages([...images, ...newImages]);
    };

    const handleAddPost = async () => {
        if (!title || !briefInfo || !categoryId) {
            setError("Tiêu đề, thông tin ngắn, và danh mục là bắt buộc.");
            return;
        }

        const postData = {
            title: title,
            briefInfo: briefInfo,
            categoryId: Number(categoryId),
            isFeatured: isFeatured,
            status: 'Published',
            images: images.map(image => ({
                id: image.id,
                url: image.url,
                displayOrder: image.displayOrder
            })),
            contents: contents.map(content => ({
                id: content.id,
                content: content.content,
                displayOrder: content.displayOrder
            })),
        };

        try {
            await fetchAddPost(postData);
            navigate(-1);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loadingCategories) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <div>
            <TextField
                label="Tiêu đề"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TextField
                label="Thông tin ngắn"
                value={briefInfo}
                onChange={(e) => setBriefInfo(e.target.value)}
                fullWidth
                margin="normal"
            />
            <FormControl fullWidth margin="normal">
                <InputLabel id="category-select-label">Chọn danh mục</InputLabel>
                <Select
                    labelId="category-select-label"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                >
                    {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                            {category.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Box display="flex" alignItems="center" marginY={2}>
                <FormControl margin="normal" style={{ marginRight: '16px' }}>
                    <InputLabel htmlFor="isFeatured">Nổi bật</InputLabel>
                    <Select
                        id="isFeatured"
                        value={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.value)}
                    >
                        <MenuItem value={true}>Có</MenuItem>
                        <MenuItem value={false}>Không</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" color="primary" onClick={handleAddPost}>
                    Thêm bài viết
                </Button>
            </Box>

            {contents.map((content, index) => (
                <div key={content.id} style={{ marginBottom: '20px' }}>
                    <Typography variant="h6">Nội dung {content.displayOrder}</Typography>
                    <ReactQuill
                        value={content.content}
                        onChange={(value) => handleContentChange(index, value)}
                        placeholder={`Nhập nội dung ${content.displayOrder}`}
                        modules={{
                            toolbar: [
                                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                ['link', 'image'],
                                ['clean'], // Remove formatting button
                                [{ 'align': [] }], 
                            ],
                        }}
                        formats={[
                            'header', 'font', 'size',
                            'bold', 'italic', 'underline', 'strike', 'blockquote',
                            'list', 'bullet', 'link', 'image', 'clean'
                        ]}
                    />
                </div>
            ))}
            <Button variant="outlined" color="primary" onClick={handleAddContent}>
                Thêm nội dung
            </Button>

            <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
            <Typography variant="h6">Hình ảnh đã tải lên:</Typography>
            {images.map((image) => (
                <img key={image.id} src={image.url} alt={`Hình ảnh ${image.displayOrder}`} style={{ width: '100px', height: '100px', margin: '10px' }} />
            ))}
        </div>
    );
};

export default AddPost;
