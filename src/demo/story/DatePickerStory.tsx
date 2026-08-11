import type { JSX } from 'preact';
import { packageSnippet } from './storySnippets';
import {
  ArchitectureStory,
  DifferenceStory,
  FootprintStory,
} from './StoryDetails';
import { StoryTopics } from './StoryTopics';
import './story.css';
import './story-details.css';
import './story-topics.css';

const Code = ({ children }: { children: string }): JSX.Element => (
  <pre className="story__code">
    <code>{children}</code>
  </pre>
);

export const DatePickerStory = (): JSX.Element => (
  <main className="story">
    <header className="story__hero">
      <nav className="story__nav" aria-label="Story navigation">
        <a href="/">← Prototype</a>
        <a href="#difference">Why Quno</a>
        <a href="#integration">Implementation</a>
      </nav>
      <span className="story__kicker">Quno Datepicker · Field guide</span>
      <h1>One range model. Every calendar interaction.</h1>
      <p>
        A practical story for product teams integrating a compact date and
        period input without importing product-specific layout or copy.
      </p>
    </header>

    <DifferenceStory />

    <StoryTopics />

    <ArchitectureStory />

    <FootprintStory />

    <section className="story__integration" id="integration">
      <span>Implementation</span>
      <h2>Ship the behavior and theme separately</h2>
      <p>
        Import the component from the public entrypoint. Add the optional
        stylesheet once, or omit it and style the stable slots yourself.
      </p>
      <Code>{packageSnippet}</Code>
      <p>
        The complete copyable contract lives in{' '}
        <strong>docs/implementation-guide.md</strong>.
      </p>
    </section>
  </main>
);
