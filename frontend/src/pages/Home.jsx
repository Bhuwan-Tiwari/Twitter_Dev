import { Container, AppBar, Toolbar, Typography, Button, Stack, Grid, Paper, List, ListItem, ListItemText, Divider, IconButton, TextField, Chip, Box } from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import { useAuth } from '../context/AuthContext'
import { Link as RouterLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

const Home = () => {
  const { token, logout } = useAuth()
  const navigate = useNavigate()
  const [tweets, setTweets] = useState([])
  const [trending, setTrending] = useState([])
  const [error, setError] = useState('')
  const [likeCounts, setLikeCounts] = useState({})
  const [commentOpen, setCommentOpen] = useState({})
  const [commentTexts, setCommentTexts] = useState({})
  const [commentsByTweet, setCommentsByTweet] = useState({})

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
      // no-op; could show toast
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
    } catch {
      // no-op; could show toast
    }
  }
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Twitter Clone</Typography>
          {token ? (
            <Stack direction="row" spacing={2}>
              <Button color="inherit" component={RouterLink} to="/tweet">Tweet</Button>
              <Button color="inherit" onClick={logout}>Logout</Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={2}>
              <Button color="inherit" component={RouterLink} to="/login">Login</Button>
              <Button color="inherit" component={RouterLink} to="/signup">Sign up</Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} sx={{ mt: 0, px: 0 }}>
        {error && <Typography color="error" sx={{ mb: 2, px: 2 }}>{error}</Typography>}
        
        {/* Trending hashtags at top */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: 0, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2, px: 2 }}>Trending Hashtags</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ px: 2 }}>
            {trending.length === 0 && <Typography variant="body2">No trends yet.</Typography>}
            {trending.map((tag) => (
              <Chip key={tag._id || tag.title} label={`#${tag.title} (${tag.count ?? 0})`} sx={{ mb: 1 }} />
            ))}
          </Stack>
        </Paper>
        
        {/* Feed takes full width */}
        <Paper elevation={0} sx={{ borderRadius: 0, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', minHeight: 'calc(100vh - 200px)' }}>
          <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>Latest Tweets</Typography>
          <List>
            {tweets.length === 0 && <Typography variant="body2">No tweets yet.</Typography>}
            {tweets.map((t) => (
              <Box key={t._id} sx={{ mb: 1 }}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <>
                        <Typography variant="body1">{t.content}</Typography>
                        {t.image && (
                          <img src={t.image} alt="tweet" style={{ maxWidth: '100%', marginTop: 8, borderRadius: 8 }} />
                        )}
                      </>
                    }
                    secondary={new Date(t.createdAt).toLocaleString()}
                  />
                </ListItem>
                <Stack direction="row" spacing={1} sx={{ px: 2, pb: 1 }}>
                  <IconButton size="small" onClick={() => onToggleLike(t._id)}>
                    {(likeCounts[t._id] || 0) > (t.likes?.length || 0) ? <FavoriteIcon fontSize="small" color="error" /> : <FavoriteBorderIcon fontSize="small" />}
                  </IconButton>
                  <Typography variant="body2" sx={{ mr: 2, alignSelf: 'center' }}>{likeCounts[t._id] || 0}</Typography>
                  <IconButton size="small" onClick={() => onToggleCommentBox(t._id)}>
                    <ChatBubbleOutlineIcon fontSize="small" />
                  </IconButton>
                  <Typography variant="body2" sx={{ alignSelf: 'center' }}>
                    {(commentsByTweet[t._id]?.length ?? (t.comments?.length || 0))}
                  </Typography>
                </Stack>
                {commentOpen[t._id] && (
                  <>
                    <List sx={{ px: 2 }}>
                      {(commentsByTweet[t._id] || []).map(c => (
                        <ListItem key={c._id}>
                          <ListItemText primary={c.content} secondary={new Date(c.createdAt).toLocaleString()} />
                        </ListItem>
                      ))}
                    </List>
                    <Stack direction="row" spacing={1} sx={{ px: 2, pb: 2 }}>
                      <TextField size="small" fullWidth placeholder="Write a comment..." value={commentTexts[t._id] || ''} onChange={(e) => onChangeComment(t._id, e.target.value)} />
                      <Button variant="contained" onClick={() => onSubmitComment(t._id)}>Post</Button>
                    </Stack>
                  </>
                )}
                <Divider component="div" />
              </Box>
            ))}
          </List>
        </Paper>
      </Container>
    </>
  )
}

export default Home

