import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'node',
        include: ['tests/**/*.test.js'],
        globals: true,
        coverage: {
            reporter: ['text', 'html'],
            include: ['js/**/*.js'],
            exclude: ['js/problems/problemData.js']
        }
    }
});
