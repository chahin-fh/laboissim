"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { X, Search, Upload, Plus, Users, UserPlus, FileText, Tag, User } from "lucide-react"
import { updatePublication, searchMembers, searchExternals } from "@/lib/publication-service"
import { uploadFile } from "@/lib/file-service"
import { useToast } from "@/hooks/use-toast"

interface MemberSearchResult {
  id: string;
  name: string;
  username: string;
}

interface ExternalSearchResult {
  id: string;
  name: string;
  email: string;
}

interface PublicationEditModalProps {
  publication: {
    id: string;
    title: string;
    abstract: string;
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
  };
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PublicationEditModal({ publication, isOpen, onClose, onSuccess }: PublicationEditModalProps) {
  const { toast } = useToast()
  const [title, setTitle] = useState(publication.title)
  const [abstract, setAbstract] = useState(publication.abstract)
  const [keywords, setKeywords] = useState<string[]>(publication.keywords || [])
  const [keywordInput, setKeywordInput] = useState("")
  const [category, setCategory] = useState<'article' | 'book_chapter' | 'memoire' | 'conference'>(publication.category || 'article')

  // Category-specific fields
  const [articleFields, setArticleFields] = useState({
    journal: publication.journal || '',
    publication_year: publication.publication_year?.toString() || '',
    volume: publication.volume || '',
    number: publication.number || '',
    pages: publication.pages || '',
  })
  const [bookFields, setBookFields] = useState({
    edition: publication.edition || '',
    publication_place: publication.publication_place || '',
    publisher_name: publication.publisher_name || '',
    publication_year: publication.publication_year?.toString() || '',
  })
  const [memoireFields, setMemoireFields] = useState({
    author_name: publication.author_name || '',
    thesis_title: publication.thesis_title || '',
    thesis_year: publication.thesis_year?.toString() || '',
    university: publication.university || '',
  })
  const [conferenceFields, setConferenceFields] = useState({
    presentation_title: publication.presentation_title || '',
    conference_title: publication.conference_title || '',
    conference_year: publication.conference_year?.toString() || '',
    conference_location: publication.conference_location || '',
    conference_pages: publication.conference_pages || '',
  })

  // Member search
  const [memberSearchQuery, setMemberSearchQuery] = useState("")
  const [memberSearchResults, setMemberSearchResults] = useState<MemberSearchResult[]>([])
  const [selectedMembers, setSelectedMembers] = useState<MemberSearchResult[]>(publication.tagged_members || [])
  const [showMemberResults, setShowMemberResults] = useState(false)
  const memberSearchRef = useRef<HTMLDivElement>(null)

  // External search
  const [externalSearchQuery, setExternalSearchQuery] = useState("")
  const [externalSearchResults, setExternalSearchResults] = useState<ExternalSearchResult[]>([])
  const [selectedExternals, setSelectedExternals] = useState<ExternalSearchResult[]>(publication.tagged_externals || [])
  const [showExternalResults, setShowExternalResults] = useState(false)
  const externalSearchRef = useRef<HTMLDivElement>(null)

  // File upload
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (memberSearchRef.current && !memberSearchRef.current.contains(event.target as Node)) {
        setShowMemberResults(false)
      }
      if (externalSearchRef.current && !externalSearchRef.current.contains(event.target as Node)) {
        setShowExternalResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()])
      setKeywordInput("")
    }
  }

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter(k => k !== keywordToRemove))
  }

  const handleAddMember = (member: MemberSearchResult) => {
    if (!selectedMembers.find(m => m.id === member.id)) {
      setSelectedMembers([...selectedMembers, member])
    }
    setMemberSearchQuery("")
    setShowMemberResults(false)
  }

  const handleRemoveMember = (memberId: string) => {
    setSelectedMembers(selectedMembers.filter(m => m.id !== memberId))
  }

  const handleAddExternal = (external: ExternalSearchResult) => {
    if (!selectedExternals.find(e => e.id === external.id)) {
      setSelectedExternals([...selectedExternals, external])
    }
    setExternalSearchQuery("")
    setShowExternalResults(false)
  }

  const handleRemoveExternal = (externalId: string) => {
    setSelectedExternals(selectedExternals.filter(e => e.id !== externalId))
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedFiles([...selectedFiles, ...files])
  }

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title.trim() || !abstract.trim()) {
      toast({
        title: "Erreur",
        description: "Le titre et l'abstract sont requis",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // First, upload all selected files
      const uploadedFileIds: string[] = []
      
      if (selectedFiles.length > 0) {
        toast({
          title: "Upload en cours",
          description: "Téléchargement des fichiers...",
        })
        
        for (const file of selectedFiles) {
          try {
            const uploadedFile = await uploadFile(file)
            uploadedFileIds.push(uploadedFile.id)
          } catch (error) {
            console.error(`Error uploading file ${file.name}:`, error)
            toast({
              title: "Erreur",
              description: `Impossible de télécharger le fichier ${file.name}`,
              variant: "destructive",
            })
            return
          }
        }
      }

      const publicationData: any = {
        title: title.trim(),
        abstract: abstract.trim(),
        category,
        tagged_members: selectedMembers.map(m => m.id),
        tagged_externals: selectedExternals.map(e => e.id),
        keywords: keywords,
        attached_files: [...(publication.attached_files?.map(f => f.id) || []), ...uploadedFileIds],
      }

      // attach category-specific fields
      if (category === 'article') {
        publicationData.journal = articleFields.journal || undefined
        publicationData.publication_year = articleFields.publication_year ? Number(articleFields.publication_year) : undefined
        publicationData.volume = articleFields.volume || undefined
        publicationData.number = articleFields.number || undefined
        publicationData.pages = articleFields.pages || undefined
      } else if (category === 'book_chapter') {
        publicationData.edition = bookFields.edition || undefined
        publicationData.publication_place = bookFields.publication_place || undefined
        publicationData.publisher_name = bookFields.publisher_name || undefined
        publicationData.publication_year = bookFields.publication_year ? Number(bookFields.publication_year) : undefined
      } else if (category === 'memoire') {
        publicationData.author_name = memoireFields.author_name || undefined
        publicationData.thesis_title = memoireFields.thesis_title || undefined
        publicationData.thesis_year = memoireFields.thesis_year ? Number(memoireFields.thesis_year) : undefined
        publicationData.university = memoireFields.university || undefined
      } else if (category === 'conference') {
        publicationData.presentation_title = conferenceFields.presentation_title || undefined
        publicationData.conference_title = conferenceFields.conference_title || undefined
        publicationData.conference_year = conferenceFields.conference_year ? Number(conferenceFields.conference_year) : undefined
        publicationData.conference_location = conferenceFields.conference_location || undefined
        publicationData.conference_pages = conferenceFields.conference_pages || undefined
      }

      console.log('Publication data being sent:', publicationData)

      await updatePublication(publication.id, publicationData)
      
      toast({
        title: "Succès",
        description: "Publication mise à jour avec succès",
      })
      
      onSuccess?.()
      onClose()
    } catch (error) {
      console.error('Error updating publication:', error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la publication",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Modifier la Publication
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la publication..."
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-3">
            <Label>Catégorie</Label>
            <Tabs value={category} onValueChange={(v) => setCategory(v as any)}>
              <TabsList className="flex flex-wrap gap-2">
                <TabsTrigger value="article">Article</TabsTrigger>
                <TabsTrigger value="book_chapter">Livre / Chapitre</TabsTrigger>
                <TabsTrigger value="memoire">Mémoires</TabsTrigger>
                <TabsTrigger value="conference">Conférence</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Separator />

          {/* Abstract */}
          <div className="space-y-2">
            <Label htmlFor="abstract">Abstract *</Label>
            <Textarea
              id="abstract"
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Résumé de la publication (contexte, méthodes, résultats, conclusion)..."
              rows={4}
              required
            />
          </div>

          {/* Category specific fields */}
          <div>
            <h4 className="text-sm font-medium mb-3 text-muted-foreground">Détails spécifiques</h4>
            <div className="rounded-lg border bg-card p-4">
              {category === 'article' && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Journal</Label>
                    <Input placeholder="Ex: Nature, Science..." value={articleFields.journal} onChange={(e) => setArticleFields({ ...articleFields, journal: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Année de publication</Label>
                    <Input type="number" placeholder="Ex: 2025" value={articleFields.publication_year} onChange={(e) => setArticleFields({ ...articleFields, publication_year: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Volume</Label>
                    <Input placeholder="Ex: 12" value={articleFields.volume} onChange={(e) => setArticleFields({ ...articleFields, volume: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Numéro</Label>
                    <Input placeholder="Ex: 3" value={articleFields.number} onChange={(e) => setArticleFields({ ...articleFields, number: e.target.value })} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Pages</Label>
                    <Input placeholder="Ex: 123-138" value={articleFields.pages} onChange={(e) => setArticleFields({ ...articleFields, pages: e.target.value })} />
                  </div>
                </div>
              )}
              {category === 'book_chapter' && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Édition</Label>
                    <Input placeholder="Ex: 2e édition" value={bookFields.edition} onChange={(e) => setBookFields({ ...bookFields, edition: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Lieu d'édition</Label>
                    <Input placeholder="Ex: Paris, France" value={bookFields.publication_place} onChange={(e) => setBookFields({ ...bookFields, publication_place: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Nom de l'éditeur</Label>
                    <Input placeholder="Ex: Dunod" value={bookFields.publisher_name} onChange={(e) => setBookFields({ ...bookFields, publisher_name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Année de publication</Label>
                    <Input type="number" placeholder="Ex: 2025" value={bookFields.publication_year} onChange={(e) => setBookFields({ ...bookFields, publication_year: e.target.value })} />
                  </div>
                </div>
              )}
              {category === 'memoire' && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Auteur</Label>
                    <Input placeholder="Nom complet" value={memoireFields.author_name} onChange={(e) => setMemoireFields({ ...memoireFields, author_name: e.target.value })} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Titre</Label>
                    <Input placeholder="Titre du mémoire / thèse" value={memoireFields.thesis_title} onChange={(e) => setMemoireFields({ ...memoireFields, thesis_title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Année</Label>
                    <Input type="number" placeholder="Ex: 2025" value={memoireFields.thesis_year} onChange={(e) => setMemoireFields({ ...memoireFields, thesis_year: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Université</Label>
                    <Input placeholder="Ex: Université de Tunis" value={memoireFields.university} onChange={(e) => setMemoireFields({ ...memoireFields, university: e.target.value })} />
                  </div>
                </div>
              )}
              {category === 'conference' && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label>Titre de la présentation</Label>
                    <Input placeholder="Titre de l'intervention" value={conferenceFields.presentation_title} onChange={(e) => setConferenceFields({ ...conferenceFields, presentation_title: e.target.value })} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Titre de la conférence</Label>
                    <Input placeholder="Nom de la conférence" value={conferenceFields.conference_title} onChange={(e) => setConferenceFields({ ...conferenceFields, conference_title: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Année</Label>
                    <Input type="number" placeholder="Ex: 2025" value={conferenceFields.conference_year} onChange={(e) => setConferenceFields({ ...conferenceFields, conference_year: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Lieu</Label>
                    <Input placeholder="Ville, Pays" value={conferenceFields.conference_location} onChange={(e) => setConferenceFields({ ...conferenceFields, conference_location: e.target.value })} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Pages</Label>
                    <Input placeholder="Ex: 45-52" value={conferenceFields.conference_pages} onChange={(e) => setConferenceFields({ ...conferenceFields, conference_pages: e.target.value })} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Keywords */}
          <div className="space-y-2">
            <Label>Mots-clés</Label>
            <div className="flex gap-2">
              <Input
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="Ajouter un mot-clé (Entrée pour valider)..."
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddKeyword()
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddKeyword}
                disabled={!keywordInput.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {keywords.map((keyword, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    <Tag className="h-3 w-3" />
                    {keyword}
                    <button
                      type="button"
                      onClick={() => handleRemoveKeyword(keyword)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Member Search */}
          <div className="space-y-2" ref={memberSearchRef}>
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Taguer des membres de l'équipe
            </Label>
            <div className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={memberSearchQuery}
                    onChange={(e) => {
                      const query = e.target.value
                      setMemberSearchQuery(query)
                      if (query.trim()) {
                        setShowMemberResults(true)
                        searchMembers(query).then(results => {
                          setMemberSearchResults(results)
                        }).catch(error => {
                          console.error('Error searching members:', error)
                        })
                      } else {
                        setShowMemberResults(false)
                        setMemberSearchResults([])
                      }
                    }}
                    onFocus={() => {
                      if (memberSearchQuery.trim()) {
                        setShowMemberResults(true)
                      }
                    }}
                    placeholder="Rechercher un membre..."
                    className="pl-10"
                  />
                </div>
              </div>
              
              {showMemberResults && memberSearchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {memberSearchResults.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => handleAddMember(member)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-gray-500">@{member.username}</div>
                    </button>
                  ))}
                </div>
              )}
              
              {showMemberResults && memberSearchQuery.trim() && memberSearchResults.length === 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4 text-center text-gray-500">
                  Aucun membre trouvé
                </div>
              )}
            </div>
            
            {selectedMembers.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedMembers.map((member) => (
                  <Badge key={member.id} variant="outline" className="gap-1">
                    <Users className="h-3 w-3" />
                    {member.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(member.id)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* External Search */}
          <div className="space-y-2" ref={externalSearchRef}>
            <Label className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" />
              Taguer des profils externes
            </Label>
            <div className="relative">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={externalSearchQuery}
                    onChange={(e) => {
                      const query = e.target.value
                      setExternalSearchQuery(query)
                      if (query.trim()) {
                        setShowExternalResults(true)
                        searchExternals(query).then(results => {
                          setExternalSearchResults(results)
                        }).catch(error => {
                          console.error('Error searching externals:', error)
                        })
                      } else {
                        setShowExternalResults(false)
                        setExternalSearchResults([])
                      }
                    }}
                    onFocus={() => {
                      if (externalSearchQuery.trim()) {
                        setShowExternalResults(true)
                      }
                    }}
                    placeholder="Rechercher un profil externe..."
                    className="pl-10"
                  />
                </div>
              </div>
              
              {showExternalResults && externalSearchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {externalSearchResults.map((external) => (
                    <button
                      key={external.id}
                      type="button"
                      onClick={() => handleAddExternal(external)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium">{external.name}</div>
                      <div className="text-sm text-gray-500">{external.email}</div>
                    </button>
                  ))}
                </div>
              )}
              
              {showExternalResults && externalSearchQuery.trim() && externalSearchResults.length === 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-4 text-center text-gray-500">
                  Aucun profil externe trouvé
                </div>
              )}
            </div>
            
            {selectedExternals.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedExternals.map((external) => (
                  <Badge key={external.id} variant="outline" className="gap-1">
                    <UserPlus className="h-3 w-3" />
                    {external.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveExternal(external.id)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Ajouter des fichiers
            </Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Sélectionner des fichiers
              </Button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {selectedFiles.length > 0 && (
              <div className="space-y-2 mt-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Mise à jour..." : "Mettre à jour la publication"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

