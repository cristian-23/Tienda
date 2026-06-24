'use client'

import { useEffect, useState } from 'react'
import styles from './PWAInstallPrompt.module.css'

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showButton, setShowButton] = useState(false)
  const [isIos, setIsIos] = useState(false)
  const [showIosGuide, setShowIosGuide] = useState(false)
  const [showDesktopGuide, setShowDesktopGuide] = useState(false)

  useEffect(() => {
    // 1. Check if already running in standalone mode (installed PWA)
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true

    if (isStandalone) {
      setShowButton(false)
      return
    }

    // Show button by default on non-standalone clients
    setShowButton(true)

    // 2. Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase()
    const ios = /iphone|ipad|ipod/.test(userAgent)
    setIsIos(ios)

    // 3. Listen for the native beforeinstallprompt event (Android / Desktop Chrome / Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Listen for appinstalled event to hide the button after successful installation
    const handleAppInstalled = () => {
      setDeferredPrompt(null)
      setShowButton(false)
    }

    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true)
      return
    }

    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowButton(false)
      }
      setDeferredPrompt(null)
    } else {
      // Native prompt is not available (e.g. non-HTTPS, or not fired yet)
      setShowDesktopGuide(true)
    }
  }

  if (!showButton) return null

  return (
    <>
      <div className={styles.container}>
        <button 
          onClick={handleInstallClick} 
          className={styles.installBtn}
          title="Instalar panel de administración como aplicación"
        >
          <i className="pi pi-download" style={{ marginRight: '8px' }} />
          Instalar App Admin
        </button>
      </div>

      {showIosGuide && (
        <div className={styles.overlay} onClick={() => setShowIosGuide(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowIosGuide(false)}>
              &times;
            </button>
            <h3 className={styles.modalTitle}>Instalar en iPhone</h3>
            <p className={styles.modalText}>
              Para instalar este panel en tu iPhone, sigue estos sencillos pasos:
            </p>
            <ol className={styles.steps}>
              <li>
                Presiona el botón de <strong>Compartir</strong> <i className="pi pi-share-alt" /> (abajo en Safari).
              </li>
              <li>
                Desliza hacia abajo en el menú.
              </li>
              <li>
                Selecciona <strong>"Añadir a la pantalla de inicio"</strong>.
              </li>
            </ol>
            <button className={styles.modalOkBtn} onClick={() => setShowIosGuide(false)}>
              Entendido
            </button>
          </div>
        </div>
      )}

      {showDesktopGuide && (
        <div className={styles.overlay} onClick={() => setShowDesktopGuide(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setShowDesktopGuide(false)}>
              &times;
            </button>
            <h3 className={styles.modalTitle}>Instalar aplicación</h3>
            <p className={styles.modalText}>
              Para instalar esta aplicación en tu navegador:
            </p>
            <ol className={styles.steps}>
              <li>
                Haz clic en el botón de <strong>Menú</strong> <i className="pi pi-ellipsis-v" /> (los tres puntos arriba a la derecha en Google Chrome o Microsoft Edge).
              </li>
              <li>
                Selecciona la opción <strong>"Guardar y compartir"</strong> o directamente <strong>"Instalar aplicación"</strong>.
              </li>
              <li>
                ¡Listo! El panel se abrirá en una ventana dedicada de tu escritorio.
              </li>
            </ol>
            <p className={styles.noteText}>
              *Nota: Las aplicaciones PWA requieren de una conexión segura (HTTPS) o localhost. En producción (Vercel), la instalación directa en un clic estará habilitada de forma automática.
            </p>
            <button className={styles.modalOkBtn} onClick={() => setShowDesktopGuide(false)}>
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  )
}
