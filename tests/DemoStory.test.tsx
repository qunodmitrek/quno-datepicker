import { fireEvent, render, screen } from '@testing-library/preact';
import { DemoHome } from '../src/demo/DemoHome';
import { DatePickerStory } from '../src/demo/story/DatePickerStory';

describe('implementation story', () => {
  it('renders the public integration chapters and live examples', () => {
    render(<DatePickerStory />);

    expect(
      screen.getByRole('heading', {
        name: 'One range model. Every calendar interaction.',
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole('grid')).toHaveLength(10);
    expect(
      screen.getByRole('heading', {
        name: 'Range editing, not two date inputs sharing a box',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('One active gesture')).toBeInTheDocument();
    expect(screen.getByText('paint · resize · move')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', {
        name: 'Mark the dates that matter to your product.',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('7.02 kB')).toBeInTheDocument();
    expect(screen.getByText('2.32 kB')).toBeInTheDocument();
    expect(screen.getByText('docs/implementation-guide.md')).toBeInTheDocument();
  });

  it('keeps the theming story interactive', () => {
    render(<DatePickerStory />);
    const violet = screen.getByRole('button', { name: 'violet theme' });
    fireEvent.click(violet);
    expect(violet).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('prototype start page', () => {
  it('presents the primary interactions as highlighted actions', () => {
    render(<DemoHome />);

    expect(
      screen.getByRole('list', { name: 'Datepicker interactions' }),
    ).toBeInTheDocument();
    for (const action of [
      'Click',
      'Click again',
      'Drag an endpoint',
      'Drag the period',
      'Paint outside',
    ]) {
      expect(screen.getByText(action)).toBeInTheDocument();
    }
  });
});
