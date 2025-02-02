import { formatAttribute, getAttributeValue, getUniqueAndCommonAttributes } from './attributeUtils';

describe('attributeUtils', () => {
  describe('getAttributeValue', () => {
    test('should return undefined if no arguments specified', () => {
      expect(() => {
        getAttributeValue();
      }).not.toThrow();
      expect(getAttributeValue()).toBe(undefined);
    });
    test('should return undefined if the argument is an epmty object', () => {
      expect(getAttributeValue()).toBe(undefined);
    });
    test('should return key if only key is present', () => {
      expect(getAttributeValue({ key: 'foo' })).toBe('foo');
    });
    test('should return value if only value specified', () => {
      expect(getAttributeValue({ value: 'foo' })).toBe('foo');
    });
    test('should return value if both key and value present', () => {
      expect(getAttributeValue({ key: 'foo', value: 'bar' })).toBe('bar');
    });
  });
  describe('formatAttribute', () => {
    test('should return an empty string if no arguments specified', () => {
      expect(formatAttribute()).toBe('');
    });
    test('should return formatted value if both key and value specified', () => {
      expect(formatAttribute({ key: 'foo', value: 'bar' })).toBe('foo:bar');
    });
  });
  describe('getUniqueAndCommonAttributes', () => {
    test('should return only common attributes', () => {
      const items = [
        { attributes: [{ key: 'key', value: 'value' }, { key: 'key2', value: 'value2' }] },
        { attributes: [{ key: 'key', value: 'value' }, { key: 'key2', value: 'value2' }] },
      ];
      const result = {
        common: [{ key: 'key', value: 'value' }, { key: 'key2', value: 'value2' }],
        unique: [],
      };
      expect(getUniqueAndCommonAttributes(items)).toEqual(result);
    });
    test('should return only unique attributes', () => {
      const items = [
        { attributes: [{ key: 'key1', value: 'value1' }, { key: 'key2', value: 'value2' }] },
        { attributes: [{ key: 'key3', value: 'value3' }, { key: 'key4', value: 'value4' }] },
      ];
      const result = {
        common: [],
        unique: [
          { key: 'key1', value: 'value1' },
          { key: 'key2', value: 'value2' },
          { key: 'key3', value: 'value3' },
          { key: 'key4', value: 'value4' },
        ],
      };
      expect(getUniqueAndCommonAttributes(items)).toEqual(result);
    });
    test('should return one common and one unique attribute', () => {
      const items = [
        { attributes: [{ key: 'key', value: 'value' }, { key: 'key1', value: 'value1' }] },
        { attributes: [{ key: 'key', value: 'value' }, { key: 'key2', value: 'value2' }] },
        { attributes: [{ key: 'key', value: 'value' }] },
      ];
      const result = {
        common: [{ key: 'key', value: 'value' }],
        unique: [{ key: 'key1', value: 'value1' }, { key: 'key2', value: 'value2' }],
      };
      expect(getUniqueAndCommonAttributes(items)).toEqual(result);
    });
  });
});
