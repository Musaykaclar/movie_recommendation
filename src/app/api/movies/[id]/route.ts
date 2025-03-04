import { NextResponse } from 'next/server';
import { connectDB } from '@/utils/db';
import { MovieModel } from '@/models/movie';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const movie = await MovieModel.findOne({ id: Number(params.id) });
    
    if (!movie) {
      return NextResponse.json(
        { error: 'Film bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(movie);
  } catch (error) {
    return NextResponse.json(
      { error: 'Film detayları alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
} 