export interface LockObject {
  instance: unknown;
}
export type StorageCommand = string[];

export interface InMemoryStorageService {
  get<T = unknown>(key: string): Promise<T>;
  upsert<T = unknown>(key: string, data: T): Promise<void>;
  getUpsertCommand<T = unknown>(key: string, data: T): StorageCommand;
  delete(key: string): Promise<void>;
  getDeleteCommand(key: string): StorageCommand;
  clear: () => Promise<void>;
  executeCommand(command: StorageCommand): Promise<void>;
  executeCommandsInTransaction(...commands: StorageCommand[]): Promise<void>;
  wrapInLock<T = unknown>(key: string, callback: () => Promise<T>): Promise<T>;
  isHaveLockOrThrow(key: string): Promise<boolean>;
}
