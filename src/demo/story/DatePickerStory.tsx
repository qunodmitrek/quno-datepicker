import type { JSX } from 'preact';
import {
  ArchitectureStory,
  DifferenceStory,
  FootprintStory,
} from './StoryDetails';
import { StoryTopics } from './StoryTopics';
import './story.css';
import './story-details.css';
import './story-howto.css';
import './story-topics.css';
import './story-themes.css';

const contents = [
  ['/', 'Live demo', 'Interactive prototype'],
  ['#difference', 'Overview', 'Range editing explained'],
  ['#paint', '01', 'Paint and resize'],
  ['#stable-view', '02', 'Stable six-week view'],
  ['#hidden-row', '03', 'Hidden-week drag'],
  ['#segment-drag', '04', 'Move a period'],
  ['#best-guess', '05', 'Build a range by click'],
  ['#wrong-guess', '06', 'Correct a click guess'],
  ['#shortcuts', '07', 'Off-screen endpoints'],
  ['#motion', '08', 'Motion and reduced motion'],
  ['#day-handler', '09', 'Custom day styling'],
  ['#localization', '10', 'Internationalization'],
  ['#theming', '11', 'Theme and size tokens'],
  ['#idea', 'Model', 'Interaction architecture'],
  ['#footprint', 'Build', 'Production footprint'],
  ['#reference', 'Docs', 'Complete API reference'],
] as const;

export const DatePickerStory = (): JSX.Element => (
  <main className="story">
    <header className="story__hero">
      <span className="story__kicker">Quno Datepicker · Field guide</span>
      <h1>One range model. Every calendar interaction.</h1>
      <p>
        Try each interaction, understand why it exists, and copy the relevant
        integration recipe beside it.
      </p>
      <nav className="story__toc" aria-labelledby="story-toc-title">
        <div>
          <span>On this page</span>
          <h2 id="story-toc-title">Explore the field guide</h2>
          <p>Read in order or jump directly to a behavior or implementation contract.</p>
        </div>
        <div className="story__toc-links">
          {contents.map(([href, label, title]) => (
            <a href={href} key={href}>
              <small>{label}</small>
              <strong>{title}</strong>
            </a>
          ))}
        </div>
      </nav>
    </header>

    <DifferenceStory />

    <StoryTopics />

    <ArchitectureStory />

    <FootprintStory />

    <section className="story__integration" id="reference">
      <span>Complete reference</span>
      <h2>Keep the full API contract nearby</h2>
      <p>
        Controlled and uncontrolled state, localization, forms, every public
        slot, and the deferred V1 scope are documented in{' '}
        <strong>docs/implementation-guide.md</strong>.
      </p>
    </section>
  </main>
);
