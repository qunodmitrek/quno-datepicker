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

export const DatePickerStory = (): JSX.Element => (
  <main className="story">
    <header className="story__hero">
      <nav className="story__nav" aria-label="Story navigation">
        <a href="/">← Prototype</a>
        <a href="#difference">Why Quno</a>
        <a href="#paint">Basic usage</a>
        <a href="#day-handler">Custom days</a>
        <a href="#theming">Theming</a>
      </nav>
      <span className="story__kicker">Quno Datepicker · Field guide</span>
      <h1>One range model. Every calendar interaction.</h1>
      <p>
        Try each interaction, understand why it exists, and copy the relevant
        integration recipe beside it.
      </p>
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
