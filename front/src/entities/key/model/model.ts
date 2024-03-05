export interface Log {
  userId: string;
  newValue: string;
  oldValue: string;
  timestamp: string;
}

export interface Key {
  id: number;
  projectId: number;
  langId: number;
  name: string;
  value: string;
  comment: string;
  logs: Log[];
}
