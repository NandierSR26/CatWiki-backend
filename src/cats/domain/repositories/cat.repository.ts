import type { CatProps } from "../entities/cat.entity.js";


export interface CatRepository {
    get(): Promise<CatProps[]>;
    search(query: string): Promise<CatProps[]>;
    getByBreedId(breedId: string): Promise<CatProps>;
}