import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react';
import { educationService } from '../../services/employee/educationService';

interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: number;
  publishedDate: string;
  tags: string[];
  featured: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  healthScoreImpact?: number;
}

interface BenefitsGuide {
  id: string;
  title: string;
  description: string;
  category: string;
  steps: Array<{
    title: string;
    description: string;
    actionRequired?: boolean;
  }>;
  estimatedSavings?: string;
  difficulty: 'easy' | 'moderate' | 'complex';
}

interface Provider {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  distance: string;
  acceptingNewPatients: boolean;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  insuranceAccepted: string[];
  languages: string[];
  availableAppointments?: string[];
}

interface EducationState {
  articles: Article[];
  benefitsGuides: BenefitsGuide[];
  providers: Provider[];
  featuredContent: Article[];
  readingProgress: Record<string, number>;
  bookmarkedArticles: string[];
  searchResults: Article[] | Provider[];
  isLoading: boolean;
  error: string | null;
}

type EducationAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ARTICLES'; payload: Article[] }
  | { type: 'SET_BENEFITS_GUIDES'; payload: BenefitsGuide[] }
  | { type: 'SET_PROVIDERS'; payload: Provider[] }
  | { type: 'SET_FEATURED_CONTENT'; payload: Article[] }
  | { type: 'UPDATE_READING_PROGRESS'; payload: { articleId: string; progress: number } }
  | { type: 'TOGGLE_BOOKMARK'; payload: string }
  | { type: 'SET_SEARCH_RESULTS'; payload: Article[] | Provider[] }
  | { type: 'MARK_ARTICLE_READ'; payload: string };

const initialState: EducationState = {
  articles: [],
  benefitsGuides: [],
  providers: [],
  featuredContent: [],
  readingProgress: {},
  bookmarkedArticles: [],
  searchResults: [],
  isLoading: false,
  error: null
};

function educationReducer(state: EducationState, action: EducationAction): EducationState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_ARTICLES':
      return { ...state, articles: action.payload };
    
    case 'SET_BENEFITS_GUIDES':
      return { ...state, benefitsGuides: action.payload };
    
    case 'SET_PROVIDERS':
      return { ...state, providers: action.payload };
    
    case 'SET_FEATURED_CONTENT':
      return { ...state, featuredContent: action.payload };
    
    case 'UPDATE_READING_PROGRESS':
      return {
        ...state,
        readingProgress: {
          ...state.readingProgress,
          [action.payload.articleId]: action.payload.progress
        }
      };
    
    case 'TOGGLE_BOOKMARK':
      const articleId = action.payload;
      const isBookmarked = state.bookmarkedArticles.includes(articleId);
      return {
        ...state,
        bookmarkedArticles: isBookmarked
          ? state.bookmarkedArticles.filter(id => id !== articleId)
          : [...state.bookmarkedArticles, articleId]
      };
    
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };
    
    case 'MARK_ARTICLE_READ':
      return {
        ...state,
        readingProgress: {
          ...state.readingProgress,
          [action.payload]: 100
        }
      };
    
    default:
      return state;
  }
}

interface EducationContextType extends EducationState {
  // Article actions
  fetchArticles: (category?: string) => Promise<void>;
  getArticleById: (id: string) => Article | undefined;
  updateReadingProgress: (articleId: string, progress: number) => void;
  markArticleAsRead: (articleId: string) => void;
  toggleBookmark: (articleId: string) => void;
  
  // Benefits guides actions
  fetchBenefitsGuides: () => Promise<void>;
  getBenefitsGuideById: (id: string) => BenefitsGuide | undefined;
  
  // Provider actions
  fetchProviders: (filters?: {
    specialty?: string;
    location?: string;
    acceptingNewPatients?: boolean;
    insuranceProvider?: string;
  }) => Promise<void>;
  getProviderById: (id: string) => Provider | undefined;
  
  // Search actions
  searchContent: (query: string, type: 'articles' | 'providers' | 'all') => Promise<void>;
  clearSearchResults: () => void;
  
  // Featured content
  fetchFeaturedContent: () => Promise<void>;
}

const EducationContext = createContext<EducationContextType | undefined>(undefined);

interface EducationProviderProps {
  children: ReactNode;
}

export function EducationProvider({ children }: EducationProviderProps) {
  const [state, dispatch] = useReducer(educationReducer, initialState);

  // Article actions
  const fetchArticles = async (category?: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const articles = await educationService.getArticles(category);
      dispatch({ type: 'SET_ARTICLES', payload: articles });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch articles' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getArticleById = (id: string): Article | undefined => {
    return state.articles.find(article => article.id === id);
  };

  const updateReadingProgress = async (articleId: string, progress: number) => {
    dispatch({ type: 'UPDATE_READING_PROGRESS', payload: { articleId, progress } });
    
    try {
      await educationService.updateReadingProgress(articleId, progress);
    } catch (error) {
      console.error('Failed to update reading progress:', error);
    }
  };

  const markArticleAsRead = async (articleId: string) => {
    dispatch({ type: 'MARK_ARTICLE_READ', payload: articleId });
    
    try {
      await educationService.markArticleAsRead(articleId);
    } catch (error) {
      console.error('Failed to mark article as read:', error);
    }
  };

  const toggleBookmark = async (articleId: string) => {
    dispatch({ type: 'TOGGLE_BOOKMARK', payload: articleId });
    
    try {
      const isBookmarked = state.bookmarkedArticles.includes(articleId);
      if (isBookmarked) {
        await educationService.removeBookmark(articleId);
      } else {
        await educationService.addBookmark(articleId);
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  // Benefits guides actions
  const fetchBenefitsGuides = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const guides = await educationService.getBenefitsGuides();
      dispatch({ type: 'SET_BENEFITS_GUIDES', payload: guides });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch benefits guides' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getBenefitsGuideById = (id: string): BenefitsGuide | undefined => {
    return state.benefitsGuides.find(guide => guide.id === id);
  };

  // Provider actions
  const fetchProviders = async (filters?: {
    specialty?: string;
    location?: string;
    acceptingNewPatients?: boolean;
    insuranceProvider?: string;
  }) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const providers = await educationService.getProviders(filters);
      dispatch({ type: 'SET_PROVIDERS', payload: providers });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch providers' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const getProviderById = (id: string): Provider | undefined => {
    return state.providers.find(provider => provider.id === id);
  };

  // Search actions
  const searchContent = async (query: string, type: 'articles' | 'providers' | 'all') => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const results = await educationService.searchContent(query, type);
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: results });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Search failed' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const clearSearchResults = () => {
    dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
  };

  // Featured content
  const fetchFeaturedContent = async () => {
    try {
      const featured = await educationService.getFeaturedContent();
      dispatch({ type: 'SET_FEATURED_CONTENT', payload: featured });
    } catch (error) {
      console.error('Failed to fetch featured content:', error);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchFeaturedContent();
    fetchArticles();
    fetchBenefitsGuides();
  }, []);

  const value: EducationContextType = {
    ...state,
    fetchArticles,
    getArticleById,
    updateReadingProgress,
    markArticleAsRead,
    toggleBookmark,
    fetchBenefitsGuides,
    getBenefitsGuideById,
    fetchProviders,
    getProviderById,
    searchContent,
    clearSearchResults,
    fetchFeaturedContent
  };

  return (
    <EducationContext.Provider value={value}>
      {children}
    </EducationContext.Provider>
  );
}

export function useEducation() {
  const context = useContext(EducationContext);
  if (context === undefined) {
    throw new Error('useEducation must be used within an EducationProvider');
  }
  return context;
}