"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'en' | 'es' | 'fr' | 'de' | 'it'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Simple translations object
const translations: Record<Language, Record<string, string>> = {
  en: {
    'settings.title': 'Settings',
    'settings.account': 'Account',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Privacy',
    'settings.display': 'Display',
    'settings.theme': 'Theme',
    'settings.language': 'Language',
    'settings.light': 'Light',
    'settings.dark': 'Dark',
    'settings.system': 'System',
    'settings.save': 'Save Changes',
    'settings.reset': 'Reset to Default',
    'settings.saved': 'Settings Saved',
    'settings.error': 'Error saving settings',
    'settings.reset.confirm': 'Are you sure you want to reset all settings to default? This cannot be undone.',
    'settings.reset.success': 'All settings have been reset to default values.',
    'header.home': 'Home',
    'header.movies': 'Movies',
    'header.topRated': 'Top Rated',
    'header.genres': 'Genres',
    'header.watchlist': 'Watchlist',
    'header.settings': 'Settings',
    'header.signOut': 'Sign out',
    'movie.rate': 'Rate Movie',
    'movie.watchTrailer': 'Watch Trailer',
    'movie.overview': 'Overview',
    'movie.director': 'Director',
    'movie.cast': 'Cast',
    'movie.plot': 'Plot',
    'movie.reviews': 'User Reviews',
    'movie.writeReview': 'Write a Review',
    'movie.notFound': 'Movie Not Found',
    'movie.backToHome': 'Back to Home',
  },
  es: {
    'settings.title': 'Configuración',
    'settings.account': 'Cuenta',
    'settings.notifications': 'Notificaciones',
    'settings.privacy': 'Privacidad',
    'settings.display': 'Pantalla',
    'settings.theme': 'Tema',
    'settings.language': 'Idioma',
    'settings.light': 'Claro',
    'settings.dark': 'Oscuro',
    'settings.system': 'Sistema',
    'settings.save': 'Guardar Cambios',
    'settings.reset': 'Restablecer',
    'settings.saved': 'Configuración Guardada',
    'settings.error': 'Error al guardar la configuración',
    'settings.reset.confirm': '¿Estás seguro de que quieres restablecer toda la configuración? Esto no se puede deshacer.',
    'settings.reset.success': 'Toda la configuración ha sido restablecida a los valores predeterminados.',
    'header.home': 'Inicio',
    'header.movies': 'Películas',
    'header.topRated': 'Mejor Valoradas',
    'header.genres': 'Géneros',
    'header.watchlist': 'Lista de Espera',
    'header.settings': 'Configuración',
    'header.signOut': 'Cerrar Sesión',
    'movie.rate': 'Calificar Película',
    'movie.watchTrailer': 'Ver Tráiler',
    'movie.overview': 'Resumen',
    'movie.director': 'Director',
    'movie.cast': 'Reparto',
    'movie.plot': 'Trama',
    'movie.reviews': 'Reseñas de Usuarios',
    'movie.writeReview': 'Escribir Reseña',
    'movie.notFound': 'Película No Encontrada',
    'movie.backToHome': 'Volver al Inicio',
  },
  fr: {
    'settings.title': 'Paramètres',
    'settings.account': 'Compte',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Confidentialité',
    'settings.display': 'Affichage',
    'settings.theme': 'Thème',
    'settings.language': 'Langue',
    'settings.light': 'Clair',
    'settings.dark': 'Sombre',
    'settings.system': 'Système',
    'settings.save': 'Enregistrer',
    'settings.reset': 'Réinitialiser',
    'settings.saved': 'Paramètres Enregistrés',
    'settings.error': 'Erreur lors de l\'enregistrement',
    'settings.reset.confirm': 'Êtes-vous sûr de vouloir réinitialiser tous les paramètres ? Cette action ne peut pas être annulée.',
    'settings.reset.success': 'Tous les paramètres ont été réinitialisés aux valeurs par défaut.',
    'header.home': 'Accueil',
    'header.movies': 'Films',
    'header.topRated': 'Mieux Notés',
    'header.genres': 'Genres',
    'header.watchlist': 'Liste de Souhaits',
    'header.settings': 'Paramètres',
    'header.signOut': 'Se Déconnecter',
    'movie.rate': 'Noter le Film',
    'movie.watchTrailer': 'Voir la Bande Annonce',
    'movie.overview': 'Aperçu',
    'movie.director': 'Réalisateur',
    'movie.cast': 'Distribution',
    'movie.plot': 'Intrigue',
    'movie.reviews': 'Avis des Utilisateurs',
    'movie.writeReview': 'Écrire un Avis',
    'movie.notFound': 'Film Non Trouvé',
    'movie.backToHome': 'Retour à l\'Accueil',
  },
  de: {
    'settings.title': 'Einstellungen',
    'settings.account': 'Konto',
    'settings.notifications': 'Benachrichtigungen',
    'settings.privacy': 'Datenschutz',
    'settings.display': 'Anzeige',
    'settings.theme': 'Design',
    'settings.language': 'Sprache',
    'settings.light': 'Hell',
    'settings.dark': 'Dunkel',
    'settings.system': 'System',
    'settings.save': 'Speichern',
    'settings.reset': 'Zurücksetzen',
    'settings.saved': 'Einstellungen Gespeichert',
    'settings.error': 'Fehler beim Speichern',
    'settings.reset.confirm': 'Sind Sie sicher, dass Sie alle Einstellungen zurücksetzen möchten? Dies kann nicht rückgängig gemacht werden.',
    'settings.reset.success': 'Alle Einstellungen wurden auf die Standardwerte zurückgesetzt.',
    'header.home': 'Startseite',
    'header.movies': 'Filme',
    'header.topRated': 'Beste Bewertungen',
    'header.genres': 'Genres',
    'header.watchlist': 'Wunschliste',
    'header.settings': 'Einstellungen',
    'header.signOut': 'Abmelden',
    'movie.rate': 'Film Bewerten',
    'movie.watchTrailer': 'Trailer Ansehen',
    'movie.overview': 'Übersicht',
    'movie.director': 'Regisseur',
    'movie.cast': 'Besetzung',
    'movie.plot': 'Handlung',
    'movie.reviews': 'Benutzerbewertungen',
    'movie.writeReview': 'Bewertung Schreiben',
    'movie.notFound': 'Film Nicht Gefunden',
    'movie.backToHome': 'Zurück zur Startseite',
  },
  it: {
    'settings.title': 'Impostazioni',
    'settings.account': 'Account',
    'settings.notifications': 'Notifiche',
    'settings.privacy': 'Privacy',
    'settings.display': 'Visualizzazione',
    'settings.theme': 'Tema',
    'settings.language': 'Lingua',
    'settings.light': 'Chiaro',
    'settings.dark': 'Scuro',
    'settings.system': 'Sistema',
    'settings.save': 'Salva',
    'settings.reset': 'Ripristina',
    'settings.saved': 'Impostazioni Salvate',
    'settings.error': 'Errore nel salvataggio',
    'settings.reset.confirm': 'Sei sicuro di voler ripristinare tutte le impostazioni? Questa azione non può essere annullata.',
    'settings.reset.success': 'Tutte le impostazioni sono state ripristinate ai valori predefiniti.',
    'header.home': 'Home',
    'header.movies': 'Film',
    'header.topRated': 'Più Votati',
    'header.genres': 'Generi',
    'header.watchlist': 'Lista dei Desideri',
    'header.settings': 'Impostazioni',
    'header.signOut': 'Disconnetti',
    'movie.rate': 'Vota Film',
    'movie.watchTrailer': 'Guarda il Trailer',
    'movie.overview': 'Panoramica',
    'movie.director': 'Regista',
    'movie.cast': 'Cast',
    'movie.plot': 'Trama',
    'movie.reviews': 'Recensioni Utenti',
    'movie.writeReview': 'Scrivi Recensione',
    'movie.notFound': 'Film Non Trovato',
    'movie.backToHome': 'Torna alla Home',
  },
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    // Load language from localStorage on mount
    const savedLanguage = localStorage.getItem('moviedb_language') as Language
    if (savedLanguage && translations[savedLanguage]) {
      setLanguageState(savedLanguage)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('moviedb_language', lang)
    // Dispatch custom event for UI updates
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }))
  }

  const t = (key: string): string => {
    return translations[language]?.[key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 