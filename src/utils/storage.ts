const PREFIX = 'vin-dashboard-';

export function saveItem(key: string, value: any, prefix = PREFIX): string | null {
  try {
    const savedValue = JSON.stringify(value);
    window.localStorage.setItem(`${prefix}${key}`, savedValue);
    return savedValue;
  } catch (e) {
    return null;
  }
}

export function getItem(key: string, parse = true, prefix = PREFIX): unknown {
  try {
    const value = window.localStorage.getItem(`${prefix}${key}`);
    return value && parse ? JSON.parse(value) : value;
  } catch (e) {
    return null;
  }
}

export function clearItem(key: string, prefix = PREFIX): void {
  try {
    return window.localStorage.removeItem(`${prefix}${key}`);
  } catch (e) {}
}
