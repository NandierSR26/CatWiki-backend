import type { CatProps } from "../entities/cat.entity.js";


export interface CatRepository {
    get(page: number, limit: number): Promise<CatProps[]>;
    search(query: string): Promise<CatProps[]>;
    getByBreedId(breedId: string): Promise<CatProps>;
}