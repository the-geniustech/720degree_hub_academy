import { Hero } from '../components/Hero';
import { Programs } from '../components/Programs';
import { Features } from '../components/Features';
import { Timeline } from '../components/Timeline';
import { Stats } from '../components/Stats';
import { SuccessStories } from '../components/SuccessStories';
import { CTA } from '../components/CTA';

export function HomePage() {
  return (
    <>
      <Hero />
      <Programs />
      <Features />
      <Timeline />
      <Stats />
      <SuccessStories />
      <CTA />
    </>
  );
}
