import React, { useState, useMemo } from 'react';
import { motion, Reorder } from 'motion/react';
import {
  Search, Zap, Layers, LayoutGrid, CalendarDays, ArrowDownUp, Star, StarHalf, Plus,
  ChevronDown, Download, Sparkles, PenLine, Calendar,
  Clock, Image as ImageIcon, Heart, ExternalLink, Pencil, Trash2,
  X, Music, Coffee, Plane, Film, Briefcase, HeartPulse, Book, Wrench, Building2, Users, Gamepad2, ShoppingBag, Shirt,
  Globe, Smartphone, Monitor, Apple, Upload, CheckCircle2, ChevronLeft, ChevronRight, GripVertical,
  CreditCard, Wallet, Bold, Italic, List
} from 'lucide-react';

// === 模擬數據定義 ===
const categories = [
  { name: 'All', icon: LayoutGrid, count: 5745 },
  { name: 'Music', icon: Music, count: 169 },
  { name: 'Food & Drink', icon: Coffee, count: 248 },
  { name: 'Travel', icon: Plane, count: 286 },
  { name: 'Entertainment', icon: Film, count: 659 },
  { name: 'Productivity', icon: Briefcase, count: 916 },
  { name: 'Health & Fitness', icon: HeartPulse, count: 750 },
  { name: 'Reference', icon: Book, count: 137 },
  { name: 'Utilities', icon: Wrench, count: 1019 },
  { name: 'Business', icon: Building2, count: 727 },
  { name: 'Social Networking', icon: Users, count: 570 },
  { name: 'Games', icon: Gamepad2, count: 73 },
  { name: 'Shopping', icon: ShoppingBag, count: 470 },
  { name: 'Lifestyle', icon: Shirt, count: 1457 },
];

const colors = [
  { id: 0, name: 'Red', class: 'bg-red-500', group: 'red' },
  { id: 1, name: 'Orange', class: 'bg-orange-500', group: 'orange' },
  { id: 2, name: 'Yellow', class: 'bg-yellow-400', group: 'yellow' },
  { id: 3, name: 'Green', class: 'bg-green-500', group: 'green' },
  { id: 4, name: 'Cyan', class: 'bg-cyan-400', group: 'cyan' },
  { id: 5, name: 'Blue', class: 'bg-blue-500', group: 'blue' },
  { id: 6, name: 'Indigo', class: 'bg-indigo-500', group: 'indigo' },
  { id: 7, name: 'Purple', class: 'bg-purple-500', group: 'purple' },
  { id: 8, name: 'Violet', class: 'bg-violet-500', group: 'purple' },
  { id: 9, name: 'Fuchsia', class: 'bg-fuchsia-500', group: 'pink' },
  { id: 10, name: 'Pink', class: 'bg-pink-500', group: 'pink' },
  { id: 11, name: 'Rose', class: 'bg-rose-500', group: 'pink' },
  { id: 12, name: 'Black', class: 'bg-black', group: 'black' },
  { id: 13, name: 'Gray', class: 'bg-gray-500', group: 'gray' },
  { id: 14, name: 'White', class: 'bg-white border border-gray-200', group: 'white' },
];

const initialApps = [
  {
    id: 1, name: 'Cron Calendar', category: 'Productivity',
    description: 'Next-generation calendar for professionals and teams.',
    tags: ['Calendar', 'Startup', 'SaaS', 'Workflow'],
    downloadsNum: 85200, downloadsText: '85.2 Thousand', rating: '4.9',
    icon: Calendar, colorIds: [4, 5, 6], bg: 'bg-gradient-to-br from-blue-400 to-indigo-600',
    starred: true, releaseDate: '2021-01-15', ageText: '3Y 2M', isPro: true,
    features: [
      { id: '1', title: 'Lightning Command Menu', description: 'Quickly perform any action with simple keyboard shortcuts and a unified search interface.', aspectRatio: '1:1', image: null },
      { id: '2', title: 'Ecosystem Integration', description: 'Seamlessly connect with Google Calendar, Outlook, Notion, and major video conferencing tools.', aspectRatio: '1:1', image: null }
    ]
  },
  {
    id: 2, name: 'Notion', category: 'Productivity',
    description: 'The all-in-one workspace for your notes, tasks, wikis, and databases.',
    tags: ['Notes', 'Wiki', 'Collaboration'],
    downloadsNum: 150000000, downloadsText: '150.0 B', rating: '4.9',
    icon: PenLine, colorIds: [12, 13, 14], bg: 'bg-black',
    starred: true, releaseDate: '2016-03-01', ageText: '8Y 1M', isPro: false,
    features: [
      { id: '1', title: 'All-in-one Workspace', description: 'Write, plan, collaborate, and get organized. Notion is all you need — in one tool.', aspectRatio: '1:1', image: null },
      { id: '2', title: 'Infinite Customization', description: 'Build your own workflow with drag-and-drop blocks. Create the perfect workspace for you.', aspectRatio: '1:1', image: null }
    ]
  },
  {
    id: 3, name: 'Sparkles', category: 'Entertainment',
    description: 'Add magic to your daily photos with AI-powered sparkles.',
    tags: ['AI', 'Photo', 'Social'],
    downloadsNum: 100200000, downloadsText: '100.2 M', rating: '4.8',
    icon: Sparkles, colorIds: [6, 7, 8], bg: 'bg-gradient-to-br from-purple-500 to-indigo-600',
    starred: true, releaseDate: '2023-11-20', ageText: '4M', isPro: false,
    features: [
      { id: '1', title: 'AI Magic Sparkles', description: 'Automatically detect and enhance photos with magical AI-powered sparkle effects.', aspectRatio: '1:1', image: null },
      { id: '2', title: 'Instant Sharing', description: 'Share your magical creations instantly with friends on all major social platforms.', aspectRatio: '1:1', image: null }
    ]
  },
  {
    id: 4, name: 'Zapier', category: 'Utilities',
    description: 'Automate your workflows by connecting your favorite apps.',
    tags: ['Automation', 'No-code'],
    downloadsNum: 50000, downloadsText: '50.0 K', rating: '4.7',
    icon: Zap, colorIds: [0, 1, 2], bg: 'bg-gradient-to-br from-rose-400 to-orange-500',
    starred: false, releaseDate: '2012-08-01', ageText: '11Y 6M', isPro: true,
    features: [
      { id: '1', title: 'Workflow Automation', description: 'Connect over 5,000 apps and automate your repetitive tasks without writing any code.', aspectRatio: '1:1', image: null },
      { id: '2', title: 'Multi-step Zaps', description: 'Create complex workflows that handle multiple tasks across different apps in a single run.', aspectRatio: '1:1', image: null }
    ]
  }
];

export default function App() {
  // === 狀態管理 ===
  const [apps, setApps] = useState(initialApps);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeColorGroups, setActiveColorGroups] = useState<string[]>([]);
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [activeMonth, setActiveMonth] = useState<number | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortOption, setSortOption] = useState('date-desc');
  const [activeTab, setActiveTab] = useState<'all' | 'collections' | 'subscription'>('all');
  const [categoriesList, setCategoriesList] = useState(categories);

  // 彈窗狀態
  const [selectedApp, setSelectedApp] = useState<any>(null); // 詳情彈窗
  const [isAddingNew, setIsAddingNew] = useState(false); // 新增彈窗
  const [newAppColors, setNewAppColors] = useState<number[]>([]); // 新增 App 時選中的顏色
  const [isExtractingColors, setIsExtractingColors] = useState(false); // 是否正在模擬提取顏色

  // 新增 App 表單狀態
  const [newAppName, setNewAppName] = useState('');
  const [newAppSlogan, setNewAppSlogan] = useState('');
  const [newAppTags, setNewAppTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [historicalTags, setHistoricalTags] = useState<string[]>(['AI', 'Efficiency', 'Design', 'Productivity']);
  const [newAppReleaseDate, setNewAppReleaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [newAppPlatforms, setNewAppPlatforms] = useState<string[]>(['iOS']);
  const [newAppCategory, setNewAppCategory] = useState('Productivity');
  const [newAppCompany, setNewAppCompany] = useState('');
  const [newAppTeamType, setNewAppTeamType] = useState('Individual');
  const [newAppPlatformDownloads, setNewAppPlatformDownloads] = useState<Record<string, string>>({});
  const [newAppLogo, setNewAppLogo] = useState<string | null>(null);
  const [newAppScreenshots, setNewAppScreenshots] = useState<string[]>([]);
  const [newAppRating, setNewAppRating] = useState('4.5'); // 評分
  const [newAppFeatures, setNewAppFeatures] = useState<any[]>([]); // 核心功能
  const [newAppBusinessModel, setNewAppBusinessModel] = useState<{
    description: string;
    tiers: any[];
  }>({ description: '', tiers: [] }); // 商業模式
  const [viewingFullPageApp, setViewingFullPageApp] = useState<any>(null); // 全屏詳情頁
  const [editingCategory, setEditingCategory] = useState<any>(null); // 正在編輯的分類
  const [isAddingCategory, setIsAddingCategory] = useState(false); // 是否正在新增分類
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState<any>(LayoutGrid);
  const [selectedAppIdsForCategory, setSelectedAppIdsForCategory] = useState<number[]>([]);
  const [showProModal, setShowProModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('3 Years');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('WeChat Pay');
  const [categoryAppSearchQuery, setCategoryAppSearchQuery] = useState('');
  const [editingApp, setEditingApp] = useState<any>(null); // 正在編輯的 App
  const [appToDelete, setAppToDelete] = useState<any>(null); // 準備刪除的 App

  // 處理分類 CRUD
  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    const newCat = {
      name: newCategoryName,
      icon: newCategoryIcon,
      count: selectedAppIdsForCategory.length
    };

    // 更新 App 的分類
    if (selectedAppIdsForCategory.length > 0) {
      setApps(apps.map(app => 
        selectedAppIdsForCategory.includes(app.id) 
          ? { ...app, category: newCategoryName } 
          : app
      ));
    }

    setCategoriesList([...categoriesList, newCat]);
    setIsAddingCategory(false);
    setNewCategoryName('');
    setNewCategoryIcon(LayoutGrid);
    setSelectedAppIdsForCategory([]);
    setCategoryAppSearchQuery('');
  };

  const handleUpdateCategory = () => {
    if (!editingCategory || !newCategoryName.trim()) return;
    
    // 更新 App 的分類 (如果分類名稱改變)
    if (editingCategory.name !== newCategoryName) {
      setApps(apps.map(app => 
        app.category === editingCategory.name 
          ? { ...app, category: newCategoryName } 
          : app
      ));
    }

    // 更新選中的 App 分類
    setApps(prevApps => prevApps.map(app => {
      if (selectedAppIdsForCategory.includes(app.id)) {
        return { ...app, category: newCategoryName };
      }
      return app;
    }));

    const updatedList = categoriesList.map(cat => 
      cat.name === editingCategory.name 
        ? { ...cat, name: newCategoryName, icon: newCategoryIcon, count: selectedAppIdsForCategory.length }
        : cat
    );
    setCategoriesList(updatedList);
    setEditingCategory(null);
    setNewCategoryName('');
    setNewCategoryIcon(LayoutGrid);
    setSelectedAppIdsForCategory([]);
    setCategoryAppSearchQuery('');
  };

  const handleEditApp = (app: any) => {
    setEditingApp(app);
    setNewAppName(app.name);
    setNewAppSlogan(app.description);
    setNewAppTags(app.tags || []);
    setNewAppReleaseDate(app.releaseDate);
    setNewAppPlatforms(app.platforms || []);
    setNewAppCategory(app.category);
    setNewAppColors(app.colorIds || []);
    setNewAppLogo(app.logo || null);
    setNewAppScreenshots(app.screenshots || []);
    setNewAppRating(app.rating || '4.5');
    setNewAppFeatures(app.features || []);
    setNewAppBusinessModel(app.businessModel || { description: '', tiers: [] });
    setNewAppPlatformDownloads(app.platformDownloads || {});
    setIsAddingNew(true);
    setSelectedApp(null);
  };

  const handleDeleteApp = (app: any) => {
    setAppToDelete(app);
  };

  const confirmDeleteApp = () => {
    if (appToDelete) {
      setApps(apps.filter(a => a.id !== appToDelete.id));
      setAppToDelete(null);
      setSelectedApp(null);
      setViewingFullPageApp(null);
    }
  };

  const handleDeleteCategory = (name: string) => {
    setCategoriesList(categoriesList.filter(cat => cat.name !== name));
    if (activeCategory === name) setActiveCategory('All');
  };

  const maxApps = 500;

  // === 核心過濾與排序邏輯 ===
  const filteredAndSortedApps = useMemo(() => {
    let result = [...apps];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(app =>
        app.name.toLowerCase().includes(q) || app.description.toLowerCase().includes(q)
      );
    }
    if (activeCategory !== 'All') {
      result = result.filter(app => app.category === activeCategory);
    }
    if (activeColorGroups.length > 0) {
      result = result.filter(app => 
        app.colorIds && app.colorIds.some(id => {
          const color = colors.find(c => c.id === id);
          return color && activeColorGroups.includes(color.group);
        })
      );
    }
    if (activeYear !== null) {
      result = result.filter(app => new Date(app.releaseDate).getFullYear() === activeYear);
    }
    if (activeMonth !== null) {
      result = result.filter(app => new Date(app.releaseDate).getMonth() + 1 === activeMonth);
    }
    if (showFavoritesOnly) {
      result = result.filter(app => app.starred);
    }
    result.sort((a, b) => {
      switch (sortOption) {
        case 'dl-desc': return b.downloadsNum - a.downloadsNum;
        case 'dl-asc': return a.downloadsNum - b.downloadsNum;
        case 'date-desc': return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        case 'date-asc': return new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
        default: return 0;
      }
    });
    return result;
  }, [apps, searchQuery, activeCategory, activeColorGroups, activeYear, activeMonth, showFavoritesOnly, sortOption]);

  const formatDownloads = (num: number) => {
    if (num >= 100000000) {
      return (num / 100000000).toFixed(2) + ' 亿';
    }
    if (num >= 10000) {
      return (num / 10000).toFixed(2) + ' 万';
    }
    return num.toString();
  };

  const totalDownloadsValue = useMemo(() => {
    return Object.values(newAppPlatformDownloads).reduce((acc: number, val: string) => {
      const num = parseInt(val.replace(/[^0-9]/g, '')) || 0;
      return acc + num * 10000; // Assuming input is in '万'
    }, 0);
  }, [newAppPlatformDownloads]);

  const totalDownloadsFormatted = useMemo(() => formatDownloads(totalDownloadsValue), [totalDownloadsValue]);

  const toggleFavorite = (e: React.MouseEvent, appId: number) => {
    e.stopPropagation();
    setApps(apps.map(app => app.id === appId ? { ...app, starred: !app.starred } : app));
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp({ ...selectedApp, starred: !selectedApp.starred });
    }
  };

  if (viewingFullPageApp) {
    const app = viewingFullPageApp;
    return (
      <div className="min-h-screen bg-[#F8F9FB] font-sans text-gray-800 pb-20">
        {/* Header */}
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-[1600px] mx-auto px-10 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setViewingFullPageApp(null)}>
              <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center overflow-hidden relative shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400 opacity-80 blur-[2px] rounded-full scale-150 -top-2 -left-2"></div>
                <div className="absolute w-4 h-4 bg-black rounded-full top-1 left-1"></div>
                <span className="relative text-white font-bold text-lg leading-none z-10">P</span>
              </div>
              <h1 className="font-bold text-xl tracking-tight">ProdNote</h1>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={(e) => toggleFavorite(e, app.id)}
                className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Star className={`w-5 h-5 ${app.starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
              </button>
              <button 
                onClick={() => handleDeleteApp(app)}
                className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => {
                  handleEditApp(app);
                  setViewingFullPageApp(null);
                }}
                className="bg-indigo-600 text-white px-8 h-11 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
              >
                Edit
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-[1600px] mx-auto px-10 pt-12 grid grid-cols-[1fr_380px] gap-12">
          {/* Left Column */}
          <div className="space-y-12">
            {/* App Header Card */}
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100/50 flex items-center gap-10">
              <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center text-white shadow-xl ${app.bg} overflow-hidden`}>
                {app.logo ? (
                  <img src={app.logo} className="w-full h-full object-cover" alt={app.name} />
                ) : (
                  <app.icon className="w-16 h-16 stroke-[1.2]" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <h2 className="text-4xl font-black text-gray-900 tracking-tight">{app.name}</h2>
                  <div className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> {app.ageText}
                  </div>
                </div>
                <p className="text-lg text-gray-400 font-medium mb-6 leading-relaxed max-w-2xl">{app.description}</p>
                <div className="flex gap-3">
                  {['Design', 'Productivity', 'Vector'].map(tag => (
                    <span key={tag} className="bg-gray-50 text-gray-400 border border-gray-100 px-4 py-1.5 rounded-xl text-xs font-bold">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-8">
              {[
                { label: 'iOS App Store', value: '12.4M', icon: Apple, color: 'text-blue-500' },
                { label: 'Google Play', value: '45.8M', icon: Smartphone, color: 'text-emerald-500' },
                { label: 'Total Downloads', value: '58.2M', icon: ArrowDownUp, color: 'text-indigo-500' }
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100/50">
                  <div className="flex items-center gap-3 mb-4">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{stat.label}</span>
                  </div>
                  <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                </div>
              ))}
            </div>

            {/* Screenshots */}
            <div className="space-y-6">
              <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                  <h3 className="text-lg font-black text-gray-900 tracking-tight">Screenshots</h3>
                </div>
                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors shadow-sm">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors shadow-sm">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-8">
                {app.screenshots && app.screenshots.length > 0 ? (
                  app.screenshots.map((src: string, i: number) => (
                    <div key={i} className="bg-white rounded-[2.5rem] aspect-[9/16] shadow-xl border border-gray-100 overflow-hidden group cursor-pointer relative">
                      <img src={src} className="w-full h-full object-cover" alt={`screenshot-${i}`} />
                    </div>
                  ))
                ) : (
                  [1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white rounded-[2.5rem] aspect-[9/16] shadow-xl border border-gray-100 overflow-hidden group cursor-pointer relative">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                        <div className="w-4/5 h-4/5 border-4 border-gray-200 rounded-[2rem] relative overflow-hidden">
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-gray-200 rounded-full"></div>
                          <div className="p-4 space-y-4">
                            <div className="h-4 w-2/3 bg-gray-100 rounded-lg"></div>
                            <div className="h-24 bg-gray-50 rounded-xl"></div>
                            <div className="space-y-2">
                              <div className="h-3 w-full bg-gray-100 rounded-lg"></div>
                              <div className="h-3 w-5/6 bg-gray-100 rounded-lg"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Key Features */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 px-4">
                <Layers className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-black text-gray-900 tracking-tight">Key Features</h3>
              </div>
              <div className="space-y-6">
                {app.features && app.features.length > 0 ? (
                  app.features.map((feature: any, i: number) => (
                    <div key={i} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100/50 flex gap-10 items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className={`w-32 h-32 rounded-3xl bg-gray-50 overflow-hidden flex-shrink-0 flex items-center justify-center`}>
                        {feature.image ? (
                          <img src={feature.image} className="w-full h-full object-cover" alt={feature.title} />
                        ) : (
                          <ImageIcon className="w-8 h-8 text-gray-200" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-gray-900 mb-2 tracking-tight">{feature.title}</h4>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-xl">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  [1, 2].map(i => (
                    <div key={i} className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100/50 flex gap-10 items-center">
                      <div className="w-24 h-24 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300">
                        <ImageIcon className="w-6 h-6 mb-2" />
                        <span className="text-[8px] font-black uppercase tracking-widest">No Image</span>
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-gray-900 mb-2 tracking-tight">Feature Title</h4>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-xl">
                          Add features in the app editor to see them here.
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Business Model */}
            <div className="bg-[#15162B] rounded-[3rem] p-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 blur-[100px] rounded-full -mr-48 -mt-48"></div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                    <Layers className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">Business Model</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed mb-12 font-medium max-w-2xl">
                  Lumina follows a <span className="text-white font-bold">Freemium</span> model. Basic tools and 5 projects are available for free. The Pro subscription ($9.99/mo) unlocks unlimited projects, cloud storage, advanced export formats (SVG, EPS, PDF), and collaboration tools.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                    <Building2 className="w-4 h-4" /> Subscription Plans
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    {/* Free Plan */}
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10">
                      <div className="mb-8">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 block">Free Plan</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-black">$0</span>
                          <span className="text-xs text-gray-500 font-bold">/forever</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {['Up to 5 active projects', 'Basic vector toolset', 'Standard PNG/JPG export'].map((item, i) => (
                          <div key={i} className="flex items-center gap-3 text-xs text-gray-300 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-indigo-500" /> {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Pro Plan */}
                    <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
                      <div className="mb-8">
                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 block">Pro Plan</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-black">$9.99</span>
                          <span className="text-xs text-gray-500 font-bold">/mo</span>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {['Unlimited projects', 'Advanced formats (SVG, EPS, PDF)', 'Real-time cloud collaboration', 'Priority support'].map((item, i) => (
                          <div key={i} className="flex items-center gap-3 text-xs text-gray-300 font-medium">
                            <CheckCircle2 className="w-4 h-4 text-indigo-500" /> {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-8">
            {/* Publisher */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100/50">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-6">Publisher</p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-gray-300" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-gray-900 mb-1">Studio Lumina Inc.</h4>
                  <p className="text-[10px] text-gray-400 font-bold">Tier: Mid-Sized Tech Company</p>
                </div>
              </div>
            </div>

            {/* Brand Palette */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100/50">
              <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-6">Extracted Brand Palette</p>
              <div className="flex gap-3">
                {['bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-rose-500', 'bg-orange-500', 'bg-yellow-400'].map((c, i) => (
                  <div key={i} className={`w-10 h-10 rounded-xl ${c} shadow-sm cursor-pointer hover:scale-110 transition-transform`}></div>
                ))}
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100/50 space-y-8">
              <div>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">Metadata</p>
                <div className="space-y-6">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Category</p>
                    <span className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-[11px] font-bold">Creative Suites</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {['Illustration', 'SVG Editor', 'Vector Art', 'Graphic Design', '+4 more'].map(tag => (
                        <span key={tag} className="bg-white border border-gray-100 text-gray-400 px-3 py-1.5 rounded-lg text-[10px] font-bold">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Changes Saved Notification */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-[2rem] p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full -mr-12 -mt-12"></div>
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <h4 className="text-xs font-black text-emerald-700 uppercase tracking-widest">Changes Saved</h4>
              </div>
              <p className="text-[10px] text-emerald-600/80 font-medium leading-relaxed">
                You are currently editing this product. Click 'Confirm Changes' below to persist data to the main database.
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="max-w-[1600px] mx-auto px-10 mt-20 pt-10 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-bold">
          <p>© 2024 APPLORE App Discovery Platform. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-900 transition-colors">Export Data (JSON)</a>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#F0F2F5] font-sans overflow-hidden text-gray-800">

      {/* 側邊欄 */}
      <aside className="w-[280px] bg-white border-r border-gray-100 flex flex-col h-full flex-shrink-0 z-10 shadow-sm">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center overflow-hidden relative shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400 opacity-80 blur-[2px] rounded-full scale-150 -top-2 -left-2"></div>
            <div className="absolute w-4 h-4 bg-black rounded-full top-1 left-1"></div>
            <span className="relative text-white font-bold text-lg leading-none z-10">P</span>
          </div>
          <h1 className="font-bold text-xl tracking-tight">ProdNote</h1>
        </div>

        <div className="px-6 mb-6">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-3" />
            <input
              type="text"
              placeholder="Search apps"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100/80 text-sm rounded-xl py-2.5 pl-9 pr-4 outline-none focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="px-4 mb-4 flex flex-col gap-1">
          <button 
            onClick={() => setActiveTab('subscription')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors w-full text-left text-sm font-medium ${activeTab === 'subscription' ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Zap className={`w-4 h-4 ${activeTab === 'subscription' ? 'text-indigo-600' : ''}`} /> Subscription
          </button>
          <button 
            onClick={() => setActiveTab('collections')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors w-full text-left text-sm font-medium ${activeTab === 'collections' ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Layers className={`w-4 h-4 ${activeTab === 'collections' ? 'text-indigo-600' : ''}`} /> Collections
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-0.5 custom-scrollbar">
          {categoriesList.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                setActiveCategory(cat.name);
                setActiveTab('all');
              }}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-colors text-sm ${activeTab === 'all' && activeCategory === cat.name ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-500 hover:bg-gray-50'
                }`}
            >
              <div className="flex items-center gap-3">
                <cat.icon className={`w-4 h-4 ${activeTab === 'all' && activeCategory === cat.name ? 'text-indigo-600' : ''}`} />
                <span>{cat.name}</span>
              </div>
              <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] text-gray-400 font-bold min-w-[30px] text-center">
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        <div className="p-6 border-t border-gray-100 bg-white">
          <div className="flex items-center justify-between text-[11px] mb-3 font-bold">
            <span className="text-gray-400 tracking-wider">{apps.length} / {maxApps} Apps Added</span>
            <span className="text-indigo-600">{Math.round((apps.length / maxApps) * 100)}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full mb-6 overflow-hidden">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all duration-500" 
              style={{ width: `${(apps.length / maxApps) * 100}%` }}
            ></div>
          </div>
          <button 
            onClick={() => setShowProModal(true)}
            className="w-full bg-[#0B1021] text-white py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold hover:bg-gray-900 transition-colors"
          >
            <Zap className="w-4 h-4 fill-current text-yellow-400" /> PRO
          </button>
        </div>
      </aside>

      {/* 主內容區 */}
      <main className="flex-1 h-full overflow-y-auto custom-scrollbar p-10 pb-20 relative">
        {activeTab === 'all' ? (
          <>
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{activeCategory}</h2>
                <p className="text-sm text-gray-400 font-medium">{filteredAndSortedApps.length} results founded</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    setSortOption(sortOption === 'date-desc' ? 'date-asc' : 'date-desc');
                  }}
                  className={`w-10 h-10 rounded-xl shadow-sm flex items-center justify-center transition-colors ${sortOption.startsWith('date') ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-gray-400 hover:text-gray-900'}`}
                >
                  <CalendarDays className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => {
                    setSortOption(sortOption === 'dl-desc' ? 'dl-asc' : 'dl-desc');
                  }}
                  className={`w-10 h-10 rounded-xl shadow-sm flex items-center justify-center transition-colors ${sortOption.startsWith('dl') ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-gray-400 hover:text-gray-900'}`}
                >
                  <ArrowDownUp className="w-5 h-5" />
                </button>
                <button onClick={() => setShowFavoritesOnly(!showFavoritesOnly)} className={`w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center transition-colors ${showFavoritesOnly ? 'text-yellow-500' : 'text-gray-400'}`}><Star className={`w-5 h-5 ${showFavoritesOnly ? 'fill-current' : ''}`} /></button>
                <button
                  onClick={() => {
                    setIsAddingNew(true);
                    setEditingApp(null);
                    setNewAppName('');
                    setNewAppSlogan('');
                    setNewAppTags([]);
                    setNewAppColors([]);
                    setNewAppLogo(null);
                    setNewAppScreenshots([]);
                    setNewAppRating('4.5');
                    setNewAppFeatures([]);
                    setNewAppPlatformDownloads({});
                  }}
                  className="bg-black text-white px-6 h-11 rounded-xl shadow-sm flex items-center gap-2 text-sm font-bold hover:bg-gray-800 transition-all active:scale-95 ml-2"
                >
                  <Plus className="w-4 h-4" strokeWidth={3} /> Add App
                </button>
              </div>
            </div>

            {/* 顏色過濾器 */}
            <div className="flex items-center gap-4 mb-10">
              <div className="bg-white rounded-full px-6 py-4 shadow-sm flex items-center gap-4 border border-gray-100/50 flex-1">
                <span className="text-[10px] font-bold text-gray-300 tracking-widest uppercase">Color</span>
                <div className="flex items-center gap-3 overflow-x-auto custom-scrollbar pb-1">
                  {/* 按組別合併顏色，並按順序排列 */}
                  {['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'indigo', 'purple', 'pink', 'black', 'gray', 'white']
                    .filter(groupName => apps.some(app => app.colorIds?.some(id => colors.find(c => c.id === id)?.group === groupName)))
                    .map((groupName) => {
                      const representativeColor = colors.find(c => c.group === groupName);
                      if (!representativeColor) return null;
                      return (
                        <button
                          key={groupName}
                          onClick={() => {
                            if (activeColorGroups.includes(groupName)) {
                              setActiveColorGroups(activeColorGroups.filter(g => g !== groupName));
                            } else {
                              setActiveColorGroups([...activeColorGroups, groupName]);
                            }
                          }}
                          className={`w-4 h-4 rounded-full transition-all flex-shrink-0 ${representativeColor.class} ${activeColorGroups.includes(groupName) ? 'ring-2 ring-offset-2 ring-gray-300 scale-110' : 'hover:scale-125'}`}
                        />
                      );
                    })}
                </div>
              </div>

              <div className="bg-white rounded-full px-6 py-4 shadow-sm flex items-center gap-4 border border-gray-100/50">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-300 tracking-widest uppercase">Year</span>
                  <select 
                    value={activeYear || ''} 
                    onChange={(e) => {
                      setActiveYear(e.target.value ? parseInt(e.target.value) : null);
                      if (e.target.value) setActiveMonth(null);
                    }}
                    className="bg-transparent text-sm font-bold text-gray-500 outline-none cursor-pointer"
                  >
                    <option value="">All</option>
                    {Array.from(new Set(apps.map(app => new Date(app.releaseDate).getFullYear()))).sort((a, b) => (b as number) - (a as number)).map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                <div className="w-px h-4 bg-gray-100" />
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-gray-300 tracking-widest uppercase">Month</span>
                  <select 
                    value={activeMonth || ''} 
                    onChange={(e) => {
                      setActiveMonth(e.target.value ? parseInt(e.target.value) : null);
                      if (e.target.value) setActiveYear(null);
                    }}
                    className="bg-transparent text-sm font-bold text-gray-500 outline-none cursor-pointer"
                  >
                    <option value="">All</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <option key={m} value={m}>{new Date(2000, m - 1).toLocaleString('default', { month: 'short' })}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 網格列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {filteredAndSortedApps.map((app) => (
                <div key={app.id} onClick={() => setSelectedApp(app)} className="flex flex-col group cursor-pointer relative">
                  <div className="bg-white rounded-[2.5rem] p-7 aspect-square shadow-sm mb-4 relative transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2">
                    <button 
                      onClick={(e) => toggleFavorite(e, app.id)}
                      className="absolute top-5 right-5 z-20 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                    >
                      <Star className={`w-4 h-4 ${app.starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                    </button>
                    <div className={`w-full h-full rounded-[2rem] flex items-center justify-center text-white ${app.bg} overflow-hidden`}>
                      {app.logo ? (
                        <img src={app.logo} className="w-full h-full object-cover" alt={app.name} />
                      ) : (
                        <app.icon className="w-14 h-14 stroke-[1.2]" />
                      )}
                    </div>
                  </div>
                  <div className="px-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{app.name}</h3>
                    <div className="flex items-center justify-between text-xs text-gray-400 font-bold">
                      <div className="flex items-center gap-1.5"><Download className="w-3.5 h-3.5" /> {app.downloadsText}</div>
                      <div className="flex items-center gap-1">{app.rating} <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 -mt-0.5" /></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : activeTab === 'collections' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start justify-between mb-12">
              <div>
                <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Manage Categories</h2>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Organize your application groups</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white rounded-2xl px-6 py-3 shadow-sm border border-gray-100/50 flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 uppercase">Sort</span>
                  <div className="flex items-center gap-2 text-sm font-black text-gray-900 cursor-pointer">
                    A-Z <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setIsAddingCategory(true);
                    setNewCategoryName('');
                    setNewCategoryIcon(LayoutGrid);
                    setCategoryAppSearchQuery('');
                  }}
                  className="bg-indigo-600 text-white px-8 h-14 rounded-2xl shadow-lg shadow-indigo-200 flex items-center gap-3 text-sm font-bold hover:bg-indigo-700 transition-all active:scale-95"
                >
                  <Plus className="w-5 h-5" strokeWidth={3} /> Add Group
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {categoriesList.map((cat) => (
                <div key={cat.name} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100/50 group hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                  <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCategory(cat);
                        setNewCategoryName(cat.name);
                        setNewCategoryIcon(cat.icon);
                        setCategoryAppSearchQuery('');
                        // 找出屬於該分類的 App ID
                        const appIds = apps.filter(a => a.category === cat.name).map(a => a.id);
                        setSelectedAppIdsForCategory(appIds);
                      }}
                      className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(cat.name);
                      }}
                      className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <cat.icon className="w-8 h-8 text-indigo-600 stroke-[1.5]" />
                  </div>
                  
                  <h3 className="text-xl font-black text-gray-900 mb-2">{cat.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400 font-bold">{cat.count} Apps</span>
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 overflow-hidden">
                          <img src={`https://picsum.photos/seed/${cat.name}${i}/40/40`} alt="" referrerPolicy="no-referrer" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
              <Zap className="w-12 h-12 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Subscription Plans</h2>
            <p className="text-gray-400 max-w-md">Unlock premium features and unlimited collections with our PRO plan.</p>
          </div>
        )}
      </main>

      {/* === 新增應用彈窗 (Add New App Modal) === */}
      {isAddingNew && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm transition-all duration-300 overflow-hidden">
          <div className="bg-white w-full max-w-[850px] max-h-[95vh] rounded-[2.5rem] shadow-2xl flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
            {/* 頂部固定區域 */}
            <div className="px-10 pt-10 pb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black text-gray-900">{editingApp ? 'Edit APP' : 'New APP'}</h2>
              <button 
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingApp(null);
                }} 
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 可捲動表單內容 */}
            <div className="flex-1 overflow-y-auto px-10 pb-10 custom-scrollbar space-y-10">

              {/* 第一部分：基礎資訊與圖示 */}
              <div className="flex gap-10">
                {/* Logo 上傳區域 */}
                <div className="flex flex-col items-center gap-4">
                  <div 
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e: any) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event: any) => {
                            setNewAppLogo(event.target.result);
                            setIsExtractingColors(true);
                            setTimeout(() => {
                              const randomColors = [...colors].sort(() => 0.5 - Math.random()).slice(0, 4).map(c => c.id);
                              setNewAppColors(randomColors);
                              setIsExtractingColors(false);
                            }, 1500);
                          };
                          reader.readAsDataURL(file);
                        }
                      };
                      input.click();
                    }}
                    className="w-44 h-44 rounded-[2.5rem] bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer group relative overflow-hidden"
                  >
                    {newAppLogo ? (
                      <img src={newAppLogo} className="w-full h-full object-cover" alt="logo" />
                    ) : isExtractingColors ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600">Extracting...</span>
                      </div>
                    ) : (
                      <>
                        <div className="p-3 bg-white rounded-xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                          <Upload className="w-6 h-6 text-gray-400" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Upload Logo</span>
                      </>
                    )}
                  </div>
                  {/* 顏色選擇 */}
                  <div className="flex flex-wrap justify-center gap-2.5 max-w-[180px]">
                    {colors.map(c => (
                      <div 
                        key={c.id} 
                        onClick={() => {
                          if (newAppColors.includes(c.id)) {
                            setNewAppColors(newAppColors.filter(id => id !== c.id));
                          } else if (newAppColors.length < 6) {
                            setNewAppColors([...newAppColors, c.id]);
                          }
                        }}
                        className={`w-5 h-5 rounded-full ${c.class} cursor-pointer transition-all ${newAppColors.includes(c.id) ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'opacity-40 hover:opacity-100 hover:scale-110'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-gray-300 uppercase">Confirm Colors (Max 6)</span>
                </div>

                {/* 輸入欄位 */}
                <div className="flex-1 space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-4">Product Name</label>
                    <input 
                      type="text" 
                      value={newAppName}
                      onChange={(e) => setNewAppName(e.target.value)}
                      placeholder="Enter name" 
                      className="w-full bg-gray-50 rounded-2xl px-5 py-3.5 outline-none border border-transparent focus:border-indigo-100 transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-4">Slogan</label>
                    <input 
                      type="text" 
                      value={newAppSlogan}
                      onChange={(e) => setNewAppSlogan(e.target.value)}
                      placeholder="About the app description" 
                      className="w-full bg-gray-50 rounded-2xl px-5 py-3.5 outline-none border border-transparent focus:border-indigo-100 transition-all" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-4">Tags</label>
                    <div className="w-full bg-gray-50 rounded-2xl px-5 py-2 flex flex-wrap gap-2 items-center min-h-[50px]">
                      {newAppTags.map(tag => (
                        <span key={tag} className="bg-white px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 flex items-center gap-2 border border-gray-100 shadow-sm">
                          {tag} 
                          <X 
                            className="w-3 h-3 text-gray-400 cursor-pointer hover:text-red-500" 
                            onClick={() => setNewAppTags(newAppTags.filter(t => t !== tag))}
                          />
                        </span>
                      ))}
                      <input 
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && tagInput.trim()) {
                            if (!newAppTags.includes(tagInput.trim())) {
                              setNewAppTags([...newAppTags, tagInput.trim()]);
                              if (!historicalTags.includes(tagInput.trim())) {
                                setHistoricalTags([...historicalTags, tagInput.trim()]);
                              }
                            }
                            setTagInput('');
                          }
                        }}
                        placeholder="Type and enter..."
                        className="bg-transparent outline-none text-xs font-bold text-gray-700 flex-1 min-w-[100px]"
                      />
                    </div>
                  </div>
                  {/* 標籤預設選項 */}
                  <div className="flex flex-wrap gap-3 ml-4">
                    {historicalTags.map(t => (
                      <span 
                        key={t} 
                        onClick={() => {
                          if (!newAppTags.includes(t)) {
                            setNewAppTags([...newAppTags, t]);
                          }
                        }}
                        className="text-[10px] font-black text-gray-300 uppercase cursor-pointer hover:text-indigo-400"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 第二部分：發佈與統計 */}
              <div className="grid grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-4">Release Date</label>
                    <div className="relative">
                      <input 
                        type="date" 
                        value={newAppReleaseDate}
                        onChange={(e) => setNewAppReleaseDate(e.target.value)}
                        className="w-full bg-gray-50 rounded-2xl px-5 py-3.5 outline-none text-sm font-medium pr-12" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-4">Category</label>
                    <div className="relative">
                      <select 
                        value={newAppCategory}
                        onChange={(e) => setNewAppCategory(e.target.value)}
                        className="w-full bg-gray-50 rounded-2xl px-5 py-3.5 outline-none appearance-none text-sm font-medium"
                      >
                        {categoriesList.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                      </select>
                      <ChevronDown className="w-5 h-5 text-gray-300 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-4">Company Name</label>
                    <input 
                      type="text" 
                      value={newAppCompany}
                      onChange={(e) => setNewAppCompany(e.target.value)}
                      placeholder="Your name" 
                      className="w-full bg-gray-50 rounded-2xl px-5 py-3.5 outline-none text-sm font-medium" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-4">Team Type</label>
                    <div className="relative">
                      <select 
                        value={newAppTeamType}
                        onChange={(e) => setNewAppTeamType(e.target.value)}
                        className="w-full bg-gray-50 rounded-2xl px-5 py-3.5 outline-none appearance-none text-sm font-medium"
                      >
                        <option value="Individual">Individual</option>
                        <option value="Studio">Studio</option>
                        <option value="Company">Company</option>
                      </select>
                      <ChevronDown className="w-5 h-5 text-gray-300 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-4">PLATFORMS</label>
                    <div className="flex gap-2">
                      {[
                        { id: 'iOS', icon: Apple },
                        { id: 'Android', icon: Smartphone },
                        { id: 'Windows', icon: Monitor },
                        { id: 'macOS', icon: Globe }
                      ].map(p => (
                        <button 
                          key={p.id}
                          onClick={() => {
                            if (newAppPlatforms.includes(p.id)) {
                              setNewAppPlatforms(newAppPlatforms.filter(id => id !== p.id));
                            } else {
                              setNewAppPlatforms([...newAppPlatforms, p.id]);
                            }
                          }}
                          className={`flex-1 rounded-xl py-2 flex items-center justify-center gap-2 text-[10px] font-bold transition-all shadow-sm ${newAppPlatforms.includes(p.id) ? 'bg-indigo-50 border border-indigo-100 text-indigo-600' : 'bg-white border border-gray-100 text-gray-400 hover:text-indigo-600 hover:border-indigo-100'}`}
                        >
                          <p.icon className="w-3.5 h-3.5" /> {p.id}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-[1.5rem] p-6 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Downloads (in thousand/million/billion)</span>
                      <span className="bg-black text-white px-2 py-0.5 rounded text-[8px] font-bold tracking-widest uppercase">Total: {totalDownloadsFormatted}</span>
                    </div>
                    {newAppPlatforms.map(platform => {
                      const Icon = [
                        { id: 'iOS', icon: Apple },
                        { id: 'Android', icon: Smartphone },
                        { id: 'Windows', icon: Monitor },
                        { id: 'macOS', icon: Globe }
                      ].find(p => p.id === platform)?.icon || Smartphone;
                      
                      return (
                        <div key={platform} className="relative">
                          <Icon className="w-4 h-4 text-gray-300 absolute left-4 top-1/2 -translate-y-1/2" />
                          <input 
                            type="text" 
                            value={newAppPlatformDownloads[platform] || ''}
                            onChange={(e) => setNewAppPlatformDownloads({
                              ...newAppPlatformDownloads,
                              [platform]: e.target.value
                            })}
                            placeholder={`e.g. 20 (万)`} 
                            className="w-full bg-white rounded-xl pl-11 pr-4 py-3 text-xs font-bold text-gray-700 outline-none border border-transparent focus:border-indigo-100 transition-all" 
                          />
                        </div>
                      );
                    })}
                    {newAppPlatforms.length === 0 && (
                      <div className="text-center py-4 text-[10px] font-bold text-gray-300 uppercase italic">
                        Select a platform to add downloads
                      </div>
                    )}
                  </div>

                  {/* 評分設置 */}
                  <div className="bg-gray-50 rounded-[1.5rem] p-6 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">App Rating (1-5)</label>
                      <div className="flex items-center gap-0.5">
                        {(() => {
                          const stars = [];
                          const rating = parseFloat(newAppRating) || 0;
                          const fullStars = Math.floor(rating);
                          const hasHalfStar = rating % 1 >= 0.5;
                          for (let i = 1; i <= 5; i++) {
                            if (i <= fullStars) {
                              stars.push(<Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" />);
                            } else if (i === fullStars + 1 && hasHalfStar) {
                              stars.push(<StarHalf key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" />);
                            } else {
                              stars.push(<Star key={i} className="w-3.5 h-3.5 text-gray-200" />);
                            }
                          }
                          return stars;
                        })()}
                      </div>
                    </div>
                    <div className="relative">
                      <input 
                        type="number" 
                        min="1" 
                        max="5" 
                        step="0.1" 
                        value={newAppRating}
                        onChange={(e) => {
                          let val = parseFloat(e.target.value);
                          if (isNaN(val)) {
                            setNewAppRating(e.target.value);
                            return;
                          }
                          if (val > 5) val = 5;
                          if (val < 1) val = 1;
                          setNewAppRating(val.toFixed(1));
                        }}
                        placeholder="e.g. 4.5"
                        className="w-full bg-white rounded-xl px-4 py-3 text-sm font-black text-indigo-600 outline-none border border-transparent focus:border-indigo-100 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 第三部分：截圖 */}
              <div className="space-y-4">
                <div className="flex items-center justify-between ml-4">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Screenshots (9:16)</label>
                  <span className="text-[10px] font-bold text-gray-300 uppercase italic">Max Size 4MB Each</span>
                </div>
                <div className="grid grid-cols-5 gap-5">
                  {newAppScreenshots.map((src, idx) => (
                    <div key={idx} className="aspect-[9/16] bg-gray-50 rounded-[2rem] border-2 border-gray-100 overflow-hidden relative group">
                      <img src={src} className="w-full h-full object-cover" alt="screenshot" />
                      <button 
                        onClick={() => setNewAppScreenshots(newAppScreenshots.filter((_, i) => i !== idx))}
                        className="absolute top-2 right-2 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {newAppScreenshots.length < 5 && (
                    <div 
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e: any) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event: any) => {
                              setNewAppScreenshots([...newAppScreenshots, event.target.result]);
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      }}
                      className="aspect-[9/16] bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300 hover:bg-indigo-50/50 hover:border-indigo-200 transition-all cursor-pointer"
                    >
                      <Plus className="w-6 h-6" />
                    </div>
                  )}
                </div>
              </div>

              {/* 第四部分：核心功能編輯 */}
              <div className="space-y-6">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-4 tracking-widest">Key Features</label>

                <div 
                  onClick={() => {
                    setNewAppFeatures([{
                      id: Date.now().toString(),
                      image: null,
                      aspectRatio: '1:1',
                      title: '',
                      description: ''
                    }, ...newAppFeatures]);
                  }}
                  className="w-full py-10 rounded-[2.5rem] bg-gray-50/50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white hover:border-indigo-300 transition-all cursor-pointer group"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform"><Plus className="w-5 h-5 text-indigo-500" /></div>
                    <span className="text-[11px] font-black uppercase tracking-widest">Add New Feature Block</span>
                  </div>
                </div>

                <Reorder.Group axis="y" values={newAppFeatures} onReorder={setNewAppFeatures} className="space-y-6">
                  {newAppFeatures.map((feature) => (
                    <Reorder.Item 
                      key={feature.id} 
                      value={feature}
                      className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm flex gap-8 relative group/item"
                    >
                      <div className="absolute top-6 right-6 flex items-center gap-2">
                        <div className="cursor-grab active:cursor-grabbing p-2 text-gray-300 hover:text-indigo-500 transition-colors">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <button 
                          onClick={() => setNewAppFeatures(newAppFeatures.filter((f) => f.id !== feature.id))}
                          className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex flex-col items-center gap-3 flex-shrink-0 pt-6">
                        <div 
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e: any) => {
                              const file = e.target.files[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (event: any) => {
                                  setNewAppFeatures(newAppFeatures.map(f => 
                                    f.id === feature.id ? { ...f, image: event.target.result } : f
                                  ));
                                };
                                reader.readAsDataURL(file);
                              }
                            };
                            input.click();
                          }}
                          className={`w-32 h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center text-gray-300 overflow-hidden cursor-pointer hover:border-indigo-300 transition-all`}
                        >
                          {feature.image ? (
                            <img src={feature.image} className="w-full h-full object-cover" alt="feature" />
                          ) : (
                            <>
                              <ImageIcon className="w-6 h-6 mb-2" />
                              <span className="text-[8px] font-bold uppercase">Feature Img</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 space-y-4 pt-6">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-300 uppercase ml-2">Feature Heading</label>
                          <input 
                            type="text" 
                            value={feature.title}
                            onChange={(e) => {
                              setNewAppFeatures(newAppFeatures.map(f => 
                                f.id === feature.id ? { ...f, title: e.target.value } : f
                              ));
                            }}
                            placeholder="Enter feature title"
                            className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold text-gray-700 outline-none border border-transparent focus:border-indigo-100 transition-all" 
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-300 uppercase ml-2">Description</label>
                          <textarea 
                            value={feature.description}
                            onChange={(e) => {
                              setNewAppFeatures(newAppFeatures.map(f => 
                                f.id === feature.id ? { ...f, description: e.target.value } : f
                              ));
                            }}
                            placeholder="Enter feature description"
                            className="w-full bg-gray-50 rounded-xl px-4 py-3 text-xs font-medium text-gray-500 outline-none resize-none h-20 border border-transparent focus:border-indigo-100 transition-all" 
                          />
                        </div>
                      </div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </div>

            </div>

            {/* 底部固定操作欄 */}
            <div className="px-10 py-8 bg-white/80 backdrop-blur-md border-t border-gray-100 flex items-center justify-between rounded-b-[2.5rem]">
              <div className="flex items-center gap-2 text-green-500">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Draft Saved</span>
              </div>
              <button
                onClick={() => {
                  if (editingApp) {
                    // 更新現有應用
                    const updatedApps = apps.map(app => {
                      if (app.id === editingApp.id) {
                        return {
                          ...app,
                          name: newAppName,
                          category: newAppCategory,
                          description: newAppSlogan,
                          tags: newAppTags,
                          downloadsNum: totalDownloadsValue,
                          downloadsText: totalDownloadsFormatted,
                          colorIds: newAppColors,
                          bg: newAppColors.length > 0 ? colors.find(c => c.id === newAppColors[0])?.class || 'bg-gray-900' : 'bg-gray-900',
                          releaseDate: newAppReleaseDate,
                          platforms: newAppPlatforms,
                          logo: newAppLogo,
                          screenshots: newAppScreenshots,
                          rating: newAppRating,
                          features: newAppFeatures,
                          businessModel: newAppBusinessModel,
                          platformDownloads: newAppPlatformDownloads
                        };
                      }
                      return app;
                    });
                    setApps(updatedApps);
                  } else {
                    // 模擬保存新應用
                    const newApp = {
                      id: apps.length + 1,
                      name: newAppName || 'New App ' + (apps.length + 1),
                      category: newAppCategory,
                      description: newAppSlogan || 'A newly added application.',
                      tags: newAppTags,
                      downloadsNum: totalDownloadsValue,
                      downloadsText: totalDownloadsFormatted,
                      rating: newAppRating,
                      icon: LayoutGrid,
                      colorIds: newAppColors,
                      bg: newAppColors.length > 0 ? colors.find(c => c.id === newAppColors[0])?.class || 'bg-gray-900' : 'bg-gray-900',
                      starred: false,
                      releaseDate: newAppReleaseDate,
                      ageText: 'New',
                      isPro: false,
                      platforms: newAppPlatforms,
                      logo: newAppLogo,
                      screenshots: newAppScreenshots,
                      features: newAppFeatures,
                      businessModel: newAppBusinessModel,
                      platformDownloads: newAppPlatformDownloads
                    };
                    setApps([...apps, newApp]);
                  }
                  
                  setIsAddingNew(false);
                  setEditingApp(null);
                  // Reset form
                  setNewAppName('');
                  setNewAppSlogan('');
                  setNewAppTags([]);
                  setNewAppColors([]);
                  setNewAppLogo(null);
                  setNewAppScreenshots([]);
                  setNewAppRating('4.5');
                  setNewAppFeatures([]);
                  setNewAppBusinessModel({ description: '', tiers: [] });
                  setNewAppPlatformDownloads({});
                }}
                className="bg-black text-white px-12 h-14 rounded-2xl shadow-xl shadow-black/10 font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95"
              >
                {editingApp ? 'Update Application' : 'Save Application'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 詳情彈窗 (保持不變) */}
      {selectedApp && !isAddingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm transition-all" onClick={() => setSelectedApp(null)}>
          <div className="bg-[#FAFAFA] w-full max-w-[850px] max-h-[95vh] rounded-[2.5rem] shadow-2xl overflow-y-auto custom-scrollbar flex flex-col relative animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="p-10 flex-1 flex flex-col gap-10">
              <div className="flex items-start gap-8 relative">
                <div className="absolute top-0 right-0 flex items-center gap-3">
                  <button 
                    onClick={() => handleEditApp(selectedApp)}
                    className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-gray-900 shadow-sm border border-gray-100 transition-colors"
                  >
                    <Pencil className="w-4.5 h-4.5" />
                  </button>
                  <button 
                    onClick={() => handleDeleteApp(selectedApp)}
                    className="w-11 h-11 bg-white rounded-full flex items-center justify-center text-red-400 hover:text-white hover:bg-red-400 shadow-sm border border-gray-100 transition-colors"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
                <div className={`w-32 h-32 rounded-[2.5rem] flex items-center justify-center text-white flex-shrink-0 shadow-lg ${selectedApp.bg} overflow-hidden`}>
                  {selectedApp.logo ? (
                    <img src={selectedApp.logo} className="w-full h-full object-cover" alt={selectedApp.name} />
                  ) : (
                    <selectedApp.icon className="w-14 h-14" />
                  )}
                </div>
                <div className="flex flex-col flex-1 pt-2 pr-32">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-3xl font-black text-gray-900">{selectedApp.name}</h2>
                    {selectedApp.isPro && <span className="bg-indigo-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full tracking-wider">PRO</span>}
                  </div>
                  <p className="text-gray-400 text-base font-medium mb-5">{selectedApp.description}</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 text-xs font-black text-gray-600 bg-white px-4 py-2 rounded-xl border border-gray-100"><LayoutGrid className="w-4 h-4 text-indigo-500" />{selectedApp.category}</div>
                    {selectedApp.tags.map((tag: string) => <span key={tag} className="text-xs font-black text-indigo-500 bg-indigo-50/50 px-4 py-2 rounded-xl border border-indigo-100">{tag}</span>)}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white border border-gray-100 rounded-3xl p-8 flex items-center justify-between shadow-sm">
                  <div><p className="text-[10px] font-black text-gray-300 tracking-widest mb-2 uppercase">Total Downloads</p><div className="flex items-baseline gap-2"><span className="text-3xl font-black text-gray-900">{selectedApp.downloadsText.split(' ')[0]}</span><span className="text-gray-400 font-bold">{selectedApp.downloadsText.split(' ')[1] || ''}</span></div></div>
                  <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500"><Download className="w-6 h-6" /></div>
                </div>
                <div className="bg-white border border-gray-100 rounded-3xl p-8 flex items-center justify-between shadow-sm">
                  <div><p className="text-[10px] font-black text-gray-300 tracking-widest mb-2 uppercase">Product Age</p><div className="flex items-baseline gap-2"><span className="text-3xl font-black text-gray-900">{selectedApp.ageText}</span><span className="text-gray-400 font-bold">since launch</span></div></div>
                  <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500"><Clock className="w-6 h-6" /></div>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-300 tracking-widest mb-6 uppercase ml-2">Screenshots</p>
                <div className="grid grid-cols-4 gap-6">
                  {selectedApp.screenshots && selectedApp.screenshots.length > 0 ? (
                    selectedApp.screenshots.map((src: string, i: number) => (
                      <div key={i} className="bg-indigo-50/30 border border-indigo-50 rounded-[2rem] aspect-[9/16] overflow-hidden">
                        <img src={src} className="w-full h-full object-cover" alt={`screenshot-${i}`} />
                      </div>
                    ))
                  ) : (
                    [1, 2, 3, 4].map(i => (
                      <div key={i} className="bg-indigo-50/30 border border-indigo-50 rounded-[2rem] aspect-[9/16] flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-indigo-100" />
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12 mt-4">
                {/* Key Features */}
                <div>
                  <p className="text-[10px] font-black text-gray-300 tracking-widest mb-6 uppercase ml-2">Key Features</p>
                  <div className="space-y-6">
                    {selectedApp.features && selectedApp.features.length > 0 ? (
                      selectedApp.features.map((feature: any, idx: number) => (
                        <div key={idx} className="flex gap-4 p-4 bg-white rounded-2xl border border-gray-50 shadow-sm">
                          <div className="w-16 h-16 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {feature.image ? (
                              <img src={feature.image} className="w-full h-full object-cover" alt={feature.title} />
                            ) : (
                              <CheckCircle2 className="w-6 h-6 text-indigo-500" />
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-1">{feature.title}</h4>
                            <p className="text-[11px] text-gray-400 leading-relaxed font-medium">{feature.description}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      [
                        { title: 'Lightning Command Menu', desc: 'Quickly perform any action with simple keyboard shortcuts and a unified search interface.' },
                        { title: 'Ecosystem Integration', desc: 'Seamlessly connect with Google Calendar, Outlook, Notion, and major video conferencing tools.' }
                      ].map((feature, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-gray-900 mb-1">{feature.title}</h4>
                            <p className="text-[11px] text-gray-400 leading-relaxed font-medium">{feature.desc}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Business Model */}
                <div>
                  <p className="text-[10px] font-black text-gray-300 tracking-widest mb-6 uppercase ml-2">Business Model</p>
                  <div className="bg-[#15162B] rounded-[2rem] p-8 text-white relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                        <Layers className="w-5 h-5 text-indigo-400" />
                      </div>
                      <h3 className="text-lg font-black tracking-tight">Business Model</h3>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed mb-8 font-medium">
                      Lumina follows a <span className="text-white font-bold">Freemium</span> model. Basic tools and 5 projects are available for free. The Pro subscription ($9.99/mo) unlocks unlimited projects, cloud storage, advanced export formats (SVG, EPS, PDF), and collaboration tools.
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                        <Building2 className="w-3 h-3" /> Subscription Plans
                      </div>
                      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Pro Plan</span>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black">$9.99</span>
                            <span className="text-[10px] text-gray-500 font-bold">/mo</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          {['Unlimited projects', 'Advanced formats (SVG, EPS, PDF)', 'Real-time cloud collaboration', 'Priority support'].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-[11px] text-gray-300 font-medium">
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" /> {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 p-8 px-10 flex items-center justify-between z-20 rounded-b-[2.5rem]">
              <button onClick={() => setSelectedApp(null)} className="text-gray-400 font-black text-xs uppercase tracking-widest hover:text-gray-900 px-6 py-2 transition-colors">Close</button>
              <div className="flex gap-4">
                <button onClick={e => toggleFavorite(e, selectedApp.id)} className="bg-white border border-gray-200 text-gray-900 font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-gray-50 flex items-center gap-3 transition-all active:scale-95 shadow-sm"><Heart className={`w-4.5 h-4.5 ${selectedApp.starred ? 'fill-red-500 text-red-500' : 'text-red-500'}`} />{selectedApp.starred ? 'Saved' : 'Save to Favorites'}</button>
                <button 
                  onClick={() => {
                    setViewingFullPageApp(selectedApp);
                    setSelectedApp(null);
                  }}
                  className="bg-indigo-600 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-indigo-700 flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-indigo-600/20"
                >
                  Open Full Page <ExternalLink className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === 刪除確認彈窗 === */}
      {appToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white w-full max-w-[400px] rounded-[2.5rem] shadow-2xl p-10 animate-in fade-in zoom-in-95 duration-200 text-center">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6">
              <Trash2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-4">Delete Application?</h2>
            <p className="text-sm text-gray-400 font-medium mb-10 leading-relaxed">
              Are you sure you want to delete <span className="text-gray-900 font-bold">"{appToDelete.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setAppToDelete(null)}
                className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteApp}
                className="flex-1 bg-red-500 text-white py-4 rounded-2xl font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
      `}} />
      {/* === 分類管理彈窗 (Add/Edit Category Modal) === */}
      {(isAddingCategory || editingCategory) && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white w-full max-w-[450px] rounded-[2.5rem] shadow-2xl p-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-gray-900">{isAddingCategory ? 'New Group' : 'Edit Group'}</h2>
              <button 
                onClick={() => {
                  setIsAddingCategory(false);
                  setEditingCategory(null);
                  setCategoryAppSearchQuery('');
                }} 
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-4">Group Name</label>
                <input 
                  type="text" 
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter name" 
                  className="w-full bg-gray-50 rounded-2xl px-5 py-3.5 outline-none border border-transparent focus:border-indigo-100 transition-all" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-4">Select Icon</label>
                <div className="grid grid-cols-5 gap-3 bg-gray-50 p-4 rounded-2xl">
                  {[LayoutGrid, Music, Coffee, Plane, Film, Briefcase, HeartPulse, Book, Wrench, Building2, Users, Gamepad2, ShoppingBag, Shirt, Globe].map((Icon, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setNewCategoryIcon(Icon)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${newCategoryIcon === Icon ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-gray-400 hover:bg-gray-100'}`}
                    >
                      <Icon className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-4">Add Apps to Group</label>
                <div className="relative mb-3">
                  <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text"
                    value={categoryAppSearchQuery}
                    onChange={(e) => setCategoryAppSearchQuery(e.target.value)}
                    placeholder="Search apps to add..."
                    className="w-full bg-gray-50 rounded-xl pl-11 pr-4 py-3 text-sm outline-none border border-transparent focus:border-indigo-100 transition-all"
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl max-h-[200px] overflow-y-auto custom-scrollbar space-y-2">
                  {apps.filter(app => app.name.toLowerCase().includes(categoryAppSearchQuery.toLowerCase())).map(app => (
                    <div 
                      key={app.id} 
                      onClick={() => {
                        if (selectedAppIdsForCategory.includes(app.id)) {
                          setSelectedAppIdsForCategory(selectedAppIdsForCategory.filter(id => id !== app.id));
                        } else {
                          setSelectedAppIdsForCategory([...selectedAppIdsForCategory, app.id]);
                        }
                      }}
                      className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-colors ${selectedAppIdsForCategory.includes(app.id) ? 'bg-indigo-50 border border-indigo-100' : 'bg-white border border-transparent hover:bg-gray-100'}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white ${app.bg}`}>
                        <app.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-gray-700 flex-1">{app.name}</span>
                      {selectedAppIdsForCategory.includes(app.id) && <CheckCircle2 className="w-4 h-4 text-indigo-600" />}
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={isAddingCategory ? handleAddCategory : handleUpdateCategory}
                className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-colors mt-4 shadow-lg shadow-gray-200"
              >
                {isAddingCategory ? 'Create Group' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* === PRO 訂閱彈窗 (PRO Subscription Modal) === */}
      {showProModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md transition-all duration-300">
          <div className="bg-white w-full max-w-[1000px] rounded-[2.5rem] shadow-2xl overflow-hidden flex animate-in fade-in zoom-in-95 duration-300 relative">
            <button 
              onClick={() => setShowProModal(false)}
              className="absolute top-8 right-8 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* 左側：功能介紹 */}
            <div className="w-[45%] p-16 bg-white flex flex-col justify-center">
              <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
                Elevate to <span className="text-indigo-600">Premium</span>
              </h2>
              <p className="text-gray-400 text-sm font-medium mb-12 leading-relaxed">
                Unlock enterprise-grade features and accelerate your creative workflow.
              </p>

              <div className="space-y-10">
                {[
                  { icon: LayoutGrid, title: 'Unlimited Apps', desc: 'Build and deploy without any restrictions on project count or complexity.' },
                  { icon: Sparkles, title: 'Advanced AI Color', desc: 'Generate professional, accessible color palettes using proprietary AI algorithms.' },
                  { icon: ArrowDownUp, title: 'Real-time Analytics', desc: 'Deep dive into user behavior with enterprise-grade tracking and reporting.' },
                  { icon: Globe, title: 'Seamless Sync', desc: 'Experience instant cloud synchronization across all your desktop and mobile devices.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-gray-900 mb-1">{item.title}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 右側：方案選擇 */}
            <div className="flex-1 bg-gray-50/50 p-16 flex flex-col justify-center border-l border-gray-100">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8">Select Your Plan</span>
              
              <div className="space-y-4 mb-10">
                {/* Monthly */}
                <div 
                  onClick={() => setSelectedPlan('Monthly')}
                  className={`bg-white border-2 p-6 rounded-3xl shadow-sm flex items-center justify-between cursor-pointer transition-all group ${selectedPlan === 'Monthly' ? 'border-indigo-600 shadow-xl shadow-indigo-100' : 'border-transparent hover:border-indigo-100'}`}
                >
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-gray-900">Monthly</span>
                  </div>
                  <div className="text-2xl font-black text-gray-900">$12</div>
                </div>

                {/* 1 Year */}
                <div 
                  onClick={() => setSelectedPlan('1 Year')}
                  className={`bg-white border-2 p-6 rounded-3xl shadow-sm flex items-center justify-between cursor-pointer transition-all group ${selectedPlan === '1 Year' ? 'border-indigo-600 shadow-xl shadow-indigo-100' : 'border-transparent hover:border-indigo-100'}`}
                >
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-gray-900">1 Year</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Regularly $144</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-gray-900">$99</div>
                    <div className="text-[10px] text-indigo-600 font-black uppercase">$8.25/mo</div>
                  </div>
                </div>

                {/* 3 Years - Popular */}
                <div 
                  onClick={() => setSelectedPlan('3 Years')}
                  className={`bg-white border-2 p-6 rounded-3xl flex items-center justify-between cursor-pointer transition-all relative ${selectedPlan === '3 Years' ? 'border-indigo-600 shadow-xl shadow-indigo-100' : 'border-transparent hover:border-indigo-100 shadow-sm'}`}
                >
                  <div className="absolute -top-3 left-6 bg-red-500 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-red-200">Save $233</div>
                  <div className="flex flex-col">
                    <span className="text-lg font-black text-gray-900">3 Years</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Regularly $432</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-gray-900">$199</div>
                    <div className="text-[10px] text-indigo-600 font-black uppercase">$5.52/mo</div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="flex flex-wrap gap-6 mb-10 ml-2">
                {[
                  { id: 'WeChat Pay', label: 'WeChat Pay' },
                  { id: 'Alipay', label: 'Alipay' },
                  { id: 'Credit Card', label: 'Credit Card' }
                ].map((method) => (
                  <label 
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedPaymentMethod === method.id ? 'border-indigo-600' : 'border-gray-200 group-hover:border-indigo-300'}`}>
                      {selectedPaymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>}
                    </div>
                    <span className={`text-sm font-bold transition-colors ${selectedPaymentMethod === method.id ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-600'}`}>
                      {method.label}
                    </span>
                  </label>
                ))}
              </div>

              <button 
                onClick={() => {
                  alert(`Successfully subscribed to ${selectedPlan} using ${selectedPaymentMethod}!`);
                  setShowProModal(false);
                }}
                className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-lg shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-[0.98] mb-6"
              >
                Subscribe Now | 立即開通
              </button>

              <div className="text-center space-y-4">
                <p className="text-[9px] text-gray-400 font-medium leading-relaxed px-10">
                  By subscribing, you agree to our <a href="#" className="text-gray-600 underline">Terms of Service</a> & <a href="#" className="text-gray-600 underline">Auto-Renewal Agreement</a>. Securely processed and encrypted.
                </p>
                <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 30-Day Money-Back Guarantee
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
