import { Router } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();

// ===============================================================
// 1. GET ALL: Obtener todas las tareas
// Endpoint: GET /api/tareas
// ===============================================================
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tareas')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({
        ok: false,
        error: error.message
      });
    }

    res.status(200).json({
      ok: true,
      total: data ? data.length : 0,
      data: data || []
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: 'Error interno del servidor: ' + err.message
    });
  }
});

// ===============================================================
// 2. GET BY ID: Obtener una tarea por su ID
// Endpoint: GET /api/tareas/:id
// Devuelve 'data' como un arreglo de objetos: [{ ... }]
// ===============================================================
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('tareas')
      .select('*')
      .eq('id', id);

    if (error) {
      return res.status(500).json({
        ok: false,
        error: error.message
      });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({
        ok: false,
        error: `No se encontró la tarea con ID ${id}`,
        data: []
      });
    }

    res.status(200).json({
      ok: true,
      total: data.length,
      data: data // Retorna siempre un array de objetos [ { id, titulo, ... } ]
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: 'Error interno del servidor: ' + err.message
    });
  }
});

// ===============================================================
// 3. POST: Crear una nueva tarea
// Endpoint: POST /api/tareas
// Body JSON esperado: { "titulo": "string", "descripcion": "string" (opcional) }
// ===============================================================
router.post('/', async (req, res) => {
  try {
    const { titulo, descripcion, completada } = req.body;

    // Validación básica de campos obligatorios
    if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
      return res.status(400).json({
        ok: false,
        error: 'El campo "titulo" es obligatorio y debe ser un texto.'
      });
    }

    const nuevaTarea = {
      titulo: titulo.trim(),
      descripcion: descripcion || null,
      completada: typeof completada === 'boolean' ? completada : false
    };

    const { data, error } = await supabase
      .from('tareas')
      .insert([nuevaTarea])
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        ok: false,
        error: error.message
      });
    }

    res.status(201).json({
      ok: true,
      mensaje: 'Tarea creada con éxito',
      data
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: 'Error interno del servidor: ' + err.message
    });
  }
});

// ===============================================================
// 4. PUT: Actualizar una tarea existente
// Endpoint: PUT /api/tareas/:id
// Body JSON: { "titulo": "...", "descripcion": "...", "completada": true/false }
// ===============================================================
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, completada } = req.body;

    // Verificar si enviaron al menos un campo a modificar
    const camposParaActualizar = {};

    if (titulo !== undefined) {
      if (typeof titulo !== 'string' || titulo.trim() === '') {
        return res.status(400).json({
          ok: false,
          error: 'El campo "titulo" no puede estar vacío.'
        });
      }
      camposParaActualizar.titulo = titulo.trim();
    }

    if (descripcion !== undefined) {
      camposParaActualizar.descripcion = descripcion;
    }

    if (completada !== undefined) {
      if (typeof completada !== 'boolean') {
        return res.status(400).json({
          ok: false,
          error: 'El campo "completada" debe ser un booleano (true o false).'
        });
      }
      camposParaActualizar.completada = completada;
    }

    if (Object.keys(camposParaActualizar).length === 0) {
      return res.status(400).json({
        ok: false,
        error: 'Debes enviar al menos un campo para actualizar ("titulo", "descripcion" o "completada").'
      });
    }

    const { data, error } = await supabase
      .from('tareas')
      .update(camposParaActualizar)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      return res.status(500).json({
        ok: false,
        error: error.message
      });
    }

    if (!data) {
      return res.status(404).json({
        ok: false,
        error: `No se encontró la tarea con ID ${id} para actualizar`
      });
    }

    res.status(200).json({
      ok: true,
      mensaje: 'Tarea actualizada correctamente',
      data
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: 'Error interno del servidor: ' + err.message
    });
  }
});

// ===============================================================
// 5. DELETE: Eliminar una tarea por ID
// Endpoint: DELETE /api/tareas/:id
// ===============================================================
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('tareas')
      .delete()
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      return res.status(500).json({
        ok: false,
        error: error.message
      });
    }

    if (!data) {
      return res.status(404).json({
        ok: false,
        error: `No se encontró la tarea con ID ${id} para eliminar`
      });
    }

    res.status(200).json({
      ok: true,
      mensaje: 'Tarea eliminada exitosamente',
      data
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: 'Error interno del servidor: ' + err.message
    });
  }
});

export default router;
