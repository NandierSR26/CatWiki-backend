export interface CatProps {
    weight:             Weight;
    id:                 string;
    name:               string;
    cfa_url:            string;
    vetstreet_url:      string;
    vcahospitals_url:   string;
    temperament:        string;
    origin:             string;
    country_codes:      string;
    country_code:       string;
    description:        string;
    life_span:          string;
    indoor:             number;
    alt_names:          string;
    adaptability:       number;
    affection_level:    number;
    child_friendly:     number;
    dog_friendly:       number;
    energy_level:       number;
    grooming:           number;
    health_issues:      number;
    intelligence:       number;
    shedding_level:     number;
    social_needs:       number;
    stranger_friendly:  number;
    vocalisation:       number;
    experimental:       number;
    hairless:           number;
    natural:            number;
    rare:               number;
    rex:                number;
    suppressed_tail:    number;
    short_legs:         number;
    wikipedia_url:      string;
    hypoallergenic:     number;
    reference_image_id: string;
    image:              Image;
}

export interface Image {
    id:     string;
    width:  number;
    height: number;
    url:    string;
}

export interface Weight {
    imperial: string;
    metric:   string;
}


export class CatEntity {
    constructor(private readonly cat: CatProps) {}

    static fromPrimitives(cat: CatProps): CatEntity {
        return new CatEntity(cat);
    }

    toPrimitives(): CatProps {
        return this.cat;
    }

    getId(): string {
        return this.cat.id;
    }
}
