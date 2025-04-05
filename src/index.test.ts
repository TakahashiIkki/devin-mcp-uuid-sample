import { describe, it, expect } from 'vitest';
import { v4 as uuidv4, validate as uuidValidate, version as uuidVersion } from 'uuid';

interface UuidVersionInfo {
  isValid: boolean;
  version: number | null;
}

class UuidService {
  generateUuid(): string {
    return uuidv4();
  }
  
  generateUuids(count: number): string[] {
    const uuids: string[] = [];
    for (let i = 0; i < count; i++) {
      uuids.push(this.generateUuid());
    }
    return uuids;
  }

  detectUuidVersion(uuid: string): UuidVersionInfo {
    if (!uuidValidate(uuid)) {
      return { isValid: false, version: null };
    }

    const version = uuidVersion(uuid);
    
    return { isValid: true, version };
  }
}

describe('UuidService', () => {
  describe('generateUuid', () => {
    it('UUIDを生成する', () => {
      const service = new UuidService();
      const uuid = service.generateUuid();
      
      expect(uuidValidate(uuid)).toBe(true);
      
      expect(uuidVersion(uuid)).toBe(4);
    });
  });
  
  describe('detectUuidVersion', () => {
    it('有効なバージョン4のUUIDを正しく判定する', () => {
      const service = new UuidService();
      const uuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'; // バージョン4のUUID
      
      const result = service.detectUuidVersion(uuid);
      
      expect(result.isValid).toBe(true);
      expect(result.version).toBe(4);
    });
    
    it('有効なバージョン1のUUIDを正しく判定する', () => {
      const service = new UuidService();
      const uuid = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'; // バージョン1のUUID
      
      const result = service.detectUuidVersion(uuid);
      
      expect(result.isValid).toBe(true);
      expect(result.version).toBe(1);
    });
    
    it('無効なUUIDを正しく判定する', () => {
      const service = new UuidService();
      const invalidUuid = 'invalid-uuid';
      
      const result = service.detectUuidVersion(invalidUuid);
      
      expect(result.isValid).toBe(false);
      expect(result.version).toBe(null);
    });
  });
});
