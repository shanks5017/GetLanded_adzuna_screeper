
export interface AdzunaJob {
  id: string;
  title: string;
  company: {
    display_name: string;
  };
  location: {
    display_name: string;
    area: string[];
  };
  description: string;
  salary_min?: number;
  salary_max?: number;
  redirect_url: string;
  created: string;
  category: {
    label: string;
  };
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salaryMin?: number;
  salaryMax?: number;
  url: string;
  created: string;
  category: string;
}

export interface AdzunaResponse {
  results: AdzunaJob[];
  count: number;
}
