type TODO = any;

type BackendArchive = {
    name: number; //it is number on the backend because thats how mongodb fetches it
    url: string;
    count: number;
    children: Archive[];
};

type Archive = {
    name: string; //it is number on the backend because thats how mongodb fetches it
    url: string;
    count: number;
    children: Archive[];
};

export { TODO, Archive, BackendArchive };
