import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchLessonsBySubject, fetchUpdateLessonStatus } from './../../../service/lesson';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    TextField,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';

const LessonApprove = () => {
    const { subjectId } = useParams();
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredLessons, setFilteredLessons] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState('');

    useEffect(() => {
        const loadLessons = async () => {
            try {
                const data = await fetchLessonsBySubject(subjectId);
                setLessons(data);
                setFilteredLessons(data);
            } catch (error) {
                console.error('Error fetching lessons:', error);
            } finally {
                setLoading(false);
            }
        };

        loadLessons();
    }, [subjectId]);

    // Effect để cập nhật filteredLessons khi lessons thay đổi
    useEffect(() => {
        filterLessons(searchTerm, selectedStatus);
    }, [lessons, searchTerm, selectedStatus]);

    const handleSearchChange = (event, value) => {
        setSearchTerm(value || '');
    };

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    const filterLessons = (searchTerm, status) => {
        const filtered = lessons.filter(lesson => {
            const matchesSearchTerm = lesson.name.toLowerCase().includes((searchTerm || '').toLowerCase());
            const matchesStatus = status ? lesson.status === status : true;
            return matchesSearchTerm && matchesStatus;
        });
        setFilteredLessons(sortLessonsByStatus(filtered));
    };

    const handleLessonStatusChange = async (id, newStatus) => {
        try {
            await fetchUpdateLessonStatus(id, newStatus);

            // Cập nhật cả lessons và filteredLessons
            const updatedLessons = lessons.map((lesson) =>
                lesson.id === id ? { ...lesson, status: newStatus } : lesson
            );
            setLessons(updatedLessons);
        } catch (error) {
            console.error('Error updating lesson status:', error);
        }
    };

    const sortLessonsByStatus = (lessons) => {
        const statusOrder = ['Draft', 'Denied', 'Inactive', 'Active']; // Đặt thứ tự mong muốn
        return lessons.sort((a, b) => {
            return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
        });
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <div>
            <div style={{ display: 'flex', marginBottom: '20px', alignItems: 'center' }}>
                <Autocomplete
                    freeSolo
                    options={lessons.map((lesson) => lesson.name)}
                    onInputChange={handleSearchChange}
                    renderInput={(params) => (
                        <TextField {...params} label="Tìm kiếm theo tên bài học" variant="outlined" />
                    )}
                    style={{ flexGrow: 1, marginRight: '20px' }}
                />
                <FormControl variant="outlined" size="small" style={{ minWidth: '150px' }}>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                        value={selectedStatus}
                        onChange={handleStatusChange}
                        label="Trạng thái"
                        style={{ minWidth: '150px' }}
                    >
                        <MenuItem value="">Tất cả</MenuItem>
                        <MenuItem value="Active">Active</MenuItem>
                        <MenuItem value="Draft">Draft</MenuItem>
                        <MenuItem value="Inactive">Inactive</MenuItem>
                        <MenuItem value="Denied">Denied</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tên Bài Học</TableCell>
                            <TableCell>Nội Dung</TableCell>
                            <TableCell>Trạng Thái</TableCell>
                            <TableCell>Thay Đổi Trạng Thái</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredLessons.map((lesson) => (
                            <TableRow key={lesson.id}>
                                <TableCell>{lesson.name}</TableCell>
                                <TableCell>{lesson.content}</TableCell>
                                <TableCell>{lesson.status}</TableCell>
                                <TableCell>
                                    <FormControl variant="outlined" size="small">
                                        <Select
                                            value={lesson.status}
                                            onChange={(e) => handleLessonStatusChange(lesson.id, e.target.value)}
                                        >
                                            <MenuItem value="Active">Active</MenuItem>
                                            <MenuItem value="Draft">Draft</MenuItem>
                                            <MenuItem value="Inactive">Inactive</MenuItem>
                                            <MenuItem value="Denied">Denied</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredLessons.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} style={{ textAlign: 'center' }}>
                                    Không tìm thấy bài học nào.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default LessonApprove;