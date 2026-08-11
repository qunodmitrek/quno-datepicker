import type { JSX } from 'preact';
import { DemoHome } from './DemoHome';
import { DatePickerStory } from './story/DatePickerStory';

export const DemoApp = (): JSX.Element =>
  window.location.pathname === '/story' ? <DatePickerStory /> : <DemoHome />;
