import { 
  Container, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Stack, 
  Grid, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  IconButton, 
  TextField, 
  Chip, 
  Box,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  Fab,
  Tooltip
} from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useAuth } from '../context/AuthContext'
import { Link as RouterLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

const Home = () => {
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()
  const [tweets, setTweets] = useState([])
  const [trending, setTrending] = useState([])
  const [error, setError] = useState('')
  const [likeCounts, setLikeCounts] = useState({})
  const [commentOpen, setCommentOpen] = useState({})
  const [commentTexts, setCommentTexts] = useState({})
  const [commentsByTweet, setCommentsByTweet] = useState({})
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [editText, setEditText] = useState('')
  const [editType, setEditType] = useState('') // 'tweet' or 'comment'
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    const load = async () => {
      setError('')
      try {
        const { data } = await api.get('/feed')
        const feedTweets = data.data.tweets || []
        setTweets(feedTweets)
        setTrending(data.data.trending || [])
        const initialLikes = {}
        feedTweets.forEach(t => { initialLikes[t._id] = (t.likes?.length || 0) })
        setLikeCounts(initialLikes)
      } catch {
        setError('Failed to load feed')
      }
    }
    load()
  }, [])

  const onToggleLike = async (tweetId) => {
    if (!token) { navigate('/login'); return }
    try {
      const { data } = await api.post(`/likes/toggle?modelId=${encodeURIComponent(tweetId)}&modelType=Tweet`)
      const added = data.data === true
      setLikeCounts(prev => ({
        ...prev,
        [tweetId]: Math.max(0, (prev[tweetId] || 0) + (added ? 1 : -1))
      }))
    } catch {
      showSnackbar('Failed to like tweet', 'error')
    }
  }

  const onToggleCommentBox = (tweetId) => {
    if (!token) { navigate('/login'); return }
    const willOpen = !commentOpen[tweetId]
    setCommentOpen(prev => ({ ...prev, [tweetId]: willOpen }))
    if (willOpen && !commentsByTweet[tweetId]) {
      // lazy load comments for this tweet
      api.get(`/tweets/${encodeURIComponent(tweetId)}`).then(({ data }) => {
        const tweet = data.data
        setCommentsByTweet(prev => ({ ...prev, [tweetId]: tweet?.comments || [] }))
      }).catch(() => {})
    }
  }

  const onChangeComment = (tweetId, value) => {
    setCommentTexts(prev => ({ ...prev, [tweetId]: value }))
  }

  const onSubmitComment = async (tweetId) => {
    if (!token) { navigate('/login'); return }
    const text = (commentTexts[tweetId] || '').trim()
    if (!text) return
    try {
      await api.post(`/comments?modelId=${encodeURIComponent(tweetId)}&modelType=Tweet`, { content: text })
      setCommentTexts(prev => ({ ...prev, [tweetId]: '' }))
      // reload comments for this tweet
      const { data } = await api.get(`/tweets/${encodeURIComponent(tweetId)}`)
      const tweet = data.data
      setCommentsByTweet(prev => ({ ...prev, [tweetId]: tweet?.comments || [] }))
      showSnackbar('Comment posted successfully!', 'success')
    } catch {
      showSnackbar('Failed to post comment', 'error')
    }
  }

  const handleMenuOpen = (event, item, type) => {
    setAnchorEl(event.currentTarget)
    setSelectedItem({ ...item, type })
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedItem(null)
  }

  const handleEdit = () => {
    if (!selectedItem) return
    setEditItem(selectedItem)
    setEditText(selectedItem.content)
    setEditType(selectedItem.type)
    setEditDialogOpen(true)
    handleMenuClose()
  }

  const handleDelete = async () => {
    if (!selectedItem) return
    try {
      if (selectedItem.type === 'tweet') {
        await api.delete(`/tweets/${selectedItem._id}`)
        setTweets(prev => prev.filter(t => t._id !== selectedItem._id))
        showSnackbar('Tweet deleted successfully!', 'success')
      } else {
        await api.delete(`/comments/${selectedItem._id}`)
        // Refresh comments for the tweet
        const tweetId = selectedItem.commentable
        const { data } = await api.get(`/tweets/${encodeURIComponent(tweetId)}`)
        const tweet = data.data
        setCommentsByTweet(prev => ({ ...prev, [tweetId]: tweet?.comments || [] }))
        showSnackbar('Comment deleted successfully!', 'success')
      }
    } catch (error) {
      showSnackbar('Failed to delete', 'error')
    }
    handleMenuClose()
  }

  const handleEditSave = async () => {
    try {
      if (editType === 'tweet') {
        await api.patch(`/tweets/${editItem._id}`, { content: editText })
        setTweets(prev => prev.map(t => t._id === editItem._id ? { ...t, content: editText } : t))
        showSnackbar('Tweet updated successfully!', 'success')
      } else {
        await api.patch(`/comments/${editItem._id}`, { content: editText })
        // Refresh comments for the tweet
        const tweetId = editItem.commentable
        const { data } = await api.get(`/tweets/${encodeURIComponent(tweetId)}`)
        const tweet = data.data
        setCommentsByTweet(prev => ({ ...prev, [tweetId]: tweet?.comments || [] }))
        showSnackbar('Comment updated successfully!', 'success')
      }
      setEditDialogOpen(false)
      setEditItem(null)
      setEditText('')
    } catch (error) {
      showSnackbar('Failed to update', 'error')
    }
  }

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity })
  }

  const canEditDelete = (item) => {
    return user && item.userId && user._id && item.userId._id === user._id
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60))
      return `${diffInMinutes}m ago`
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <>
      <AppBar position="static" sx={{ background: 'linear-gradient(45deg, #1DA1F2 30%, #0D8BD9 90%)' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            🐦 Twitter Clone
          </Typography>
          {token ? (
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="body2" sx={{ color: 'white' }}>
                Welcome, {user?.name || 'User'}!
              </Typography>
              <Button 
                color="inherit" 
                onClick={logout}
                sx={{ 
                  borderRadius: '20px', 
                  textTransform: 'none',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Logout
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={2}>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/login"
                sx={{ 
                  borderRadius: '20px', 
                  textTransform: 'none',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Login
              </Button>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/signup"
                sx={{ 
                  borderRadius: '20px', 
                  textTransform: 'none',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                }}
              >
                Sign up
              </Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth={false} sx={{ mt: 3, mb: 3, px: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={3}>
          {/* Left Sidebar - Trending */}
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 3, 
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                position: 'sticky',
                top: 20,
                height: 'fit-content',
                border: '1px solid #e1e8ed'
              }}
            >
              <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#1a1a1a', textAlign: 'center' }}>
                🔥 Trending Hashtags
              </Typography>
              <Stack spacing={2}>
                {trending.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                    No trends yet.
                  </Typography>
                ) : (
                  trending.map((tag) => (
                    <Chip 
                      key={tag._id || tag.title} 
                      label={`#${tag.title} (${tag.count ?? 0})`} 
                      sx={{ 
                        borderRadius: '20px',
                        background: 'rgba(29, 161, 242, 0.1)',
                        color: '#1DA1F2',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        py: 1,
                        '&:hover': {
                          background: 'rgba(29, 161, 242, 0.2)',
                          transform: 'scale(1.02)',
                          transition: 'all 0.2s ease'
                        }
                      }} 
                    />
                  ))
                )}
              </Stack>
            </Paper>
          </Grid>

          {/* Main Feed */}
          <Grid item xs={12} md={8}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1a1a1a', textAlign: 'center' }}>
              Latest Tweets
            </Typography>
            
            {tweets.length === 0 ? (
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 6, 
                  borderRadius: 3, 
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                  border: '1px solid #e1e8ed'
                }}
              >
                <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
                  No tweets yet. Be the first to tweet!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Start sharing your thoughts with the world.
                </Typography>
              </Paper>
            ) : (
              <Stack spacing={3}>
                {tweets.map((tweet) => (
                  <Card 
                    key={tweet._id} 
                    elevation={0}
                    sx={{ 
                      borderRadius: 3,
                      border: '1px solid #e1e8ed',
                      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                      '&:hover': { 
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                        transform: 'translateY(-3px)',
                        transition: 'all 0.3s ease',
                        border: '1px solid #1DA1F2'
                      }
                    }}
                  >
                    <CardContent sx={{ pb: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                        <Avatar 
                          sx={{ 
                            bgcolor: '#1DA1F2', 
                            mr: 3,
                            width: 56,
                            height: 56,
                            fontSize: '1.5rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {tweet.userId?.name?.charAt(0) || 'U'}
                        </Avatar>
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 2, color: '#1a1a1a' }}>
                              {tweet.userId?.name || 'Unknown User'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              {formatDate(tweet.createdAt)}
                            </Typography>
                            {canEditDelete(tweet) && (
                              <IconButton 
                                size="small" 
                                onClick={(e) => handleMenuOpen(e, tweet, 'tweet')}
                                sx={{ ml: 'auto', color: '#657786' }}
                              >
                                <MoreVertIcon />
                              </IconButton>
                            )}
                          </Box>
                          <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8, fontSize: '1.1rem' }}>
                            {tweet.content}
                          </Typography>
                          {tweet.image && (
                            <Box sx={{ mb: 2 }}>
                              <img 
                                src={tweet.image} 
                                alt="tweet" 
                                style={{ 
                                  maxWidth: '100%', 
                                  borderRadius: 16,
                                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                }} 
                              />
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </CardContent>

                    <CardActions sx={{ px: 3, pb: 3 }}>
                      <Stack direction="row" spacing={3} sx={{ width: '100%' }}>
                        <Button
                          startIcon={
                            (likeCounts[tweet._id] || 0) > (tweet.likes?.length || 0) ? 
                            <FavoriteIcon color="error" /> : 
                            <FavoriteBorderIcon />
                          }
                          onClick={() => onToggleLike(tweet._id)}
                          sx={{ 
                            color: (likeCounts[tweet._id] || 0) > (tweet.likes?.length || 0) ? '#e0245e' : '#657786',
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            '&:hover': { 
                              backgroundColor: 'rgba(224, 36, 94, 0.1)',
                              transform: 'scale(1.05)',
                              transition: 'all 0.2s ease'
                            }
                          }}
                        >
                          {likeCounts[tweet._id] || 0}
                        </Button>
                        <Button
                          startIcon={<ChatBubbleOutlineIcon />}
                          onClick={() => onToggleCommentBox(tweet._id)}
                          sx={{ 
                            color: '#657786',
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            '&:hover': { 
                              backgroundColor: 'rgba(29, 161, 242, 0.1)',
                              transform: 'scale(1.05)',
                              transition: 'all 0.2s ease'
                            }
                          }}
                        >
                          {(commentsByTweet[tweet._id]?.length ?? (tweet.comments?.length || 0))}
                        </Button>
                      </Stack>
                    </CardActions>

                    {/* Comments Section */}
                    {commentOpen[tweet._id] && (
                      <Box sx={{ px: 3, pb: 3 }}>
                        <Divider sx={{ mb: 3 }} />
                        
                        {/* Comments List */}
                        <Stack spacing={3} sx={{ mb: 3 }}>
                          {(commentsByTweet[tweet._id] || []).map(comment => (
                            <Box 
                              key={comment._id} 
                              sx={{ 
                                pl: 3, 
                                borderLeft: '3px solid #e1e8ed',
                                position: 'relative',
                                background: 'rgba(29, 161, 242, 0.02)',
                                borderRadius: 2,
                                p: 2
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                <Avatar 
                                  sx={{ 
                                    bgcolor: '#17bf63', 
                                    mr: 2,
                                    width: 40,
                                    height: 40,
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  {comment.userId?.name?.charAt(0) || 'U'}
                                </Avatar>
                                <Box sx={{ flexGrow: 1 }}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mr: 2, color: '#1a1a1a' }}>
                                      {comment.userId?.name || 'Unknown User'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                      {formatDate(comment.createdAt)}
                                    </Typography>
                                    {canEditDelete(comment) && (
                                      <IconButton 
                                        size="small" 
                                        onClick={(e) => handleMenuOpen(e, comment, 'comment')}
                                        sx={{ ml: 'auto', color: '#657786' }}
                                      >
                                        <MoreVertIcon fontSize="small" />
                                      </IconButton>
                                    )}
                                  </Box>
                                  <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                                    {comment.content}
                                  </Typography>
                                </Box>
                              </Box>
                            </Box>
                          ))}
                        </Stack>

                        {/* Add Comment */}
                        <Stack direction="row" spacing={2}>
                          <TextField 
                            size="medium" 
                            fullWidth 
                            placeholder="Write a comment..." 
                            value={commentTexts[tweet._id] || ''} 
                            onChange={(e) => onChangeComment(tweet._id, e.target.value)}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: '25px',
                                '&:hover fieldset': {
                                  borderColor: '#1DA1F2',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#1DA1F2',
                                },
                              },
                            }}
                          />
                          <Button 
                            variant="contained" 
                            onClick={() => onSubmitComment(tweet._id)}
                            sx={{ 
                              borderRadius: '25px',
                              textTransform: 'none',
                              px: 3,
                              background: 'linear-gradient(45deg, #1DA1F2 30%, #0D8BD9 90%)',
                              '&:hover': {
                                background: 'linear-gradient(45deg, #0D8BD9 30%, #1DA1F2 90%)',
                                transform: 'scale(1.05)',
                                transition: 'all 0.2s ease'
                              }
                            }}
                          >
                            Post
                          </Button>
                        </Stack>
                      </Box>
                    )}
                  </Card>
                ))}
              </Stack>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ background: 'linear-gradient(45deg, #1DA1F2 30%, #0D8BD9 90%)', color: 'white' }}>
          Edit {editType === 'tweet' ? 'Tweet' : 'Comment'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            sx={{ 
              mt: 1,
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
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setEditDialogOpen(false)}
            sx={{ 
              borderRadius: '20px',
              textTransform: 'none',
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleEditSave} 
            variant="contained"
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              px: 3,
              background: 'linear-gradient(45deg, #1DA1F2 30%, #0D8BD9 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #0D8BD9 30%, #1DA1F2 90%)',
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
          }
        }}
      >
        <MenuItem onClick={handleEdit} sx={{ borderRadius: 1, mx: 1, my: 0.5 }}>
          <EditIcon sx={{ mr: 1, color: '#1DA1F2' }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main', borderRadius: 1, mx: 1, my: 0.5 }}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%', borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Floating Action Button */}
      <Tooltip title="New Tweet" placement="left">
        <Fab
          color="primary"
          component={RouterLink}
          to="/tweet"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(45deg, #1DA1F2 30%, #0D8BD9 90%)',
            width: 56,
            height: 56,
            '&:hover': {
              background: 'linear-gradient(45deg, #0D8BD9 30%, #1DA1F2 90%)',
              transform: 'scale(1.1)',
              transition: 'all 0.2s ease'
            }
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </>
  )
}

export default Home

