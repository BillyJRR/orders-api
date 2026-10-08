import { defineConfig } from 'oxlint';

export default defineConfig({
    overrides: [
        // DOMAIN
        {
            files: ['src/**/domain/**/*.ts'],
            rules: {
                'no-restricted-imports': [
                    'error',
                    {
                        patterns: [
                            {
                                group: [
                                    '@nestjs/*',
                                    'typeorm',
                                    'class-validator',
                                    'class-transformer',
                                ],
                                message:
                                    'El dominio no puede depender de frameworks ni librerías externas.',
                            },
                            {
                                group: [
                                    '**/application/**',
                                    '**/infrastructure/**',
                                    '**/presentation/**',
                                ],
                                message:
                                    'El dominio no puede importar capas externas.',
                            },
                        ],
                    },
                ],
            },
        },

        // APPLICATION
        {
            files: ['src/**/application/**/*.ts'],
            rules: {
                'no-restricted-imports': [
                    'error',
                    {
                        patterns: [
                            {
                                group: [
                                    'typeorm',
                                    '@nestjs/typeorm',
                                    '**/infrastructure/**',
                                    '**/presentation/**',
                                ],
                                message:
                                    'Application no puede depender de infrastructure ni de presentation.',
                            },
                        ],
                    },
                ],
            },
        },

        // PRESENTATION
        {
            files: ['src/**/presentation/**/*.ts'],
            rules: {
                'no-restricted-imports': [
                    'error',
                    {
                        patterns: [
                            'typeorm',
                            '@nestjs/typeorm',
                            '**/infrastructure/**',
                        ].map((pattern) => ({
                            group: [pattern],
                            message:
                                'Presentation no puede depender de infrastructure.',
                        })),
                    },
                ],
            },
        },
    ],
});