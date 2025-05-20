import { render, screen } from '@testing-library/react';
import AppKey from '@/components/AppKey';
import '@testing-library/jest-dom'

describe('AppKey', () => {
  it('sets correct props without spacer', () => {
    render(
      <AppKey
        dataKey="a"
        ariaLabel="add a"
        ariaDisabled={false}
      />
    );

    const button = screen.getByRole('button', { name: /add a/i });

    expect(button).toHaveAttribute('data-key', 'a');
    expect(button).toHaveAttribute('aria-label', 'add a');
    expect(button).toHaveAttribute('aria-disabled', 'false');
    expect(screen.queryByTestId('spacer')).not.toBeInTheDocument();
  });

  it('adds spacer before the tile', () => {
    render(
      <AppKey
        dataKey="a"
        ariaLabel="add a"
        ariaDisabled={false}
        spacerBefore
      />
    );

    const spacer = screen.getByTestId('spacer');
    const button = screen.getByRole('button', { name: /add a/i });

    expect(spacer).toBeInTheDocument();
    expect(button).toBeInTheDocument();

    expect(spacer.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('adds spacer after the tile', () => {
    render(
      <AppKey
        dataKey="a"
        ariaLabel="add a"
        ariaDisabled={false}
        spacerAfter
      />
    );

    const spacer = screen.getByTestId('spacer');
    const button = screen.getByRole('button', { name: /add a/i });

    expect(spacer).toBeInTheDocument();
    expect(button).toBeInTheDocument();

    expect(spacer.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
  });
});
