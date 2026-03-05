import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PartCard from './PartCard';
import { Part } from '../types/Parts';

const mockPart: Part = {
    name: 'Test Head',
    section: 'Head',
    path: 'Head/Test Head',
    hasBOM: true,
    hasAssembly: true,
    thumb: '/images/head/thumb.png',
};

describe('PartCard', () => {
    it('renders part name when part is provided', () => {
        const onClick = jest.fn();
        render(<PartCard part={mockPart} onClick={onClick} />);
        expect(screen.getByText('Test Head')).toBeInTheDocument();
    });

    it('uses part thumb as image when provided', () => {
        render(<PartCard part={mockPart} onClick={() => {}} />);
        const img = document.querySelector('img');
        expect(img).toHaveAttribute('src', expect.stringContaining('thumb.png'));
    });

    it('calls onClick when clicked', () => {
        const onClick = jest.fn();
        render(<PartCard part={mockPart} onClick={onClick} />);
        fireEvent.click(screen.getByText('Test Head'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('renders without crashing when part is undefined', () => {
        render(<PartCard part={undefined} onClick={() => {}} />);
        expect(document.querySelector('[class*="MuiCard"]')).toBeInTheDocument();
    });
});
