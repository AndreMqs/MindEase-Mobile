/**
 * Porta do data source de storage (arquivos).
 */
export interface IStorageDataSource {
  upload(path: string, uri: string, contentType?: string): Promise<string>;
  getDownloadURL(path: string): Promise<string>;
  delete(path: string): Promise<void>;
}
