-- ===============================================================
-- Script SQL para Supabase (Ejemplo de Clase)
-- Pega este código en el "SQL Editor" de tu panel de Supabase y dale a "Run"
-- ===============================================================

-- 1. Crear la tabla de 'tareas'
CREATE TABLE IF NOT EXISTS public.tareas (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  completada BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Insertar algunos datos iniciales de prueba (opcional)
INSERT INTO public.tareas (titulo, descripcion, completada)
VALUES 
  ('Aprender Node.js y Express', 'Configurar una API REST con métodos GET, POST, PUT y DELETE', true),
  ('Conectar Supabase', 'Crear proyecto en la nube y configurar las claves de API', true),
  ('Desplegar en Vercel', 'Subir el proyecto a GitHub y conectar con Vercel Serverless', false);

-- 3. Configuración de Seguridad a Nivel de Fila (RLS - Row Level Security)
-- ⚠️ NOTA PARA CLASE:
-- Por defecto en Supabase las tablas nuevas pueden requerir políticas de RLS.
-- Para un ejemplo de clase rápido donde se usa la clave pública anon key sin autenticación:
ALTER TABLE public.tareas DISABLE ROW LEVEL SECURITY;

-- ALTERNATIVA RECOMENDADA (Si prefieres dejar RLS activado):
-- Descomenta las siguientes líneas si quieres mantener RLS activado con permisos públicos:
-- ALTER TABLE public.tareas ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Permitir acceso publico a tareas" 
--   ON public.tareas 
--   FOR ALL 
--   USING (true) 
--   WITH CHECK (true);
