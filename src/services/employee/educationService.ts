import { api } from '../api';

interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: string;
  publishedDate: string;
  category: string;
  tags: string[];
  imageUrl?: string;
}

interface BenefitsGuide {
  id: string;
  title: string;
  description: string;
  content: string;
  lastUpdated: string;
  category: string;
}

interface Provider {
  id: string;
  name: string;
  specialty: string;
  address: string;
  phone: string;
  network: string;
  acceptingNewPatients: boolean;
  rating: number;
  website?: string;
}

export const educationService = {
  async getArticles(category?: string, tag?: string): Promise<Article[]> {
    try {
      let url = '/education/articles';
      const params = new URLSearchParams();
      
      if (category) {
        params.append('category', category);
      }
      
      if (tag) {
        params.append('tag', tag);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching articles:', error);
      throw error;
    }
  },
  
  async getArticleById(articleId: string): Promise<Article> {
    try {
      const response = await api.get(`/education/articles/${articleId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching article with ID ${articleId}:`, error);
      throw error;
    }
  },
  
  async getBenefitsGuides(): Promise<BenefitsGuide[]> {
    try {
      const response = await api.get('/education/benefits-guides');
      return response.data;
    } catch (error) {
      console.error('Error fetching benefits guides:', error);
      throw error;
    }
  },
  
  async getBenefitsGuideById(guideId: string): Promise<BenefitsGuide> {
    try {
      const response = await api.get(`/education/benefits-guides/${guideId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching benefits guide with ID ${guideId}:`, error);
      throw error;
    }
  },
  
  async searchProviders(query: string, specialty?: string, network?: string): Promise<Provider[]> {
    try {
      let url = '/education/providers/search';
      const params = new URLSearchParams();
      
      params.append('query', query);
      
      if (specialty) {
        params.append('specialty', specialty);
      }
      
      if (network) {
        params.append('network', network);
      }
      
      url += `?${params.toString()}`;
      
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error searching providers:', error);
      throw error;
    }
  },
  
  async getProviderById(providerId: string): Promise<Provider> {
    try {
      const response = await api.get(`/education/providers/${providerId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching provider with ID ${providerId}:`, error);
      throw error;
    }
  },
};