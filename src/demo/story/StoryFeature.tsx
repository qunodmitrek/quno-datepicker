import type { ComponentChildren, JSX } from 'preact';

type StoryFeatureProps = {
  id: string;
  number: string;
  kicker: string;
  title: string;
  copy: ComponentChildren;
  instruction: ComponentChildren;
  howTo?: ComponentChildren;
  reverse?: boolean;
  children: ComponentChildren;
};

export const StoryFeature = ({
  id,
  number,
  kicker,
  title,
  copy,
  instruction,
  howTo,
  reverse,
  children,
}: StoryFeatureProps): JSX.Element => (
  <section
    className={`story__topic${reverse ? ' story__topic--reverse' : ''}`}
    id={id}
    data-story-topic={id}
  >
    <div className="story__topic-copy">
      <span>{number} · {kicker}</span>
      <h2>{title}</h2>
      <p>{copy}</p>
      {howTo}
    </div>
    <div className="story__topic-example">
      <p className="story__try"><strong>Try it</strong>{instruction}</p>
      {children}
    </div>
  </section>
);
