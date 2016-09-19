export interface IMetadata {
    page: number;
    pages: number;
    total: number;
}
export interface IQueryResult {
    metadata: IMetadata;
    objects: {}[];
}
