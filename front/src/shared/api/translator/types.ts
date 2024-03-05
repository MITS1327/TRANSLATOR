export type GetDictsPayload = {
  project?: string;
};

export type GetProjectsPayload = {
  limit: number;
  offset: number;
  filter: string[];
  orderBy: string;
  sortBy: string;
};

export type UpdateKeyValue = {
  id: number;
  value: string;
};

type Key = {
  langId: number;
  value: string;
};

export type CreateKeyPayload = {
  projectId: number;
  name: string;
  values: Key[];
};

export type UpdateCommentPayload = {
  name: string;
  comment: string;
  projectId: number;
  langsIdsToFilesAssociations?: string[];
  pootleFiles?: string[];
};

export type CreateProjectPayload = {
  name: string;
  langsIdsToFilesAssociations: string[];
  pootleFiles: string[];
};
