import { z } from 'zod';

const ProcessEnv = z.object({
    TOKEN: z.string(),
    CLIENT_ID: z.string(),
    GUILD: z.string(),
    REDIRECT_URI: z.string(),
});

declare global {
    namespace NodeJS {
        interface ProcessEnv extends z.infer<typeof ProcessEnv> {}
    }
}