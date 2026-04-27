import React, { useMemo, useEffect, useState } from 'react'
import { Box, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Container, useTheme, Card, Avatar, Divider, Chip } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, Cell } from 'recharts'
import { t } from '../utils/translations'
import mockData from '../data/mockData.json'
import PeopleIcon from '@mui/icons-material/People'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AssessmentIcon from '@mui/icons-material/Assessment'

export default function Admin(){
  const theme = useTheme()
  const language = localStorage.getItem('agri_lang') || 'en'
  const [products, setProducts] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const prev = window.__agri_tts_enabled
        window.__agri_tts_enabled = false
        return () => { window.__agri_tts_enabled = prev }
      }
    } catch (e) {}
  }, [])

  const loadProducts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8081/api/products')
      if (response.ok) {
        const data = await response.json()
        const localProducts = JSON.parse(localStorage.getItem('agri_products') || '[]')
        setProducts([...data, ...localProducts])
      } else {
        const localProducts = JSON.parse(localStorage.getItem('agri_products') || '[]')
        setProducts(localProducts)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      const localProducts = JSON.parse(localStorage.getItem('agri_products') || '[]')
      setProducts(localProducts)
    }
  }

  const loadUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8081/api/users')
      if (response.ok) {
        const userData = await response.json()
        setUsers(userData)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  useEffect(()=> {
    loadProducts()
    loadUsers()
    const onUpdate = () => loadProducts()
    window.addEventListener('agri_products_updated', onUpdate)
    const onStorage = (ev) => {
      if(ev.key === 'agri_products_updated_ts') loadProducts()
    }
    window.addEventListener('storage', onStorage)
    return () => {
      window.removeEventListener('agri_products_updated', onUpdate)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  const graph1 = useMemo(()=>{
    const map = {}
    products.forEach(p=>{
      if(!map[p.crop]) map[p.crop] = {crop:p.crop, quantity:0, farmers: new Set()}
      map[p.crop].quantity += Number(p.quantity || 0)
      map[p.crop].farmers.add(p.farmerMobile || p.farmerId)
    })
    return Object.values(map).map(o=> ({ crop:o.crop, label: t(language, 'crop_'+String(o.crop).toLowerCase()), quantity:o.quantity, farmers: o.farmers.size }))
  },[products, language])

  const registeredCounts = useMemo(() => {
    const farmerSet = new Set((products || []).map(p => p.farmerMobile).filter(Boolean))
    const purchases = (mockData.purchases || []).concat(JSON.parse(localStorage.getItem('agri_purchases') || '[]'))
    const buyerSet = new Set((purchases || []).map(pu => pu.buyerMobile).filter(Boolean))
    return { farmers: farmerSet.size, buyers: buyerSet.size }
  }, [products])

  const farmers = useMemo(() => users.filter(user => user.role === 'FARMER'), [users])
  const buyers = useMemo(() => users.filter(user => user.role === 'BUYER'), [users])

  const graph2 = useMemo(()=>{
    const purchases = JSON.parse(localStorage.getItem('agri_purchases') || '[]')
    const map = {}
    purchases.forEach(pu=>{
      const prod = products.find(pp=> pp.id === pu.productId)
      if(!prod) return
      if(!map[prod.crop]) map[prod.crop] = { crop: prod.crop, purchased:0 }
      map[prod.crop].purchased += Number(pu.quantity || 0)
    })
    return Object.values(map).map(o=> ({ crop:o.crop, label: t(language, 'crop_'+String(o.crop).toLowerCase()), purchased: o.purchased }))
  },[products, language])

  return (
    <Box sx={{ minHeight: '100vh', pt: 12, pb: 8, bgcolor: 'background.default' }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, color: 'primary.dark', mb: 1 }}>
            Admin Insights
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive platform overview and trading analytics
          </Typography>
        </Box>

        <Grid container spacing={3} sx={{ mb: 6 }}>
          {[
            { label: 'Registered Farmers', value: farmers.length || registeredCounts.farmers, icon: <PeopleIcon />, color: theme.palette.primary.main },
            { label: 'Registered Buyers', value: buyers.length || registeredCounts.buyers, icon: <ShoppingCartIcon />, color: theme.palette.secondary.main },
            { label: 'Total Listings', value: products.length, icon: <AssessmentIcon />, color: theme.palette.info.main },
          ].map((stat, i) => (
            <Grid item xs={12} sm={4} key={i}>
              <Card sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>
                  {stat.icon}
                </Avatar>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800 }}>{stat.value}</Typography>
                  <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 4, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 4 }}>Inventory Analysis</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={graph1} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} fontSize={12} />
                  <YAxis axisLine={false} tickLine={false} fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: theme.shadows[10] }} />
                  <Legend iconType="circle" />
                  <Bar dataKey="quantity" name="Total Quantity" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="farmers" name="Farmer Count" fill={theme.palette.secondary.main} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ p: 4, height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 4 }}>Purchase Volume</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={graph2} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="label" axisLine={false} tickLine={false} fontSize={12} />
                  <YAxis axisLine={false} tickLine={false} fontSize={12} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: theme.shadows[10] }} />
                  <Bar dataKey="purchased" name="Purchased Qty" fill={theme.palette.warning.main} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ p: 0, overflow: 'hidden' }}>
              <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Farmer Directory</Typography>
                <Chip label={`${farmers.length} Users`} size="small" variant="outlined" />
              </Box>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Mobile Number</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {farmers.map((farmer) => (
                      <TableRow key={farmer.id} hover>
                        <TableCell>{farmer.name || 'Anonymous'}</TableCell>
                        <TableCell>{farmer.mobile}</TableCell>
                      </TableRow>
                    ))}
                    {farmers.length === 0 && <TableRow><TableCell colSpan={2} align="center">No farmers found</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ p: 0, overflow: 'hidden' }}>
              <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.divider}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Buyer Directory</Typography>
                <Chip label={`${buyers.length} Users`} size="small" variant="outlined" />
              </Box>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table stickyHeader size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Mobile Number</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {buyers.map((buyer) => (
                      <TableRow key={buyer.id} hover>
                        <TableCell>{buyer.name || 'Anonymous'}</TableCell>
                        <TableCell>{buyer.mobile}</TableCell>
                      </TableRow>
                    ))}
                    {buyers.length === 0 && <TableRow><TableCell colSpan={2} align="center">No buyers found</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
