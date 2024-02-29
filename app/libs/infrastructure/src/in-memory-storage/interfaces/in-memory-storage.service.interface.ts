export interface LockObject {
  instance: unknown;
}
export type StorageCommand = string[];

export interface InMemoryStorageService {
  get<T = unknown>(key: string): Promise<T>;
  upsert<T = unknown>(key: string, data: T): Promise<void>;
  getUpsertCommand<T = unknown>(key: string, data: T): StorageCommand;
  executeCommand(command: StorageCommand): Promise<void>;
  executeCommandsInTransaction(...commands: StorageCommand[]): Promise<void>;
  isHaveLock(key: string): Promise<boolean>;
  lock(key: string): Promise<LockObject>;
  releaseLock(id: LockObject): Promise<void>;
}
