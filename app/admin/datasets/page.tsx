'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminDatasetsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [country, setCountry] = useState('DE')
  const [degreeLevel, setDegreeLevel] = useState<'BACHELOR' | 'MASTER'>('MASTER')
  const [datasetInfo, setDatasetInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (session?.user?.role !== 'ADMIN') {
      router.push('/')
    }
  }, [status, session, router])

  useEffect(() => {
    if (session?.user?.role === 'ADMIN') {
      fetchDatasetInfo()
    }
  }, [country, degreeLevel, session])

  const fetchDatasetInfo = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/datasets?country=${country}&degreeLevel=${degreeLevel}`)
      if (response.ok) {
        const data = await response.json()
        setDatasetInfo(data)
      }
    } catch (error) {
      console.error('Fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete all ${country} ${degreeLevel} programs?`)) {
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/admin/datasets?country=${country}&degreeLevel=${degreeLevel}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        alert('Dataset deleted successfully')
        fetchDatasetInfo()
      } else {
        alert('Failed to delete dataset')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete dataset')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || !session || session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1629] flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f1629]">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Dataset Manager</h1>
            <p className="text-gray-400">Manage program datasets by country and degree level</p>
          </div>
          <Link href="/admin">
            <button className="px-4 py-2 glass rounded-lg hover:bg-white/10">
              ← Back to Admin
            </button>
          </Link>
        </div>

        <div className="glass-dark rounded-xl p-6 mb-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="DE">Germany (DE)</option>
                <option value="IT">Italy (IT)</option>
                <option value="PL">Poland (PL)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Degree Level</label>
              <select
                value={degreeLevel}
                onChange={(e) => setDegreeLevel(e.target.value as 'BACHELOR' | 'MASTER')}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="BACHELOR">Bachelor</option>
                <option value="MASTER">Master</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : datasetInfo ? (
            <div>
              <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4 mb-6">
                <p className="text-blue-400 font-semibold">
                  {datasetInfo.count} programs found for {country} {degreeLevel}
                </p>
              </div>

              {datasetInfo.preview && datasetInfo.preview.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">Preview (First 20)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="border-b border-white/10">
                        <tr>
                          <th className="text-left p-2">University</th>
                          <th className="text-left p-2">Program</th>
                          <th className="text-left p-2">Language</th>
                        </tr>
                      </thead>
                      <tbody>
                        {datasetInfo.preview.slice(0, 10).map((program: any) => (
                          <tr key={program.id} className="border-b border-white/5">
                            <td className="p-2">{program.universityName}</td>
                            <td className="p-2">{program.programName}</td>
                            <td className="p-2">{program.language}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleDelete}
                  disabled={loading || datasetInfo.count === 0}
                  className="px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed transition"
                >
                  Delete Dataset
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="glass-dark rounded-xl p-6">
          <h3 className="font-semibold mb-4">📝 Instructions</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Select a country and degree level to view dataset information</li>
            <li>• Delete removes all programs for the selected combination</li>
            <li>• To add new data, run the seed script with updated Excel files</li>
            <li>• Excel files should be placed in data/master/ or data/bachelor/</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
