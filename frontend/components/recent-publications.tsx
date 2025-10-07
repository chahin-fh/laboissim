"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Trash2, Eye, Edit, FileText, ExternalLink } from "lucide-react"
import { deletePublication } from "@/lib/publication-service"
import { motion, AnimatePresence } from "framer-motion"

interface PublicationResponse {
  id: string;
  title: string;
  abstract: string;
  posted_at: string;
  category?: 'article' | 'book_chapter' | 'memoire' | 'conference';
  // Article
  journal?: string | null;
  publication_year?: number | null;
  volume?: string | null;
  number?: string | null;
  pages?: string | null;
  // Book / Chapter
  edition?: string | null;
  publication_place?: string | null;
  publisher_name?: string | null;
  // Memoire
  author_name?: string | null;
  thesis_title?: string | null;
  thesis_year?: number | null;
  university?: string | null;
  // Conference
  presentation_title?: string | null;
  conference_title?: string | null;
  conference_year?: number | null;
  conference_location?: string | null;
  conference_pages?: string | null;
  posted_by?: {
    id: string;
    name: string;
  };
  tagged_members?: Array<{
    id: string;
    name: string;
    username: string;
  }>;
  tagged_externals?: Array<{
    id: string;
    name: string;
    email: string;
  }>;
  attached_files?: Array<{
    id: string;
    name: string;
    file: string;
    file_type: string;
    size: number;
  }>;
  keywords?: string[];
}

interface RecentPublicationsProps {
  publications: PublicationResponse[];
  currentUserId: string;
  onPublicationDelete: (publicationId: string) => void;
  onPublicationEdit?: (publication: PublicationResponse) => void;
}

export function RecentPublications({ publications, currentUserId, onPublicationDelete, onPublicationEdit }: RecentPublicationsProps) {
  const router = useRouter()
  const [showAllPublications, setShowAllPublications] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isUserPublication = (publication: PublicationResponse) => {
    return publication.posted_by?.id === currentUserId
  }

  const getCategoryDisplayName = (category?: string) => {
    switch (category) {
      case 'article': return 'Article'
      case 'book_chapter': return 'Livre / Chapitre'
      case 'memoire': return 'Mémoires'
      case 'conference': return 'Conférence'
      default: return 'Publication'
    }
  }

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'article': return 'bg-blue-600'
      case 'book_chapter': return 'bg-purple-600'
      case 'memoire': return 'bg-green-600'
      case 'conference': return 'bg-orange-600'
      default: return 'bg-gray-600'
    }
  }

  const recentPublications = publications.slice(0, 3)

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-800">Publications récentes :</h4>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/publications')}
            className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Voir toutes
          </Button>
          {publications.length > 3 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllPublications(!showAllPublications)}
              className="text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
            >
              <Eye className="h-3 w-3 mr-1" />
              {showAllPublications ? "Réduire" : "Voir tous"}
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!showAllPublications ? (
          // Recent 3 publications view
          <motion.div
            key="recent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {recentPublications.map((publication) => (
              <div key={publication.id} className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <BookOpen className="h-4 w-4 text-green-600" />
                      <h5 className="font-medium text-gray-800">{publication.title}</h5>
                      <Badge className={`${getCategoryColor(publication.category)} text-white text-xs`}>
                        {getCategoryDisplayName(publication.category)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{publication.abstract}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">{publication.posted_by?.name || 'Utilisateur'}</span>
                        {isUserPublication(publication) && (
                          <Badge variant="secondary" className="text-xs">
                            Vous
                          </Badge>
                        )}
                        {publication.attached_files && publication.attached_files.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <FileText className="h-3 w-3 text-orange-600" />
                            <span className="text-xs text-orange-600">{publication.attached_files.length}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">{formatDate(publication.posted_at)}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-3">
                    {isUserPublication(publication) && (
                      <>
                        {onPublicationEdit && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => onPublicationEdit(publication)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-800"
                          onClick={async () => {
                            try {
                              await deletePublication(publication.id);
                              onPublicationDelete(publication.id);
                            } catch (error) {
                              console.error('Error deleting publication:', error);
                            }
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {publications.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">
                Aucune publication disponible
              </p>
            )}
          </motion.div>
        ) : (
          // All publications table view
          <motion.div
            key="all"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-green-600" />
                  Toutes les publications
                </CardTitle>
                <CardDescription>
                  {publications.length} publication{publications.length > 1 ? 's' : ''} au total
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Publié par</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Document</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {publications.map((publication) => (
                      <TableRow key={publication.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center space-x-2">
                              <BookOpen className="h-4 w-4 text-green-600" />
                              <span>{publication.title}</span>
                            </div>
                            <p className="text-xs text-gray-500 line-clamp-2">{publication.abstract}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getCategoryColor(publication.category)} text-white text-xs`}>
                            {getCategoryDisplayName(publication.category)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{publication.posted_by?.name || 'Utilisateur'}</span>
                            {isUserPublication(publication) && (
                              <Badge variant="secondary" className="text-xs">
                                Vous
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(publication.posted_at)}</TableCell>
                        <TableCell>
                          {publication.attached_files && publication.attached_files.length > 0 ? (
                            <div className="flex items-center space-x-1">
                              <FileText className="h-4 w-4 text-orange-600" />
                              <span className="text-sm">{publication.attached_files[0].name}</span>
                              {publication.attached_files.length > 1 && (
                                <span className="text-xs text-gray-500">+{publication.attached_files.length - 1}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {isUserPublication(publication) && (
                              <>
                                {onPublicationEdit && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-blue-600 hover:text-blue-800"
                                    onClick={() => onPublicationEdit(publication)}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-600 hover:text-red-800"
                                  onClick={async () => {
                                    try {
                                      await deletePublication(publication.id);
                                      onPublicationDelete(publication.id);
                                    } catch (error) {
                                      console.error('Error deleting publication:', error);
                                    }
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
