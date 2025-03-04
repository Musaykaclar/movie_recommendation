import Link from 'next/link';
import { Movie } from '@/types/movie';

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  return (
    <Link href={`/movie/${movie.id}`} className="group perspective">
      <div className="relative transform-gpu transition-all duration-500 group-hover:scale-105">
        {/* Neon Glow Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-blue-500/50 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
        
        <div className="relative bg-black/40 rounded-lg overflow-hidden shadow-2xl">
          {/* Poster with Flash Effect */}
          <div className="relative overflow-hidden">
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover transition-transform duration-700 group-hover:scale-110"
              />
            )}
            {/* Flash Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
          </div>

          {/* Content */}
          <div className="p-4 bg-gradient-to-b from-black/60 to-black">
            <h3 className="text-white font-medium mb-2 group-hover:text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 transition-colors duration-300">
              {movie.title}
            </h3>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400 group-hover:text-primary/80 transition-colors duration-300">
                {new Date(movie.release_date).getFullYear()}
              </span>
              <span className="flex items-center text-yellow-500 group-hover:text-yellow-400 transition-colors duration-300">
                <svg className="w-4 h-4 mr-1 filter drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {movie.vote_average.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Hover Border Effect */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 rounded-lg transition-colors duration-300"></div>
        </div>
      </div>
    </Link>
  );
}