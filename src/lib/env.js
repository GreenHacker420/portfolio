export function validateEnv() {
    const required = [
        'DATABASE_URL',
        'NEXTAUTH_SECRET',
        'NEXTAUTH_URL'
    ];

    const optional = [
        { key: 'GITHUB_TOKEN', msg: 'GitHub data fetching will be limited by rate limits.' },
        { key: 'OPENAI_API_KEY', msg: 'AI features like Chat and Resume generation will not work.' },
        { key: 'RESEND_API_KEY', msg: 'Email notifications will not be sent.' },
        { key: 'PINECONE_API_KEY', msg: 'Vector search for Knowledge Base will be disabled.' }
    ];

    const missing = required.filter(key => !process.env[key]);

    if (missing.length > 0) {
        const error = `Missing required environment variables: ${missing.join(', ')}`;
        if (process.env.NODE_ENV === 'production') {
            throw new Error(error);
        } else {
            console.error('\x1b[31m%s\x1b[0m', 'CRITICAL ERROR: ' + error);
        }
    }

    optional.forEach(({ key, msg }) => {
        if (!process.env[key]) {
            console.warn('\x1b[33m%s\x1b[0m', `OPTIONAL ENV MISSING: ${key}. ${msg}`);
        }
    });
}
