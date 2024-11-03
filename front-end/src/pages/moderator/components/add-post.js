import React, { useEffect, useState } from 'react';
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
import { useNavigate } from 'react-router-dom'; // Thay đổi ở đây

const AddPost = () => {
    const navigate = useNavigate(); // Thay đổi ở đây
    const [title, setTitle] = useState('');
    const [briefInfo, setBriefInfo] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [isFeatured, setIsFeatured] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [error, setError] = useState(null);
    
    // State cho nội dung và hình ảnh
    const [contents, setContents] = useState([]);
    const [images, setImages] = useState([]);
    
    // Biến để theo dõi thứ tự hiện tại
    const [currentDisplayOrder, setCurrentDisplayOrder] = useState(1);
    
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
        setCurrentDisplayOrder(currentDisplayOrder + 1); // Tăng thứ tự hiển thị
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
                    setCurrentDisplayOrder(currentDisplayOrder + 1); // Tăng thứ tự hiển thị
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

        console.log("Posting data:", JSON.stringify(postData, null, 2));

        try {
            await fetchAddPost(postData);
            navigate(-1); // Thay đổi ở đây
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
                <TextField
                    key={content.id}
                    label={`Nội dung ${content.displayOrder}`}
                    value={content.content}
                    onChange={(e) => handleContentChange(index, e.target.value)}
                    fullWidth
                    multiline
                    rows={4}
                    margin="normal"
                    variant="outlined"
                />
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
