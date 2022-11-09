import urlJoin from 'url-join';

export function joinUrl(...paths: string[]): string {
  let url = urlJoin(...paths);
  while (url.indexOf('//') > -1) {
    url = url.replace(/\/\//g, '/');
  }
  return url;
}
