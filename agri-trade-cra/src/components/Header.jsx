import React, { useContext, useState, useEffect } from 'react'
import { AppBar, Toolbar, Typography, Box, IconButton, useTheme, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Button, Container, alpha } from '@mui/material'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import HomeIcon from '@mui/icons-material/Home'
import AgricultureIcon from '@mui/icons-material/Agriculture'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import { speak } from '../utils/tts'
import { AppContext } from '../App'
import { t } from '../utils/translations'

export default function Header(){
  const { mode, setMode, language, setRoute, route, mobile, setMobile } = useContext(AppContext)
  const theme = useTheme()
  const [ttsOpen, setTtsOpen] = useState(false)
  const [voices, setVoices] = useState([])
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const load = () => setVoices(window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [])
      load()
      window.speechSynthesis.onvoiceschanged = load
      return () => { try { window.speechSynthesis.onvoiceschanged = null } catch(e){} }
    }
  }, [])

  const goHome = () => setRoute('home')

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        bgcolor: scrolled ? alpha(theme.palette.background.paper, 0.8) : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? `1px solid ${theme.palette.divider}` : 'none',
        transition: 'all 0.3s ease-in-out',
        color: theme.palette.text.primary,
        boxShadow: scrolled ? theme.shadows[2] : 'none'
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ display:'flex', justifyContent:'space-between', px: { xs: 0, sm: 2 } }}>
          <Box sx={{ display:'flex', alignItems:'center', gap: 1.5 }}>
            <IconButton 
              aria-label="home" 
              onClick={goHome} 
              size="medium" 
              sx={{ 
                bgcolor: scrolled ? alpha(theme.palette.primary.main, 0.1) : 'rgba(255,255,255,0.2)',
                color: theme.palette.primary.main,
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
              }}
            >
              <HomeIcon />
            </IconButton>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={goHome}>
              <AgricultureIcon sx={{ fontSize: 28, color: theme.palette.primary.main }} />
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 800, 
                  letterSpacing: '-0.5px',
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                AgriTrade
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display:'flex', alignItems:'center', gap: 1 }}>
            <IconButton 
              onClick={()=> setMode(prev => prev === 'light' ? 'dark' : 'light')} 
              size="large" 
              sx={{ color: theme.palette.primary.main }}
            >
              { mode === 'light' ? <Brightness7Icon/> : <Brightness4Icon/> }
            </IconButton>
            
            { route !== 'admin' && (
              <>
                <IconButton 
                  aria-label="tts-test" 
                  onClick={() => setTtsOpen(true)} 
                  size="large" 
                  sx={{ color: theme.palette.primary.main }}
                >
                  <VolumeUpIcon />
                </IconButton>
                <Dialog open={ttsOpen} onClose={() => setTtsOpen(false)} fullWidth maxWidth="xs">
                  <DialogTitle sx={{ fontWeight: 800 }}>TTS Engine Status</DialogTitle>
                  <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                      { typeof window === 'undefined' || !('speechSynthesis' in window) ? 'SpeechSynthesis not supported in this browser.' : `Total ${voices.length} voices configured for your system.` }
                    </Typography>
                    <List dense sx={{ maxHeight: 200, overflow: 'auto', bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 2 }}>
                      {voices.map((v, i) => (
                        <ListItem key={i}>
                          <ListItemText 
                            primary={v.name || 'unknown'} 
                            secondary={v.lang || 'n/a'} 
                            primaryTypographyProps={{ variant: 'caption', fontWeight: 600 }}
                          />
                        </ListItem>
                      ))}
                    </List>
                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 3 }}>
                      <Button variant="outlined" onClick={() => { try { speak(t(language,'enterMobilePrompt'), language) } catch(e){ console.error(e) } }}>Play Sample</Button>
                      <Button variant="contained" onClick={() => setTtsOpen(false)}>Close</Button>
                    </Box>
                  </DialogContent>
                </Dialog>
                { mobile && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, display: { xs: 'none', md: 'block' } }}>{mobile}</Typography>
                    <Button 
                      size="small" 
                      color="error" 
                      variant="outlined" 
                      onClick={() => {
                        setMobile('')
                        setRoute('home')
                        localStorage.removeItem('agri_mobile')
                      }}
                      sx={{ borderRadius: 2 }}
                    >
                      Logout
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
