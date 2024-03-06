export type Dict = {
  [key: string]: { [key: string]: string };
};

export interface DefaultGetRequestPayload {
  limit: number;
  offset: number;
  filter: string[];
  orderBy: string;
  sortBy: string;
}
