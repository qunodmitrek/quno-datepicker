import { render } from 'preact';
import '../components/QunoDatePicker.css';
import './demo.css';
import { DemoApp } from './DemoApp';

const root = document.getElementById('app');

if (root) {
  render(<DemoApp />, root);
}
