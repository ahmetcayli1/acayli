'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Upload, 
  Trash2, 
  RefreshCw, 
  Eye, 
  Database,
  FileSpreadsheet,
  AlertCircle,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loading } from '@/components/ui/loading'
import { COUNTRIES } from '@/lib/constants'

interface DatasetStats {
  total: number
  byCountryAndLevel: {
    country: string
    degreeLevel: string
    _count: number
  }[]
}

interface PreviewProgram {
  id: string
  universityName: string
  programName: string
  language: string
  description?: string
}

const DEGREE_LEVELS = [
  { value: 'MASTER', label: 'Master' },
  { value: 'BACHELOR', label: 'Bachelor' },
]

export default function DatasetsPage() {
  const [stats, setStats] = useState<DatasetStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState('germany')
  const [selectedDegree, setSelectedDegree] = useState<'MASTER' | 'BACHELOR'>('MASTER')
  const [uploadMode, setUploadMode] = useState<'replace' | 'append'>('append')
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [preview, setPreview] = useState<PreviewProgram[]>([])
  const [showPreview, setShowPreview] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/datasets')
      const data = await res.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('country', selectedCountry)
      formData.append('degreeLevel', selectedDegree)
      formData.append('mode', uploadMode)

      const res = await fetch('/api/admin/datasets/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: data.message })
        fetchStats()
      } else {
        setMessage({ type: 'error', text: data.error })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Upload failed' })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete all ${selectedDegree} programs for ${selectedCountry}?`)) {
      return
    }

    setIsDeleting(true)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/datasets/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: selectedCountry,
          degreeLevel: selectedDegree,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: data.message })
        fetchStats()
      } else {
        setMessage({ type: 'error', text: data.error })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Delete failed' })
    } finally {
      setIsDeleting(false)
    }
  }

  const handlePreview = async () => {
    try {
      const res = await fetch(
        `/api/admin/datasets/preview?country=${selectedCountry}&degreeLevel=${selectedDegree}&limit=20`
      )
      const data = await res.json()

      if (res.ok) {
        setPreview(data.data)
        setShowPreview(true)
      }
    } catch (error) {
      console.error('Preview failed:', error)
    }
  }

  const getCountById = (country: string, degree: string) => {
    return stats?.byCountryAndLevel.find(
      s => s.country === country && s.degreeLevel === degree
    )?._count || 0
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loading text="Loading datasets..." />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dataset Manager</h1>
        <p className="text-white/60">
          Manage program databases for each country and degree level
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {COUNTRIES.filter(c => c.available).map(country => (
          <Card key={country.id} className="text-center">
            <CardContent className="pt-4">
              <p className="text-2xl mb-1">{country.flag}</p>
              <p className="text-white font-medium text-sm mb-2">{country.name}</p>
              <div className="flex justify-center gap-2">
                <Badge variant="default">M: {getCountById(country.id, 'MASTER')}</Badge>
                <Badge variant="default">B: {getCountById(country.id, 'BACHELOR')}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Controls */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Dataset Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Select
              label="Country"
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
              options={COUNTRIES.filter(c => c.available).map(c => ({
                value: c.id,
                label: `${c.flag} ${c.name}`,
              }))}
            />
            <Select
              label="Degree Level"
              value={selectedDegree}
              onChange={e => setSelectedDegree(e.target.value as 'MASTER' | 'BACHELOR')}
              options={DEGREE_LEVELS}
            />
            <Select
              label="Upload Mode"
              value={uploadMode}
              onChange={e => setUploadMode(e.target.value as 'replace' | 'append')}
              options={[
                { value: 'append', label: 'Append (add to existing)' },
                { value: 'replace', label: 'Replace (delete & re-import)' },
              ]}
            />
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">
                Current Count
              </label>
              <div className="h-[46px] flex items-center justify-center bg-white/5 rounded-xl text-2xl font-bold text-blue-400">
                {getCountById(selectedCountry, selectedDegree)}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              isLoading={isUploading}
              leftIcon={<Upload className="w-4 h-4" />}
            >
              Upload Excel
            </Button>
            <Button
              variant="outline"
              onClick={handlePreview}
              leftIcon={<Eye className="w-4 h-4" />}
            >
              Preview Data
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Delete Dataset
            </Button>
          </div>

          {/* Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 flex items-center gap-2 p-4 rounded-xl ${
                message.type === 'success'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}
            >
              {message.type === 'success' ? (
                <Check className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              {message.text}
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Preview Table */}
      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5" />
                Preview: {selectedCountry} {selectedDegree} ({preview.length} rows)
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPreview(false)}
              >
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-white/60">University</th>
                    <th className="text-left py-3 px-4 text-white/60">Program</th>
                    <th className="text-left py-3 px-4 text-white/60">Language</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map(program => (
                    <tr key={program.id} className="border-b border-white/5">
                      <td className="py-3 px-4 text-white">{program.universityName}</td>
                      <td className="py-3 px-4 text-white">{program.programName}</td>
                      <td className="py-3 px-4">
                        <Badge>{program.language}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.length === 0 && (
                <p className="text-center text-white/50 py-8">No data found</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
