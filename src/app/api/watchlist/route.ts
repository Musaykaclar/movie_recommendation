import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import { UserModel } from '@/models/user';
import { MovieModel } from '@/models/movie';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Watchlist'i getir
export async function GET(request: Request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    await connectDB();

    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    console.log('Kullanıcı watchlist:', user.watchlist); // Debug için

    if (!user.watchlist || user.watchlist.length === 0) {
      return NextResponse.json({ movies: [] });
    }

    const movies = await MovieModel.find({ 
      id: { $in: user.watchlist } 
    });

    console.log('Bulunan filmler:', movies); // Debug için

    return NextResponse.json({ movies });
  } catch (error) {
    console.error('Watchlist getirme hatası:', error);
    return NextResponse.json({ error: 'İşlem başarısız' }, { status: 500 });
  }
}

// Film ekle/çıkar
export async function POST(request: Request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Yetkilendirme gerekli' }, { status: 401 });
    }

    const { movieId } = await request.json();
    console.log('Gelen movieId:', movieId); // Debug için

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    await connectDB();

    // Kullanıcıyı bul ve watchlist'i başlat
    let user = await UserModel.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    // Eğer watchlist undefined ise, boş array olarak başlat
    if (!user.watchlist) {
      user = await UserModel.findByIdAndUpdate(
        decoded.userId,
        { $set: { watchlist: [] } },
        { new: true }
      );
    }

    // Film var mı kontrol et
    const movie = await MovieModel.findOne({ id: movieId });
    if (!movie) {
      return NextResponse.json({ error: 'Film bulunamadı' }, { status: 404 });
    }

    // Watchlist'i kontrol et ve güncelle
    const isInWatchlist = user.watchlist.includes(Number(movieId));
    
    if (isInWatchlist) {
      // Filmi çıkar
      user = await UserModel.findByIdAndUpdate(
        decoded.userId,
        { $pull: { watchlist: Number(movieId) } },
        { new: true }
      );
      console.log('Film çıkarıldı, yeni watchlist:', user.watchlist);
      return NextResponse.json({ 
        message: 'Film watchlist\'ten çıkarıldı',
        inWatchlist: false 
      });
    } else {
      // Filmi ekle
      user = await UserModel.findByIdAndUpdate(
        decoded.userId,
        { $addToSet: { watchlist: Number(movieId) } },
        { new: true }
      );
      console.log('Film eklendi, yeni watchlist:', user.watchlist);
      return NextResponse.json({ 
        message: 'Film watchlist\'e eklendi',
        inWatchlist: true 
      });
    }
  } catch (error) {
    console.error('Watchlist güncelleme hatası:', error);
    return NextResponse.json({ error: 'İşlem başarısız' }, { status: 500 });
  }
} 