import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GeneratorCard from './GeneratorCard';

describe('GeneratorCard', () => {
    it('renders title', () => {
        render(<GeneratorCard onClick={() => {}} image="" title="My Part" />);
        expect(screen.getByText('My Part')).toBeInTheDocument();
    });

    it('renders image when provided', () => {
        render(<GeneratorCard onClick={() => {}} image="/test.jpg" title="Part" />);
        const img = document.querySelector('img');
        expect(img).toHaveAttribute('src', '/test.jpg');
    });

    it('calls onClick when card is clicked', () => {
        const onClick = jest.fn();
        render(<GeneratorCard onClick={onClick} image="" title="Part" />);
        fireEvent.click(screen.getByText('Part'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('renders without image when image is undefined', () => {
        render(<GeneratorCard onClick={() => {}} image={undefined} title="No Image" />);
        expect(screen.getByText('No Image')).toBeInTheDocument();
    });
});
