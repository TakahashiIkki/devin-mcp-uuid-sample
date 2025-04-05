import { v4 as uuidv4, validate as uuidValidate, version as uuidVersion } from 'uuid';

/**
 * UUIDのバージョン情報
 */
export interface UuidVersionInfo {
  isValid: boolean;
  version: number | null;
}

/**
 * UUID生成と検証のためのサービスクラス
 */
export class UuidService {
  /**
   * UUIDを生成して返す
   * @returns 生成されたUUID
   */
  generateUuid(): string {
    return uuidv4();
  }
  
  /**
   * 指定された回数のUUIDを生成して返す
   * @param count - 生成するUUIDの数
   * @returns 生成されたUUIDの配列
   */
  generateUuids(count: number): string[] {
    const uuids: string[] = [];
    for (let i = 0; i < count; i++) {
      uuids.push(this.generateUuid());
    }
    return uuids;
  }

  /**
   * UUIDのバージョンを判定する
   * @param uuid - 判定するUUID文字列
   * @returns UUIDのバージョン情報
   */
  detectUuidVersion(uuid: string): UuidVersionInfo {
    if (!uuidValidate(uuid)) {
      return { isValid: false, version: null };
    }

    const version = uuidVersion(uuid);
    
    return { isValid: true, version };
  }
}
