import { http } from "./http";
    
export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type Orden = {
  id: number;
  table_id: number;
  table_nombre?: string;
  items_summary: string;
  total: number;
  status: string;
  creado_en?: string;
};


export async function listordenesPublicApi() {
  const { data } = await http.get<Paginated<Orden>>("/api/ordenes/");
  return data; // { ... , results: [] }
}

export async function listordenesAdminApi() {
  const { data } = await http.get<Paginated<Orden>>("/api/ordenes/");
  return data;
}

export async function createOrdenApi(payload: Omit<Orden, "id">) {
  const { data } = await http.post<Orden>("/api/ordenes/", payload);
  return data;
}

export async function updateOrdenApi(id: number, payload: Partial<Orden>) {
  const { data } = await http.put<Orden>(`/api/ordenes/${id}/`, payload);
  return data;
}

export async function deleteOrdenApi(id: number) {
  await http.delete(`/api/ordenes/${id}/`);
}