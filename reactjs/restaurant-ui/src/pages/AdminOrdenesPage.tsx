import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert,
  FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Mesa, listMesasApi } from "../api/mesas.api";
import { type Orden, listordenesAdminApi, createOrdenApi, updateOrdenApi, deleteOrdenApi } from "../api/ordenes.api";

export default function AdminOrdensPage() {
  const [items, setItems] = useState<Orden[]>([]);
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [error, setError] = useState("");

  const [editId, setEditId] = useState<number | null>(null);
  const [mesa_id, setMesa] = useState<number>(0);
  const [items_summary, setItem_sum] = useState("");
  const [total, setTotal] = useState<number>(0);;
  const [status, setStatus] = useState("");


  const load = async () => {
    try {
      setError("");
      const data = await listordenesAdminApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar ordenes. ¿Login? ¿Token admin?");
    }
  };

  const loadMesas = async () => {
    try {
      const data = await listMesasApi();
      setMesas(data.results); // DRF paginado
      if (!mesa_id && data.results.length > 0) setMesa(data.results[0].id);
    } catch {
      // si falla, no bloquea la pantalla
    }
  };

  useEffect(() => { load(); loadMesas(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!mesa_id) return setError("Seleccione una mesa");
      if (!items_summary.trim() || !status.trim()) return setError("Modelo y status son requeridos");

      const payload = {
        mesa: Number(mesa_id),
        items_summary: items_summary.trim(),
        total: Number(total),
        status: status.trim(),

      };

      if (editId) await updateOrdenApi(editId, payload);
      else await createOrdenApi(payload as any);

      setEditId(null);
      setItem_sum("");
      setStatus("");
      await load();
    } catch {
      setError("No se pudo guardar vehículo. ¿Token admin?");
    }
  };

  const startEdit = (v: Orden) => {
    setEditId(v.id);
    setMesa(v.table_id);
    setItem_sum(v.items_summary);
    setTotal(v.total);
    setStatus(v.status);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteOrdenApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar vehículo. ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Vehículos (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack spacing={2} sx={{ mb: 2 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>

            <FormControl sx={{ width: 260 }}>
              <InputLabel id="mesa-label">Mesa</InputLabel>
              <Select
                labelId="mesa-label"
                label="Mesa"
                value={mesa_id}
                onChange={(e) => setMesa(Number(e.target.value))}
              >
                {mesas.map((m) => (
                  <MenuItem key={m.id} value={m.id}>
                    {m.name} (#{m.id})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField label="Modelo" value={items_summary} onChange={(e) => setItem_sum(e.target.value)} fullWidth />
            <TextField label="Año" type="number" value={total} onChange={(e) => setTotal(Number(e.target.value))} sx={{ width: 160 }} />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField label="Placa" value={status} onChange={(e) => setStatus(e.target.value)} sx={{ width: 220 }} />

            <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
            <Button variant="outlined" onClick={() => { setEditId(null); setItem_sum(""); setStatus(""); }}>Limpiar</Button>
            <Button variant="outlined" onClick={() => { load(); loadMesas(); }}>Refrescar</Button>
          </Stack>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Mesa</TableCell>
              <TableCell>Modelo</TableCell>
              <TableCell>Año</TableCell>
              <TableCell>Placa</TableCell>
              <TableCell>Color</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((v) => (
              <TableRow key={v.id}>
                <TableCell>{v.id}</TableCell>
                <TableCell>{v.table_nombre}</TableCell>
                <TableCell>{v.items_summary}</TableCell>
                <TableCell>{v.total}</TableCell>
                <TableCell>{v.status}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(v)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(v.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}