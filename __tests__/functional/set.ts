/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

///<reference path='../../resources/jest.d.ts'/>

import { Map, set } from '../../';

describe('set', () => {
  it('sets a new value', () => {
    const map = Map({ a: 1, b: 2 });
    expect(set(map, 'c', 3)).toEqual(Map({ a: 1, b: 2, c: 3 }));
  });

  it('updates an existing value', () => {
    const map = Map({ a: 1, b: 2 });
    expect(set(map, 'a', 10)).toEqual(Map({ a: 10, b: 2 }));
  });

  it('returns same collection if value is identical', () => {
    const map = Map({ a: 1, b: 2 });
    expect(set(map, 'a', 1)).toBe(map);
  });

  it('works with plain objects', () => {
    const obj = { a: 1, b: 2 };
    const result = set(obj, 'c', 3);
    expect(result).toEqual({ a: 1, b: 2, c: 3 });
    expect(result).not.toBe(obj);
  });

  it('does not modify the original object', () => {
    const originalObject = { x: 123, y: 456 };
    expect(set(originalObject, 'z', 789)).toEqual({ x: 123, y: 456, z: 789 });
    expect(originalObject).toEqual({ x: 123, y: 456 });
  });

  it('is not sensible to prototype pollution via set on plain object', () => {
    type User = { user: string; admin?: boolean };

    const obj: User = { user: 'Alice' };
    // Setting __proto__ key should not change the returned object's prototype chain
    // @ts-expect-error -- intentionally setting __proto__ to test prototype pollution
    const result = set(obj, '__proto__', { admin: true });

    // The returned copy should NOT have 'admin' accessible via prototype
    // @ts-expect-error -- testing prototype pollution
    expect(result.admin).toBeUndefined();
  });

  it('is not sensible to prototype pollution via set with JSON.parse source', () => {
    type User = { user: string; admin?: boolean };

    // JSON.parse creates __proto__ as an own property
    const malicious = JSON.parse(
      '{"user":"Eve","__proto__":{"admin":true}}'
    ) as User;
    // set on an object that already carries __proto__ from JSON.parse
    const result = set(malicious, 'user', 'Alice');

    // The returned copy should NOT have 'admin' accessible via prototype pollution
    expect(result.admin).toBeUndefined();
  });
});
