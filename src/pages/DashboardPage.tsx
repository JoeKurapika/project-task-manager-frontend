import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskItem } from '@/components/tasks/TaskItem';
import { TaskSkeleton } from '@/components/tasks/TaskSkeleton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import type { Task } from '@/services/task.service';
import type { Project } from '@/services/project.service';
import {
  AlertCircle,
  CheckCircle2,
  CheckSquare,
  Clock,
  FolderPlus,
  Inbox,
  ListTodo,
  LogOut,
  Plus,
  RefreshCw,
  Folder,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  
  const {
    projects,
    selectedProject,
    selectedProjectId,
    isLoading: isProjectsLoading,
    addProject,
    removeProject,
    selectProject,
  } = useProjects();

  const {
    tasks,
    isLoading,
    error,
    fetchTasks,
    addTask,
    toggleTask,
    editTask,
    removeTask,
  } = useTasks(selectedProjectId);

  // Estado para controlar la apertura del modal de creación
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // Estado para la tarea que se está editando (null cuando no hay edición activa)
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Estados para modal de proyectos
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');

  // Métricas calculadas en tiempo de render
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  // Handler para crear un proyecto
  const handleCreateProject = async (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;
    await addProject({ name: projectName.trim(), description: projectDesc.trim() });
    setProjectName('');
    setProjectDesc('');
    setIsProjectModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Barra de navegación superior privada */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          {/* Marca / Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md">
              <CheckSquare className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-white">
              Task<span className="text-indigo-400">Flow</span>
            </span>
          </div>

          {/* Información del usuario y botón de cerrar sesión */}
          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-200">
                {user?.name || 'Usuario'}
              </p>
              <p className="text-xs text-slate-400">{user?.email}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="gap-1.5 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Contenedor principal del Dashboard */}
      <main className="container mx-auto px-4 py-8 sm:px-8">
        {/* Barra Selector de Proyectos */}
        <div className="mb-8 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Folder className="h-5 w-5 text-indigo-400" />
              <h2 className="text-lg font-semibold text-white">Proyectos</h2>
            </div>
            <Button
              size="sm"
              onClick={() => setIsProjectModalOpen(true)}
              className="gap-2 bg-indigo-600 text-white hover:bg-indigo-500"
            >
              <FolderPlus className="h-4 w-4" />
              <span>Nuevo Proyecto</span>
            </Button>
          </div>

          {/* Lista Horizontal de Proyectos */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
            {isProjectsLoading ? (
              <Skeleton className="h-10 w-32" />
            ) : projects.length === 0 ? (
              <p className="text-sm text-slate-500">No hay proyectos creados.</p>
            ) : (
              projects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => selectProject(proj)}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                    selectedProjectId === proj.id
                      ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300'
                      : 'border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span>{proj.name}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`¿Eliminar el proyecto "${proj.name}"?`)) {
                        removeProject(proj.id);
                      }
                    }}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Cabecera de Tareas */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              {selectedProject ? selectedProject.name : 'Panel de Tareas'}
            </h1>
            <p className="text-sm text-slate-400">
              {selectedProject?.description || 'Gestiona tus tareas del proyecto activo.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="default"
              onClick={fetchTasks}
              disabled={isLoading || !selectedProjectId}
              className="gap-2 border-slate-800 text-slate-300 hover:bg-slate-900"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </Button>

            <Button
              size="default"
              onClick={() => setIsCreateModalOpen(true)}
              disabled={!selectedProjectId}
              className="gap-2 bg-indigo-600 font-semibold text-white shadow-md hover:bg-indigo-500 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              <span>Nueva Tarea</span>
            </Button>
          </div>
        </div>

        {/* Tarjetas de Métricas */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="border-slate-800 bg-slate-900/60">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-indigo-500/10 p-3 text-indigo-400">
                <ListTodo className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">Total Tareas</p>
                {isLoading ? <Skeleton className="mt-1 h-8 w-12" /> : <p className="text-2xl font-bold text-slate-100">{totalTasks}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/60">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">Completadas</p>
                {isLoading ? <Skeleton className="mt-1 h-8 w-12" /> : <p className="text-2xl font-bold text-emerald-400">{completedTasks}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/60">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="rounded-lg bg-amber-500/10 p-3 text-amber-400">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium tracking-wider text-slate-400 uppercase">Pendientes</p>
                {isLoading ? <Skeleton className="mt-1 h-8 w-12" /> : <p className="text-2xl font-bold text-amber-400">{pendingTasks}</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Estados de Interfaz */}
        {!selectedProjectId && (
          <div className="rounded-xl border border-dashed border-slate-800 bg-slate-900/30 py-12 text-center text-slate-400">
            Selecciona o crea un proyecto arriba para ver sus tareas.
          </div>
        )}

        {selectedProjectId && isLoading && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <TaskSkeleton key={index} />
            ))}
          </div>
        )}

        {selectedProjectId && !isLoading && error && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-rose-900/50 bg-rose-950/20 p-8 text-center">
            <AlertCircle className="h-10 w-10 text-rose-500" />
            <h3 className="mt-3 text-lg font-semibold text-rose-300">Error al cargar tareas</h3>
            <p className="mt-1 max-w-md text-sm text-rose-400/80">{error}</p>
            <Button variant="outline" size="sm" onClick={fetchTasks} className="mt-4 border-rose-800 text-rose-300 hover:bg-rose-950">
              Reintentar
            </Button>
          </div>
        )}

        {selectedProjectId && !isLoading && !error && tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30 py-16 text-center">
            <div className="rounded-full bg-slate-800/80 p-4 text-slate-400">
              <Inbox className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-slate-200">No hay tareas en este proyecto</h3>
            <Button onClick={() => setIsCreateModalOpen(true)} className="mt-4 gap-2 bg-indigo-600 text-white hover:bg-indigo-500">
              <Plus className="h-4 w-4" />
              <span>Crear primera tarea</span>
            </Button>
          </div>
        )}

        {selectedProjectId && !isLoading && !error && tasks.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={removeTask}
                onEdit={setTaskToEdit}
              />
            ))}
          </div>
        )}

        {/* Modales de Tareas */}
        <TaskForm
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onSubmit={addTask}
        />

        <TaskForm
          open={Boolean(taskToEdit)}
          onOpenChange={(isOpen) => {
            if (!isOpen) setTaskToEdit(null);
          }}
          initialData={taskToEdit}
          onSubmit={async (data) => {
            if (taskToEdit) {
              await editTask(taskToEdit.id, data);
            }
          }}
        />

        {/* Modal Simple de Creación de Proyecto */}
        {isProjectModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white">Crear Nuevo Proyecto</h3>
              <form onSubmit={handleCreateProject} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400">Nombre</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400">Descripción</label>
                  <textarea
                    value={projectDesc}
                    onChange={(e) => setProjectDesc(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none"
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsProjectModalOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-500">
                    Guardar
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}