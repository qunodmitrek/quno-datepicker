import type { JSX } from 'preact';
import {
  BestGuessExample,
  PaintExample,
  SegmentMoveExample,
  WrongGuessExample,
} from './InteractionExamples';
import {
  HiddenRowExample,
  MotionExample,
  ShortcutExample,
  StableViewExample,
} from './NavigationExamples';
import {
  DayHandlerExample,
  LocalizationExample,
  ThemeExample,
} from './CustomizationExamples';
import { StoryFeature } from './StoryFeature';
import { StoryHowTo } from './StoryHowTo';
import {
  basicUsageSnippet,
  customDaysSnippet,
  localizationSnippet,
  themingSnippet,
} from './storySnippets';

export const StoryTopics = (): JSX.Element => (
  <>
    <StoryFeature id="paint" number="01" kicker="Primary interaction"
      title="Paint first. Drag everything."
      copy="Press an empty date with a pointer or finger and drag to paint a period. Start, End, and the selected band are direct manipulation targets; the public value changes only when the gesture is released."
      instruction="Drag from 4 to 9 with a pointer or finger. Then grab either blue endpoint to resize it."
      howTo={<StoryHowTo title="Basic usage" language="TSX"
        copy="Import behavior and optional styles, then give the picker one range value and one change handler."
        code={basicUsageSnippet} />}>
      <PaintExample />
    </StoryFeature>
    <StoryFeature id="stable-view" number="02" kicker="Stable view"
      title="Six weeks, every month."
      copy="Every month uses the same 42-cell body and one reserved line for its title. Dates and the month name change, but the calendar height does not, so surrounding forms and popovers stay still."
      instruction="Use both chevrons and watch the bottom edge remain fixed." reverse>
      <StableViewExample />
    </StoryFeature>
    <StoryFeature id="hidden-row" number="03" kicker="Hidden week"
      title="Day names become another row of dates."
      copy="During painting or endpoint dragging, the weekday strip becomes a progressive hidden previous week. Only dates reached by the selected segment appear, and the header keeps exactly the same height."
      instruction="With a pointer or finger, drag Start upward into MON–SUN, move across the labels, then leave the strip.">
      <HiddenRowExample />
    </StoryFeature>
    <StoryFeature id="segment-drag" number="04" kicker="Segment movement"
      title="Move the whole period by days or weeks."
      copy="The highlighted band is draggable. Movement snaps to dates and preserves inclusive duration, whether the destination is three days away or several calendar rows away."
      instruction="Grab the pale middle of the range—not an endpoint—and drag it to another week." reverse>
      <SegmentMoveExample />
    </StoryFeature>
    <StoryFeature id="best-guess" number="05" kicker="Click construction"
      title="Click once, extend, then edit by best guess."
      copy="From empty, the first click creates one day. A click before or after it extends the period. Once a range exists, another date moves the nearest endpoint, with outside clicks naturally extending Start or End."
      instruction="Click 8, then 16, then 20. Clear and try the same sequence backward.">
      <BestGuessExample />
    </StoryFeature>
    <StoryFeature id="wrong-guess" number="06" kicker="Inline correction"
      title="Wrong guess? Stay on the date."
      copy="The first click applies the contextual guess. Hover that same clicked date to outline the next interpretation; click again for the opposite endpoint, then once more to keep only that day."
      instruction="Click 15, keep hovering it to see the outline, then click it twice more." reverse>
      <WrongGuessExample />
    </StoryFeature>
    <StoryFeature id="shortcuts" number="07" kicker="Range context"
      title="Start and End remain one click away."
      copy="When an endpoint is outside the visible month, a full-size shortcut slides from beneath the calendar on the correct side. It names the endpoint and its direction without changing selection."
      instruction="Use Start and End to jump across this July–September period.">
      <ShortcutExample />
    </StoryFeature>
    <StoryFeature id="motion" number="08" kicker="Micro-animation"
      title="Motion explains direction, then gets out of the way."
      copy="Month names and day numbers move vertically just enough to show travel direction. Endpoint shortcuts reveal from the calendar edge. The operating-system reduced-motion preference removes those animations automatically."
      instruction="Switch the demo mode, then use the month chevrons in each mode." reverse>
      <MotionExample />
    </StoryFeature>
    <StoryFeature id="day-handler" number="09" kicker="Day handler"
      title="Mark the dates that matter to your product."
      copy="Give the component one function that runs for every date. It can add a class, color, or tooltip for Today, weekends, non-working days, holidays, or availability. The datepicker still owns clicks, dragging, focus, and screen-reader labels, so styling a date cannot break selection."
      instruction="Today has an orange ring, weekends are brown, every Wednesday is crossed out, and 27 August is marked by its exact date. The calendar remains fully interactive."
      howTo={<StoryHowTo title="Custom day attributes" language="TSX"
        copy="Return presentation-only props from typed date context; the component keeps every interaction handler."
        code={customDaysSnippet} />}>
      <DayHandlerExample />
    </StoryFeature>
    <StoryFeature id="localization" number="10" kicker="Internationalization"
      title="Locale is more than a translated month name."
      copy="Locale-aware month, date, day-label, and weekday formatting work together with translated interface labels and a configurable first day of the week. Products can replace any formatter without changing timezone-free values."
      instruction="Navigate months, inspect the French date summary and weekday labels, then use Effacer. Monday remains the first column."
      howTo={<StoryHowTo title="Localization" language="TSX"
        copy="Set the locale and week start, then translate every visible control label your product uses."
        code={localizationSnippet} />}>
      <LocalizationExample />
    </StoryFeature>
    <StoryFeature id="theming" number="11" kicker="Design tokens"
      title="Fixed contracts, flexible skin."
      copy="Component-scoped tokens control geometry as well as color, radii, surfaces, shadows, endpoint pills, and motion. Acid compresses the calendar into 300px; Candy enlarges its day tracks inside 390px and carries its pink selected-day fill into the period summary."
      instruction="Switch to Acid or Candy. Click 15 and hover it for the next-click outline, then use a month chevron once to reveal the themed Start and End pills."
      howTo={<StoryHowTo title="Theme with tokens" language="CSS + TSX"
        copy="Set scoped custom properties on the component class; no global theme selector is required."
        code={themingSnippet} />} reverse>
      <ThemeExample />
    </StoryFeature>
  </>
);
