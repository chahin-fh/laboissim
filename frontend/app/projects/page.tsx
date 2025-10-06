"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Calendar, Users, Download, ArrowLeft, FileText } from "lucide-react"
import {
  getPublicProjects,
  getPublicProjectDocuments,
  type Project,
  type ProjectDocument,
  getStatusColor,
  getPriorityColor,
  getStatusLabel,
  getPriorityLabel,
  formatFileSize,
} from "@/lib/project-service"

// Use Project type from service instead of local mock

function ProjectDetail({ project, onBack, documents, loading }: { project: Project; onBack: () => void; documents: ProjectDocument[]; loading: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <Button onClick={onBack} variant="ghost" className="text-violet-600 hover:text-violet-700 mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour aux projets
      </Button>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="relative overflow-hidden">
              {project.image ? (
                <Image
                  src={project.image}
                  alt={project.title}
                  width={800}
                  height={400}
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100" />
              )}
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge className={getStatusColor(project.status)}>{getStatusLabel(project.status)}</Badge>
                <Badge className={getPriorityColor(project.priority)}>{getPriorityLabel(project.priority)}</Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle className="text-3xl text-gray-800">{project.title}</CardTitle>
              <p className="text-gray-600 text-lg">{project.description}</p>
            </CardHeader>
          </Card>

          {/* Documents */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-gray-500">Chargement des documents...</p>
              ) : documents.length > 0 ? (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <Button
                      key={doc.id}
                      variant="outline"
                      className="w-full justify-between border-violet-200 text-violet-600 hover:bg-violet-50"
                      onClick={() => window.open(doc.file, '_blank')}
                    >
                      <span className="truncate text-left">
                        {doc.name}
                        <span className="ml-2 text-xs text-gray-500">{formatFileSize(doc.size)} • {doc.uploaded_by_name}</span>
                      </span>
                      <Download className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center text-sm text-gray-500">
                  <FileText className="h-4 w-4 mr-2" />
                  Aucun document pour ce projet
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Informations du Projet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-1">Créé par</h4>
                <div className="text-gray-600">
                  <Link 
                    href={`/profile/${project.created_by}`}
                    className="text-violet-600 hover:text-violet-700 hover:underline transition-colors"
                  >
                    {project.created_by_name}
                  </Link>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-1">Période</h4>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {(project.start_date ? new Date(project.start_date).toLocaleDateString() : '—')} - {(project.end_date ? new Date(project.end_date).toLocaleDateString() : '—')}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-1">Équipe</h4>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {project.team_members_names.length} membres
                </div>
                <ul className="mt-2 space-y-1">
                  {project.team_members_names.map((member, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      • <Link 
                        href={`/profile/${project.team_members[index]}`}
                        className="text-violet-600 hover:text-violet-700 hover:underline transition-colors"
                      >
                        {member}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [documents, setDocuments] = useState<ProjectDocument[]>([])
  const [documentsLoading, setDocumentsLoading] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true)
        const data = await getPublicProjects()
        setProjects(data)
      } catch (e) {
        console.error('Error fetching projects:', e)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const filteredProjects = projects.filter((project) => {
    const query = searchQuery.toLowerCase()
    return (
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query)
    )
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-electric-50 to-violet-100 pt-20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-violet-600 via-electric-600 to-violet-600 bg-clip-text text-transparent mb-6 animate-rotate-gradient bg-[length:200%_auto]">
            Nos Projets de Recherche
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les projets innovants sur lesquels notre équipe travaille actuellement et les résultats de nos
            recherches passées.
          </p>
        </motion.div>

        {selectedProject ? (
          <ProjectDetail
            project={selectedProject}
            documents={documents}
            loading={documentsLoading}
            onBack={() => setSelectedProject(null)}
          />
        ) : (
          <>
            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >

            </motion.div>

            {/* Projects Grid */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {loading ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">Chargement des projets...</p>
                </div>
              ) : filteredProjects.length > 0 ? (
                filteredProjects.map((project) => (
                  <motion.div key={project.id} variants={fadeInUp}>
                    <Card
                      className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col cursor-pointer group"
                      onClick={async () => {
                        setSelectedProject(project)
                        try {
                          setDocumentsLoading(true)
                          const docs = await getPublicProjectDocuments(String(project.id))
                          setDocuments(docs)
                        } catch (e) {
                          console.error('Error loading documents:', e)
                          setDocuments([])
                        } finally {
                          setDocumentsLoading(false)
                        }
                      }}
                    >
                      <div className="relative overflow-hidden">
                        {project.image ? (
                          <Image
                            src={project.image}
                            alt={project.title}
                            width={500}
                            height={300}
                            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-100" />
                        )}
                        <div className="absolute top-4 left-4 flex gap-2">
                          <Badge className={getStatusColor(project.status)}>{getStatusLabel(project.status)}</Badge>
                          <Badge className={getPriorityColor(project.priority)}>{getPriorityLabel(project.priority)}</Badge>
                        </div>
                      </div>
                      <CardHeader className="flex-grow">
                        <CardTitle className="text-xl group-hover:text-violet-600 transition-colors">
                          {project.title}
                        </CardTitle>
                        <p className="text-gray-600 line-clamp-3">{project.description}</p>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-500">
                            {project.team_members_names.length} membres • {project.documents_count} documents
                          </div>
                          <ArrowRight className="h-4 w-4 text-violet-600 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">Aucun projet trouvé avec ces critères.</p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}