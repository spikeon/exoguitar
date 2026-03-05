// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

(global as unknown as { TextEncoder: typeof TextEncoder }).TextEncoder = TextEncoder;
(global as unknown as { TextDecoder: typeof TextDecoder }).TextDecoder = TextDecoder as typeof TextDecoder;
