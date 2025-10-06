"use client"

// Système de gestion de contenu dynamique
export interface SiteContent {
  hero: {
    title: string
    subtitle: string
    description: string
    primaryButtonText: string
    secondaryButtonText: string
  }
  stats: {
    researchers: number
    publications: number
    awards: number
    events: number
    researchersLabel: string
    publicationsLabel: string
    awardsLabel: string
    eventsLabel: string
  }
  about: {
    teamName: string
    description: string
    mission: string
    title: string
    subtitle: string
    history: {
      title: string
      content: string[]
      values: Array<{
        title: string
        description: string
      }>
      achievements: {
        founded: string
        researchers: string
        publications: string
        awards: string
      }
    }
    team: Array<{
      id: string
      name: string
      role: string
      bio: string
      expertise: string[]
      education: string
      publications: number
      citations: number
    }>
    expertise: Array<{
      title: string
      description: string
      skills: string[]
    }>
  }
  contact: {
    address: string
    phone: string
    email: string
    hours: string
    title: string
    subtitle: string
    formName: string
    formEmail: string
    formSubject: string
    formMessage: string
    formSend: string
  }
  logo: {
    text: string
    subtitle: string
    imageUrl?: string
  }
  navigation: {
    home: string
    about: string
    projects: string
    publications: string
    events: string
    contact: string
    login: string
    register: string
    dashboard: string
    profile: string
    logout: string
  }
  projects: {
    title: string
    subtitle: string
    viewAll: string
  }
  publications: {
    title: string
    subtitle: string
    viewAll: string
  }
  events: {
    title: string
    subtitle: string
    viewAll: string
  }
  footer: {
    researchDomains: string[]
    teamIntroduction: string
    teamName: string
    copyright: string
    aboutTitle: string
    quickLinksTitle: string
    contactTitle: string
    followUs: string
  }
  pageTitles: {
    home: string
    about: string
    projects: string
    publications: string
    events: string
    contact: string
    login: string
    register: string
    dashboard: string
    profile: string
    admin: string
  }
  meta: {
    siteTitle: string
    siteDescription: string
    siteKeywords: string
  }
}

// Contenu par défaut (modifiable par l'admin)
export const defaultContent: SiteContent = {
  hero: {
    title: "Innovation & Excellence Scientifique",
    subtitle: "Laboratoire de Recherche Avancée",
    description:
      "Nous repoussons les frontières de la connaissance à travers des recherches innovantes et des collaborations interdisciplinaires de premier plan.",
    primaryButtonText: "Découvrir nos projets",
    secondaryButtonText: "Rejoindre l'équipe",
  },
  stats: {
    researchers: 28,
    publications: 156,
    awards: 15,
    events: 52,
    researchersLabel: "Chercheurs",
    publicationsLabel: "Publications",
    awardsLabel: "Prix reçus",
    eventsLabel: "Événements",
  },
  about: {
    teamName: "Équipe de Recherche Excellence",
    description: "Une équipe pluridisciplinaire dédiée à l'innovation scientifique",
    mission: "Transformer les découvertes scientifiques en solutions concrètes pour la société",
    title: "À propos de nous",
    subtitle: "Notre équipe de recherche",
    history: {
      title: "Notre Histoire",
      content: [
        "Notre équipe de recherche a été fondée en 2010 par le Professeur Jean Martin avec une vision claire : créer un environnement de recherche interdisciplinaire où les frontières traditionnelles entre les domaines scientifiques seraient dépassées.",
        "Ce qui a commencé comme un petit groupe de trois chercheurs passionnés s'est rapidement développé pour devenir l'un des centres de recherche les plus dynamiques et innovants du pays, attirant des talents du monde entier.",
        "Au fil des années, notre équipe a été reconnue pour ses contributions significatives dans divers domaines, de l'intelligence artificielle éthique aux énergies renouvelables, en passant par la médecine personnalisée et la nanotechnologie.",
        "Aujourd'hui, nous sommes fiers de compter plus de 25 chercheurs permanents et de nombreux collaborateurs internationaux, tous unis par la même passion pour la découverte scientifique et l'innovation responsable.",
      ],
      values: [
        {
          title: "Excellence scientifique",
          description: "Nous visons l'excellence dans toutes nos recherches et publications.",
        },
        {
          title: "Collaboration",
          description: "Nous croyons en la puissance de la collaboration interdisciplinaire.",
        },
        {
          title: "Innovation responsable",
          description: "Nous développons des technologies qui bénéficient à la société.",
        },
        {
          title: "Diversité et inclusion",
          description: "Nous valorisons la diversité des perspectives et des expériences.",
        },
      ],
      achievements: {
        founded: "2010",
        researchers: "25+",
        publications: "150+",
        awards: "12",
      },
    },
    team: [
      {
        id: "prof-martin",
        name: "Prof. Jean Martin",
        role: "Directeur de Recherche",
        bio: "Le Professeur Jean Martin dirige l'équipe depuis sa création en 2010. Spécialiste en intelligence artificielle éthique, il a publié plus de 100 articles dans des revues internationales et reçu le Prix d'Excellence en Recherche en 2018.",
        expertise: ["Intelligence Artificielle", "Éthique des Technologies", "Apprentissage Automatique"],
        education: "Doctorat en Informatique, École Polytechnique (2005)",
        publications: 120,
        citations: 5600,
      },
      {
        id: "dr-dubois",
        name: "Dr. Sophie Dubois",
        role: "Chercheuse Principale",
        bio: "Dr. Sophie Dubois est spécialisée en biotechnologie et médecine personnalisée. Ses travaux sur les thérapies géniques ont été publiés dans Nature et Science. Elle a rejoint l'équipe en 2015 après un post-doctorat à Harvard.",
        expertise: ["Biotechnologie", "Médecine Personnalisée", "Thérapie Génique"],
        education: "Doctorat en Biologie Moléculaire, Université de Paris (2012)",
        publications: 85,
        citations: 3200,
      },
    ],
    expertise: [
      {
        title: "Intelligence Artificielle Éthique",
        description:
          "Nous développons des algorithmes d'IA responsables et transparents, en mettant l'accent sur l'équité, l'explicabilité et la protection de la vie privée.",
        skills: ["Apprentissage automatique", "IA explicable", "Équité algorithmique", "Gouvernance de l'IA"],
      },
      {
        title: "Médecine Personnalisée",
        description:
          "Notre recherche en médecine personnalisée vise à adapter les traitements médicaux aux caractéristiques individuelles de chaque patient.",
        skills: ["Génomique", "Thérapie ciblée", "Biomarqueurs", "Médecine de précision"],
      },
    ],
  },
  contact: {
    address: "123 Avenue de la Recherche, 75001 Paris, France",
    phone: "+33 1 23 45 67 89",
    email: "contact@research-excellence.fr",
    hours: "Lundi - Vendredi: 9h00 - 18h00",
    title: "Contactez-nous",
    subtitle: "Nous sommes là pour vous aider",
    formName: "Nom",
    formEmail: "Email",
    formSubject: "Sujet",
    formMessage: "Message",
    formSend: "Envoyer le message",
  },
  logo: {
    text: "Research Excellence",
    subtitle: "Laboratoire d'Innovation",
  },
  navigation: {
    home: "Accueil",
    about: "À propos",
    projects: "Projets",
    publications: "Publications",
    events: "Événements",
    contact: "Contact",
    login: "Connexion",
    register: "S'inscrire",
    dashboard: "Tableau de bord",
    profile: "Profil",
    logout: "Déconnexion",
  },
  projects: {
    title: "Nos Projets",
    subtitle: "Découvrez nos recherches en cours",
    viewAll: "Voir tous les projets",
  },
  publications: {
    title: "Publications",
    subtitle: "Nos dernières publications scientifiques",
    viewAll: "Voir toutes les publications",
  },
  events: {
    title: "Événements",
    subtitle: "Rejoignez-nous lors de nos événements",
    viewAll: "Voir tous les événements",
  },
  footer: {
    researchDomains: ["", "", "", "", ""],
    teamIntroduction: "",
    teamName: "",
    copyright: "",
    aboutTitle: "À propos",
    quickLinksTitle: "Liens rapides",
    contactTitle: "Contact",
    followUs: "Suivez-nous",
  },
  pageTitles: {
    home: "Accueil",
    about: "À propos",
    projects: "Projets",
    publications: "Publications",
    events: "Événements",
    contact: "Contact",
    login: "Connexion",
    register: "Inscription",
    dashboard: "Tableau de bord",
    profile: "Profil",
    admin: "Administration",
  },
  meta: {
    siteTitle: "Laboratoire de Recherche",
    siteDescription: "Laboratoire de recherche avancée dédié à l'innovation scientifique",
    siteKeywords: "recherche, science, innovation, laboratoire, publications",
  },
}

// Hook pour gérer le contenu
import { useState, useEffect } from "react"

export function useContentManager() {
  const [content, setContent] = useState<SiteContent>(defaultContent)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchContent() {
      setLoading(true)
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
        const res = await fetch("http://localhost:8000/api/site-content/", {
          headers: token ? { "Authorization": `Bearer ${token}` } : {},
        })
        if (res.ok) {
          const data = await res.json()
          // Map backend fields to SiteContent structure
          setContent(prev => ({
            ...prev,
            hero: {
              title: data.hero_title || prev.hero.title,
              subtitle: data.hero_subtitle || prev.hero.subtitle,
              description: data.hero_description || prev.hero.description,
              primaryButtonText: data.hero_primary_button || prev.hero.primaryButtonText,
              secondaryButtonText: data.hero_secondary_button || prev.hero.secondaryButtonText,
            },
            logo: {
              text: data.logo_text || prev.logo.text,
              subtitle: data.logo_subtitle || prev.logo.subtitle,
              imageUrl: data.logo_image ? `http://localhost:8000${data.logo_image}` : prev.logo.imageUrl,
            },
            about: {
              ...prev.about,
              teamName: data.about_team_name || prev.about.teamName,
              description: data.about_description || prev.about.description,
              mission: data.about_mission || prev.about.mission,
              title: data.about_title || prev.about.title,
              subtitle: data.about_subtitle || prev.about.subtitle,
            },
            stats: {
              researchers: data.stats_researchers ?? prev.stats.researchers,
              publications: data.stats_publications ?? prev.stats.publications,
              awards: data.stats_awards ?? prev.stats.awards,
              events: data.stats_events ?? prev.stats.events,
              researchersLabel: data.stats_researchers_label || prev.stats.researchersLabel,
              publicationsLabel: data.stats_publications_label || prev.stats.publicationsLabel,
              awardsLabel: data.stats_awards_label || prev.stats.awardsLabel,
              eventsLabel: data.stats_events_label || prev.stats.eventsLabel,
            },
            contact: {
              address: data.contact_address || "",
              phone: data.contact_phone || "",
              email: data.contact_email || "",
              hours: data.contact_hours || "",
              title: data.contact_title || prev.contact.title,
              subtitle: data.contact_subtitle || prev.contact.subtitle,
              formName: data.contact_form_name || prev.contact.formName,
              formEmail: data.contact_form_email || prev.contact.formEmail,
              formSubject: data.contact_form_subject || prev.contact.formSubject,
              formMessage: data.contact_form_message || prev.contact.formMessage,
              formSend: data.contact_form_send || prev.contact.formSend,
            },
            navigation: {
              home: data.nav_home || prev.navigation.home,
              about: data.nav_about || prev.navigation.about,
              projects: data.nav_projects || prev.navigation.projects,
              publications: data.nav_publications || prev.navigation.publications,
              events: data.nav_events || prev.navigation.events,
              contact: data.nav_contact || prev.navigation.contact,
              login: data.nav_login || prev.navigation.login,
              register: data.nav_register || prev.navigation.register,
              dashboard: data.nav_dashboard || prev.navigation.dashboard,
              profile: data.nav_profile || prev.navigation.profile,
              logout: data.nav_logout || prev.navigation.logout,
            },
            projects: {
              title: data.projects_title || prev.projects.title,
              subtitle: data.projects_subtitle || prev.projects.subtitle,
              viewAll: data.projects_view_all || prev.projects.viewAll,
            },
            publications: {
              title: data.publications_title || prev.publications.title,
              subtitle: data.publications_subtitle || prev.publications.subtitle,
              viewAll: data.publications_view_all || prev.publications.viewAll,
            },
            events: {
              title: data.events_title || prev.events.title,
              subtitle: data.events_subtitle || prev.events.subtitle,
              viewAll: data.events_view_all || prev.events.viewAll,
            },
            footer: {
              researchDomains: data.footer_research_domains || ["", "", "", "", ""],
              teamIntroduction: data.footer_team_introduction || "",
              teamName: data.footer_team_name || "",
              copyright: data.footer_copyright || "",
              aboutTitle: data.footer_about_title || prev.footer.aboutTitle,
              quickLinksTitle: data.footer_quick_links_title || prev.footer.quickLinksTitle,
              contactTitle: data.footer_contact_title || prev.footer.contactTitle,
              followUs: data.footer_follow_us || prev.footer.followUs,
            },
            pageTitles: {
              home: data.page_title_home || prev.pageTitles.home,
              about: data.page_title_about || prev.pageTitles.about,
              projects: data.page_title_projects || prev.pageTitles.projects,
              publications: data.page_title_publications || prev.pageTitles.publications,
              events: data.page_title_events || prev.pageTitles.events,
              contact: data.page_title_contact || prev.pageTitles.contact,
              login: data.page_title_login || prev.pageTitles.login,
              register: data.page_title_register || prev.pageTitles.register,
              dashboard: data.page_title_dashboard || prev.pageTitles.dashboard,
              profile: data.page_title_profile || prev.pageTitles.profile,
              admin: data.page_title_admin || prev.pageTitles.admin,
            },
            meta: {
              siteTitle: data.site_title || prev.meta.siteTitle,
              siteDescription: data.site_description || prev.meta.siteDescription,
              siteKeywords: data.site_keywords || prev.meta.siteKeywords,
            },
          }))
        } else {
          // fallback to localStorage
          const savedContent = localStorage.getItem("siteContent")
          if (savedContent) {
            setContent(JSON.parse(savedContent))
          }
        }
      } catch (e) {
        // fallback to localStorage
        const savedContent = localStorage.getItem("siteContent")
        if (savedContent) {
          setContent(JSON.parse(savedContent))
        }
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
    // Vérifier si l'utilisateur est admin
    const userRole = localStorage.getItem("userRole")
    setIsAdmin(userRole === "admin")
  }, [])

  const updateContent = async (newContent: Partial<SiteContent>) => {
    // Update local state immediately for responsiveness
    const updatedContent = { ...content, ...newContent }
    setContent(updatedContent)
    localStorage.setItem("siteContent", JSON.stringify(updatedContent))
    // Prepare backend payload
    // Choose payload type: JSON or FormData if uploading logo
    let useFormData = false
    const payload: any = {}
    if (newContent.hero) {
      payload.hero_title = newContent.hero.title
      payload.hero_subtitle = newContent.hero.subtitle
      payload.hero_description = newContent.hero.description
      payload.hero_primary_button = newContent.hero.primaryButtonText
      payload.hero_secondary_button = newContent.hero.secondaryButtonText
    }
    if (newContent.logo) {
      payload.logo_text = newContent.logo.text
      payload.logo_subtitle = newContent.logo.subtitle
    }
    // Don't include logo_image in JSON payload - it will be handled separately
    if (newContent.stats) {
      payload.stats_researchers = newContent.stats.researchers
      payload.stats_publications = newContent.stats.publications
      payload.stats_awards = newContent.stats.awards
      payload.stats_events = newContent.stats.events
      payload.stats_researchers_label = newContent.stats.researchersLabel
      payload.stats_publications_label = newContent.stats.publicationsLabel
      payload.stats_awards_label = newContent.stats.awardsLabel
      payload.stats_events_label = newContent.stats.eventsLabel
    }
    if (newContent.about) {
      payload.about_team_name = newContent.about.teamName
      payload.about_description = newContent.about.description
      payload.about_mission = newContent.about.mission
      payload.about_title = newContent.about.title
      payload.about_subtitle = newContent.about.subtitle
    }
    if (newContent.contact) {
      payload.contact_address = newContent.contact.address
      payload.contact_phone = newContent.contact.phone
      payload.contact_email = newContent.contact.email
      payload.contact_hours = newContent.contact.hours
      payload.contact_title = newContent.contact.title
      payload.contact_subtitle = newContent.contact.subtitle
      payload.contact_form_name = newContent.contact.formName
      payload.contact_form_email = newContent.contact.formEmail
      payload.contact_form_subject = newContent.contact.formSubject
      payload.contact_form_message = newContent.contact.formMessage
      payload.contact_form_send = newContent.contact.formSend
    }
    if (newContent.navigation) {
      payload.nav_home = newContent.navigation.home
      payload.nav_about = newContent.navigation.about
      payload.nav_projects = newContent.navigation.projects
      payload.nav_publications = newContent.navigation.publications
      payload.nav_events = newContent.navigation.events
      payload.nav_contact = newContent.navigation.contact
      payload.nav_login = newContent.navigation.login
      payload.nav_register = newContent.navigation.register
      payload.nav_dashboard = newContent.navigation.dashboard
      payload.nav_profile = newContent.navigation.profile
      payload.nav_logout = newContent.navigation.logout
    }
    if (newContent.projects) {
      payload.projects_title = newContent.projects.title
      payload.projects_subtitle = newContent.projects.subtitle
      payload.projects_view_all = newContent.projects.viewAll
    }
    if (newContent.publications) {
      payload.publications_title = newContent.publications.title
      payload.publications_subtitle = newContent.publications.subtitle
      payload.publications_view_all = newContent.publications.viewAll
    }
    if (newContent.events) {
      payload.events_title = newContent.events.title
      payload.events_subtitle = newContent.events.subtitle
      payload.events_view_all = newContent.events.viewAll
    }
    if (newContent.footer) {
      payload.footer_research_domains = JSON.stringify(newContent.footer.researchDomains)
      payload.footer_team_introduction = newContent.footer.teamIntroduction
      payload.footer_team_name = newContent.footer.teamName
      payload.footer_copyright = newContent.footer.copyright
      payload.footer_about_title = newContent.footer.aboutTitle
      payload.footer_quick_links_title = newContent.footer.quickLinksTitle
      payload.footer_contact_title = newContent.footer.contactTitle
      payload.footer_follow_us = newContent.footer.followUs
    }
    if (newContent.pageTitles) {
      payload.page_title_home = newContent.pageTitles.home
      payload.page_title_about = newContent.pageTitles.about
      payload.page_title_projects = newContent.pageTitles.projects
      payload.page_title_publications = newContent.pageTitles.publications
      payload.page_title_events = newContent.pageTitles.events
      payload.page_title_contact = newContent.pageTitles.contact
      payload.page_title_login = newContent.pageTitles.login
      payload.page_title_register = newContent.pageTitles.register
      payload.page_title_dashboard = newContent.pageTitles.dashboard
      payload.page_title_profile = newContent.pageTitles.profile
      payload.page_title_admin = newContent.pageTitles.admin
    }
    if (newContent.meta) {
      payload.site_title = newContent.meta.siteTitle
      payload.site_description = newContent.meta.siteDescription
      payload.site_keywords = newContent.meta.siteKeywords
    }
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
      // Support logo upload: if payload contains a File under (logo_image as any)
      let body: BodyInit
      let headers: any = { ...(token ? { "Authorization": `Bearer ${token}` } : {}) }
      
      // Debug: log what we're sending
      console.log('Has logo_image file:', (newContent as any).logo_image instanceof File)
      
      if ((newContent as any).logo_image instanceof File) {
        const form = new FormData()
        Object.entries(payload).forEach(([k, v]) => {
          if (v !== undefined && v !== null) form.append(k, String(v))
        })
        form.append('logo_image', (newContent as any).logo_image as File)
        body = form
        console.log('Using FormData for logo upload')
      } else {
        headers["Content-Type"] = "application/json"
        body = JSON.stringify(payload)
        console.log('Using JSON payload:', payload)
      }
      await fetch("http://localhost:8000/api/site-content/", {
        method: "PUT",
        headers,
        body,
      })
    } catch (e) {
      // Optionally handle error (e.g., show notification)
    }
  }

  return { content, updateContent, isAdmin, loading }
}
