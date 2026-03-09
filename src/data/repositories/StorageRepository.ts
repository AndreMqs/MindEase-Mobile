import type { IStorageRepository } from '../../domain/contracts/repositories/IStorageRepository';
import type { IStorageDataSource } from '../data-sources/storage/IStorageDataSource';

export class StorageRepository implements IStorageRepository {
  constructor(private readonly dataSource: IStorageDataSource) {}

  upload(path: string, uri: string, contentType?: string): Promise<string> {
    return this.dataSource.upload(path, uri, contentType);
  }

  getDownloadURL(path: string): Promise<string> {
    return this.dataSource.getDownloadURL(path);
  }

  delete(path: string): Promise<void> {
    return this.dataSource.delete(path);
  }
}
