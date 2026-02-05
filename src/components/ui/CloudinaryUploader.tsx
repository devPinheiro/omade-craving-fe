import { Button } from '@/components/ui/button'
import { Image as ImageIcon, Loader2, Upload, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface CloudinaryUploaderProps {
  onUpload: (url: string) => void
  onError?: (error: string) => void
  accept?: string
  maxSize?: number
  preview?: boolean
  placeholder?: string
  loading?: boolean
  currentImage?: string
  className?: string
}

interface UploadResponse {
  secure_url: string
  public_id: string
}

export function CloudinaryUploader({
  onUpload,
  onError,
  accept = 'image/*',
  maxSize = 5 * 1024 * 1024, // 5MB default
  preview = true,
  placeholder = 'Upload an image',
  loading = false,
  currentImage,
  className = '',
}: CloudinaryUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string>(currentImage || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Update preview when currentImage prop changes (for edit mode)
  useEffect(() => {
    setPreviewUrl(currentImage || '')
  }, [currentImage])

  const validateFile = (file: File): string | null => {
    if (!file.type.startsWith('image/')) {
      return 'Please select an image file'
    }

    if (file.size > maxSize) {
      return `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`
    }

    return null
  }

  const getSignedUploadParams = async () => {
    try {
      // This would call your backend endpoint to get signed upload parameters
      const response = await fetch(
        'https://omade-cravings-be-production.up.railway.app/api/cloudinary/sign',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            upload_preset: 'products', // You'll need to create this preset in Cloudinary
            folder: 'products',
          }),
        }
      )

      if (!response.ok) {
        throw new Error('Failed to get upload signature')
      }

      return await response.json()
    } catch (error) {
      throw new Error('Failed to get upload signature')
    }
  }

  const uploadToCloudinary = async (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Get signed upload parameters from your backend
      const signedParams = await getSignedUploadParams()

      const formData = new FormData()
      formData.append('file', file)
      formData.append('signature', signedParams.signature)
      formData.append('timestamp', signedParams.timestamp.toString())
      formData.append('api_key', signedParams.api_key)
      formData.append('upload_preset', signedParams.upload_preset)
      formData.append('folder', signedParams.folder)

      const xhr = new XMLHttpRequest()

      return new Promise<UploadResponse>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100)
            setUploadProgress(progress)
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText)
            resolve(response)
          } else {
            reject(new Error('Upload failed'))
          }
        })

        xhr.addEventListener('error', () => {
          reject(new Error('Upload failed'))
        })

        xhr.open('POST', `https://api.cloudinary.com/v1_1/appnet/image/upload`)
        xhr.send(formData)
      })
    } catch (error) {
      throw error
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleFileSelect = async (file: File) => {
    const validationError = validateFile(file)
    if (validationError) {
      onError?.(validationError)
      return
    }

    // Show optimistic preview
    const fileUrl = URL.createObjectURL(file)
    setPreviewUrl(fileUrl)

    try {
      const result = await uploadToCloudinary(file)
      setPreviewUrl(result.secure_url)

      // Store in localStorage temporarily
      localStorage.setItem('tempUploadedImageUrl', result.secure_url)

      onUpload(result.secure_url)

      // Clean up object URL
      URL.revokeObjectURL(fileUrl)
    } catch (error) {
      // Rollback optimistic update
      setPreviewUrl(currentImage || '')
      URL.revokeObjectURL(fileUrl)

      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      onError?.(errorMessage)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const file = files[0]

    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleRemoveImage = () => {
    setPreviewUrl('')
    // Clear localStorage when image is removed
    localStorage.removeItem('tempUploadedImageUrl')
    onUpload('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {preview && previewUrl && (
        <div className="relative inline-block">
          <img
            src={previewUrl}
            alt="Upload preview"
            className="max-w-full max-h-32 rounded-md border border-gray-300 object-cover"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            disabled={isUploading || loading}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            <X className="h-3 w-3" />
          </button>
          {isUploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
              <div className="text-white text-sm">
                {uploadProgress > 0 ? `${uploadProgress}%` : 'Uploading...'}
              </div>
            </div>
          )}
        </div>
      )}

      {!previewUrl && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
            ${isDragging ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-gray-400'}
            ${isUploading || loading ? 'pointer-events-none opacity-50' : ''}
          `}
          onClick={openFileDialog}
        >
          <div className="flex flex-col items-center space-y-3">
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
                <div className="text-sm text-gray-600">
                  {uploadProgress > 0 ? `Uploading... ${uploadProgress}%` : 'Uploading...'}
                </div>
                {uploadProgress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="p-2 bg-gray-100 rounded-full">
                  <Upload className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{placeholder}</div>
                  <div className="text-xs text-gray-500 mt-1">Drag & drop or click to browse</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Max size: {Math.round(maxSize / 1024 / 1024)}MB
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {previewUrl && !isUploading && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={openFileDialog}
          disabled={loading}
          className="w-full"
        >
          <ImageIcon className="h-4 w-4 mr-2" />
          Change Image
        </Button>
      )}
    </div>
  )
}
