export interface PaginatedResponseDTO<T> {
  data: T[];
  limit: number;
  offset: number;
  totalCount: number;
}
