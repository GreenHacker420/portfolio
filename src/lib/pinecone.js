import { Pinecone } from '@pinecone-database/pinecone';

if (!process.env.PINECONE_API_KEY) {
    throw new Error('PINECONE_API_KEY is not defined');
}

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
});

export const getIndex = () => {
    if (!process.env.PINECONE_INDEX_NAME) {
        throw new Error('PINECONE_INDEX_NAME is not defined');
    }
    return pinecone.index(process.env.PINECONE_INDEX_NAME);
};

export default pinecone;
