"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, BookOpen, FileText, Users, Award, ExternalLink, Download, Eye, Tag, UserPlus, Table } from "lucide-react"
import { getPublications } from "@/lib/publication-service"
import PublicationDetailModal from "@/components/publication-detail-modal"
import { Table as UITable, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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

export default function PublicationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")
  const [dynamicPublications, setDynamicPublications] = useState<PublicationResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPublication, setSelectedPublication] = useState<PublicationResponse | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')

  const fetchPublications = async () => {
    try {
      const publications = await getPublications()
      setDynamicPublications(publications)
    } catch (error) {
      console.error('Error fetching publications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPublications()
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

  const handlePublicationClick = (publication: PublicationResponse) => {
    setSelectedPublication(publication)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPublication(null)
  }

  // Transform dynamic publications to match the display format and new schema
  const transformedDynamicPublications = dynamicPublications.map((pub) => {
    const type =
      pub.category === 'article' ? 'Article' :
      pub.category === 'book_chapter' ? 'Livre / Chapitre' :
      pub.category === 'memoire' ? 'Mémoires' :
      pub.category === 'conference' ? 'Conférence' : 'Publication'

    const year =
      pub.category === 'article' ? (pub.publication_year ?? new Date(pub.posted_at).getFullYear()) :
      pub.category === 'book_chapter' ? (pub.publication_year ?? new Date(pub.posted_at).getFullYear()) :
      pub.category === 'memoire' ? (pub.thesis_year ?? new Date(pub.posted_at).getFullYear()) :
      pub.category === 'conference' ? (pub.conference_year ?? new Date(pub.posted_at).getFullYear()) :
      new Date(pub.posted_at).getFullYear()

    const firstFileUrl = pub.attached_files && pub.attached_files.length > 0 ? pub.attached_files[0].file : '#'
    const authors = [pub.posted_by?.name || 'Utilisateur', ...(pub.tagged_members?.map(m => m.name) || [])]

    return {
      id: pub.id,
      title: pub.title,
      authors,
      journal: pub.category === 'article' ? (pub.journal || '—') : (
        pub.category === 'book_chapter' ? (pub.publisher_name || '—') : (
          pub.category === 'memoire' ? (pub.university || '—') : (
            pub.category === 'conference' ? (pub.conference_title || '—') : '—'
          )
        )
      ),
      year,
      type,
      abstract: pub.abstract,
      keywords: pub.keywords || [],
      doi: `internal.${pub.id}`,
      url: firstFileUrl,
      citations: 0,
      pdf: firstFileUrl,
      // Keep raw fields for detailed rendering
      ...pub,
      tagged_members: pub.tagged_members || [],
      tagged_externals: pub.tagged_externals || [],
      attached_files: pub.attached_files || [],
    }
  })

  // Combine dynamic and static publications
  const allPublications = [...transformedDynamicPublications]

  const filteredPublications = allPublications.filter((pub) => {
    const matchesSearch =
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.authors.join(" ").toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.keywords.join(" ").toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.tagged_members.map(m => m.name).join(" ").toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.tagged_externals.map(e => e.name).join(" ").toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = selectedType === "all" || pub.type === selectedType
    const matchesYear = selectedYear === "all" || pub.year.toString() === selectedYear

    return matchesSearch && matchesType && matchesYear
  })

  const publicationTypes = Array.from(new Set(allPublications.map((pub) => pub.type)))
  const publicationYears = Array.from(new Set(allPublications.map((pub) => pub.year.toString())))

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-electric-50 to-violet-100 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des publications...</p>
        </div>
      </div>
    )
  }

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
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <BookOpen className="h-10 w-10 text-white" />
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-violet-600 via-electric-600 to-violet-600 bg-clip-text text-transparent mb-6 animate-rotate-gradient bg-[length:200%_auto]">
            Nos Publications
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez les publications scientifiques de notre équipe de recherche dans des revues internationales de
            premier plan.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {[
            { icon: FileText, number: allPublications.length.toString(), label: "Publications", color: "violet" },
            { icon: Users, number: Array.from(new Set(allPublications.flatMap(p => p.authors))).length.toString(), label: "Auteurs", color: "electric" },
            { icon: Award, number: "12", label: "Prix", color: "violet" },
            { icon: BookOpen, number: allPublications.reduce((total, pub) => total + pub.citations, 0).toString(), label: "Citations", color: "electric" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-violet-100"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-${stat.color}-100 rounded-full flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Rechercher une publication..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-gray-200 focus:border-violet-500 focus:ring-violet-500"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-48">
                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="border-gray-200 focus:border-violet-500 focus:ring-violet-500">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les types</SelectItem>
                        {publicationTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full sm:w-48">
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger className="border-gray-200 focus:border-violet-500 focus:ring-violet-500">
                        <SelectValue placeholder="Année" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les années</SelectItem>
                        {publicationYears.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'cards' ? 'default' : 'outline'}
                      onClick={() => setViewMode('cards')}
                      className="flex items-center gap-2"
                    >
                      <BookOpen className="h-4 w-4" />
                      Cartes
                    </Button>
                    <Button
                      variant={viewMode === 'table' ? 'default' : 'outline'}
                      onClick={() => setViewMode('table')}
                      className="flex items-center gap-2"
                    >
                      <Table className="h-4 w-4" />
                      Voir tous
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Publications List */}
        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="space-y-6">
          {filteredPublications.length > 0 ? (
            viewMode === 'cards' ? (
              filteredPublications.map((publication, index) => (
                <motion.div key={publication.id} variants={fadeInUp}>
                  <Card 
                    className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                    onClick={() => handlePublicationClick(publication)}
                  >
                    <CardHeader>
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              className={`${
                                publication.type === "Article"
                                  ? "bg-violet-600"
                                  : publication.type === "Review"
                                    ? "bg-electric-600"
                                    : "bg-green-600"
                              } text-white`}
                            >
                              {publication.type}
                            </Badge>
                            <Badge variant="outline" className="border-gray-300 text-gray-600">
                              {publication.year}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl text-gray-800 mb-2 hover:text-violet-600 transition-colors cursor-pointer">
                            {publication.title}
                          </CardTitle>
                          <p className="text-gray-600 mb-2">
                            <strong>Auteurs:</strong> {publication.authors.join(", ")}
                            {publication.posted_by && (
                              <span className="ml-2">
                                (Principal:{" "}
                                <span 
                                  className="text-blue-600 hover:text-blue-800 cursor-pointer underline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.location.href = `/profile/${publication.posted_by!.id}`;
                                  }}
                                >
                                  {publication.posted_by.name}
                                </span>
                                )
                              </span>
                            )}
                          </p>
                          {/* Category-specific metadata */}
                          <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                            {publication.type === 'Article' && (
                              <>
                                <div><strong>Journal:</strong> {publication.journal || '—'}</div>
                                <div><strong>Volume/Numéro:</strong> {(publication as any).volume || '—'}/{(publication as any).number || '—'}</div>
                                <div className="md:col-span-2"><strong>Pages:</strong> {(publication as any).pages || '—'}</div>
                              </>
                            )}
                            {publication.type === 'Livre / Chapitre' && (
                              <>
                                <div><strong>Édition:</strong> {(publication as any).edition || '—'}</div>
                                <div><strong>Lieu d'édition:</strong> {(publication as any).publication_place || '—'}</div>
                                <div><strong>Éditeur:</strong> {(publication as any).publisher_name || '—'}</div>
                              </>
                            )}
                            {publication.type === 'Mémoires' && (
                              <>
                                <div><strong>Auteur:</strong> {(publication as any).author_name || '—'}</div>
                                <div><strong>Université:</strong> {(publication as any).university || '—'}</div>
                                <div className="md:col-span-2"><strong>Titre:</strong> {(publication as any).thesis_title || '—'}</div>
                              </>
                            )}
                            {publication.type === 'Conférence' && (
                              <>
                                <div className="md:col-span-2"><strong>Présentation:</strong> {(publication as any).presentation_title || '—'}</div>
                                <div className="md:col-span-2"><strong>Conférence:</strong> {(publication as any).conference_title || '—'}</div>
                                <div><strong>Lieu:</strong> {(publication as any).conference_location || '—'}</div>
                                <div><strong>Pages:</strong> {(publication as any).conference_pages || '—'}</div>
                              </>
                            )}
                          </div>
                          <p className="text-gray-700 leading-relaxed mb-4">{publication.abstract}</p>

                          {/* Keywords */}
                          {publication.keywords && publication.keywords.length > 0 && (
                            <div className="mb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Tag className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-600">Mots-clés:</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {publication.keywords.map((keyword, i) => (
                                  <Badge key={i} variant="outline" className="border-violet-200 text-violet-600">
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Tagged Members */}
                          {publication.tagged_members && publication.tagged_members.length > 0 && (
                            <div className="mb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Users className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-600">Membres tagués:</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {publication.tagged_members.map((member) => (
                                  <Badge 
                                    key={member.id} 
                                    variant="outline" 
                                    className="border-blue-200 text-blue-600 hover:bg-blue-100 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Navigate to member profile
                                      window.location.href = `/profile/${member.id}`;
                                    }}
                                  >
                                    {member.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Tagged Externals */}
                          {publication.tagged_externals && publication.tagged_externals.length > 0 && (
                            <div className="mb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <UserPlus className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-600">Profils externes tagués:</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {publication.tagged_externals.map((external) => (
                                  <Badge 
                                    key={external.id} 
                                    variant="outline" 
                                    className="border-green-200 text-green-600 hover:bg-green-100 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Navigate to external profile page
                                      window.location.href = `/external-profile/${external.id}`;
                                    }}
                                  >
                                    {external.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Attached Files */}
                          {publication.attached_files && publication.attached_files.length > 0 && (
                            <div className="mb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <FileText className="h-4 w-4 text-gray-500" />
                                <span className="text-sm font-medium text-gray-600">Fichiers joints:</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {publication.attached_files.map((file) => (
                                  <Badge key={file.id} variant="outline" className="border-orange-200 text-orange-600">
                                    <FileText className="h-3 w-3 mr-1" />
                                    {file.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col items-end space-y-2 min-w-fit">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-violet-600">{publication.citations}</div>
                            <div className="text-sm text-gray-500">Citations</div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))
            ) : (
              /* Table View */
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-0">
                  <UITable>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Titre</TableHead>
                        <TableHead>Auteur</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Document</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPublications.map((publication) => (
                        <TableRow key={publication.id}>
                          <TableCell className="font-medium max-w-xs">
                            <div className="truncate" title={publication.title}>
                              {publication.title}
                            </div>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {publication.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {publication.posted_by?.name || 'Utilisateur'}
                          </TableCell>
                          <TableCell>
                            {new Date(publication.posted_at).toLocaleDateString('fr-FR')}
                          </TableCell>
                          <TableCell>
                            {publication.attached_files && publication.attached_files.length > 0 ? (
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-orange-600" />
                                <span className="text-sm">{publication.attached_files[0].name}</span>
                              </div>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePublicationClick(publication)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </UITable>
                </CardContent>
              </Card>
            )
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucune publication trouvée avec ces critères.</p>
            </div>
          )}
        </motion.div>

        {/* Publication Detail Modal */}
        {selectedPublication && (
          <PublicationDetailModal
            publication={selectedPublication}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  )
}
