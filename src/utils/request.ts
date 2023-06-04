const SERVER_URL = "http://localhost:5000";

export async function get(url: string) {
  return fetch(SERVER_URL + url);
}

export async function post(url: string, data: any) {
  return fetch(SERVER_URL + url, { method: "post", body: JSON.stringify(data) });
}
