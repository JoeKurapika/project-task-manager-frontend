import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  getTasksRequest,
  createTaskRequest,
  updateTaskRequest,
  completeTaskRequest,
  deleteTaskRequest,
  pendingTaskRequest,
  type Task,
  type CreateTaskDTO,
  type UpdateTaskDTO,
} from '@/services/task.service';

/**
 * Extrae de forma segura el arreglo de tareas desde la estructura devuelta por PostgreSQL:
 * { success: true, message: '...', data: { items: [...], pagination: {...} } }
 */
const extractTaskList = (response: any): Task[] => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.items)) return response.data.items;
  if (Array.isArray(response?.items)) return response.items;
  return [];
};

/**
 * Extrae un objeto Task individual de la respuesta
 */
const extractTaskItem = (response: any): Task => {
  if (response?.data?.items && Array.isArray(response.data.items)) {
    return response.data.items[0];
  }
  if (response?.data) return response.data;
  return response;
};

export function useTasks(projectId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Recarga manual de tareas
  const fetchTasks = useCallback(async () => {
    if (!projectId) {
      setTasks([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await getTasksRequest(projectId);
      console.log('📡 Respuesta Backend GET /tasks:', response);
      
      const taskList = extractTaskList(response);
      setTasks(taskList);
      toast.success('Lista de tareas sincronizada');
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Error al cargar las tareas';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  // Carga inicial y re-sincronización cuando cambia projectId
  useEffect(() => {
    let ignore = false;

    if (!projectId) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    const loadInitialTasks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getTasksRequest(projectId);
        console.log('📡 Carga inicial Backend GET /tasks:', response);
        
        if (!ignore) {
          const taskList = extractTaskList(response);
          setTasks(taskList);
        }
      } catch (err) {
        if (!ignore) {
          const msg =
            err instanceof Error ? err.message : 'Error al cargar las tareas';
          setError(msg);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadInitialTasks();

    return () => {
      ignore = true;
    };
  }, [projectId]);

  // Crear tarea (POST)
  const addTask = async (data: CreateTaskDTO) => {
    if (!projectId) return;
    try {
      const response = await createTaskRequest(projectId, data);
      const newTask = extractTaskItem(response);
      
      setTasks((prev) => [newTask, ...(Array.isArray(prev) ? prev : [])]);
      toast.success('Tarea creada con éxito');
      return newTask;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al crear la tarea';
      toast.error(msg);
      throw err;
    }
  };

  // Alternar completada / pendiente
  const toggleTask = async (taskId: string) => {
    if (!projectId) return;
    try {
      const currentTask = (Array.isArray(tasks) ? tasks : []).find(
        (t) => t.id === taskId
      );
      const isCompleted = Boolean(currentTask?.completed);

      const request = isCompleted
        ? pendingTaskRequest(projectId, taskId)
        : completeTaskRequest(projectId, taskId);
        
      const response = await request;
      const updatedTask = extractTaskItem(response);

      setTasks((prev) =>
        (Array.isArray(prev) ? prev : []).map((t) =>
          t.id === taskId ? updatedTask : t
        )
      );

      if (updatedTask.completed) {
        toast.success('¡Tarea completada!');
      } else {
        toast.info('Tarea marcada como pendiente');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al cambiar estado';
      toast.error(msg);
    }
  };

  // Editar tarea (PATCH)
  const editTask = async (taskId: string, data: UpdateTaskDTO) => {
    if (!projectId) return;
    try {
      const response = await updateTaskRequest(projectId, taskId, data);
      const updatedTask = extractTaskItem(response);

      setTasks((prev) =>
        (Array.isArray(prev) ? prev : []).map((t) =>
          t.id === taskId ? updatedTask : t
        )
      );
      toast.success('Tarea actualizada correctamente');
      return updatedTask;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al actualizar tarea';
      toast.error(msg);
      throw err;
    }
  };

  // Eliminar tarea (DELETE)
  const removeTask = async (taskId: string) => {
    if (!projectId) return;

    try {
      await deleteTaskRequest(projectId, taskId);
      setTasks((prev) =>
        (Array.isArray(prev) ? prev : []).filter((t) => t.id !== taskId)
      );
      toast.success('Tarea eliminada del sistema');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al eliminar tarea';
      toast.error(msg);
      throw err;
    }
  };

  return {
    tasks,
    isLoading,
    error,
    fetchTasks,
    addTask,
    toggleTask,
    editTask,
    removeTask,
  };
}