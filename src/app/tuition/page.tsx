import { getPublicProgrammesData } from '../lib/public-programmes';
import { TuitionPage } from '../pages/TuitionPage';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const { data, source } = await getPublicProgrammesData();
  return <TuitionPage programs={data.programs} source={source} />;
}
