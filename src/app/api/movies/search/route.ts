import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import { MovieModel } from '@/models/movie';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json({ movies: [] });
    }

    // Veritabanında arama yap (başlıkta veya açıklamada)
    const movies = await MovieModel.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { overview: { $regex: query, $options: 'i' } }
      ]
    })
    .sort({ popularity: -1 })
    .limit(10);

    return NextResponse.json({ movies });
  } catch (error) {
    return NextResponse.json(
      { error: 'Film arama hatası' },
      { status: 500 }
    );
  }
}