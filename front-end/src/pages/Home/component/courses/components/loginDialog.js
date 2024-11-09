import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    TextField,
    Button,
    IconButton,
    InputAdornment
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export const LoginDialog = ({ 
    open, 
    onClose, 
    onLogin, 
    email,
    setEmail,
    password,
    setPassword,
    emailError,
    passwordError 
}) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleLoginClick = () => {
        onLogin();  // Không cần truyền email và password vì đã được quản lý ở useAuth
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                Đăng nhập
                <IconButton edge="end" color="inherit" onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} direction="column">
                    <Grid item>
                        <TextField
                            label="Email, hoặc số điện thoại"
                            type="email"
                            fullWidth
                            margin="dense"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={!!emailError}
                            helperText={emailError}
                        />
                    </Grid>
                    <Grid item>
                        <TextField
                            label="Mật khẩu"
                            type={showPassword ? 'text' : 'password'}
                            fullWidth
                            margin="dense"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={!!passwordError}
                            helperText={passwordError}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="warning"
                            fullWidth
                            sx={{ marginTop: 2 }}
                            onClick={handleLoginClick}
                        >
                            Đăng nhập
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};