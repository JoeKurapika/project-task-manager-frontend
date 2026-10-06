import { apiFetch, type ApiResponse } from './api';

export interface Project {
  id: string;
  name: string;
  description: string;
  status?: string;
  createdAt?: string;
  userId?: string;
}

export interface CreateProjectDTO {
  name: string;
  description: string;
}

export interface UpdateProjectDTO {
  name?: string;
  description?: string;
}

/**
 * Obtener todos los proyectos del usuario
 * Endpoint: GET /projects
 */
export async function getProjectsRequest(): Promise<ApiResponse<Project[]>> {
  return apiFetch<Project[]>('/projects');
}

/**
 * Crear un nuevo proyecto
 * Endpoint: POST /projects
 */
export async function createProjectRequest(
  projectData: CreateProjectDTO
): Promise<ApiResponse<Project>> {
  return apiFetch<Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(projectData),
  });
}

/**
 * Actualizar un proyecto existente
 * Endpoint: PUT /projects/:id
 */
export async function updateProjectRequest(
  id: string,
  projectData: UpdateProjectDTO
): Promise<ApiResponse<Project>> {
  return apiFetch<Project>(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(projectData),
  });
}

/**
 * Eliminar un proyecto (soft delete)
 * Endpoint: DELETE /projects/:id
 */
export async function deleteProjectRequest(
  id: string
): Promise<ApiResponse<null>> {
  return apiFetch<null>(`/projects/${id}`, {
    method: 'DELETE',
  });
}