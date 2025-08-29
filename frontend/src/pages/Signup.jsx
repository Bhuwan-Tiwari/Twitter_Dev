import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Container, Box, TextField, Button, Typography, Paper } from '@mui/material'

const Signup = () => {
  const { signup, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signup({ email, password, name })
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError('Signup failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Sign up</Typography>
        <Box component="form" onSubmit={onSubmit}>
          <TextField fullWidth label="Name" margin="normal" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField fullWidth label="Email" margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? 'Creating account...' : 'Sign up'}
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Have an account? <Link to="/login">Login</Link>
        </Typography>
      </Paper>
    </Container>
  )
}

export default Signup

