import { describe, it, expect } from 'vitest';
import { UuidClient } from './index.js';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

describe('UuidClient', () => {
  describe('generateUuid', () => {
    it('UUIDを生成する', () => {
      const client = new UuidClient();
      const uuid = client.generateUuid();
      
      expect(uuidValidate(uuid)).toBe(true);
      
      expect(uuidVersion(uuid)).toBe(4);
    });
  });
  
  describe('detectUuidVersion', () => {
    it('有効なバージョン4のUUIDを正しく判定する', () => {
      const client = new UuidClient();
      const uuid = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'; // バージョン4のUUID
      
      const result = client.detectUuidVersion(uuid);
      
      expect(result.isValid).toBe(true);
      expect(result.version).toBe(4);
    });
    
    it('有効なバージョン1のUUIDを正しく判定する', () => {
      const client = new UuidClient();
      const uuid = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'; // バージョン1のUUID
      
      const result = client.detectUuidVersion(uuid);
      
      expect(result.isValid).toBe(true);
      expect(result.version).toBe(1);
    });
    
    it('無効なUUIDを正しく判定する', () => {
      const client = new UuidClient();
      const invalidUuid = 'invalid-uuid';
      
      const result = client.detectUuidVersion(invalidUuid);
      
      expect(result.isValid).toBe(false);
      expect(result.version).toBe(null);
    });
  });
});
