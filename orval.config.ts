import { defineConfig } from 'orval'

export default defineConfig({
    flylink: {
        input: 'http://localhost:8080/api-docs',
        output: {
            mode: 'tags-split',
            target: 'src/api/generated',
            schemas: 'src/api/generated/schemas',
            client: 'react-query',
            override: {
                mutator: {
                    path: 'src/lib/axios.ts',
                    name: 'customInstance',
                },
                query: {
                    useQuery: true,
                    useMutation: true,
                    useSuspenseQuery: true,
                },
            },
        },
        hooks: {
            afterAllFilesWrite: 'bunx prettier --write',
        },
    },
})
