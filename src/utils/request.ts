const SERVER_URL = import.meta.env.DEV ? "http://localhost:5000" : "https://ops-wswd.onrender.com";

async function check(res: Response) {
  const data = await res.json();

  if (res.status !== 200) {
    console.log(data);

    const errorMessage = data.error;
    throw new Error(`Code ${res.status} - ${errorMessage}`);
  }

  return data;
}

export async function get(url: string) {
  const res = await fetch(SERVER_URL + url);
  return check(res);
}

export async function del(url: string) {
  const res = await fetch(SERVER_URL + url, { method: "delete" });
  return check(res);
}

export async function post(url: string, data: any) {
  const res = await fetch(SERVER_URL + url, {
    method: "post",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  });
  return check(res);
}
