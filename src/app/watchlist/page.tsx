'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import { Movie } from '@/types/movie';

export default function Watchlist() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    const fetchWatchlist = async () => {
      try {
        const response = await axios.get('/api/watchlist');
        setMovies(response.data.movies);
      } catch (error) {
        console.error('Watchlist yüklenirken hata:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchWatchlist();
    }
  }, [user, loading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black/95">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/95">
      <Navbar />
      <div className="container mx-auto px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">İzleme Listem</h1>
        
        {movies.length === 0 ? (
          <p className="text-gray-400 text-center">İzleme listenizde henüz film yok.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 