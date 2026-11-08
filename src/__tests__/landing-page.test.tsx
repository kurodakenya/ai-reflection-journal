import { expect, test, describe, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import LandingPage from '../app/page';

afterEach(cleanup);

describe('LandingPage', () => {
  test('renders hero heading', () => {
    render(<LandingPage />);
    expect(screen.getByText('AIが感情を可視化')).toBeInTheDocument();
  });

  test('renders CTA buttons', () => {
    render(<LandingPage />);
    const ctas = screen.getAllByText('無料ではじめる');
    expect(ctas.length).toBeGreaterThanOrEqual(2);
  });

  test('renders feature cards', () => {
    render(<LandingPage />);
    expect(screen.getAllByText('AI感情分析').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('月間レポート').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('データエクスポート').length).toBeGreaterThanOrEqual(1);
  });

  test('renders pricing plans', () => {
    render(<LandingPage />);
    expect(screen.getAllByText('Free').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Pro').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('¥0').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('¥980').length).toBeGreaterThanOrEqual(1);
  });

  test('renders FAQ section', () => {
    render(<LandingPage />);
    expect(screen.getAllByText('データは安全ですか？').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Freeプランで何ができますか？').length).toBeGreaterThanOrEqual(1);
  });

  test('renders footer', () => {
    render(<LandingPage />);
    expect(screen.getAllByText(/©.*AI振り返りジャーナル/).length).toBeGreaterThanOrEqual(1);
  });
});
