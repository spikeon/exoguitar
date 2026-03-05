import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PartsProvider } from '../../contexts/parts/provider';
import Gallery from './index';
import { Part } from '../../types/Parts';

const partsWithImages: Part[] = [
    {
        name: 'Test Head',
        section: 'Head',
        path: 'Head/Test Head',
        hasBOM: true,
        hasAssembly: true,
        images: ['images/Head/Test Head/photos/a.jpg', 'images/Head/Test Head/photos/b.png'],
    },
    {
        name: 'No Images',
        section: 'Bridge',
        path: 'Bridge/No Images',
        hasBOM: true,
        hasAssembly: false,
        images: [],
    },
];

const partsNoImages: Part[] = [
    {
        name: 'Empty',
        section: 'Head',
        path: 'Head/Empty',
        hasBOM: false,
        hasAssembly: false,
    },
];

describe('Gallery', () => {
    it('renders PageWrapper with Gallery title', () => {
        render(
            <PartsProvider data={[]}>
                <Gallery />
            </PartsProvider>
        );
        expect(screen.getByText('Gallery')).toBeInTheDocument();
    });

    it('shows message when no parts have images', () => {
        render(
            <PartsProvider data={partsNoImages}>
                <Gallery />
            </PartsProvider>
        );
        expect(screen.getByText(/No part images yet/)).toBeInTheDocument();
    });

    it('shows part section and name for parts with images', () => {
        render(
            <PartsProvider data={partsWithImages}>
                <Gallery />
            </PartsProvider>
        );
        expect(screen.getByText('Head – Test Head')).toBeInTheDocument();
    });

    it('renders thumbnails for part images', () => {
        render(
            <PartsProvider data={partsWithImages}>
                <Gallery />
            </PartsProvider>
        );
        const imgs = document.querySelectorAll('img');
        expect(imgs.length).toBe(2);
        expect(imgs[0]).toHaveAttribute('src', '/images/Head/Test Head/photos/a.jpg');
        expect(imgs[1]).toHaveAttribute('src', '/images/Head/Test Head/photos/b.png');
    });

    it('opens modal when thumbnail is clicked', () => {
        render(
            <PartsProvider data={partsWithImages}>
                <Gallery />
            </PartsProvider>
        );
        const thumb = document.querySelector('img[src="/images/Head/Test Head/photos/a.jpg"]');
        expect(thumb).toBeInTheDocument();
        fireEvent.click(thumb!);
        const modal = document.querySelector('.MuiModal-root');
        expect(modal).toBeInTheDocument();
        const expandedImg = document.querySelector('.MuiModal-root img');
        expect(expandedImg).toHaveAttribute('src', '/images/Head/Test Head/photos/a.jpg');
    });

    it('normalizes backslash in image paths to forward slash', () => {
        const partsBackslash: Part[] = [
            {
                name: 'Back',
                section: 'Back',
                path: 'Back/Back',
                hasBOM: false,
                hasAssembly: false,
                images: ['images\\Back\\Back\\photos\\x.jpg'],
            },
        ];
        render(
            <PartsProvider data={partsBackslash}>
                <Gallery />
            </PartsProvider>
        );
        const img = document.querySelector('img');
        expect(img).toHaveAttribute('src', '/images/Back/Back/photos/x.jpg');
    });
});
