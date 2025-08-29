import { useState } from 'react'
import api from '../lib/api'
import { Container, Paper, Typography, TextField, Button, Stack } from '@mui/material'

const TweetCreate = () => {
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const form = new FormData()
      form.append('content', content)
      if (image) form.append('image', image)
      await api.post('/tweets', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      setContent('')
      setImage(null)
      alert('Tweet created')
    } catch (err) {
      setError('Failed to create tweet')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Create Tweet</Typography>
        <form onSubmit={onSubmit}>
          <Stack spacing={2}>
            <TextField label="What's happening?" multiline minRows={3} value={content} onChange={(e) => setContent(e.target.value)} />
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
            {error && <Typography color="error" variant="body2">{error}</Typography>}
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? 'Posting...' : 'Tweet'}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  )
}

export default TweetCreate

