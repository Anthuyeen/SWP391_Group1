import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate để điều hướng
import { fetchAllSubjects, updateSubjectStatus } from './../../../service/subject';
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
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

const ApproveSubject = () => {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const navigate = useNavigate(); // Khởi tạo navigate

    useEffect(() => {
        const loadSubjects = async () => {
            try {
                const data = await fetchAllSubjects();
                setSubjects(data);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            } finally {
                setLoading(false);
            }
        };
        loadSubjects();
    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    const filteredSubjects = subjects.filter(subject => 
        subject.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterStatus === '' || subject.status === filterStatus)
    );

    const clearSearch = () => {
        setSearchTerm('');
    };

    const handleStatusChange = async (id, newStatus) => {
        const subjectToUpdate = subjects.find((subject) => subject.id === id);
        
        if (subjectToUpdate) {
            const subjectData = { 
                ...subjectToUpdate,
                status: newStatus,
            };
    
            try {
                await updateSubjectStatus(id, newStatus);
                setSubjects((prevSubjects) =>
                    prevSubjects.map((subject) =>
                        subject.id === id ? { ...subject, status: newStatus } : subject
                    )
                );
            } catch (error) {
                console.error('Error updating subject status:', error);
            }
        }
    };

    const handleRowClick = (subjectId) => {
        navigate(`/moderator/home/lesson-approve/${subjectId}`);
    };

    return (
        <div>
            <Grid container spacing={2} style={{ marginBottom: '20px' }}>
                <Grid item xs={8}>
                    <TextField
                        label="Tìm kiếm theo tên Subject"
                        variant="outlined"
                        fullWidth
                        size="small"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                        InputProps={{
                            endAdornment: (
                                <IconButton onClick={clearSearch} edge="end">
                                    <ClearIcon />
                                </IconButton>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={4}>
                    <FormControl variant="outlined" fullWidth size="small">
                        <InputLabel>Lọc theo trạng thái</InputLabel>
                        <Select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            label="Lọc theo trạng thái"
                        >
                            <MenuItem value="">Tất cả</MenuItem>
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="Draft">Draft</MenuItem>
                            <MenuItem value="Inactive">Inactive</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tên Subject</TableCell>
                            <TableCell>Danh mục</TableCell>
                            <TableCell>Chủ sở hữu</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Mô tả</TableCell>
                            <TableCell>Hình ảnh</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredSubjects.slice(0, 5).map((subject) => (
                            <TableRow key={subject.id} onClick={() => handleRowClick(subject.id)} style={{ cursor: 'pointer' }}>
                                <TableCell>{subject.name}</TableCell>
                                <TableCell>{subject.categoryName}</TableCell>
                                <TableCell>{subject.ownerName}</TableCell>
                                <TableCell>{subject.status}</TableCell>
                                <TableCell>{subject.description}</TableCell>
                                <TableCell>
                                    {subject.thumbnail && (
                                        <img src={subject.thumbnail} alt={subject.name} width="50" />
                                    )}
                                </TableCell>
                                <TableCell>
                                    <FormControl variant="outlined" size="small">
                                        <InputLabel>Trạng thái</InputLabel>
                                        <Select
                                            value={subject.status}
                                            onChange={(e) => handleStatusChange(subject.id, e.target.value)}
                                        >
                                            <MenuItem value="Active">Active</MenuItem>
                                            <MenuItem value="Draft">Draft</MenuItem>
                                            <MenuItem value="Inactive">Inactive</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default ApproveSubject;
