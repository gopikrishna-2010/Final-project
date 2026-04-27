// src/pages/Farmer.jsx
import React, { useState, useEffect, useContext } from 'react'
import { Box, Typography, Grid, Card, CardContent, Button, Dialog, TextField, MenuItem, Snackbar, Container, IconButton, Stack, Paper, Modal } from '@mui/material'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import AddBoxIcon from '@mui/icons-material/AddBox'
import ListAltIcon from '@mui/icons-material/ListAlt'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import HomeIcon from '@mui/icons-material/Home'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { t } from '../utils/translations'
import { AppContext } from '../App'
import { speak } from '../utils/tts'

const cropList = [
  'wheat','rice','maize','sugarcane','cotton','groundnut','soybean','millet',
  'tomato','potato','onion','chili','coriander','banana','mango','coconut'
]

const cropImages = {
  wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
  rice: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
  maize: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400',
  sugarcane: 'https://images.unsplash.com/photo-1590240974613-2616857183e2?w=400',
  cotton: 'https://images.unsplash.com/photo-1615811721580-f00e93433668?w=400',
  groundnut: 'https://images.unsplash.com/photo-1525463133618-9366df041071?w=400',
  soybean: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400',
  millet: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=400',
  tomato: 'https://images.unsplash.com/photo-1518977676601-b53f02bad67b?w=400',
  potato: 'https://images.unsplash.com/photo-1518977676601-b53f02bad67b?w=400',
  onion: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400',
  chili: 'https://images.unsplash.com/photo-1588253524114-164741366160?w=400',
  coriander: 'https://images.unsplash.com/photo-1596450514735-24d65378c1ec?w=400',
  banana: 'https://images.unsplash.com/photo-1571771894821-ad996211fdf4?w=400',
  mango: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400',
  coconut: 'https://images.unsplash.com/photo-1584947848529-397efb76392c?w=400'
};

const API_URL = 'http://127.0.0.1:8081/api/products';

export default function Farmer() {
  const { language, setRoute } = useContext(AppContext)
  const userMobile = localStorage.getItem('agri_mobile') || ''
  
  const [view, setView] = useState('home') // home | add | list
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ crop: 'wheat', quantity: '', rate: '', images: [] })
  const [editingId, setEditingId] = useState(null)
  const [snack, setSnack] = useState({ open: false, msg: '' })

  useEffect(() => {
    if (userMobile) fetchProducts();
  }, [userMobile]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/farmer/${userMobile}`);
      if (response.ok) setProducts(await response.json());
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    if (!form.quantity || !form.rate) {
      setSnack({ open: true, msg: 'Please fill all fields' });
      return;
    }

    const payload = {
      ...form,
      farmerMobile: userMobile,
      date: new Date().toISOString().slice(0, 10),
      image: form.images[0] || cropImages[form.crop] || 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'
    };

    try {
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;
      const method = editingId ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const msg = t(language, editingId ? 'updatedProductSuccess' : 'addedProductSuccess');
        setSnack({ open: true, msg });
        speak(msg, language);
        fetchProducts();
        setView('list');
        setEditingId(null);
      } else {
        const errData = await response.json().catch(() => ({}));
        setSnack({ open: true, msg: 'Server error: ' + (errData.message || response.statusText || 'Failed to save') });
      }
    } catch (e) {
      console.error('Fetch error:', e);
      setSnack({ open: true, msg: 'Network error: Could not reach the server' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t(language, 'confirmDelete'))) return;
    try {
      const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
        setSnack({ open: true, msg: t(language, 'deletedProductSuccess') });
      }
    } catch (e) { console.error(e); }
  };

  const renderDashboard = () => (
    <Stack spacing={3}>
      {/* Quick Info Grid */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Paper sx={{ p: 2, bgcolor: '#e3f2fd', textAlign: 'center', borderRadius: 4 }}>
            <WbSunnyIcon sx={{ color: '#1976d2', fontSize: 40, mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 800 }}>32°C</Typography>
            <Typography variant="body2">{t(language, 'weather')}</Typography>
            <IconButton size="small" onClick={() => speak(`32 degrees Celsius, sunny day`, language)}>
              <VolumeUpIcon fontSize="small" />
            </IconButton>
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper sx={{ p: 2, bgcolor: '#fff3e0', textAlign: 'center', borderRadius: 4 }}>
            <TrendingUpIcon sx={{ color: '#e65100', fontSize: 40, mb: 1 }} />
            <Typography variant="h5" sx={{ fontWeight: 800 }}>₹2400</Typography>
            <Typography variant="body2">Wheat/Qtl</Typography>
            <IconButton size="small" onClick={() => speak(`Wheat rate today is 2400 rupees per quintal`, language)}>
              <VolumeUpIcon fontSize="small" />
            </IconButton>
          </Paper>
        </Grid>
      </Grid>

      {/* Main Action Tiles */}
      <Button
        variant="contained"
        fullWidth
        startIcon={<AddBoxIcon sx={{ fontSize: 40 }} />}
        onClick={() => { setView('add'); setEditingId(null); setForm({ crop: 'wheat', quantity: '', rate: '', images: [] }); }}
        sx={{ py: 3, fontSize: '1.5rem', bgcolor: 'primary.main', borderRadius: 5, boxShadow: '0 8px 16px rgba(0,0,0,0.1)' }}
      >
        {t(language, 'addProduct')}
      </Button>

      <Button
        variant="outlined"
        fullWidth
        startIcon={<ListAltIcon sx={{ fontSize: 40 }} />}
        onClick={() => setView('list')}
        sx={{ py: 3, fontSize: '1.5rem', borderRadius: 5, borderWidth: 3, '&:hover': { borderWidth: 3 } }}
      >
        {t(language, 'myCrops')}
      </Button>

      {/* Alerts Section */}
      <Box sx={{ p: 3, bgcolor: '#fffde7', borderRadius: 5, borderLeft: '10px solid #fbc02d' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#f57f17', mb: 1 }}>{t(language, 'alerts')}</Typography>
        <Typography variant="body2">Rain expected tomorrow evening. Secure your crops!</Typography>
        <Button startIcon={<VolumeUpIcon />} onClick={() => speak("Rain expected tomorrow evening. Secure your crops!", language)}>
          Listen
        </Button>
      </Box>
    </Stack>
  );

  const renderAddForm = () => (
    <Stack spacing={3}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => setView('home')}><ArrowBackIcon /></IconButton>
        <Typography variant="h5" sx={{ ml: 1, fontWeight: 900 }}>{editingId ? 'Update' : t(language, 'addProduct')}</Typography>
      </Box>

      <TextField select label={t(language, 'selectCrop')} fullWidth value={form.crop} onChange={e => setForm({ ...form, crop: e.target.value })}>
        {cropList.map(c => <MenuItem key={c} value={c}>{t(language, 'crop_' + c)}</MenuItem>)}
      </TextField>

      <TextField label={t(language, 'quantity') + ' (Kg)'} type="number" fullWidth value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
      
      <TextField label={t(language, 'rate') + ' (₹/Kg)'} type="number" fullWidth value={form.rate} onChange={e => setForm({ ...form, rate: e.target.value })} />

      <Box>
        <input accept="image/*" id="icon-button-file" type="file" capture="environment" style={{ display: 'none' }} onChange={async (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (re) => setForm({ ...form, images: [re.target.result] });
            reader.readAsDataURL(file);
          }
        }} />
        <label htmlFor="icon-button-file">
          <Button component="span" fullWidth variant="outlined" startIcon={<PhotoCamera />} sx={{ py: 2, borderStyle: 'dashed', borderRadius: 4 }}>
            {t(language, 'upload')} Photo
          </Button>
        </label>
        {form.images[0] && <Box sx={{ mt: 2, textAlign: 'center' }}><img src={form.images[0]} style={{ width: 100, height: 100, borderRadius: 10, objectFit: 'cover' }} /></Box>}
      </Box>

      <Button variant="contained" size="large" fullWidth onClick={handleSave} sx={{ py: 2, fontSize: '1.2rem', borderRadius: 4 }}>
        {t(language, 'submit')}
      </Button>
    </Stack>
  );

  const renderList = () => (
    <Stack spacing={2}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => setView('home')}><ArrowBackIcon /></IconButton>
        <Typography variant="h5" sx={{ ml: 1, fontWeight: 900 }}>{t(language, 'myCrops')}</Typography>
      </Box>

      {products.length ? products.map(p => (
        <Card key={p.id} sx={{ p: 2, bgcolor: '#f1f8e9' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <img src={p.image} style={{ width: 80, height: 80, borderRadius: 10, objectFit: 'cover' }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{t(language, 'crop_' + p.crop)}</Typography>
              <Typography variant="body2">Qty: {p.quantity} | ₹{p.rate}/Kg</Typography>
              <Box sx={{ mt: 1 }}>
                <IconButton onClick={() => { setForm(p); setEditingId(p.id); setView('add'); }} color="primary"><EditIcon /></IconButton>
                <IconButton onClick={() => handleDelete(p.id)} color="error"><DeleteIcon /></IconButton>
              </Box>
            </Box>
          </Box>
        </Card>
      )) : (
        <Typography textAlign="center" sx={{ py: 4 }} color="text.secondary">{t(language, 'noProducts')}</Typography>
      )}
    </Stack>
  );

  return (
    <Box sx={{ minHeight: '100vh', pt: 10, pb: 6, bgcolor: 'background.default' }}>
      <Container maxWidth="sm">
        {/* Top Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main' }}>
              Namaste,
            </Typography>
            <Typography variant="body2" color="text.secondary">{userMobile}</Typography>
          </Box>
          <IconButton color="primary" onClick={() => setRoute('home')} sx={{ bgcolor: '#eee' }}>
            <HomeIcon />
          </IconButton>
        </Box>

        {view === 'home' && renderDashboard()}
        {view === 'add' && renderAddForm()}
        {view === 'list' && renderList()}

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
            <VolumeUpIcon fontSize="small" /> {t(language, 'speakerTip')}
          </Typography>
        </Box>
      </Container>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack({ open: false, msg: '' })} message={snack.msg} />
    </Box>
  )
}