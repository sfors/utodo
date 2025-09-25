export async function request<T>(url: string, {method, body}: {method: "GET" | "POST", body?: any}): Promise<T> {
  let options: RequestInit = {method};

  if (method === "POST") {
    options.body = JSON.stringify(body);
    options.headers = {...options.headers, "Content-Type": "application/json"};
  }

  const token = localStorage.getItem("token");

  if (token) {
    options.headers = {...options.headers, Authorization: `Bearer ${token}`};
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return response.json();
}

export async function get<T>(url: string): Promise<T> {
  return request<T>(url, {method: "GET"});
}

export async function post<T>(url: string, {body}: {body: any}): Promise<T> {
  return request<T>(url, {body, method: "POST"});
}