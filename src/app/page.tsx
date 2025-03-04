'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import MovieCard from '../components/MovieCard';
import { Movie } from '@/types/movie';
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const searchParams = useSearchParams();
  const sort = searchParams.get('sort') || 'date';
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // TMDB kategori ID'leri ve renkleri
  const categories = [
    { id: 28, name: 'Aksiyon', color: 'from-red-500 to-orange-500' },
    { id: 10749, name: 'Romantik', color: 'from-pink-500 to-rose-500' },
    { id: 53, name: 'Gerilim', color: 'from-purple-500 to-indigo-500' },
    { id: 35, name: 'Komedi', color: 'from-yellow-500 to-amber-500' },
    { id: 12, name: 'Macera', color: 'from-green-500 to-emerald-500' },
    { id: 878, name: 'Bilim Kurgu', color: 'from-blue-500 to-cyan-500' },
    { id: 9648, name: 'Gizem', color: 'from-violet-500 to-purple-500' },
    { id: 80, name: 'Suç', color: 'from-slate-500 to-gray-500' },
  ];

  const fetchMovies = async (pageNumber: number) => {
    try {
      setLoading(true);
      const url = new URL('/api/movies', window.location.origin);
      url.searchParams.set('page', pageNumber.toString());
      url.searchParams.set('sort', sort);
      
      if (selectedCategory) {
        url.searchParams.set('category', selectedCategory.toString());
      }
      
      const response = await axios.get(url.toString());
      
      if (pageNumber === 1) {
        setMovies(response.data.movies);
      } else {
        setMovies(prev => [...prev, ...response.data.movies]);
      }
      
      setHasMore(response.data.hasMore);
    } catch (error) {
      console.error('Film verileri çekilemedi:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Kategoriye göre film yükleme optimizasyonu
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchMovies(1);
    }, 300); // Debounce ekle

    return () => clearTimeout(timer);
  }, [selectedCategory, sort,fetchMovies]);

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(nextPage);
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <main className="min-h-screen flex">
      {/* Side Navigation */}
      <div className={`w-64 glass-effect min-h-screen fixed left-0 top-0 p-6 border-r border-white/10
        transform transition-transform duration-300 ease-in-out z-40
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="mb-8 mt-20">
          <h2 className="text-xl font-semibold text-white mb-6 neon-text">Film Türleri</h2>
          <div className="space-y-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`w-full text-left px-4 py-2.5 rounded-full transition-all duration-300 relative group overflow-hidden ${
                selectedCategory === null
                  ? 'bg-gradient-to-r from-primary to-blue-500 text-white neon-border'
                  : 'text-gray-400 hover:text-white glass-effect'
              }`}
            >
              <span className="relative z-10">Tümü</span>
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full text-left px-4 py-2.5 rounded-full transition-all duration-300 relative group overflow-hidden ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white` 
                    : 'text-gray-400 hover:text-white glass-effect'
                }`}
              >
                <span className="relative z-10">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 flex-1 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className={`fixed top-0 right-0 z-50 transition-all duration-300
          ${isSidebarOpen ? 'left-64' : 'left-0'}`}
        >
          <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
        </div>
        <div className="container mx-auto px-8 py-8 mt-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie, index) => (
              <MovieCard 
                key={`${movie.id}-${index}`} 
                movie={movie} 
              />
            ))}
          </div>
          
          {/* Daha Fazla Yükle Butonu */}
          {hasMore && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="bg-primary hover:bg-primary/80 text-white py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Yükleniyor...' : 'Daha Fazla Film Göster'}
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}