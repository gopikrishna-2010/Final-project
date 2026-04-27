import React, { useContext, useState } from 'react'
import { Box, Card, CardContent, Typography, Container, useTheme, Stack } from '@mui/material'
import { AppContext } from '../App'
import LanguageOverlay from './LanguageOverlay'
import { t } from '../utils/translations'
import AgricultureIcon from '@mui/icons-material/Agriculture'
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'

export default function Home() {
  const { setRoute, language } = useContext(AppContext)
  const theme = useTheme()
  const [openLang, setOpenLang] = useState(false)
  const [target, setTarget] = useState(null)

  const onClickCard = (k) => {
    if (k === 'admin') {
      localStorage.setItem('agri_lang', 'en')
      setRoute('admin')
      return
    }
    setTarget(k)
    setOpenLang(true)
  }

  const roleStyles = {
    farmer: { bg: '#e8f5e9', color: '#1b4332', icon: <AgricultureIcon sx={{ fontSize: 60 }} /> },
    buyer: { bg: '#fff8e1', color: '#ff8f00', icon: <ShoppingBasketIcon sx={{ fontSize: 60 }} /> },
    admin: { bg: '#f5f5f5', color: '#424242', icon: <AdminPanelSettingsIcon sx={{ fontSize: 60 }} /> }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" color="primary" gutterBottom sx={{ fontWeight: 900 }}>
            AgriTrade
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
            {t(language, 'selectYourRole') || 'Choose your role'}
          </Typography>
        </Box>

        <Stack spacing={3}>
          {[
            { id: 'farmer', title: 'I am a Farmer', desc: 'Sell your crops directly', key: 'farmer' },
            { id: 'buyer', title: 'I am a Buyer', desc: 'Buy fresh produce', key: 'buyer' },
            { id: 'admin', title: 'Platform Admin', desc: 'Manage systems', key: 'admin' }
          ].map((role) => (
            <Card
              key={role.id}
              onClick={() => onClickCard(role.id)}
              sx={{
                p: 2,
                cursor: 'pointer',
                bgcolor: roleStyles[role.id].bg,
                borderColor: 'transparent',
                '&:hover': {
                  borderColor: roleStyles[role.id].color,
                  transform: 'scale(1.02)'
                }
              }}
            >
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box sx={{ color: roleStyles[role.id].color }}>
                  {roleStyles[role.id].icon}
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: roleStyles[role.id].color }}>
                    {role.title}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8, color: 'text.secondary' }}>
                    {role.desc}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Container>

      {/* Simplified Footer */}
      <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary', borderTop: '1px solid #eee' }}>
        <Typography variant="caption">
          © {new Date().getFullYear()} AgriTrade Team
        </Typography>
      </Box>

      <LanguageOverlay
        open={openLang}
        onClose={() => setOpenLang(false)}
        onConfirm={(lang, mobile) => {
          setRoute(target || 'home')
          setOpenLang(false)
        }}
        target={target || ''}
      />
    </Box>
  )
}
