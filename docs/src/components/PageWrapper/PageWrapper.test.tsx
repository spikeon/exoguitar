import React from 'react';
import { render, screen } from '@testing-library/react';
import PageWrapper from './PageWrapper';

describe('PageWrapper', () => {
    it('renders the title', () => {
        render(<PageWrapper title="Test Page">content</PageWrapper>);
        expect(screen.getByText('Test Page')).toBeInTheDocument();
    });

    it('renders children', () => {
        render(<PageWrapper title="Page"><span data-testid="child">Child content</span></PageWrapper>);
        expect(screen.getByTestId('child')).toHaveTextContent('Child content');
    });
});
