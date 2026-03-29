/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

///<reference path='../../resources/jest.d.ts'/>

import { Map, update } from '../../';

describe('update', () => {
  it('updates a value using updater function', () => {
    const map = Map({ a: 1, b: 2 });
    expect(update(map, 'a', x => (x as number) * 10)).toEqual(
      Map({ a: 10, b: 2 })
    );
  });

  it('works with plain objects', () => {
    const obj = { a: 1, b: 2 };
    const result = update(obj, 'a', x => (x as number) * 10);
    expect(result).toEqual({ a: 10, b: 2 });
    expect(result).not.toBe(obj);
  });

  it('does not modify the original object', () => {
    const originalObject = { x: 123, y: 456 };
    expect(
      update(originalObject, 'x', x => {
        return (x as number) * 2;
      })
    ).toEqual({
      x: 246,
      y: 456,
    });
    expect(originalObject).toEqual({ x: 123, y: 456 });
  });

  it('is not sensible to prototype pollution via update on plain object', () => {
    type User = { user: string; admin?: boolean };

    const obj: User = { user: 'Alice' };
    // @ts-expect-error -- intentionally setting __proto__ to test prototype pollution
    const result = update(obj, '__proto__', () => ({
      admin: true,
    })) as unknown as User;

    // The returned copy should NOT have 'admin' accessible via prototype
    expect(result.admin).toBeUndefined();
  });

  it('is not sensible to prototype pollution via update with JSON.parse source', () => {
    type User = { user: string; admin?: boolean };

    // JSON.parse creates __proto__ as an own property
    const malicious = JSON.parse('{"user":"Eve","__proto__":{"admin":true}}');
    const result = update(malicious, 'user', () => 'Alice') as User;

    // The returned copy (via shallowCopy) should NOT have 'admin' via prototype
    expect(result.admin).toBeUndefined();
  });
});
