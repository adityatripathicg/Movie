import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Layout from '../../../components/Layout'
import { useAuth } from '../../../context/AuthContext'
import api from '../../../utils/api'

export default function EditMovie() {
  const [title, setTitle] = useState('')
  const [publishingYear, setPublishingYear] = useState('')
  const [poster, setPoster] = useState(null)
  const [posterPreview, setPosterPreview] = useState(null)
  const [existingPoster, setExistingPoster] = useState(null)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const fileInputRef = useRef(null)
  const { user } = useAuth()
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    if (id) {
      fetchMovie()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, router, id])

  const fetchMovie = async () => {
    try {
      setFetching(true)
      const response = await api.get(`/movies/${id}`)
      const movie = response.data
      setTitle(movie.title)
      setPublishingYear(movie.publishing_year.toString())
      if (movie.poster) {
        setExistingPoster(movie.poster)
      }
    } catch (error) {
      console.error('Error fetching movie:', error)
      router.push('/movies')
    } finally {
      setFetching(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, poster: 'Please select an image file' })
        return
      }

      // 5MB limit
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, poster: 'File size must be less than 5MB' })
        return
      }

      setPoster(file)
      setPosterPreview(URL.createObjectURL(file))
      setErrors({ ...errors, poster: null })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    const newErrors = {}
    if (!title.trim()) {
      newErrors.title = 'Title is required'
    }

    const year = parseInt(publishingYear)
    const currentYear = new Date().getFullYear()
    if (!publishingYear) {
      newErrors.publishingYear = 'Publishing year is required'
    } else if (isNaN(year) || year < 1800 || year > currentYear + 5) {
      newErrors.publishingYear = `Year must be between 1800 and ${currentYear + 5}`
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      setLoading(true)
      const formData = new FormData()
      formData.append('title', title)
      formData.append('publishing_year', publishingYear)
      
      // Only append the poster if a new file was selected
      if (poster) {
        formData.append('poster', poster)
      }

      await api.put(`/movies/${id}`, formData)
      router.push('/movies')
    } catch (error) {
      console.error('Error updating movie:', error)
      setErrors({ 
        general: error.response?.data?.message || 'Failed to update movie' 
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this movie?')) {
      return
    }

    try {
      await api.delete(`/movies/${id}`)
      router.push('/movies')
    } catch (error) {
      alert('Failed to delete movie')
    }
  }

  if (fetching) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </Layout>
    )
  }

  const displayPoster = posterPreview || existingPoster

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-white text-4xl md:text-5xl font-semibold">
            Edit
          </h1>
          <button
            onClick={handleDelete}
            className="text-error hover:text-error/80 transition-colors font-medium"
          >
            Delete Movie
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Upload Section */}
            <div>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative w-full h-96 bg-background-input rounded-lg border-2 
                  border-dashed border-white/20 cursor-pointer hover:border-primary/50 
                  transition-colors overflow-hidden group"
              >
                {displayPoster ? (
                  <>
                    <Image
                      src={displayPoster}
                      alt="Movie poster"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 
                      transition-opacity flex items-center justify-center">
                      <p className="text-white font-medium">Change image</p>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <svg 
                      width="64" 
                      height="64" 
                      viewBox="0 0 64 64" 
                      fill="none" 
                      className="mb-4"
                    >
                      <path 
                        d="M32 42V22M22 32H42" 
                        stroke="white" 
                        strokeWidth="4" 
                        strokeLinecap="round"
                      />
                    </svg>
                    <p className="text-white font-medium mb-2">
                      Drop an image here
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {errors.poster && (
                <p className="text-error text-sm mt-2">{errors.poster}</p>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              {/* Title Input */}
              <div>
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full bg-background-input text-white px-4 py-3 rounded-lg 
                    placeholder-gray-400 focus:outline-none focus:ring-2 
                    ${errors.title ? 'ring-2 ring-error' : 'focus:ring-primary'}`}
                />
                {errors.title && (
                  <p className="text-error text-sm mt-1">{errors.title}</p>
                )}
              </div>

              {/* Publishing Year Input */}
              <div>
                <input
                  type="number"
                  placeholder="Publishing year"
                  value={publishingYear}
                  onChange={(e) => setPublishingYear(e.target.value)}
                  className={`w-full bg-background-input text-white px-4 py-3 rounded-lg 
                    placeholder-gray-400 focus:outline-none focus:ring-2 
                    ${errors.publishingYear ? 'ring-2 ring-error' : 'focus:ring-primary'}`}
                />
                {errors.publishingYear && (
                  <p className="text-error text-sm mt-1">{errors.publishingYear}</p>
                )}
              </div>

              {/* Error Message */}
              {errors.general && (
                <div className="bg-error/10 border border-error rounded-lg p-3">
                  <p className="text-error text-sm">{errors.general}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => router.push('/movies')}
                  className="flex-1 border border-white text-white px-6 py-3 rounded-lg 
                    font-semibold hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white px-6 py-3 
                    rounded-lg font-semibold transition-colors disabled:opacity-50 
                    disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  )
}

