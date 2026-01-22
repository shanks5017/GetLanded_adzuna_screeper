
import { AdzunaResponse, Job } from '../types';

/**
 * ADZUNA API CREDENTIALS
 */
const ADZUNA_APP_ID = 'a1a0566c';
const ADZUNA_APP_KEY = '82417530a16e158b8a60664d77bd8280';
const BASE_URL = '/api/adzuna/v1/api/jobs/gb/search';

export const searchJobs = async (keyword: string, location: string = '', page: number = 1): Promise<Job[]> => {
  try {
    const params = new URLSearchParams({
      app_id: ADZUNA_APP_ID,
      app_key: ADZUNA_APP_KEY,
      what: keyword,
      where: location,
      results_per_page: '21', // 21 to fit nicely in 3-column grid
    });

    const response = await fetch(`${BASE_URL}/${page}?${params.toString()}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.display_message || 'Failed to fetch jobs from Adzuna');
    }

    const data: AdzunaResponse = await response.json();

    return data.results.map(job => ({
      id: job.id,
      title: job.title.replace(/<\/?[^>]+(>|$)/g, ""),
      company: job.company.display_name,
      location: job.location.display_name,
      description: job.description.replace(/<\/?[^>]+(>|$)/g, ""),
      salaryMin: job.salary_min,
      salaryMax: job.salary_max,
      url: job.redirect_url,
      created: job.created,
      category: job.category.label
    }));
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};
