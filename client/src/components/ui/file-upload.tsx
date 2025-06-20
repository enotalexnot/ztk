import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { X, Upload, Image as ImageIcon, FileText, Download } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface FileUploadProps {
  files: string[]
  onChange: (files: string[]) => void
  acceptedTypes?: string[]
  maxFiles?: number
  type: 'images' | 'files'
  productName?: string
}

interface UploadProgress {
  [key: string]: number
}

export function FileUpload({ 
  files, 
  onChange, 
  acceptedTypes = ['image/*'], 
  maxFiles = 10,
  type,
  productName = 'default'
}: FileUploadProps) {
  const [uploading, setUploading] = useState<string[]>([])
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({})
  const { toast } = useToast()

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('productName', productName)
    formData.append('type', type)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const data = await response.json()
      return data.filePath
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: 'Ошибка загрузки',
        description: `Не удалось загрузить файл ${file.name}`,
        variant: 'destructive'
      })
      return null
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const remainingSlots = maxFiles - files.length
    const filesToUpload = acceptedFiles.slice(0, remainingSlots)

    if (acceptedFiles.length > remainingSlots) {
      toast({
        title: 'Превышен лимит',
        description: `Можно загрузить максимум ${maxFiles} файлов. Загружены первые ${remainingSlots} файлов.`,
        variant: 'destructive'
      })
    }

    setUploading(prev => [...prev, ...filesToUpload.map(f => f.name)])

    const uploadPromises = filesToUpload.map(async (file) => {
      // Симуляция прогресса загрузки
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: Math.min((prev[file.name] || 0) + 10, 90)
        }))
      }, 100)

      try {
        const filePath = await uploadFile(file)
        clearInterval(progressInterval)
        
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: 100
        }))

        setTimeout(() => {
          setUploadProgress(prev => {
            const newProgress = { ...prev }
            delete newProgress[file.name]
            return newProgress
          })
          setUploading(prev => prev.filter(name => name !== file.name))
        }, 1000)

        return filePath
      } catch (error) {
        clearInterval(progressInterval)
        setUploadProgress(prev => {
          const newProgress = { ...prev }
          delete newProgress[file.name]
          return newProgress
        })
        setUploading(prev => prev.filter(name => name !== file.name))
        return null
      }
    })

    const uploadedPaths = await Promise.all(uploadPromises)
    const successfulUploads = uploadedPaths.filter(path => path !== null) as string[]
    
    if (successfulUploads.length > 0) {
      onChange([...files, ...successfulUploads])
    }
  }, [files, maxFiles, onChange, productName, type, toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxFiles: maxFiles - files.length,
    disabled: files.length >= maxFiles
  })

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    onChange(newFiles)
  }

  const getFileIcon = () => {
    return type === 'images' ? <ImageIcon className="h-8 w-8" /> : <FileText className="h-8 w-8" />
  }

  const getFileName = (filePath: string) => {
    return filePath.split('/').pop() || filePath
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-primary bg-primary/5' 
            : files.length >= maxFiles 
              ? 'border-gray-300 bg-gray-50 cursor-not-allowed' 
              : 'border-gray-300 hover:border-primary hover:bg-primary/5'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          {getFileIcon()}
          {files.length >= maxFiles ? (
            <p className="text-sm text-gray-500">
              Достигнут максимум файлов ({maxFiles})
            </p>
          ) : isDragActive ? (
            <p className="text-sm text-primary">
              Перетащите файлы сюда...
            </p>
          ) : (
            <div>
              <p className="text-sm text-gray-600">
                Перетащите файлы сюда или нажмите для выбора
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {type === 'images' ? 'Изображения' : 'Документы'} • Макс. {maxFiles} файлов
              </p>
            </div>
          )}
          {files.length < maxFiles && (
            <Button type="button" variant="outline" size="sm" className="mt-2">
              <Upload className="h-4 w-4 mr-2" />
              Выбрать файлы
            </Button>
          )}
        </div>
      </div>

      {/* Прогресс загрузки */}
      {uploading.length > 0 && (
        <div className="space-y-2">
          {uploading.map((fileName) => (
            <div key={fileName} className="flex items-center gap-2">
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span className="truncate">{fileName}</span>
                  <span>{uploadProgress[fileName] || 0}%</span>
                </div>
                <Progress value={uploadProgress[fileName] || 0} className="h-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Загруженные файлы */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">
            Загруженные файлы ({files.length}/{maxFiles})
          </h4>
          <div className="flex flex-wrap gap-2">
            {files.map((filePath, index) => (
              <Badge key={index} variant="secondary" className="text-sm max-w-xs">
                <span className="truncate flex-1">
                  {getFileName(filePath)}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}