import { site } from './data/site';
import { projects } from './data/projects';
import { skillGroups } from './data/skills';
import { posts } from './data/writing';
import { about } from './data/about';

/**
 * Phase 0 scaffold placeholder.
 * This exists only to prove the typed data files compile and the build is
 * clean. The real UI is built in Phase 2+ after the design plan is approved.
 */
export default function App() {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem', lineHeight: 1.6 }}>
      <h1>{site.name}</h1>
      <p>{site.roleLine}</p>
      <p>
        Scaffold ready — {projects.length} projects, {skillGroups.length} skill groups,{' '}
        {posts.length} posts, {about.length} about paragraphs loaded from typed data.
      </p>
      <p>Design plan pending approval (Phase 1). UI arrives in Phase 2.</p>
    </main>
  );
}
