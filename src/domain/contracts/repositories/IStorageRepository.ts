/**
 * Contrato para armazenamento de arquivos (ex.: Firebase Storage).
 */
export interface IStorageRepository {
  upload(path: string, uri: string, contentType?: string): Promise<string>;
  getDownloadURL(path: string): Promise<string>;
  delete(path: string): Promise<void>;
}
