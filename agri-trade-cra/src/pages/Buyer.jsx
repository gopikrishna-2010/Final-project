// src/pages/Buyer.jsx
import React, { useEffect, useState, useContext } from 'react'
import { Box, Typography, Grid, Card, CardMedia, CardContent, Button, Container, TextField, InputAdornment, IconButton, Stack, Paper } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import RefreshIcon from '@mui/icons-material/Refresh'
import CallIcon from '@mui/icons-material/Call'
import HomeIcon from '@mui/icons-material/Home'
import { t } from '../utils/translations'
import { AppContext } from '../App'

const API_URL = 'http://127.0.0.1:8081/api/products';

export default function Buyer() {
  const { language, setRoute } = useContext(AppContext)
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const myMobile = localStorage.getItem('agri_mobile') || ''

  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      if (response.ok) setProducts(await response.json());
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchProducts();
  }, [])

  const filteredProducts = products.filter(p =>
    (p.crop || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Box sx={{ minHeight: '100vh', pt: 10, pb: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main' }}>
              {t(language, 'buyer')} {t(language, 'dashboard')}
            </Typography>
            <Typography variant="body2" color="text.secondary">Find fresh crops near you</Typography>
          </Box>
          <IconButton color="primary" onClick={() => setRoute('home')} sx={{ bgcolor: '#eee' }}>
            <HomeIcon />
          </IconButton>
        </Box>

        {/* Search Bar */}
        <Paper sx={{ p: 1, mb: 4, borderRadius: 4, display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Search crops (e.g. Wheat)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
              sx: { border: 'none', '& fieldset': { border: 'none' } }
            }}
          />
          <IconButton onClick={fetchProducts} color="primary" sx={{ p: 2 }}>
            <RefreshIcon />
          </IconButton>
        </Paper>

        <Grid container spacing={3}>
          {filteredProducts.length ? filteredProducts.map(p => (
            <Grid item xs={12} sm={6} key={p.id}>
              <Card sx={{ p: 1, display: 'flex', gap: 2, alignItems: 'center' }}>
                <img src={p.image} style={{ width: 100, height: 100, borderRadius: 12, objectFit: 'cover' }} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {t(language, 'crop_' + p.crop.toLowerCase()) || p.crop}
                  </Typography>
                  <Typography variant="h5" color="primary" sx={{ fontWeight: 900 }}>₹{p.rate}/Kg</Typography>
                  <Typography variant="body2" color="text.secondary">Qty: {p.quantity} Kg</Typography>
                  
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<CallIcon />}
                    href={'tel:' + p.farmerMobile}
                    sx={{ mt: 1, py: 1, borderRadius: 3 }}
                  >
                    {t(language, 'call')}
                  </Button>
                </Box>
              </Card>
            </Grid>
          )) : (
            <Box sx={{ width: '100%', py: 8, textAlign: 'center' }}>
              <Typography color="text.secondary">{t(language, 'noProducts')}</Typography>
            </Box>
          )}
        </Grid>
      </Container>
    </Box>
  )
}

