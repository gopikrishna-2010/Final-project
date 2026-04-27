// src/components/LanguageOverlay.jsx
import React, { useState, useContext, useEffect } from 'react'
import { Modal, Box, Typography, Button, Paper, IconButton, Stack } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { AppContext } from '../App'
import { availableLanguages, t } from '../utils/translations'
import LanguageSelector from './LanguageSelector'
import MobilePrompt from './MobilePrompt'
import { speak } from '../utils/tts'

export default function LanguageOverlay({ open, onClose, onConfirm, target }) {
  const { setLanguage: setGlobalLanguage, setMobile: setGlobalMobile } = useContext(AppContext)
  const [lang, setLang] = useState(localStorage.getItem('agri_lang') || 'en')
  const [mobile, setMobile] = useState(localStorage.getItem('agri_mobile') || '')
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState('select') // 'select' | 'mobile'

  useEffect(() => {
    if (open) {
      const storedLang = localStorage.getItem('agri_lang') || 'en'
      const storedMobile = localStorage.getItem('agri_mobile') || ''
      setLang(storedLang)
      setMobile(storedMobile)
      setStep('select')
    }
  }, [open])

  const handleSelectLang = (l) => {
    setLang(l)
    speak(t(l, 'enterMobilePrompt'), l)
    if (target === 'admin') {
      setGlobalLanguage && setGlobalLanguage(l)
      try { localStorage.setItem('agri_lang', l) } catch (e) {}
      onConfirm && onConfirm(l, '')
      setStep('select')
      return
    }
    setStep('mobile')
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      // Actually register the user in the database so they show up in MySQL!
      if (target && mobile) {
        try {
          await fetch('http://127.0.0.1:8081/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: mobile,
              name: target.charAt(0).toUpperCase() + target.slice(1) + ' User',
              mobile: mobile,
              password: 'defaultPassword',
              role: target.toUpperCase()
            })
          });
        } catch (err) {
          console.error("Background registration failed", err);
        }
      }

      setGlobalLanguage && setGlobalLanguage(lang)
      setGlobalMobile && setGlobalMobile(mobile)
      try { localStorage.setItem('agri_lang', lang) } catch (e) {}
      try { localStorage.setItem('agri_mobile', mobile) } catch (e) {}
      onConfirm && onConfirm(lang, mobile)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal open={!!open} onClose={onClose}>
      <Box sx={{
        position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.8)', p: 2
      }}>
        <Paper elevation={0} sx={{ width: '100%', maxWidth: 500, borderRadius: 6, overflow: 'hidden', border: '5px solid #1b4332' }}>
          {/* Header */}
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#f8f9fa' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {step === 'mobile' && <IconButton onClick={() => setStep('select')}><ArrowBackIcon /></IconButton>}
              <Typography variant="h6" sx={{ ml: 1, fontWeight: 900 }}>
                {step === 'select' ? t(lang, 'selectLanguage') : t(lang, 'enterMobile')}
              </Typography>
            </Box>
            <IconButton onClick={onClose}><CloseIcon /></IconButton>
          </Box>

          <Box sx={{ p: 4, bgcolor: 'white' }}>
            {step === 'select' ? (
              <Stack spacing={3}>
                <Typography variant="body1" sx={{ textAlign: 'center', fontWeight: 600 }}>
                  Please choose your language
                </Typography>
                <LanguageSelector lang={lang} onSelect={handleSelectLang} t={t} availableLanguages={availableLanguages} />
              </Stack>
            ) : (
              <MobilePrompt lang={lang} mobile={mobile} onChangeMobile={setMobile} onSubmit={handleSubmit} t={t} target={target} submitting={submitting} />
            )}
          </Box>
        </Paper>
      </Box>
    </Modal>
  )
}