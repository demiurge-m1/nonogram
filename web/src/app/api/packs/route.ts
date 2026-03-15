import { NextResponse } from 'next/server';
import { mockPacks } from '@/data/mockPacks';

export function GET() {
  return NextResponse.json(
    mockPacks.map((pack) => ({
      id: pack.id,
      title: pack.title,
      description: pack.description,
      difficulty: pack.difficulty,
      badge: pack.badge,
      puzzleCount: pack.puzzles.length,
    })),
  );
}
