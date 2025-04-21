const local = "http://localhost:8888/";

/* const production = "https://getdrunk.onrender.com"; */

export const serverBaseUrl: string = local;

export function getGameServerUrl(gameName: string): string {
  return `${serverBaseUrl}${gameName}`;
}
