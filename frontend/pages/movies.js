import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Layout from '../components/Layout'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

export default function Movies() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({})
  const [currentPage, setCurrentPage] = useState(1)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }
    fetchMovies(currentPage)
  }, [user, router, currentPage])

  const fetchMovies = async (page) => {
    try {
      setLoading(true)
      const res = await api.get(`/movies?page=${page}&limit=8`)
      setMovies(res.data.movies)
      setPagination(res.data.pagination)
    } catch (err) {
      console.error('Error fetching movies:', err)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleEdit = (movieId, e) => {
    e.stopPropagation()
    router.push(`/movies/edit/${movieId}`)
  }

  const handleDelete = async (movieId, e) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this movie?')) {
      try {
        await api.delete(`/movies/${movieId}`)
        fetchMovies(currentPage)
      } catch (err) {
        console.error('Error deleting movie:', err)
        alert('Failed to delete movie')
      }
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </Layout>
    )
  }

  if (movies.length === 0) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-white text-4xl font-semibold mb-8">
            Your movie list is empty
          </h2>
          <button
            onClick={() => router.push('/movies/create')}
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 
              rounded-lg font-semibold transition-colors"
          >
            Add a new movie
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 md:mb-12">
          <h2 className="text-white text-3xl md:text-4xl font-semibold flex items-center gap-3">
            My movies
            <button
              onClick={() => router.push('/movies/create')}
              className="text-2xl hover:text-primary transition-colors"
              title="Add new movie"
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="16" fill="currentColor"/>
                <path d="M16 10V22M10 16H22" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </h2>
          <button
            onClick={() => router.push('/movies/create')}
            className="hidden md:block bg-primary hover:bg-primary/90 text-white px-6 py-3 
              rounded-lg font-semibold transition-colors"
          >
            Add a new movie
          </button>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="bg-background-card rounded-xl overflow-hidden group relative movie-card"
            >
              {/* Movie Poster */}
              <div className="relative w-full h-72 bg-gradient-to-br from-background-input to-background-card overflow-hidden">
                {movie.poster ? (
                  <Image
                    src={movie.poster}
                    alt={movie.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mx-auto mb-2 opacity-50">
                        <rect width="80" height="80" rx="12" fill="#224957"/>
                        <path d="M28 32L40 40L52 32M28 48L40 56L52 48M28 32V48M52 32V48M40 24L52 32M40 24L28 32" stroke="#2BD17E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <p className="text-gray-500 text-sm">No poster</p>
                    </div>
                  </div>
                )}

                {/* Hover Overlay with Buttons */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent 
                  opacity-0 group-hover:opacity-100 transition-all duration-300 
                  flex items-center justify-center gap-3 z-10">
                  <button
                    onClick={(e) => handleEdit(movie._id || movie.id, e)}
                    className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg 
                      font-semibold transition-all duration-200 flex items-center gap-2 
                      transform hover:scale-105 shadow-lg hover:shadow-primary/50"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M12.75 2.25C12.947 2.05302 13.1808 1.89676 13.4382 1.79051C13.6956 1.68426 13.971 1.62988 14.2492 1.62988C14.5274 1.62988 14.8027 1.68426 15.0601 1.79051C15.3175 1.89676 15.5513 2.05302 15.7483 2.25C15.9453 2.44698 16.1016 2.68081 16.2078 2.93821C16.3141 3.19561 16.3684 3.47098 16.3684 3.74917C16.3684 4.02735 16.3141 4.30272 16.2078 4.56012C16.1016 4.81752 15.9453 5.05135 15.7483 5.24833L6.00001 15L2.25001 15.75L3.00001 12L12.75 2.25Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDelete(movie._id || movie.id, e)}
                    className="bg-error hover:bg-error/90 text-white px-5 py-2.5 rounded-lg 
                      font-semibold transition-all duration-200 flex items-center gap-2 
                      transform hover:scale-105 shadow-lg hover:shadow-error/50"
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M2.25 4.5H3.75H15.75" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 4.5V3C6 2.60218 6.15804 2.22064 6.43934 1.93934C6.72064 1.65804 7.10218 1.5 7.5 1.5H10.5C10.8978 1.5 11.2794 1.65804 11.5607 1.93934C11.842 2.22064 12 2.60218 12 3V4.5M14.25 4.5V15C14.25 15.3978 14.092 15.7794 13.8107 16.0607C13.5294 16.342 13.1478 16.5 12.75 16.5H5.25C4.85218 16.5 4.47064 16.342 4.18934 16.0607C3.90804 15.7794 3.75 15.3978 3.75 15V4.5H14.25Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7.5 8.25V12.75M10.5 8.25V12.75" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>

              {/* Movie Info */}
              <div className="p-5 bg-gradient-to-b from-background-card to-background-card/80">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-semibold text-lg truncate group-hover:text-primary 
                    transition-colors duration-200 flex-1">
                    {movie.title}
                  </h3>
                  {/* Mobile buttons */}
                  <div className="flex gap-2 md:hidden">
                    <button
                      onClick={(e) => handleEdit(movie._id || movie.id, e)}
                      className="text-primary hover:text-primary/80 p-1"
                      title="Edit"
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M12.75 2.25C12.947 2.05302 13.1808 1.89676 13.4382 1.79051C13.6956 1.68426 13.971 1.62988 14.2492 1.62988C14.5274 1.62988 14.8027 1.68426 15.0601 1.79051C15.3175 1.89676 15.5513 2.05302 15.7483 2.25C15.9453 2.44698 16.1016 2.68081 16.2078 2.93821C16.3141 3.19561 16.3684 3.47098 16.3684 3.74917C16.3684 4.02735 16.3141 4.30272 16.2078 4.56012C16.1016 4.81752 15.9453 5.05135 15.7483 5.24833L6.00001 15L2.25001 15.75L3.00001 12L12.75 2.25Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleDelete(movie._id || movie.id, e)}
                      className="text-error hover:text-error/80 p-1"
                      title="Delete"
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <path d="M2.25 4.5H3.75H15.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M6 4.5V3C6 2.60218 6.15804 2.22064 6.43934 1.93934C6.72064 1.65804 7.10218 1.5 7.5 1.5H10.5C10.8978 1.5 11.2794 1.65804 11.5607 1.93934C11.842 2.22064 12 2.60218 12 3V4.5M14.25 4.5V15C14.25 15.3978 14.092 15.7794 13.8107 16.0607C13.5294 16.342 13.1478 16.5 12.75 16.5H5.25C4.85218 16.5 4.47064 16.342 4.18934 16.0607C3.90804 15.7794 3.75 15.3978 3.75 15V4.5H14.25Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7.5 8.25V12.75M10.5 8.25V12.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-primary">
                    <path d="M8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8C14.6667 4.3181 11.6819 1.33334 8 1.33334C4.3181 1.33334 1.33334 4.3181 1.33334 8C1.33334 11.6819 4.3181 14.6667 8 14.6667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 4V8L10.6667 9.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-gray-400 text-sm font-medium">
                    {movie.publishing_year}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="text-white px-4 py-2 rounded disabled:opacity-50 
                disabled:cursor-not-allowed hover:bg-background-card transition-colors"
            >
              Prev
            </button>

            {[...Array(pagination.totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded transition-colors ${
                  currentPage === index + 1
                    ? 'bg-primary text-white'
                    : 'text-white hover:bg-background-card'
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="text-white px-4 py-2 rounded disabled:opacity-50 
                disabled:cursor-not-allowed hover:bg-background-card transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </Layout>
  )
}

