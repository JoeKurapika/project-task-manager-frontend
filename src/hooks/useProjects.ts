import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  getProjectsRequest,
  createProjectRequest,
  updateProjectRequest,
  deleteProjectRequest,
  type Project,
  type CreateProjectDTO,
  type UpdateProjectDTO,
} from '@/services/project.service';

/**
 * Custom Hook para gestionar el estado, selección y operaciones CRUD de los Proyectos.
 */
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener la lista completa de proyectos desde la API
  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getProjectsRequest();
      const projectList = response.data || [];
      setProjects(projectList);

      // Si no hay proyecto seleccionado pero hay proyectos, seleccionar el primero por defecto
      if (projectList.length > 0) {
        setSelectedProject((prev) => {
          if (!prev) return projectList[0];
          // Mantener la selección si el proyecto aún existe
          const exists = projectList.find((p) => p.id === prev.id);
          return exists || projectList[0];
        });
      } else {
        setSelectedProject(null);
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Error al cargar los proyectos';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carga inicial de proyectos al montar el hook
  useEffect(() => {
    let ignore = false;

    const loadInitialProjects = async () => {
      setIsLoading(true);
      try {
        const response = await getProjectsRequest();
        if (!ignore) {
          const projectList = response.data || [];
          setProjects(projectList);
          if (projectList.length > 0) {
            setSelectedProject(projectList[0]);
          }
        }
      } catch (err) {
        if (!ignore) {
          const msg =
            err instanceof Error ? err.message : 'Error al cargar los proyectos';
          setError(msg);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadInitialProjects();

    return () => {
      ignore = true;
    };
  }, []);

  // Crear un nuevo proyecto
  const addProject = async (data: CreateProjectDTO) => {
    try {
      const response = await createProjectRequest(data);
      const newProject = response.data;
      setProjects((prev) => [newProject, ...prev]);
      setSelectedProject(newProject); // Seleccionar automáticamente el proyecto recién creado
      toast.success('Proyecto creado con éxito');
      return newProject;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Error al crear el proyecto';
      toast.error(msg);
      throw err;
    }
  };

  // Editar un proyecto existente
  const editProject = async (id: string, data: UpdateProjectDTO) => {
    try {
      const response = await updateProjectRequest(id, data);
      const updatedProject = response.data;

      setProjects((prev) =>
        prev.map((p) => (p.id === id ? updatedProject : p))
      );

      if (selectedProject?.id === id) {
        setSelectedProject(updatedProject);
      }

      toast.success('Proyecto actualizado correctamente');
      return updatedProject;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Error al actualizar el proyecto';
      toast.error(msg);
      throw err;
    }
  };

  // Eliminar un proyecto
  const removeProject = async (id: string) => {
    try {
      await deleteProjectRequest(id);

      setProjects((prev) => {
        const updated = prev.filter((p) => p.id !== id);
        // Si eliminamos el proyecto seleccionado, cambiar la selección al primero disponible
        if (selectedProject?.id === id) {
          setSelectedProject(updated.length > 0 ? updated[0] : null);
        }
        return updated;
      });

      toast.success('Proyecto eliminado correctamente');
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Error al eliminar el proyecto';
      toast.error(msg);
      throw err;
    }
  };

  // Cambiar el proyecto activo
  const selectProject = (project: Project) => {
    setSelectedProject(project);
  };

  return {
    projects,
    selectedProject,
    selectedProjectId: selectedProject?.id,
    isLoading,
    error,
    fetchProjects,
    addProject,
    editProject,
    removeProject,
    selectProject,
  };
}