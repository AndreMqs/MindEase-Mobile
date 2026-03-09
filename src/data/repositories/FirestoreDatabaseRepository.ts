import type { IDatabaseRepository } from '../../domain/contracts/repositories/IDatabaseRepository';
import type { IDatabaseDataSource } from '../data-sources/database/IDatabaseDataSource';

/**
 * Implementação do repositório de banco que delega para um data source.
 * A implementação concreta do data source (Firestore) fica na infra.
 */
export class FirestoreDatabaseRepository implements IDatabaseRepository {
  constructor(private readonly dataSource: IDatabaseDataSource) {}

  get<T>(collection: string, id: string): Promise<T | null> {
    return this.dataSource.get<T>(collection, id);
  }

  set<T>(collection: string, id: string, data: T): Promise<void> {
    return this.dataSource.set(collection, id, data);
  }

  update<T extends Record<string, unknown>>(
    collection: string,
    id: string,
    data: Partial<T>
  ): Promise<void> {
    return this.dataSource.update(collection, id, data);
  }

  delete(collection: string, id: string): Promise<void> {
    return this.dataSource.delete(collection, id);
  }

  query<T>(
    collection: string,
    options?: { where?: Array<[string, string, unknown]>; limit?: number }
  ): Promise<T[]> {
    return this.dataSource.query<T>(collection, options);
  }
}
