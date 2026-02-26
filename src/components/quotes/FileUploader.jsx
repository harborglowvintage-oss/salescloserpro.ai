import { useState, useRef, useCallback } from 'react'
import { Upload, X, FileText, AlertTriangle } from 'lucide-react'
import clsx from 'clsx'

const MAX_FILES = 5
const MAX_SIZE_MB = 2
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf']

function resizeImage(file) {
  return new Promise((resolve) => {
    if (file.type === 'application/pdf') {
      const reader = new FileReader()
      reader.onload = () => resolve({ dataUrl: reader.result, name: file.name, type: file.type, size: file.size })
      reader.readAsDataURL(file)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new window.Image()
      img.onload = () => {
        const MAX_DIM = 1200
        let { width, height } = img
        if (width > MAX_DIM || height > MAX_DIM) {
          const scale = Math.min(MAX_DIM / width, MAX_DIM / height)
          width = Math.round(width * scale)
          height = Math.round(height * scale)
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        const dataUrl = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.85)
        resolve({ dataUrl, name: file.name, type: file.type, size: dataUrl.length, width, height })
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

export default function FileUploader({ files = [], onChange }) {
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  const addFiles = useCallback(async (fileList) => {
    setError('')
    const incoming = Array.from(fileList)

    if (files.length + incoming.length > MAX_FILES) {
      setError(`Max ${MAX_FILES} files. You have ${files.length}.`)
      return
    }

    const processed = []
    for (const f of incoming) {
      if (!ACCEPTED_TYPES.includes(f.type)) {
        setError(`${f.name}: unsupported. Use JPG, PNG, GIF, WebP, or PDF.`)
        continue
      }
      if (f.size > MAX_SIZE_BYTES) {
        setError(`${f.name}: exceeds ${MAX_SIZE_MB}MB limit.`)
        continue
      }
      const result = await resizeImage(f)
      processed.push({ ...result, id: crypto.randomUUID() })
    }

    if (processed.length) {
      onChange([...files, ...processed])
    }
  }, [files, onChange])

  const removeFile = (id) => {
    onChange(files.filter((f) => f.id !== id))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    addFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">
          Attachments
          <span className="ml-2 text-xs font-normal text-gray-400 dark:text-gray-500">
            {files.length}/{MAX_FILES} · max {MAX_SIZE_MB}MB each · images &amp; PDFs
          </span>
        </h3>
      </div>

      {/* Drop zone */}
      {files.length < MAX_FILES && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={clsx(
            'border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200',
            dragOver
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
              : 'border-gray-200 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
          )}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Drop files here or <span className="text-blue-600 dark:text-blue-400">browse</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">Drawings, photos, or PDF documents</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,application/pdf"
            multiple
            className="hidden"
            onChange={(e) => { addFiles(e.target.files); e.target.value = '' }}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 rounded-xl px-4 py-2.5">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Thumbnails */}
      {files.length > 0 && (
        <div className="flex flex-wrap justify-center gap-4">
          {files.map((f) => (
            <div key={f.id} className="group relative w-44 rounded-xl overflow-hidden border-2 border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
              {f.type?.startsWith('image/') ? (
                <img src={f.dataUrl} alt={f.name} className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-600">
                  <FileText className="w-8 h-8 text-gray-400 dark:text-gray-300" />
                  <span className="text-[10px] text-gray-500 dark:text-gray-300 mt-1 font-medium">PDF</span>
                </div>
              )}
              <div className="px-2.5 py-2">
                <p className="text-[11px] font-medium text-gray-700 dark:text-gray-200 truncate">{f.name}</p>
                <p className="text-[10px] text-gray-400">{(f.size / 1024).toFixed(0)} KB</p>
              </div>
              <button
                onClick={() => removeFile(f.id)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
