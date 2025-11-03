// update-freelance.dto.ts
export class UpdateFreelanceDto {
    skills?: string[];
    portfolioLinks?: string[];
    hourlyRate?: number;
    experienceLevel?: 'Junior' | 'Mid' | 'Senior';
}
