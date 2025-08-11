"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Trash2, Calendar, User } from "lucide-react"
import { deleteFile, formatFileSize } from "@/lib/file-service"

interface FileResponse {
  id: string;
  name: string;
  file: string;
  uploaded_at: string;
  file_type: string;
  size: number;
  uploaded_by?: {
    id: string;
    name: string;
  };
}

interface RecentDocumentsProps {
  userFiles: FileResponse[];
  currentUserId: string;
  onFileDelete: (fileId: string) => void;
}

export function RecentDocuments({ userFiles, currentUserId, onFileDelete }: RecentDocumentsProps) {
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());

  const handleDelete = async (fileId: string) => {
    setDeletingFiles(prev => new Set(prev).add(fileId));
    try {
      await deleteFile(fileId);
      onFileDelete(fileId);
    } catch (error) {
      console.error('Error deleting file:', error);
    } finally {
      setDeletingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(fileId);
        return newSet;
      });
    }
  };

  if (userFiles.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Aucun document partagé</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h4 className="font-medium text-gray-800 mb-3">Documents récents</h4>
      <div className="space-y-3">
        {userFiles.map((file) => (
          <Card key={file.id} className="bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{file.name}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>{formatFileSize(file.size)}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(file.uploaded_at).toLocaleDateString()}
                      </span>
                      {file.uploaded_by && (
                        <>
                          <span>•</span>
                          <span className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {file.uploaded_by.name}
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
                    onClick={() => window.open(file.file, '_blank')}
                    className="border-blue-300 text-blue-600 hover:bg-blue-50"
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                  {file.uploaded_by?.id === currentUserId && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(file.id)}
                      disabled={deletingFiles.has(file.id)}
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}