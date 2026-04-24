import {
  getPublicProgrammesData,
  isPublicProgrammesDataError,
} from '../lib/public-programmes';
import { TuitionPage } from '../pages/TuitionPage';

export const dynamic = 'force-dynamic';

export default async function Page() {
  try {
    const { data } = await getPublicProgrammesData();
    return <TuitionPage programs={data.programs} />;
  } catch (error) {
    if (isPublicProgrammesDataError(error)) {
      return <TuitionPage programs={[]} unavailableMessage={error.message} />;
    }

    throw error;
  }
}
