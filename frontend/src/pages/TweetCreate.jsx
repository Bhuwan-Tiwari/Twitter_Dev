import { useState } from 'react'
import api from '../lib/api'
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Stack, 
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Alert,
  Snackbar,
  Card,
  CardContent,
  Avatar,
  Chip
} from '@mui/material'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ImageIcon from '@mui/icons-material/Image'
import { useAuth } from '../context/AuthContext'

const TweetCreate = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null
    setImage(file)
    
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target.result)
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    if (!content.trim()) {
      setError('Please write something to tweet')
      setLoading(false)
      return
    }
    
    try {
      const form = new FormData()
      form.append('content', content)
      if (image) form.append('image', image)
      await api.post('/tweets', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      setContent('')
      setImage(null)
      setImagePreview(null)
      showSnackbar('Tweet posted successfully!', 'success')
      setTimeout(() => navigate('/'), 1500)
    } catch(error) {
      setError('Failed to create tweet')
      showSnackbar('Failed to create tweet',"error", error.response.data.message)
    } finally {
      setLoading(false)
    }
  }

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity })
  }

  const characterCount = content.length
  const maxCharacters = 280
  const isOverLimit = characterCount > maxCharacters

  return (
    <>
      <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #1DA1F2 30%, #0D8BD9 90%)' }}>
        <Toolbar>
          <IconButton 
            edge="start" 
            color="inherit" 
            component={RouterLink} 
            to="/"
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            New Tweet
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 3, mb: 3 }}>
        <Card 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            border: '1px solid #e1e8ed',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
              <Avatar 
                sx={{ 
                  bgcolor: '#1DA1F2', 
                  mr: 2,
                  width: 56,
                  height: 56
                }}
              >
                {user?.name?.charAt(0) || 'U'}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {user?.name || 'Anonymous'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  What's happening?
                </Typography>
              </Box>
            </Box>

            <form onSubmit={onSubmit}>
              <Stack spacing={3}>
                <TextField
                  label=""
                  multiline
                  minRows={4}
                  maxRows={8}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's happening?"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      '&:hover fieldset': {
                        borderColor: '#1DA1F2',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#1DA1F2',
                      },
                    },
                  }}
                />

                {imagePreview && (
                  <Box sx={{ position: 'relative' }}>
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      style={{ 
                        maxWidth: '100%', 
                        borderRadius: 12,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => {
                        setImage(null)
                        setImagePreview(null)
                      }}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        minWidth: 'auto',
                        borderRadius: '50%',
                        width: 32,
                        height: 32,
                        background: 'rgba(0,0,0,0.7)',
                        '&:hover': {
                          background: 'rgba(0,0,0,0.9)',
                        }
                      }}
                    >
                      ×
                    </Button>
                  </Box>
                )}

                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                      component="label"
                      startIcon={<ImageIcon />}
                      sx={{
                        color: '#1DA1F2',
                        textTransform: 'none',
                        borderRadius: '20px',
                        '&:hover': {
                          backgroundColor: 'rgba(29, 161, 242, 0.1)',
                        }
                      }}
                    >
                      Add Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                    </Button>
                    {image && (
                      <Chip 
                        label="Image selected" 
                        size="small" 
                        sx={{ 
                          background: 'rgba(29, 161, 242, 0.1)',
                          color: '#1DA1F2'
                        }} 
                      />
                    )}
                  </Stack>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: isOverLimit ? 'error.main' : 'text.secondary',
                        fontWeight: isOverLimit ? 'bold' : 'normal'
                      }}
                    >
                      {characterCount}/{maxCharacters}
                    </Typography>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading || isOverLimit || !content.trim()}
                      sx={{
                        borderRadius: '20px',
                        textTransform: 'none',
                        px: 3,
                        background: 'linear-gradient(45deg, #1DA1F2 30%, #0D8BD9 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #0D8BD9 30%, #1DA1F2 90%)',
                        },
                        '&:disabled': {
                          background: '#ccc',
                        }
                      }}
                    >
                      {loading ? 'Posting...' : 'Tweet'}
                    </Button>
                  </Box>
                </Box>

                {error && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}
              </Stack>
            </form>
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

export default TweetCreate

