"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Trash2, Calendar, User, Eye } from "lucide-react"
import { deletePublication } from "@/lib/publication-service"

interface PublicationResponse {
  id: string;
  title: string;
  abstract: string;
  posted_at: string;
  posted_by?: {
    id: string;
    name: string;
  };
}

interface RecentPublicationsProps {
  publications: PublicationResponse[];
  currentUserId: string;
  onPublicationDelete: (publicationId: string) => void;
}

export function RecentPublications({ publications, currentUserId, onPublicationDelete }: RecentPublicationsProps) {
  const [deletingPublications, setDeletingPublications] = useState<Set<string>>(new Set());

  const handleDelete = async (publicationId: string) => {
    setDeletingPublications(prev => new Set(prev).add(publicationId));
    try {
      await deletePublication(publicationId);
      onPublicationDelete(publicationId);
    } catch (error) {
      console.error('Error deleting publication:', error);
    } finally {
      setDeletingPublications(prev => {
        const newSet = new Set(prev);
        newSet.delete(publicationId);
        return newSet;
      });
    }
  };

  if (publications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Aucune publication partagée</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h4 className="font-medium text-gray-800 mb-3">Publications récentes</h4>
      <div className="space-y-4">
        {publications.map((publication) => (
          <Card key={publication.id} className="bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-gray-800 mb-1">{publication.title}</h5>
                      <p className="text-sm text-gray-600 line-clamp-2">{publication.abstract}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(publication.posted_at).toLocaleDateString()}
                        </span>
                        {publication.posted_by && (
                          <>
                            <span>•</span>
                            <span className="flex items-center">
                              <User className="h-3 w-3 mr-1" />
                              {publication.posted_by.name}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-300 text-green-600 hover:bg-green-50"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    {publication.posted_by?.id === currentUserId && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(publication.id)}
                        disabled={deletingPublications.has(publication.id)}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
