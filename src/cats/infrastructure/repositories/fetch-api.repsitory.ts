import type { CatProps } from "../../domain/entities/cat.entity.js";
import type { CatRepository } from "../../domain/repositories/cat.repository.js";


export class FetchAPIRepository implements CatRepository {
    private readonly apiUrl: string;
    private readonly apiKey: string;
    
    constructor(apiUrl: string, apiKey: string) {
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
    }
    async get(page: number, limit: number): Promise<CatProps[]> {
        const response = await fetch(`${this.apiUrl}/breeds?page=${page}&limit=${limit}`, {
            headers: {
                'x-api-key': this.apiKey
            }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error('Failed to fetch breeds');
        }
        return data;
    }
    async search(query: string): Promise<CatProps[]> {
        const response = await fetch(`${this.apiUrl}/breeds/search?q=${query}`, {
            headers: {
                'x-api-key': this.apiKey
            }
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error('Failed to search breeds');
        }
        return data;
    }

    async getByBreedId(breedId: string): Promise<CatProps> {
        const response = await fetch(`${this.apiUrl}/breeds/${breedId}`, {
            headers: {
                'x-api-key': this.apiKey
            }
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error('Failed to fetch breed by ID');
        }
        return data;
    }

    async Get(endpoint: string): Promise<any> {
        const response = await fetch(`${this.apiUrl}/${endpoint}`, {
            headers: {
                'x-api-key': this.apiKey
            }
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${endpoint}`);
        }
        return data;
    }
}