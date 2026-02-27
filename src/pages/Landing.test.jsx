import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Landing from './Landing';

// Mock GSAP to prevent it from trying to animate headless DOM elements
jest.mock('gsap', () => {
    return {
        registerPlugin: jest.fn(),
        fromTo: jest.fn(),
        utils: {
            toArray: jest.fn(() => []),
        }
    };
});

// Mock @gsap/react to prevent useGSAP from running actual animations
jest.mock('@gsap/react', () => {
    return {
        useGSAP: (callback) => {
            // we can simulate the callback executing if we want, but for a render test, doing nothing is safest.
        }
    };
});

describe('Landing Page Component', () => {
    test('renders the main hero text', () => {
        render(
            <MemoryRouter>
                <Landing />
            </MemoryRouter>
        );

        // Assert that the main headline is visible
        expect(screen.getByText(/Voyagez plus loin./i)).toBeInTheDocument();
        expect(screen.getByText(/Planifiez moins./i)).toBeInTheDocument();
    });

    test('renders the call to action buttons', () => {
        render(
            <MemoryRouter>
                <Landing />
            </MemoryRouter>
        );

        // Assert that buttons are rendered
        expect(screen.getByText(/Commencer l'expérience/i)).toBeInTheDocument();
        expect(screen.getByText(/Découvrir/i)).toBeInTheDocument();
    });
});
