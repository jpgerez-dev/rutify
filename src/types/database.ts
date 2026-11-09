// ARCHIVO GENERADO: no editar a mano.
// Regenerar con `npm run db:types` después de cada migración.
// (Versión inicial escrita a mano con el mismo formato hasta vincular el proyecto.)

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      alumnos: {
        Row: {
          activo: boolean
          apellido: string
          created_at: string
          email: string | null
          entrenador_id: string
          fecha_nacimiento: string | null
          id: string
          lesiones_limitaciones: string | null
          nivel: string | null
          nombre: string
          notas: string | null
          objetivo: string | null
          telefono: string | null
          updated_at: string
        }
        Insert: {
          activo?: boolean
          apellido: string
          created_at?: string
          email?: string | null
          entrenador_id?: string
          fecha_nacimiento?: string | null
          id?: string
          lesiones_limitaciones?: string | null
          nivel?: string | null
          nombre: string
          notas?: string | null
          objetivo?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          activo?: boolean
          apellido?: string
          created_at?: string
          email?: string | null
          entrenador_id?: string
          fecha_nacimiento?: string | null
          id?: string
          lesiones_limitaciones?: string | null
          nivel?: string | null
          nombre?: string
          notas?: string | null
          objetivo?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      configuracion: {
        Row: {
          created_at: string
          email: string | null
          entrenador_id: string
          instagram: string | null
          logo_path: string | null
          nombre_entrenador: string | null
          telefono: string | null
          texto_pie_pdf: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          entrenador_id?: string
          instagram?: string | null
          logo_path?: string | null
          nombre_entrenador?: string | null
          telefono?: string | null
          texto_pie_pdf?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          entrenador_id?: string
          instagram?: string | null
          logo_path?: string | null
          nombre_entrenador?: string | null
          telefono?: string | null
          texto_pie_pdf?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ejercicios: {
        Row: {
          archivado: boolean
          categoria: string | null
          created_at: string
          entrenador_id: string
          equipamiento: string | null
          es_propio: boolean
          favorito: boolean
          id: string
          id_externo: string | null
          imagen_fin: string | null
          imagen_inicio: string | null
          instrucciones: string[]
          instrucciones_es: string[] | null
          mecanica: string | null
          musculos_primarios: string[]
          musculos_secundarios: string[]
          nivel: string | null
          nombre: string
          nombre_es: string | null
          updated_at: string
        }
        Insert: {
          archivado?: boolean
          categoria?: string | null
          created_at?: string
          entrenador_id?: string
          equipamiento?: string | null
          es_propio?: boolean
          favorito?: boolean
          id?: string
          id_externo?: string | null
          imagen_fin?: string | null
          imagen_inicio?: string | null
          instrucciones?: string[]
          instrucciones_es?: string[] | null
          mecanica?: string | null
          musculos_primarios?: string[]
          musculos_secundarios?: string[]
          nivel?: string | null
          nombre: string
          nombre_es?: string | null
          updated_at?: string
        }
        Update: {
          archivado?: boolean
          categoria?: string | null
          created_at?: string
          entrenador_id?: string
          equipamiento?: string | null
          es_propio?: boolean
          favorito?: boolean
          id?: string
          id_externo?: string | null
          imagen_fin?: string | null
          imagen_inicio?: string | null
          instrucciones?: string[]
          instrucciones_es?: string[] | null
          mecanica?: string | null
          musculos_primarios?: string[]
          musculos_secundarios?: string[]
          nivel?: string | null
          nombre?: string
          nombre_es?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      rutina_dias: {
        Row: {
          created_at: string
          entrenador_id: string
          id: string
          indicaciones: string | null
          nombre: string
          orden: number
          rutina_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          entrenador_id?: string
          id?: string
          indicaciones?: string | null
          nombre: string
          orden: number
          rutina_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          entrenador_id?: string
          id?: string
          indicaciones?: string | null
          nombre?: string
          orden?: number
          rutina_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rutina_dias_rutina_id_entrenador_id_fkey"
            columns: ["rutina_id", "entrenador_id"]
            isOneToOne: false
            referencedRelation: "rutinas"
            referencedColumns: ["id", "entrenador_id"]
          },
        ]
      }
      rutina_ejercicios: {
        Row: {
          carga: string | null
          created_at: string
          descanso: string | null
          dia_id: string
          ejercicio_id: string
          entrenador_id: string
          id: string
          notas: string | null
          orden: number
          repeticiones: string | null
          rir: string | null
          series: string | null
          tecnica: string | null
          updated_at: string
        }
        Insert: {
          carga?: string | null
          created_at?: string
          descanso?: string | null
          dia_id: string
          ejercicio_id: string
          entrenador_id?: string
          id?: string
          notas?: string | null
          orden: number
          repeticiones?: string | null
          rir?: string | null
          series?: string | null
          tecnica?: string | null
          updated_at?: string
        }
        Update: {
          carga?: string | null
          created_at?: string
          descanso?: string | null
          dia_id?: string
          ejercicio_id?: string
          entrenador_id?: string
          id?: string
          notas?: string | null
          orden?: number
          repeticiones?: string | null
          rir?: string | null
          series?: string | null
          tecnica?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rutina_ejercicios_dia_id_entrenador_id_fkey"
            columns: ["dia_id", "entrenador_id"]
            isOneToOne: false
            referencedRelation: "rutina_dias"
            referencedColumns: ["id", "entrenador_id"]
          },
          {
            foreignKeyName: "rutina_ejercicios_ejercicio_id_entrenador_id_fkey"
            columns: ["ejercicio_id", "entrenador_id"]
            isOneToOne: false
            referencedRelation: "ejercicios"
            referencedColumns: ["id", "entrenador_id"]
          },
        ]
      }
      rutina_progresiones: {
        Row: {
          created_at: string
          descripcion: string
          entrenador_id: string
          id: string
          orden: number
          rutina_id: string
          semana: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          descripcion: string
          entrenador_id?: string
          id?: string
          orden?: number
          rutina_id: string
          semana: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          descripcion?: string
          entrenador_id?: string
          id?: string
          orden?: number
          rutina_id?: string
          semana?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rutina_progresiones_rutina_id_entrenador_id_fkey"
            columns: ["rutina_id", "entrenador_id"]
            isOneToOne: false
            referencedRelation: "rutinas"
            referencedColumns: ["id", "entrenador_id"]
          },
        ]
      }
      rutinas: {
        Row: {
          alumno_id: string | null
          created_at: string
          entrenador_id: string
          es_plantilla: boolean | null
          fecha_inicio: string | null
          id: string
          nombre: string
          notas: string | null
          objetivo: string | null
          origen_id: string | null
          semanas: number | null
          updated_at: string
        }
        Insert: {
          alumno_id?: string | null
          created_at?: string
          entrenador_id?: string
          fecha_inicio?: string | null
          id?: string
          nombre: string
          notas?: string | null
          objetivo?: string | null
          origen_id?: string | null
          semanas?: number | null
          updated_at?: string
        }
        Update: {
          alumno_id?: string | null
          created_at?: string
          entrenador_id?: string
          fecha_inicio?: string | null
          id?: string
          nombre?: string
          notas?: string | null
          objetivo?: string | null
          origen_id?: string | null
          semanas?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rutinas_alumno_id_entrenador_id_fkey"
            columns: ["alumno_id", "entrenador_id"]
            isOneToOne: false
            referencedRelation: "alumnos"
            referencedColumns: ["id", "entrenador_id"]
          },
          {
            foreignKeyName: "rutinas_origen_id_fkey"
            columns: ["origen_id"]
            isOneToOne: false
            referencedRelation: "rutinas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      duplicar_rutina: {
        Args: { p_alumno_id?: string; p_nombre?: string; p_rutina_id: string }
        Returns: string
      }
      reordenar_dias: {
        Args: { p_ids: string[]; p_rutina_id: string }
        Returns: undefined
      }
      reordenar_ejercicios: {
        Args: { p_dia_id: string; p_ids: string[] }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never
