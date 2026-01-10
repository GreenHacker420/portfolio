import { getMockData } from '@/lib/mockData';
import getData from './dbfetch';


export default async function AllData() {


    const mockData = getMockData();
    const dbData = await getData();

    if (!dbData) {
        return mockData;
    }
    return dbData;

}