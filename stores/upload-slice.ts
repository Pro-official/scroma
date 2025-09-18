'use client'

import { AppStore } from './index'
import { SliceCreator } from './types'

export interface UploadFile {
  id: string
  file: File
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error'
  progress: number
  error?: string
  addedAt: number
  completedAt?: number
  previewUrl?: string
}

export interface RecentFile {
  name: string
  size: number
  completedAt: number
  previewUrl?: string
}

export interface UploadSettings {
  maxFileSize: number
  supportedFormats: string[]
  autoProcess: boolean
  compressionEnabled: boolean
  compressionQuality: number
}

export interface UploadState {
  upload: {
    files: UploadFile[]
    currentUpload: string | null
    isUploading: boolean
    uploadProgress: number
    queue: string[]
    settings: UploadSettings
    recentFiles: RecentFile[]
    totalUploaded: number
    errors: Array<{ fileId: string; error: string; timestamp: number }>
  }
}

export interface UploadActions {
  addFile: (file: File) => string
  addMultipleFiles: (files: FileList | File[]) => void
  removeFile: (fileId: string) => void
  updateProgress: (fileId: string, progress: number) => void
  setUploadStatus: (fileId: string, status: UploadFile['status']) => void
  setUploadError: (fileId: string, error: string) => void
  clearCompleted: () => void
  clearAll: () => void
  updateSettings: (settings: Partial<UploadSettings>) => void
  processQueue: () => void
  retryUpload: (fileId: string) => void
  setPreviewUrl: (fileId: string, url: string) => void
}

export interface UploadSlice extends UploadState, UploadActions {}

const initialUploadState: UploadState = {
  upload: {
    files: [],
    currentUpload: null,
    isUploading: false,
    uploadProgress: 0,
    queue: [],
    settings: {
      maxFileSize: 10 * 1024 * 1024, // 10MB default
      supportedFormats: ['png', 'jpg', 'jpeg', 'webp', 'svg', 'gif'],
      autoProcess: true,
      compressionEnabled: false,
      compressionQuality: 0.9,
    },
    recentFiles: [],
    totalUploaded: 0,
    errors: [],
  }
}

export const createUploadSlice: SliceCreator<AppStore, UploadSlice> = (set, get) => ({
  ...initialUploadState,

  addFile: (file) => {
    const fileId = crypto.randomUUID()

    set((state) => {
      const { settings } = state.upload

      // Validate file size
      if (file.size > settings.maxFileSize) {
        state.upload.errors.push({
          fileId,
          error: `File size exceeds maximum limit of ${settings.maxFileSize / 1024 / 1024}MB`,
          timestamp: Date.now()
        })
        return
      }

      // Validate file format
      const fileExt = file.name.split('.').pop()?.toLowerCase()
      if (!fileExt || !settings.supportedFormats.includes(fileExt)) {
        state.upload.errors.push({
          fileId,
          error: `Unsupported file format. Supported formats: ${settings.supportedFormats.join(', ')}`,
          timestamp: Date.now()
        })
        return
      }

      const uploadFile: UploadFile = {
        id: fileId,
        file,
        status: 'pending',
        progress: 0,
        addedAt: Date.now(),
      }

      state.upload.files.push(uploadFile)
      state.upload.queue.push(fileId)
    })

    // Add to history after state update
    const store = get()
    if ('addAction' in store) {
      store.addAction({
        type: 'ADD_FILE',
        data: { fileName: file.name, fileId },
        description: `Added file: ${file.name}`
      })
    }

    // Auto-process if enabled
    const { settings } = get().upload
    if (settings.autoProcess && !get().upload.isUploading) {
      get().processQueue()
    }

    return fileId
  },

  addMultipleFiles: (files) => {
    const fileArray = files instanceof FileList ? Array.from(files) : files
    fileArray.forEach((file) => {
      get().addFile(file)
    })
  },

  removeFile: (fileId) => {
    set((state) => {
      state.upload.files = state.upload.files.filter(f => f.id !== fileId)
      state.upload.queue = state.upload.queue.filter(id => id !== fileId)

      if (state.upload.currentUpload === fileId) {
        state.upload.currentUpload = null
        state.upload.isUploading = false
        state.upload.uploadProgress = 0
      }
    })
  },

  updateProgress: (fileId, progress) => {
    set((state) => {
      const file = state.upload.files.find(f => f.id === fileId)
      if (file) {
        file.progress = Math.min(100, Math.max(0, progress))

        if (state.upload.currentUpload === fileId) {
          state.upload.uploadProgress = file.progress
        }
      }
    })
  },

  setUploadStatus: (fileId, status) => {
    set((state) => {
      const file = state.upload.files.find(f => f.id === fileId)
      if (file) {
        file.status = status

        if (status === 'completed') {
          file.completedAt = Date.now()
          file.progress = 100

          // Add to recent files
          state.upload.recentFiles.unshift({
            name: file.file.name,
            size: file.file.size,
            completedAt: file.completedAt,
            previewUrl: file.previewUrl
          })

          // Keep only last 20 recent files
          state.upload.recentFiles = state.upload.recentFiles.slice(0, 20)
          state.upload.totalUploaded++

          // Remove from queue
          state.upload.queue = state.upload.queue.filter(id => id !== fileId)

          if (state.upload.currentUpload === fileId) {
            state.upload.currentUpload = null
            state.upload.isUploading = false
            state.upload.uploadProgress = 0
          }
        } else if (status === 'uploading') {
          state.upload.currentUpload = fileId
          state.upload.isUploading = true
        } else if (status === 'error') {
          file.progress = 0

          if (state.upload.currentUpload === fileId) {
            state.upload.currentUpload = null
            state.upload.isUploading = false
            state.upload.uploadProgress = 0
          }
        }
      }
    })
  },

  setUploadError: (fileId, error) => {
    set((state) => {
      const file = state.upload.files.find(f => f.id === fileId)
      if (file) {
        file.error = error
        file.status = 'error'

        state.upload.errors.push({
          fileId,
          error,
          timestamp: Date.now()
        })

        // Keep only last 50 errors
        state.upload.errors = state.upload.errors.slice(-50)
      }
    })
  },

  clearCompleted: () => {
    set((state) => {
      state.upload.files = state.upload.files.filter(f => f.status !== 'completed')
    })
  },

  clearAll: () => {
    set((state) => {
      state.upload.files = []
      state.upload.queue = []
      state.upload.currentUpload = null
      state.upload.isUploading = false
      state.upload.uploadProgress = 0
      state.upload.errors = []
    })
  },

  updateSettings: (settings) => {
    set((state) => {
      state.upload.settings = {
        ...state.upload.settings,
        ...settings
      }
    })
  },

  processQueue: () => {
    const { upload } = get()

    if (upload.isUploading || upload.queue.length === 0) {
      return
    }

    const nextFileId = upload.queue[0]
    const file = upload.files.find(f => f.id === nextFileId)

    if (file && file.status === 'pending') {
      get().setUploadStatus(nextFileId, 'uploading')
      // Processing logic would be implemented by the component using this store
    }
  },

  retryUpload: (fileId) => {
    set((state) => {
      const file = state.upload.files.find(f => f.id === fileId)
      if (file && file.status === 'error') {
        file.status = 'pending'
        file.progress = 0
        file.error = undefined

        if (!state.upload.queue.includes(fileId)) {
          state.upload.queue.push(fileId)
        }
      }
    })

    get().processQueue()
  },

  setPreviewUrl: (fileId, url) => {
    set((state) => {
      const file = state.upload.files.find(f => f.id === fileId)
      if (file) {
        file.previewUrl = url
      }
    })
  },
})