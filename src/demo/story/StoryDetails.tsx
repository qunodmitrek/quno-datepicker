import type { JSX } from 'preact';

const comparisons = [
  [
    'Calendar surface',
    'Often two months side by side',
    'One stable six-week month',
  ],
  [
    'Editing',
    'Start a new selection sequence',
    'Edit the range already present',
  ],
  [
    'Long ranges',
    'Navigate away from an unseen endpoint',
    'Persistent Start and End controls',
  ],
  [
    'Pointer model',
    'Mostly click-to-pick',
    'Resize, move, paint, and cross months',
  ],
  [
    'Customization',
    'Theme-specific markup',
    'Tokens, slots, callbacks, or no CSS',
  ],
];

export const DifferenceStory = (): JSX.Element => (
  <section className="story__wide" id="difference">
    <div className="story__section-heading">
      <span>Why another datepicker?</span>
      <h2>Range editing, not two date inputs sharing a box</h2>
      <p>
        Conventional range pickers optimize for choosing Start and then End.
        Quno optimizes for seeing and reshaping one existing period. That makes
        the interaction compact and continuous when dates change repeatedly.
      </p>
    </div>
    <div
      className="story__comparison"
      role="table"
      aria-label="Picker comparison"
    >
      <div className="story__comparison-row story__comparison-head" role="row">
        <span role="columnheader">Concern</span>
        <span role="columnheader">Conventional pattern</span>
        <span role="columnheader">Quno approach</span>
      </div>
      {comparisons.map(([concern, common, quno]) => (
        <div className="story__comparison-row" role="row" key={concern}>
          <strong role="cell">{concern}</strong>
          <span role="cell">{common}</span>
          <span role="cell">{quno}</span>
        </div>
      ))}
    </div>
  </section>
);

export const ArchitectureStory = (): JSX.Element => (
  <section className="story__wide story__idea" id="idea">
    <div className="story__section-heading">
      <span>The idea underneath</span>
      <h2>Small state, explicit interaction</h2>
    </div>
    <div className="story__idea-grid">
      <article>
        <strong>One value</strong><code>null | {'{ start, end }'}</code>
        <p>A single day is just start equal to end.</p>
      </article>
      <article>
        <strong>One view</strong><code>visibleMonth</code>
        <p>Navigation never silently edits selection.</p>
      </article>
      <article>
        <strong>One active gesture</strong><code>paint · resize · move</code>
        <p>
          One gesture owns the pointer at a time, so actions cannot collide.
          Release returns the calendar cleanly to rest.
        </p>
      </article>
      <article>
        <strong>Two layers</strong><code>committed + transient</code>
        <p>Hover and drag previews cannot masquerade as public state.</p>
      </article>
    </div>
  </section>
);

export const FootprintStory = (): JSX.Element => (
  <section className="story__wide story__footprint" id="footprint">
    <div className="story__section-heading">
      <span>Production footprint</span>
      <h2>About 10.1 kB gzip with the default theme</h2>
      <p>
        V1 ships as typed ESM. Preact remains a peer dependency, so the package
        does not bundle another framework runtime. The stylesheet is optional.
      </p>
    </div>
    <div className="story__metrics">
      <div>
        <strong>7.73 kB</strong><span>JavaScript gzip</span>
        <small>29.11 kB raw</small>
      </div>
      <div>
        <strong>2.32 kB</strong><span>CSS gzip</span>
        <small>11.32 kB raw</small>
      </div>
      <div>
        <strong>0 kB</strong><span>Bundled Preact</span>
        <small>external peer</small>
      </div>
    </div>
    <p className="story__measurement">
      Measured from the current production build with{' '}
      <code>npm run report:size</code>.
    </p>
  </section>
);
