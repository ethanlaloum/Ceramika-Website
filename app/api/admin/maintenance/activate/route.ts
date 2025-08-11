import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { setMaintenanceCookie } from '@/lib/maintenance-middleware';

export async function POST(request: NextRequest) {
  try {
    // Activer le mode maintenance en base de données
    await prisma.maintenanceMode.upsert({
      where: { id: 1 },
      update: { isActive: true },
      create: { id: 1, isActive: true }
    });

    // Créer une réponse avec le cookie de maintenance
    const response = NextResponse.json({ 
      success: true, 
      message: 'Mode maintenance activé' 
    });

    // Synchroniser le cookie avec l'état de la base
    setMaintenanceCookie(response, true);

    return response;
  } catch (error) {
    console.error('Erreur lors de l\'activation du mode maintenance:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'activation du mode maintenance' },
      { status: 500 }
    );
  }
}
