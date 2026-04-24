import { getPublicProgrammesData } from '../../lib/public-programmes';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const result = await getPublicProgrammesData();
  return Response.json(result);
}
