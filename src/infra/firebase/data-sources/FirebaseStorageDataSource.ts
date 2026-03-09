import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../../../lib/firebase';
import type { IStorageDataSource } from '../../../data/data-sources/storage/IStorageDataSource';

/**
 * Implementação do data source de storage usando Firebase Storage (Web SDK).
 * Uma única config em src/lib/firebase.ts para iOS, Android e Web.
 * Em React Native/Expo, upload converte URI em blob via fetch.
 */
export class FirebaseStorageDataSource implements IStorageDataSource {
  async upload(path: string, uri: string, contentType?: string): Promise<string> {
    const storageRef = ref(storage, path);
    const response = await fetch(uri);
    const blob = await response.blob();
    await new Promise<void>((resolve, reject) => {
      const task = uploadBytesResumable(storageRef, blob, {
        contentType: contentType ?? blob.type ?? 'application/octet-stream',
      });
      task.then(() => resolve(), reject);
    });
    return getDownloadURL(storageRef);
  }

  async getDownloadURL(path: string): Promise<string> {
    const storageRef = ref(storage, path);
    return getDownloadURL(storageRef);
  }

  async delete(path: string): Promise<void> {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  }
}
