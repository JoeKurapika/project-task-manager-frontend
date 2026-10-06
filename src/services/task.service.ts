import { apiFetch, type ApiResponse } from './api';

// 1. Modelo de datos de una Tarea
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt?: string;
  userId?: string;
}

// 2. Objetos de transferencia de datos (DTOs)
export interface CreateTaskDTO {
  title: string;
  description: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
}

/**
 * Obtener todas las tareas del usuario autenticado
 * Endpoint: GET /tasks
 */
export async function getTasksRequest(projectId: string): Promise<ApiResponse<Task[]>> {
  return apiFetch<Task[]>(`/tasks/${projectId}`);
}

/**
 * Crear una nueva tarea
 * Endpoint: POST /tasks
 */
export async function createTaskRequest(
  projectId: string,
  taskData: CreateTaskDTO
): Promise<ApiResponse<Task>> {
  return apiFetch<Task>(`/tasks/${projectId}`, {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
}

/**
 * Actualizar título y/o descripción de una tarea existente
 * Endpoint: PUT /tasks/:id
 */
export async function updateTaskRequest(
  projectId: string,
  taskId: string,
  taskData: UpdateTaskDTO
): Promise<ApiResponse<Task>> {
  return apiFetch<Task>(`/tasks/${projectId}`, {
    method: 'PATCH',
    body: JSON.stringify({ id: taskId, ...taskData }),
  });
}

/**
 * Alternar estado completado de una tarea
 * Endpoint: PATCH /tasks/:id/complete
 */
export async function completeTaskRequest(
  projectId: string,
  taskId: string
): Promise<ApiResponse<Task>> {
  return apiFetch<Task>(`/tasks/${projectId}/complete`, {
    method: 'PATCH',
    body: JSON.stringify({ id: taskId }),
  });
}

/**
 * Eliminar una tarea permanentemente
 * Endpoint: DELETE /tasks/:id
 */
export async function deleteTaskRequest(
  projectId: string,
  taskId: string
): Promise<ApiResponse<null>> {
  return apiFetch<null>(`/tasks/${projectId}`, {
    method: 'DELETE',
    body: JSON.stringify({ id: taskId }),
  });
}

/**
 * Marcar una tarea como pendiente nuevamente
 * Endpoint: PATCH /tasks/:id/pending
 */
export async function pendingTaskRequest(
  projectId: string,
  taskId: string
): Promise<ApiResponse<Task>> {
  return apiFetch<Task>(`/tasks/${projectId}/pending`, {
    method: 'PATCH',
    body: JSON.stringify({ id: taskId }),
  });
}
