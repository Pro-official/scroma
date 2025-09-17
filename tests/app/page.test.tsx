import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home Page', () => {
  it('should render the main heading', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', {
      name: /Scroma - Screenshot Mockup Tool/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it('should render the description', () => {
    render(<Home />);
    const description = screen.getByText(
      /Create beautiful screenshot mockups with device frames and backgrounds/i
    );
    expect(description).toBeInTheDocument();
  });

  it('should have proper CSS classes for layout', () => {
    const { container } = render(<Home />);
    const main = container.querySelector('main');
    expect(main).toHaveClass('flex', 'min-h-screen', 'flex-col', 'items-center', 'justify-center');
  });
});