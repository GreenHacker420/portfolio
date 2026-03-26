import { Pinecone } from '@pinecone-database/pinecone';

let _pinecone = null;

export const getPineconeClient = () => {
    if (_pinecone) return _pinecone;
    
    const apiKey = process.env.PINECONE_API_KEY;
    if (!apiKey) {
        console.warn('PINECONE_API_KEY is not defined. Vector features will be unavailable.');
        return null;
    }

    _pinecone = new Pinecone({ apiKey });
    return _pinecone;
};

export const getIndex = () => {
    const client = getPineconeClient();
    if (!client) return null;

    const indexName = process.env.PINECONE_INDEX_NAME;
    if (!indexName) {
        console.warn('PINECONE_INDEX_NAME is not defined');
        return null;
    }
    return client.index(indexName);
};

export default getPineconeClient;
