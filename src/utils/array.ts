export type NestedArrays<T> = Array<T | NestedArrays<T>>;
/**
 * @see https://github.com/jonschlinkert/arr-flatten
 */
function flatten<T>(arr: NestedArrays<T>, result: T[]) {
  let len = arr.length;
  let num = 0;

  while (len--) {
    const current = arr[num++];
    if (Array.isArray(current)) {
      flatten(current, result);
    } else {
      result.push(current);
    }
  }
}

export function flattenedArray<T>(nestedArray: NestedArrays<T>): T[] {
  const result: T[] = [];
  flatten(nestedArray, result);
  return result;
}

export function findObject<T, K extends keyof T>(arrayObject: T[], key: K, val: any): number {
  return arrayObject.findIndex((item) => item[key] === val);
}

export const formatListPermission = (array: any): any => {
  const output = array.reduce(
    (o: any[], current: { resource: string; description: string; status: string; _id: string; action: string }) => {
      const occurs = o.reduce((n: any, item: { resource: any }, init: any) => {
        return item.resource === current.resource ? init : n;
      }, -1);
      if (occurs >= 0) {
        o[occurs].description = o[occurs].description.concat({
          description: current.description,
          status: current.status,
          _id: current._id,
          action: current.action,
        });
      } else {
        const obj = {
          resource: current.resource,
          description: [
            { description: current.description, status: current.status, _id: current._id, action: current.action },
          ],
        };
        o = o.concat([obj]);
      }
      return o;
    },
    [],
  );
  return output;
};
