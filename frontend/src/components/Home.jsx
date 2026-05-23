import { useState, useEffect } from 'react'
import client from '../api/client.js'

function Home() {
  const [message, setMessage] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    client.get('/home/greeting')
      .then(res => setMessage(res.data.message))
      .catch(err => setError('Error connecting to backend: ' + err.message))
  }, [])

  if (error) return <p>{error}</p>
  if (!message) return <p>Loading...</p>

  return <h1>{message}</h1>
}

export default Home
