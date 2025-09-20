export function setCookie(
  name: string,
  value: string,
  days: number = 30,
  path: string = '/'
): void {
  const encodedName = encodeURIComponent(name);
  const encodedValue = encodeURIComponent(value);
  let expires = '';
  
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = `; expires=${date.toUTCString()}`;
  }
  
  document.cookie = `${encodedName}=${encodedValue}${expires}; path=${path}`;
}

export function getCookie(name: string): string | null {
  const encodedName = encodeURIComponent(name);
  const cookies = document.cookie.split(';');
  
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === encodedName) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

export function deleteCookie(name: string, path: string = '/'): void {
  setCookie(name, '', -1, path);
}
