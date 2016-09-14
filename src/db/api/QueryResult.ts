export interface Metadata {
    page: number;
    pages: number;
    total: number;
}

export interface QueryResult {
    metadata: Metadata;
    objects: {}[];
}
