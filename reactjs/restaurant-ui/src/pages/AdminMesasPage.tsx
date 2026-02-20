import { useEffect, useState } from "react";
import {
  Container, Paper, Typography, TextField, Button, Stack,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton, Alert
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { type Mesa, listMesasApi, createMesaApi, updateMesaApi, deleteMesaApi } from "../api/mesas.api";

export default function AdminMesasPage() {
  const [items, setItems] = useState<Mesa[]>([]);
  const [nombre, setNombre] = useState("");
  const [editId, setEditId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await listMesasApi();
      setItems(data.results); // DRF paginado
    } catch {
      setError("No se pudo cargar Mesas. ¿Login? ¿Token admin?");
    }
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    try {
      setError("");
      if (!nombre.trim()) return setError("Nombre requerido");

      if (editId) await updateMesaApi(editId, nombre.trim());
      else await createMesaApi(nombre.trim());

      setNombre("");
      setEditId(null);
      await load();
    } catch {
      setError("No se pudo guardar Mesa. ¿Token admin?");
    }
  };

  const startEdit = (m: Mesa) => {
    setEditId(m.id);
    setNombre(m.name);
  };

  const remove = async (id: number) => {
    try {
      setError("");
      await deleteMesaApi(id);
      await load();
    } catch {
      setError("No se pudo eliminar Mesa. ¿Vehículos asociados? ¿Token admin?");
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Admin Mesas (Privado)</Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
          <TextField label="Nombre Mesa" value={nombre} onChange={(e) => setNombre(e.target.value)} fullWidth />
          <Button variant="contained" onClick={save}>{editId ? "Actualizar" : "Crear"}</Button>
          <Button variant="outlined" onClick={() => { setNombre(""); setEditId(null); }}>Limpiar</Button>
          <Button variant="outlined" onClick={load}>Refrescar</Button>
        </Stack>

        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.id}</TableCell>
                <TableCell>{m.name}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => startEdit(m)}><EditIcon /></IconButton>
                  <IconButton onClick={() => remove(m.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}