import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  AppBar,
  Toolbar,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Avatar,
  Stack
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

const Login = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      showSnackbar('Login successful!', 'success')
      setTimeout(() => navigate('/'), 1000)
    } catch (err) {
      setError('Invalid email or password')
      showSnackbar('Login failed. Please check your credentials.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity })
  }

  return (
    <>
      <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #1DA1F2 30%, #0D8BD9 90%)' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            🐦 Twitter Clone
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        <Card 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            border: '1px solid #e1e8ed',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Avatar 
                sx={{ 
                  bgcolor: '#1DA1F2', 
                  width: 64,
                  height: 64,
                  mx: 'auto',
                  mb: 2
                }}
              >
                <LockOutlinedIcon fontSize="large" />
              </Avatar>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a1a1a', mb: 1 }}>
                Welcome back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to your account to continue
              </Typography>
            </Box>

            <Box component="form" onSubmit={onSubmit}>
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#1DA1F2',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1DA1F2',
                      },
                    },
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#1DA1F2',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1DA1F2',
                      },
                    },
                  }}
                />

                {error && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    borderRadius: '20px',
                    textTransform: 'none',
                    py: 1.5,
                    fontSize: '1.1rem',
                    background: 'linear-gradient(45deg, #1DA1F2 30%, #0D8BD9 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #0D8BD9 30%, #1DA1F2 90%)',
                    },
                    '&:disabled': {
                      background: '#ccc',
                    }
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Link 
                      to="/signup" 
                      style={{ 
                        color: '#1DA1F2', 
                        textDecoration: 'none',
                        fontWeight: 'bold'
                      }}
                    >
                      Sign up
                    </Link>
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Login

