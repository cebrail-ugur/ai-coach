import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(_request: NextRequest) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json(
        { success: false, error: 'Çıkış başarısız' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Başarıyla çıkış yapıldı',
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Çıkış sırasında hata oluştu' },
      { status: 500 }
    );
  }
}
