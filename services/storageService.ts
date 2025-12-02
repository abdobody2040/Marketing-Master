
import { UserProfile, UserRole, MarketingModule, Difficulty, AppConfig, Book, Template } from '../types';
import { INITIAL_MODULES, LIBRARY_BOOKS, MARKETING_TEMPLATES } from '../constants';

const USERS_KEY = 'mm_users';
const MODULES_KEY = 'mm_modules';
const CURRENT_USER_ID_KEY = 'mm_current_user_id';
const CONFIG_KEY = 'mm_config';
const BOOKS_KEY = 'mm_books';
const TEMPLATES_KEY = 'mm_templates';

// Initialize with seed data if empty
const initialize = () => {
  // Force update modules to ensure latest constants are loaded
  localStorage.setItem(MODULES_KEY, JSON.stringify(INITIAL_MODULES));
  
  // Initialize Config if not present
  if (!localStorage.getItem(CONFIG_KEY)) {
      localStorage.setItem(CONFIG_KEY, JSON.stringify({ price: 39 }));
  }

  // Initialize or Update Books (Force update if catalog expanded)
  const storedBooks = JSON.parse(localStorage.getItem(BOOKS_KEY) || '[]');
  if (storedBooks.length < LIBRARY_BOOKS.length) {
      localStorage.setItem(BOOKS_KEY, JSON.stringify(LIBRARY_BOOKS));
  }

  // Initialize Templates if not present
  if (!localStorage.getItem(TEMPLATES_KEY)) {
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(MARKETING_TEMPLATES));
  }

  if (!localStorage.getItem(USERS_KEY)) {
    // Default Admin
    const adminUser = {
      id: 'admin-1',
      username: 'admin',
      password: 'password', // Plain text for demo purposes
      role: UserRole.ADMIN,
      name: 'Grandmaster',
      level: 99,
      xp: 99999,
      xpToNextLevel: 100000,
      badges: ['Creator', 'Omniscient'],
      completedModules: INITIAL_MODULES.map(m => m.id),
      // FIX: Populate completedTopics for admin so charts work correctly
      completedTopics: INITIAL_MODULES.flatMap(m => m.topics.map(t => `${m.id}:${t}`)), 
      difficulty: Difficulty.CMO,
      hasSeenTutorial: true,
      theme: 'light',
      isPro: true
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([adminUser]));
  }
};

initialize();

export const storageService = {
  // Auth
  login: (username: string, password: string): UserProfile | null => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: any) => u.username === username && u.password === password);
    if (user) {
      // Backfill
      if (!user.completedTopics) user.completedTopics = [];
      if (!user.theme) user.theme = 'light';
      
      localStorage.setItem(CURRENT_USER_ID_KEY, user.id);
      return user;
    }
    return null;
  },

  register: (username: string, password: string, name: string): UserProfile | string => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (users.find((u: any) => u.username === username)) {
      return "Username already exists";
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      password,
      role: UserRole.USER,
      name,
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      badges: [] as string[],
      completedModules: [] as string[],
      completedTopics: [] as string[],
      difficulty: Difficulty.INTERN,
      hasSeenTutorial: false,
      theme: 'light' as 'light' | 'dark',
      isPro: false
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_ID_KEY, newUser.id);
    return newUser;
  },

  createUser: (user: Omit<UserProfile, 'id' | 'level' | 'xp' | 'xpToNextLevel' | 'badges' | 'completedModules' | 'completedTopics' | 'difficulty' | 'theme'> & { password: string }): void => {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      const newUser = {
          id: Date.now().toString(),
          ...user,
          level: 1,
          xp: 0,
          xpToNextLevel: 100,
          badges: [] as string[],
          completedModules: [] as string[],
          completedTopics: [] as string[],
          difficulty: Difficulty.INTERN,
          hasSeenTutorial: false,
          theme: 'light' as 'light' | 'dark',
          isPro: false
      };
      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  logout: () => {
    localStorage.removeItem(CURRENT_USER_ID_KEY);
  },

  getCurrentUser: (): UserProfile | null => {
    const id = localStorage.getItem(CURRENT_USER_ID_KEY);
    if (!id) return null;
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: any) => u.id === id) || null;
    if (user) {
        if (!user.completedTopics) user.completedTopics = []; // Backfill
        if (!user.theme) user.theme = 'light';
    }
    return user;
  },

  updateUser: (user: UserProfile) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const index = users.findIndex((u: any) => u.id === user.id);
    if (index !== -1) {
      const password = users[index].password;
      users[index] = { ...user, password };
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  },

  getAllUsers: (): any[] => {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  },

  deleteUser: (userId: string) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const filtered = users.filter((u: any) => u.id !== userId);
    localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
  },

  // Modules
  getModules: (): MarketingModule[] => {
    return JSON.parse(localStorage.getItem(MODULES_KEY) || '[]');
  },

  saveModules: (modules: MarketingModule[]) => {
    localStorage.setItem(MODULES_KEY, JSON.stringify(modules));
  },

  addModule: (module: MarketingModule) => {
    const modules = JSON.parse(localStorage.getItem(MODULES_KEY) || '[]');
    modules.push(module);
    localStorage.setItem(MODULES_KEY, JSON.stringify(modules));
  },

  deleteModule: (moduleId: string) => {
    const modules = JSON.parse(localStorage.getItem(MODULES_KEY) || '[]');
    const filtered = modules.filter((m: any) => m.id !== moduleId);
    localStorage.setItem(MODULES_KEY, JSON.stringify(filtered));
  },

  // Config
  getConfig: (): AppConfig => {
      return JSON.parse(localStorage.getItem(CONFIG_KEY) || '{"price": 39}');
  },

  saveConfig: (config: AppConfig) => {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
  },

  // LIBRARY - BOOKS
  getBooks: (): Book[] => {
      return JSON.parse(localStorage.getItem(BOOKS_KEY) || '[]');
  },
  
  addBook: (book: Book) => {
      const books = JSON.parse(localStorage.getItem(BOOKS_KEY) || '[]');
      books.unshift(book); // Add to top
      localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  },

  deleteBook: (id: string) => {
      const books = JSON.parse(localStorage.getItem(BOOKS_KEY) || '[]');
      const filtered = books.filter((b: any) => b.id !== id);
      localStorage.setItem(BOOKS_KEY, JSON.stringify(filtered));
  },

  // LIBRARY - TEMPLATES
  getTemplates: (): Template[] => {
      return JSON.parse(localStorage.getItem(TEMPLATES_KEY) || '[]');
  },

  addTemplate: (template: Template) => {
      const tmpls = JSON.parse(localStorage.getItem(TEMPLATES_KEY) || '[]');
      tmpls.push(template);
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(tmpls));
  },

  deleteTemplate: (id: string) => {
      const tmpls = JSON.parse(localStorage.getItem(TEMPLATES_KEY) || '[]');
      const filtered = tmpls.filter((t: any) => t.id !== id);
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(filtered));
  }
};
