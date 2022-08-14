import { message } from 'antd';

export const isNil = (value: any): value is undefined | null => typeof value === 'undefined' || value === null;
export const isEmpty = (value: any): boolean => {
  if (isNil(value)) {
    return true;
  }
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  } else if (Array.isArray(value)) {
    return value.length === 0;
  } else {
    return value.length === 0;
  }
};

export const mergeParam = (currentPath: string, input: any) => {
  let newString = [];
  for (const [fieldName, value] of Object.entries(input)) {
    if (!isEmpty(value)) {
      newString.push(`${fieldName}=${value}`);
    }
  }

  return `${currentPath}?${newString.join('&')}`;
};

export const getParentKey = (key: any, tree: any): any => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item: any) => item.key === key)) {
        parentKey = node;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

export const listToTree = (arr = [], parentId: any, pathName = null) => {
  return arr
    .filter((obj: any) => obj.path === parentId)
    .reduce((acc: any, next: any) => {
      const children: any = listToTree(
        arr,
        `${parentId ? `${parentId}/${next._id}` : next._id}`,
        pathName ? `${pathName}/${next.name}` : next.name,
      );
      return [...acc, { ...next, title: next.name, children, pathName }];
    }, []);
};
export function alertMessage(content: string, type: 'success' | 'error') {
  switch (type) {
    case 'success':
      return message.success({
        content,
        style: {
          textAlign: 'right',
        },
      });
    case 'error':
      return message.error({
        content,
        style: {
          textAlign: 'right',
        },
      });
    default:
      break;
  }
}
export function formatterNumber(val: any) {
  const amount = Math.trunc(val * Math.pow(10, 2)) / Math.pow(10, 2);
  if (!amount) return '';
  return `€ ${amount}`.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatterNumberWithoutSymbol(val: any) {
  const amount = Math.trunc(val * Math.pow(10, 2)) / Math.pow(10, 2);
  if (!amount) return '';
  return `${amount}`.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function convertStringToNumber(val: string) {
  if (!val) return val;
  return Number(
    val
      .toString()
      .split('')
      .filter((item) => item !== ',')
      .join(''),
  );
}

export function formatterNumberWithoutDecimal(val: any) {
  const amount = val.toString().replace(/[^0-9]*/g, '');
  if (!amount) return '';
  return `${amount}`.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function formatterNumberWithoutComma(x: any) {
  if (!isNaN(Number(x))) {
    const result = x.toString().split('.');
    result[0] = result[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return result.join('.');
  }
  return x;
}
