import { getPublicProgrammesData } from '../../lib/public-programmes';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await getPublicProgrammesData();
    return Response.json(result);
  } catch (error) {
    console.error('Public programmes route error:', error);
    const message =
      error instanceof Error ? error.message : 'Unable to load programmes from the backend.';

    return Response.json(
      {
        ok: false,
        error: message,
      },
      { status: 503 }
    );
  }
}
