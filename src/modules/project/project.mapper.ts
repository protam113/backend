import { ProjectStatus } from './project.constant';

export function toDataResponse(project: any): any {
  return {
    _id: project._id?.toString() || '',
    title: project.title ?? '',
    description: project.description ?? '',
    status: project.status as ProjectStatus,
    clientId: project.clientId ?? '',
    freelancerId: project.freelancerId ?? '',
    budgetMin: project.budgetMin ?? 0,
    budgetMax: project.budgetMax ?? 0,
    skillsRequired: project.skillsRequired ?? [],
    createdAt: project.createdAt ?? new Date(),
    updatedAt: project.updatedAt ?? new Date(),
  };
}