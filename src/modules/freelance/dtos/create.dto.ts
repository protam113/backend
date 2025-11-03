// create-freelance.dto.ts
export class CreateFreelanceDto {
    skills?: string[];
    portfolioLinks?: string[];
    hourlyRate?: number;
    experienceLevel?: 'Junior' | 'Mid' | 'Senior';
}

