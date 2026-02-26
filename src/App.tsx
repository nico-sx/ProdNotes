import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, Reorder } from 'motion/react';
import {
  Search, Zap, Layers, LayoutGrid, CalendarDays, ArrowDownUp, Star, StarHalf, Plus,
  ChevronDown, Download, Sparkles, PenLine, Calendar,
  Clock, Image as ImageIcon, Heart, ExternalLink, Pencil, Trash2,
  X, Music, Coffee, Plane, Film, Briefcase, HeartPulse, Book, Wrench, Building2, Users, Gamepad2, ShoppingBag, Shirt,
  Globe, Smartphone, Monitor, Apple, Upload, CheckCircle2, ChevronLeft, ChevronRight, GripVertical,
  CreditCard, Wallet, Bold, Italic, List
} from 'lucide-react';

// === 顏色工具函數 ===
const hexToHsl = (hex: string) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
};

const getColorGroup = (hex: string) => {
  const { h, s, l } = hexToHsl(hex);
  if (l < 15) return 'Black';
  if (l > 85) return 'White';
  if (s < 15) return 'Gray';

  if (h < 15) return 'Red';
  if (h < 35) return 'Red-Orange';
  if (h < 50) return 'Orange';
  if (h < 65) return 'Orange-Yellow';
  if (h < 85) return 'Yellow';
  if (h < 110) return 'Yellow-Green';
  if (h < 150) return 'Green';
  if (h < 170) return 'Green-Cyan';
  if (h < 195) return 'Cyan';
  if (h < 215) return 'Cyan-Blue';
  if (h < 245) return 'Blue';
  if (h < 270) return 'Blue-Purple';
  if (h < 295) return 'Purple';
  if (h < 320) return 'Purple-Pink';
  if (h < 340) return 'Pink';
  if (h < 360) return 'Pink-Red';
  return 'Red';
};

const groupToHex: Record<string, string> = {
  'Red': '#ef4444',
  'Red-Orange': '#f97316',
  'Orange': '#f59e0b',
  'Orange-Yellow': '#fbbf24',
  'Yellow': '#eab308',
  'Yellow-Green': '#84cc16',
  'Green': '#22c55e',
  'Green-Cyan': '#10b981',
  'Cyan': '#06b6d4',
  'Cyan-Blue': '#0ea5e9',
  'Blue': '#3b82f6',
  'Blue-Purple': '#6366f1',
  'Purple': '#8b5cf6',
  'Purple-Pink': '#a855f7',
  'Pink': '#ec4899',
  'Pink-Red': '#f43f5e',
  'Black': '#000000',
  'Gray': '#6b7280',
  'White': '#ffffff'
};

const extractColorsFromImage = (imageUrl: string): Promise<string[]> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve([]);
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const points = [
        [Math.floor(img.width / 2), Math.floor(img.height / 2)],
        [Math.floor(img.width / 4), Math.floor(img.height / 4)],
        [Math.floor(img.width * 3 / 4), Math.floor(img.height * 3 / 4)],
        [Math.floor(img.width / 4), Math.floor(img.height * 3 / 4)],
        [Math.floor(img.width * 3 / 4), Math.floor(img.height / 4)],
      ];
      
      const hexes: string[] = [];
      points.forEach(([x, y]) => {
        try {
          const data = ctx.getImageData(x, y, 1, 1).data;
          const hex = "#" + ((1 << 24) + (data[0] << 16) + (data[1] << 8) + data[2]).toString(16).slice(1);
          hexes.push(hex);
        } catch (e) {
          // Ignore cross-origin errors if any
        }
      });
      
      resolve(Array.from(new Set(hexes)));
    };
    img.onerror = () => resolve([]);
  });
};

// === 模擬數據定義 ===
const categories = [
  { name: 'All', icon: LayoutGrid },
  { name: 'Music', icon: Music },
  { name: 'Food & Drink', icon: Coffee },
  { name: 'Travel', icon: Plane },
  { name: 'Entertainment', icon: Film },
  { name: 'Productivity', icon: Briefcase },
  { name: 'Health & Fitness', icon: HeartPulse },
  { name: 'Reference', icon: Book },
  { name: 'Utilities', icon: Wrench },
  { name: 'Business', icon: Building2 },
  { name: 'Social Networking', icon: Users },
  { name: 'Games', icon: Gamepad2 },
  { name: 'Shopping', icon: ShoppingBag },
  { name: 'Lifestyle', icon: Shirt },
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
    icon: Calendar, hexColors: ['#60a5fa', '#6366f1'], bg: 'bg-gradient-to-br from-blue-400 to-indigo-600',
    starred: true, releaseDate: '2021-01-15', ageText: '3Y 2M', isPro: true,
    features: [
      { id: '1', title: 'Lightning Command Menu', description: 'Quickly perform any action with simple keyboard shortcuts and a unified search interface.', aspectRatio: '1:1', image: null },
      { id: '2', title: 'Ecosystem Integration', description: 'Seamlessly connect with Google Calendar, Outlook, Notion, and major video conferencing tools.', aspectRatio: '1:1', image: null }
    ],
    businessModel: {
      description: 'Cron follows a Freemium model. Basic features are free for individuals, while advanced team features require a subscription.',
      tiers: [
        { id: '1', name: 'Free', price: '0', cycle: 'forever', benefits: 'Up to 3 calendars\nBasic integrations\nStandard support' },
        { id: '2', name: 'Pro', price: '9.99', cycle: 'per month', benefits: 'Unlimited calendars\nAdvanced integrations\nPriority support\nTeam collaboration' }
      ]
    }
  },
  {
    id: 2, name: 'Notion', category: 'Productivity',
    description: 'The all-in-one workspace for your notes, tasks, wikis, and databases.',
    tags: ['Notes', 'Wiki', 'Collaboration'],
    downloadsNum: 150000000, downloadsText: '150.0 B', rating: '4.9',
    icon: PenLine, hexColors: ['#000000', '#6b7280', '#ffffff'], bg: 'bg-black',
    starred: true, releaseDate: '2016-03-01', ageText: '8Y 1M', isPro: false,
    features: [
      { id: '1', title: 'All-in-one Workspace', description: 'Write, plan, collaborate, and get organized. Notion is all you need — in one tool.', aspectRatio: '1:1', image: null },
      { id: '2', title: 'Infinite Customization', description: 'Build your own workflow with drag-and-drop blocks. Create the perfect workspace for you.', aspectRatio: '1:1', image: null }
    ],
    businessModel: {
      description: 'Notion is free for individuals. Teams can upgrade for advanced collaboration and admin tools.',
      tiers: [
        { id: '1', name: 'Personal', price: '0', cycle: 'forever', benefits: 'Unlimited pages\nShare with 5 guests\nSync across devices' },
        { id: '2', name: 'Plus', price: '8', cycle: 'per month', benefits: 'Unlimited blocks for teams\nUnlimited file uploads\n30-day page history' }
      ]
    }
  },
  {
    id: 3, name: 'Sparkles', category: 'Entertainment',
    description: 'Add magic to your daily photos with AI-powered sparkles.',
    tags: ['AI', 'Photo', 'Social'],
    downloadsNum: 100200000, downloadsText: '100.2 M', rating: '4.8',
    icon: Sparkles, hexColors: ['#8b5cf6', '#6366f1', '#ec4899'], bg: 'bg-gradient-to-br from-purple-500 to-indigo-600',
    starred: true, releaseDate: '2023-11-20', ageText: '4M', isPro: false,
    features: [
      { id: '1', title: 'AI Magic Sparkles', description: 'Automatically detect and enhance photos with magical AI-powered sparkle effects.', aspectRatio: '1:1', image: null },
      { id: '2', title: 'Instant Sharing', description: 'Share your magical creations instantly with friends on all major social platforms.', aspectRatio: '1:1', image: null }
    ],
    businessModel: {
      description: 'Sparkles is free to use with basic effects. Pro users get exclusive AI filters and high-res exports.',
      tiers: [
        { id: '1', name: 'Basic', price: '0', cycle: 'forever', benefits: 'Standard AI filters\nSD exports\nAd-supported' },
        { id: '2', name: 'Premium', price: '4.99', cycle: 'per month', benefits: 'Exclusive Pro filters\n4K exports\nNo ads\nEarly access' }
      ]
    }
  },
  {
    id: 4, name: 'Zapier', category: 'Utilities',
    description: 'Automate your workflows by connecting your favorite apps.',
    tags: ['Automation', 'No-code'],
    downloadsNum: 50000, downloadsText: '50.0 K', rating: '4.7',
    icon: Zap, hexColors: ['#f59e0b', '#fbbf24', '#f97316'], bg: 'bg-gradient-to-br from-rose-400 to-orange-500',
    starred: false, releaseDate: '2012-08-01', ageText: '11Y 6M', isPro: true,
    features: [
      { id: '1', title: 'Workflow Automation', description: 'Connect over 5,000 apps and automate your repetitive tasks without writing any code.', aspectRatio: '1:1', image: null },
      { id: '2', title: 'Multi-step Zaps', description: 'Create complex workflows that handle multiple tasks across different apps in a single run.', aspectRatio: '1:1', image: null }
    ],
    businessModel: {
      description: 'Zapier offers a free plan for basic automation. Paid plans unlock multi-step Zaps and premium apps.',
      tiers: [
        { id: '1', name: 'Free', price: '0', cycle: 'forever', benefits: '100 tasks/mo\nSingle-step Zaps\n15-min update time' },
        { id: '2', name: 'Starter', price: '19.99', cycle: 'per month', benefits: '750 tasks/mo\nMulti-step Zaps\n3 premium apps' }
      ]
    }
  }
];

// === 自定義下拉菜單組件 ===
const CustomSelect = ({ 
  label, 
  value, 
  options, 
  onChange, 
  icon: Icon,
  className = "" 
}: { 
  label?: string, 
  value: any, 
  options: { label: string, value: any }[], 
  onChange: (val: any) => void,
  icon?: any,
  className?: string
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div className="flex flex-col gap-1.5">
        {label && <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest ml-1">{label}</span>}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-white hover:border-indigo-100 transition-all shadow-sm"
        >
          <div className="flex items-center gap-2.5 truncate">
            {Icon && <Icon className="w-4 h-4 text-gray-400" />}
            <span className="truncate">{selectedOption?.label || 'Select...'}</span>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-200 max-h-[240px] overflow-y-auto custom-scrollbar">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center px-4 py-2.5 text-sm font-medium transition-colors ${
                value === opt.value 
                  ? 'bg-indigo-50 text-indigo-600 font-bold' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default function App() {
  // === 狀態管理 ===
  const [apps, setApps] = useState(initialApps);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeColorGroups, setActiveColorGroups] = useState<string[]>([]);
  const [isColorExpanded, setIsColorExpanded] = useState(false);
  const [activeYear, setActiveYear] = useState<number | null>(null);
  const [activeMonth, setActiveMonth] = useState<number | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortOption, setSortOption] = useState('date-desc');
  const [activeTab, setActiveTab] = useState<'all' | 'categories' | 'collections' | 'subscription'>('all');
  const [categoriesList, setCategoriesList] = useState(categories);
  const [collectionsList, setCollectionsList] = useState<any[]>([]);
  const [categorySortOption, setCategorySortOption] = useState('name-asc');
  const [collectionSortOption, setCollectionSortOption] = useState('name-asc');

  // 彈窗狀態
  const [selectedApp, setSelectedApp] = useState<any>(null); // 詳情彈窗
  const [isAddingNew, setIsAddingNew] = useState(false); // 新增彈窗
  const [isPro, setIsPro] = useState(false); // 是否為 PRO 用戶
  const [newAppColors, setNewAppColors] = useState<number[]>([]); // 新增 App 時選中的顏色 (Legacy)
  const [newAppHexColors, setNewAppHexColors] = useState<string[]>([]); // 新增 App 時提取的顏色
  const [extractedColors, setExtractedColors] = useState<string[]>([]); // 從圖片提取的所有顏色
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
  const [editingTierIndex, setEditingTierIndex] = useState<number | null>(null);
  const [tierForm, setTierForm] = useState({ name: '', price: '', currency: '$', cycle: 'per month', benefits: '' });
  const currencies = [
    { symbol: '$', name: 'USD' },
    { symbol: '€', name: 'EUR' },
    { symbol: '£', name: 'GBP' },
    { symbol: '¥', name: 'JPY' },
    { symbol: '₹', name: 'INR' },
    { symbol: '₩', name: 'KRW' },
    { symbol: 'A$', name: 'AUD' },
    { symbol: 'C$', name: 'CAD' },
    { symbol: 'R$', name: 'BRL' },
    { symbol: '₽', name: 'RUB' },
    { symbol: '₺', name: 'TRY' },
    { symbol: '฿', name: 'THB' },
    { symbol: '₫', name: 'VND' },
    { symbol: '₱', name: 'PHP' },
    { symbol: 'S$', name: 'SGD' },
    { symbol: 'HK$', name: 'HKD' },
    { symbol: 'NT$', name: 'TWD' },
    { symbol: '₪', name: 'ILS' },
    { symbol: 'zł', name: 'PLN' },
    { symbol: 'Kč', name: 'CZK' },
    { symbol: 'Ft', name: 'HUF' },
    { symbol: 'kr', name: 'SEK/NOK/DKK' },
    { symbol: 'RM', name: 'MYR' },
    { symbol: 'Rp', name: 'IDR' },
    { symbol: '₦', name: 'NGN' },
    { symbol: 'KSh', name: 'KES' },
    { symbol: 'R', name: 'ZAR' },
  ];
  const [viewingFullPageApp, setViewingFullPageApp] = useState<any>(null); // 全屏詳情頁
  const [editingCategory, setEditingCategory] = useState<any>(null); // 正在編輯的分類
  const [previewingGroup, setPreviewingGroup] = useState<any>(null); // 正在預覽的分類/組合
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

  // Chatbot 狀態
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'bot', content: string, apps?: any[] }[]>([
    { role: 'bot', content: 'Hello! I am your App Discovery assistant. What kind of app are you looking for today?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 自動滾動聊天到底部
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isBotTyping]);

  // 計算當前所有 App 使用到的顏色分組
  const usedColorGroups = useMemo(() => {
    const groups = new Set<string>();
    apps.forEach(app => {
      (app.hexColors || []).forEach(hex => {
        groups.add(getColorGroup(hex));
      });
    });
    
    const groupOrder = Object.keys(groupToHex);
    return Array.from(groups).sort((a, b) => groupOrder.indexOf(a) - groupOrder.indexOf(b));
  }, [apps]);

  // 計算每個分類/組合下的應用數量
  const groupCounts = useMemo(() => {
    const counts: Record<string, number> = { All: apps.length };
    apps.forEach(app => {
      if (app.category) {
        counts[app.category] = (counts[app.category] || 0) + 1;
      }
      if (app.collection) {
        counts[`col_${app.collection}`] = (counts[`col_${app.collection}`] || 0) + 1;
      }
    });
    return counts;
  }, [apps]);

  // Chatbot 搜尋邏輯
  const handleChatSubmit = async () => {
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setChatInput('');
    setIsBotTyping(true);

    // 模擬搜尋邏輯
    setTimeout(() => {
      const query = userMsg.toLowerCase();
      
      // 自然語言溝通處理
      const helpKeywords = ['what can you do', 'help', '功能', '你能做什麼', '可以幫什麼', 'how to use'];
      if (helpKeywords.some(k => query.includes(k))) {
        setChatMessages(prev => [...prev, { 
          role: 'bot', 
          content: "I am your App Discovery assistant! I can help you find the perfect apps based on your needs. Just describe what you're looking for (e.g., 'a black productivity tool' or 'apps with subscription models'), and I'll search through our collection using fuzzy matching to find the best matches for you." 
        }]);
        setIsBotTyping(false);
        return;
      }

      const matchedApps = apps.filter(app => {
        const nameMatch = app.name.toLowerCase().includes(query);
        const sloganMatch = app.description.toLowerCase().includes(query);
        const featuresMatch = (app.features || []).some((f: any) => 
          f.title.toLowerCase().includes(query) || f.description.toLowerCase().includes(query)
        );
        const businessMatch = app.businessModel?.description?.toLowerCase().includes(query) || 
          (app.businessModel?.tiers || []).some((t: any) => t.benefits.toLowerCase().includes(query));
        
        return nameMatch || sloganMatch || featuresMatch || businessMatch;
      });

      if (matchedApps.length > 0) {
        setChatMessages(prev => [...prev, { 
          role: 'bot', 
          content: `I found ${matchedApps.length} apps that might match your needs:`,
          apps: matchedApps 
        }]);
      } else {
        setChatMessages(prev => [...prev, { 
          role: 'bot', 
          content: "I'm sorry, I couldn't find any apps with those specific features in our current collection." 
        }]);
      }
      setIsBotTyping(false);
    }, 1000);
  };

  // 處理分類/組合 CRUD
  const handleAddGroup = () => {
    if (!newCategoryName.trim()) return;
    const newGroup = {
      name: newCategoryName,
      icon: newCategoryIcon
    };

    const isCollection = activeTab === 'collections';

    // 更新 App 的分類/組合
    if (selectedAppIdsForCategory.length > 0) {
      setApps(apps.map(app => 
        selectedAppIdsForCategory.includes(app.id) 
          ? { ...app, [isCollection ? 'collection' : 'category']: newCategoryName } 
          : app
      ));
    }

    if (isCollection) {
      setCollectionsList([...collectionsList, newGroup]);
    } else {
      setCategoriesList([...categoriesList, newGroup]);
    }
    
    setIsAddingCategory(false);
    setNewCategoryName('');
    setNewCategoryIcon(LayoutGrid);
    setSelectedAppIdsForCategory([]);
    setCategoryAppSearchQuery('');
  };

  const handleUpdateGroup = () => {
    if (!editingCategory || !newCategoryName.trim()) return;
    
    const isCollection = activeTab === 'collections';
    const field = isCollection ? 'collection' : 'category';

    // 更新 App 的分類/組合 (如果名稱改變)
    if (editingCategory.name !== newCategoryName) {
      setApps(apps.map(app => 
        app[field] === editingCategory.name 
          ? { ...app, [field]: newCategoryName } 
          : app
      ));
    }

    // 更新選中的 App 分類/組合 (包含取消選中的)
    setApps(prevApps => prevApps.map(app => {
      if (selectedAppIdsForCategory.includes(app.id)) {
        return { ...app, [field]: newCategoryName };
      } else if (app[field] === editingCategory.name) {
        // 如果原本在這個分類/組合中，但現在沒被選中，則清除
        return { ...app, [field]: undefined };
      }
      return app;
    }));

    if (isCollection) {
      const updatedList = collectionsList.map(cat => 
        cat.name === editingCategory.name 
          ? { ...cat, name: newCategoryName, icon: newCategoryIcon }
          : cat
      );
      setCollectionsList(updatedList);
    } else {
      const updatedList = categoriesList.map(cat => 
        cat.name === editingCategory.name 
          ? { ...cat, name: newCategoryName, icon: newCategoryIcon }
          : cat
      );
      setCategoriesList(updatedList);
    }
    
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
    setNewAppHexColors(app.hexColors || []);
    setExtractedColors(app.hexColors || []);
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

  const handleDeleteGroup = (name: string) => {
    const isCollection = activeTab === 'collections';
    if (isCollection) {
      setCollectionsList(collectionsList.filter(c => c.name !== name));
    } else {
      setCategoriesList(categoriesList.filter(c => c.name !== name));
    }
    if (activeCategory === name) setActiveCategory('All');
  };

  const sortedGroups = useMemo(() => {
    const list = activeTab === 'collections' ? collectionsList : categoriesList;
    const sortOption = activeTab === 'collections' ? collectionSortOption : categorySortOption;
    
    return [...list].sort((a, b) => {
      if (sortOption === 'name-asc') return a.name.localeCompare(b.name);
      if (sortOption === 'name-desc') return b.name.localeCompare(a.name);
      return 0;
    });
  }, [activeTab, categoriesList, collectionsList, categorySortOption, collectionSortOption]);

  const maxApps = 500;

  // === 核心過濾與排序邏輯 ===
  const filteredAndSortedApps = useMemo(() => {
    let result = [...apps];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(app => {
        const nameMatch = app.name.toLowerCase().includes(q);
        const sloganMatch = app.description.toLowerCase().includes(q);
        const featuresMatch = (app.features || []).some((f: any) => 
          f.title.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)
        );
        const businessMatch = app.businessModel?.description?.toLowerCase().includes(q) || 
          (app.businessModel?.tiers || []).some((t: any) => t.benefits.toLowerCase().includes(q));
        
        return nameMatch || sloganMatch || featuresMatch || businessMatch;
      });
    }
    if (activeCategory !== 'All') {
      result = result.filter(app => app.category === activeCategory || app.collection === activeCategory);
    }
    if (activeColorGroups.length > 0) {
      result = result.filter(app => 
        (app.hexColors || []).some(hex => activeColorGroups.includes(getColorGroup(hex)))
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
    if (viewingFullPageApp && viewingFullPageApp.id === appId) {
      setViewingFullPageApp({ ...viewingFullPageApp, starred: !viewingFullPageApp.starred });
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
                    <Wallet className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">Business Model</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed mb-12 font-medium max-w-2xl">
                  {app.businessModel?.description || 'No business model description provided.'}
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                    <Building2 className="w-4 h-4" /> Subscription Plans
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    {app.businessModel?.tiers && app.businessModel.tiers.length > 0 ? (
                      app.businessModel.tiers.map((tier: any, i: number) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full -mr-16 -mt-16"></div>
                          <div className="mb-8">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2 block">{tier.name}</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-4xl font-black">{tier.currency || '$'}{tier.price}</span>
                              <span className="text-xs text-gray-500 font-bold">/{tier.cycle}</span>
                            </div>
                          </div>
                          <div className="space-y-4">
                            {tier.benefits.split('\n').filter((b: string) => b.trim()).map((item: string, j: number) => (
                              <div key={j} className="flex items-center gap-3 text-xs text-gray-300 font-medium">
                                <CheckCircle2 className="w-4 h-4 text-indigo-500" /> {item}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 bg-white/5 border border-white/10 border-dashed rounded-[2.5rem] p-10 text-center text-gray-500 font-bold">
                        No subscription plans added yet.
                      </div>
                    )}
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
              <div className="flex flex-wrap gap-3">
                {app.hexColors && app.hexColors.length > 0 ? (
                  app.hexColors.map((hex: string, i: number) => (
                    <div key={i} className="group relative">
                      <div 
                        className="w-10 h-10 rounded-xl shadow-sm cursor-pointer hover:scale-110 transition-transform" 
                        style={{ backgroundColor: hex }}
                      ></div>
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-[8px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {hex}
                      </div>
                    </div>
                  ))
                ) : (
                  ['bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-rose-500', 'bg-orange-500', 'bg-yellow-400'].map((c, i) => (
                    <div key={i} className={`w-10 h-10 rounded-xl ${c} shadow-sm cursor-pointer hover:scale-110 transition-transform`}></div>
                  ))
                )}
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100/50 space-y-8">
              <div>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">Metadata</p>
                <div className="space-y-6">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Category</p>
                    <span className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-[11px] font-bold">{app.category}</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {app.tags && app.tags.length > 0 ? (
                        app.tags.map((tag: string) => (
                          <span key={tag} className="bg-white border border-gray-100 text-gray-400 px-3 py-1.5 rounded-lg text-[10px] font-bold">{tag}</span>
                        ))
                      ) : (
                        ['Illustration', 'SVG Editor', 'Vector Art', 'Graphic Design'].map(tag => (
                          <span key={tag} className="bg-white border border-gray-100 text-gray-400 px-3 py-1.5 rounded-lg text-[10px] font-bold">{tag}</span>
                        ))
                      )}
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
          <button 
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors w-full text-left text-sm font-medium ${activeTab === 'categories' ? 'bg-gray-100 text-gray-900 font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <LayoutGrid className={`w-4 h-4 ${activeTab === 'categories' ? 'text-indigo-600' : ''}`} /> Categories
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-0.5 custom-scrollbar">
          {(activeTab === 'collections' ? collectionsList : categoriesList).filter(cat => cat.name === 'All' || (groupCounts[cat.name] || 0) > 0 || (activeTab === 'collections' && (groupCounts[`col_${cat.name}`] || 0) > 0)).map((cat) => (
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
                {activeTab === 'collections' ? (groupCounts[`col_${cat.name}`] || 0) : (groupCounts[cat.name] || 0)}
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
          {isPro ? (
            <div className="w-full bg-emerald-50 text-emerald-600 py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-black border border-emerald-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              PRO STATUS ACTIVE
            </div>
          ) : (
            <button 
              onClick={() => setShowProModal(true)}
              className="w-full bg-[#0B1021] text-white py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold hover:bg-gray-900 transition-colors"
            >
              <Zap className="w-4 h-4 fill-current text-yellow-400" /> PRO
            </button>
          )}
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
                    setNewAppHexColors([]);
                    setExtractedColors([]);
                    setNewAppLogo(null);
                    setNewAppScreenshots([]);
                    setNewAppRating('4.5');
                    setNewAppFeatures([]);
                    setNewAppBusinessModel({ description: '', tiers: [] });
                    setNewAppPlatformDownloads({});
                  }}
                  className="bg-black text-white px-6 h-11 rounded-xl shadow-sm flex items-center gap-2 text-sm font-bold hover:bg-gray-800 transition-all active:scale-95 ml-2"
                >
                  <Plus className="w-4 h-4" strokeWidth={3} /> Add App
                </button>
              </div>
            </div>

            {/* 顏色過濾器與年份篩選對齊 */}
            <div className="flex items-start gap-4 mb-10">
              <div className="bg-white rounded-[2rem] px-6 py-4 shadow-sm flex flex-col gap-4 border border-gray-100/50 flex-1 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] font-bold text-gray-300 tracking-widest uppercase">Color</span>
                    <div className="flex flex-wrap items-center gap-3">
                      {(isColorExpanded ? usedColorGroups : usedColorGroups.slice(0, 12)).map((groupName) => (
                        <button
                          key={groupName}
                          onClick={() => {
                            if (activeColorGroups.includes(groupName)) {
                              setActiveColorGroups(activeColorGroups.filter(g => g !== groupName));
                            } else {
                              setActiveColorGroups([...activeColorGroups, groupName]);
                            }
                          }}
                          title={groupName}
                          className={`w-5 h-5 rounded-full transition-all flex-shrink-0 border-2 ${activeColorGroups.includes(groupName) ? 'border-gray-900 scale-110 shadow-md' : 'border-transparent hover:scale-125'}`}
                          style={{ backgroundColor: groupToHex[groupName] }}
                        />
                      ))}
                    </div>
                  </div>
                  
                  {/* 展開按鈕 */}
                  {usedColorGroups.length > 12 && (
                    <button 
                      onClick={() => setIsColorExpanded(!isColorExpanded)}
                      className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-indigo-600 transition-all"
                    >
                      <ChevronDown className={`w-4 h-4 transition-transform ${isColorExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CustomSelect 
                  label="Year"
                  value={activeYear}
                  options={[
                    { label: 'All', value: null },
                    ...Array.from(new Set(apps.map(app => new Date(app.releaseDate).getFullYear()))).sort((a, b) => (b as number) - (a as number)).map(year => ({ label: year.toString(), value: year }))
                  ]}
                  onChange={(val) => {
                    setActiveYear(val);
                    if (val) setActiveMonth(null);
                  }}
                  className="w-32"
                />
                <CustomSelect 
                  label="Month"
                  value={activeMonth}
                  options={[
                    { label: 'All', value: null },
                    ...Array.from({ length: 12 }, (_, i) => ({ 
                      label: new Date(2000, i).toLocaleString('default', { month: 'short' }), 
                      value: i + 1 
                    }))
                  ]}
                  onChange={(val) => {
                    setActiveMonth(val);
                    if (val) setActiveYear(null);
                  }}
                  className="w-32"
                />
              </div>
            </div>

            {/* 網格列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {filteredAndSortedApps.map((app) => (
                <div key={app.id} onClick={() => setSelectedApp(app)} className="flex flex-col group cursor-pointer relative">
                  <div className="bg-white rounded-[2.5rem] aspect-square p-6 shadow-sm mb-4 relative transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 overflow-hidden">
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
        ) : (activeTab === 'categories' || activeTab === 'collections') ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-start justify-between mb-12">
              <div>
                <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Manage {activeTab === 'categories' ? 'Categories' : 'Collections'}</h2>
                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Organize your application groups</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="bg-white rounded-2xl px-6 py-3 shadow-sm border border-gray-100/50 flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 uppercase">Sort</span>
                  <button 
                    onClick={() => {
                      if (activeTab === 'categories') {
                        setCategorySortOption(categorySortOption === 'name-asc' ? 'name-desc' : 'name-asc');
                      } else {
                        setCollectionSortOption(collectionSortOption === 'name-asc' ? 'name-desc' : 'name-asc');
                      }
                    }}
                    className="flex items-center gap-2 text-sm font-black text-gray-900 hover:text-indigo-600 transition-colors"
                  >
                    {(activeTab === 'categories' ? categorySortOption : collectionSortOption) === 'name-asc' ? 'A-Z' : 'Z-A'}
                    <ChevronDown className={`w-4 h-4 transition-transform ${(activeTab === 'categories' ? categorySortOption : collectionSortOption) === 'name-desc' ? 'rotate-180' : ''}`} />
                  </button>
                </div>
                <button 
                  onClick={() => {
                    setIsAddingCategory(true);
                    setNewCategoryName('');
                    setNewCategoryIcon(LayoutGrid);
                    setCategoryAppSearchQuery('');
                    setSelectedAppIdsForCategory([]);
                  }}
                  className="bg-indigo-600 text-white px-8 h-14 rounded-2xl shadow-lg shadow-indigo-200 flex items-center gap-3 text-sm font-bold hover:bg-indigo-700 transition-all active:scale-95"
                >
                  <Plus className="w-5 h-5" strokeWidth={3} /> Add {activeTab === 'categories' ? 'Category' : 'Collection'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedGroups.map((cat) => (
                <div 
                  key={cat.name} 
                  onClick={() => setPreviewingGroup(cat)}
                  className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100/50 group hover:shadow-xl transition-all duration-300 relative overflow-hidden cursor-pointer"
                >
                  <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCategory(cat);
                        setNewCategoryName(cat.name);
                        setNewCategoryIcon(cat.icon);
                        setCategoryAppSearchQuery('');
                        // 找出屬於該分類/組合的 App ID
                        const field = activeTab === 'collections' ? 'collection' : 'category';
                        const appIds = apps.filter(a => a[field] === cat.name).map(a => a.id);
                        setSelectedAppIdsForCategory(appIds);
                      }}
                      className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGroup(cat.name);
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
                    <span className="text-sm text-gray-400 font-bold">
                      {activeTab === 'collections' ? (groupCounts[`col_${cat.name}`] || 0) : (groupCounts[cat.name] || 0)} Apps
                    </span>
                    <div className="flex -space-x-3">
                      {apps.filter(a => (activeTab === 'collections' ? a.collection : a.category) === cat.name).slice(0, 4).map((app, i) => (
                        <div key={app.id} className={`w-9 h-9 rounded-xl border-2 border-white flex items-center justify-center text-white text-[8px] font-bold ${app.bg} shadow-sm overflow-hidden`}>
                          {app.logo ? (
                            <img src={app.logo} className="w-full h-full object-cover" alt={app.name} />
                          ) : (
                            <app.icon className="w-4 h-4" />
                          )}
                        </div>
                      ))}
                      {(activeTab === 'collections' ? (groupCounts[`col_${cat.name}`] || 0) : (groupCounts[cat.name] || 0)) > 4 && (
                        <div className="w-9 h-9 rounded-xl border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-black text-gray-400">
                          +{(activeTab === 'collections' ? (groupCounts[`col_${cat.name}`] || 0) : (groupCounts[cat.name] || 0)) - 4}
                        </div>
                      )}
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
                          reader.onload = async (event: any) => {
                            const logoUrl = event.target.result;
                            setNewAppLogo(logoUrl);
                            setIsExtractingColors(true);
                            const extracted = await extractColorsFromImage(logoUrl);
                            setExtractedColors(extracted);
                            setNewAppHexColors(extracted); // 預設選中所有提取的顏色
                            setIsExtractingColors(false);
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
                  {newAppLogo && (
                    <div className="flex flex-col items-center gap-4">
                      <div className="flex flex-wrap justify-center gap-2.5 max-w-[180px]">
                        {extractedColors.map((hex, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => {
                              if (newAppHexColors.includes(hex)) {
                                setNewAppHexColors(newAppHexColors.filter(c => c !== hex));
                              } else {
                                setNewAppHexColors([...newAppHexColors, hex]);
                              }
                            }}
                            title={getColorGroup(hex)}
                            className={`w-7 h-7 rounded-full border-2 shadow-sm cursor-pointer transition-all hover:scale-110 ${newAppHexColors.includes(hex) ? 'border-indigo-600 scale-110 ring-2 ring-indigo-100' : 'border-white opacity-40'}`} 
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Brand Colors</span>
                    </div>
                  )}
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
                    <CustomSelect 
                      value={newAppCategory}
                      options={categoriesList.map(c => ({ label: c.name, value: c.name }))}
                      onChange={(val) => setNewAppCategory(val)}
                    />
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
                    <CustomSelect 
                      value={newAppTeamType}
                      options={[
                        { label: 'Individual', value: 'Individual' },
                        { label: 'Studio', value: 'Studio' },
                        { label: 'Company', value: 'Company' }
                      ]}
                      onChange={(val) => setNewAppTeamType(val)}
                    />
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
                    if (newAppFeatures.length >= 50) return;
                    setNewAppFeatures([{
                      id: Date.now().toString(),
                      image: null,
                      aspectRatio: '1:1',
                      title: '',
                      description: ''
                    }, ...newAppFeatures]);
                  }}
                  className={`w-full py-10 rounded-[2.5rem] bg-gray-50/50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white hover:border-indigo-300 transition-all cursor-pointer group ${newAppFeatures.length >= 50 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform"><Plus className="w-5 h-5 text-indigo-500" /></div>
                    <span className="text-[11px] font-black uppercase tracking-widest">Add New Feature Block ({newAppFeatures.length}/50)</span>
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

              {/* 第五部分：商業模式編輯 */}
              <div className="space-y-6 pt-6 border-t border-gray-100">
                <div className="flex items-center justify-between ml-4">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-indigo-500" />
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Business Model</label>
                  </div>
                  {newAppBusinessModel.tiers.length < 9 && editingTierIndex === null && (
                    <button 
                      onClick={() => {
                        setEditingTierIndex(-1); // -1 means adding new
                        setTierForm({ name: '', price: '', currency: '$', cycle: 'per month', benefits: '' });
                      }}
                      className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-colors"
                    >
                      <Plus className="w-3 h-3" /> Add New Tier
                    </button>
                  )}
                </div>

                <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-gray-300 uppercase ml-2">Model Description</label>
                    <textarea 
                      value={newAppBusinessModel.description}
                      onChange={(e) => setNewAppBusinessModel({ ...newAppBusinessModel, description: e.target.value })}
                      placeholder="e.g. Lumina follows a Freemium model. Basic tools and 5 projects are available for free."
                      className="w-full bg-gray-50 rounded-xl px-4 py-3 text-xs font-medium text-gray-500 outline-none resize-none h-20 border border-transparent focus:border-indigo-100 transition-all" 
                    />
                  </div>

                  {editingTierIndex !== null && (
                    <div className="bg-indigo-50/30 border border-indigo-100 rounded-[2rem] p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-indigo-400 uppercase ml-2">Tier Name</label>
                        <input 
                          type="text" 
                          value={tierForm.name}
                          onChange={(e) => setTierForm({ ...tierForm, name: e.target.value })}
                          placeholder="e.g. Enterprise Plan"
                          className="w-full bg-white rounded-xl px-4 py-3 text-sm font-bold text-gray-700 outline-none border border-indigo-100 focus:border-indigo-300 transition-all" 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-indigo-400 uppercase ml-2">Price & Currency</label>
                          <div className="flex gap-2">
                            <select 
                              value={tierForm.currency}
                              onChange={(e) => setTierForm({ ...tierForm, currency: e.target.value })}
                              className="w-24 bg-white rounded-xl px-3 py-3 text-sm font-bold text-gray-700 outline-none border border-indigo-100 focus:border-indigo-300 transition-all appearance-none cursor-pointer"
                            >
                              {currencies.map(c => (
                                <option key={c.symbol} value={c.symbol}>{c.symbol} ({c.name})</option>
                              ))}
                            </select>
                            <div className="relative flex-1">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">{tierForm.currency}</span>
                              <input 
                                type="text" 
                                value={tierForm.price}
                                onChange={(e) => setTierForm({ ...tierForm, price: e.target.value })}
                                placeholder="29.99"
                                className="w-full bg-white rounded-xl pl-8 pr-4 py-3 text-sm font-bold text-gray-700 outline-none border border-indigo-100 focus:border-indigo-300 transition-all" 
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-indigo-400 uppercase ml-2">Billing Cycle</label>
                          <select 
                            value={tierForm.cycle}
                            onChange={(e) => setTierForm({ ...tierForm, cycle: e.target.value })}
                            className="w-full bg-white rounded-xl px-4 py-3 text-sm font-bold text-gray-700 outline-none border border-indigo-100 focus:border-indigo-300 transition-all appearance-none cursor-pointer"
                          >
                            <option value="per month">per month</option>
                            <option value="per year">per year</option>
                            <option value="forever">forever</option>
                            <option value="one-time">one-time</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between ml-2">
                          <label className="text-[9px] font-bold text-indigo-400 uppercase">Plan Benefits</label>
                          <div className="flex gap-2">
                            <Bold className="w-3 h-3 text-gray-400 cursor-pointer hover:text-indigo-500" />
                            <Italic className="w-3 h-3 text-gray-400 cursor-pointer hover:text-indigo-500" />
                            <List className="w-3 h-3 text-gray-400 cursor-pointer hover:text-indigo-500" />
                          </div>
                        </div>
                        <textarea 
                          value={tierForm.benefits}
                          onChange={(e) => setTierForm({ ...tierForm, benefits: e.target.value })}
                          placeholder="Enter plan benefits..."
                          className="w-full bg-white rounded-xl px-4 py-3 text-xs font-medium text-gray-500 outline-none resize-none h-32 border border-indigo-100 focus:border-indigo-300 transition-all" 
                        />
                      </div>
                      <div className="flex gap-3 pt-2">
                        <button 
                          onClick={() => setEditingTierIndex(null)}
                          className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 bg-white border border-gray-100 hover:bg-gray-50 transition-all"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => {
                            if (!tierForm.name) return;
                            const updatedTiers = [...newAppBusinessModel.tiers];
                            if (editingTierIndex === -1) {
                              updatedTiers.push({ ...tierForm, id: Date.now().toString() });
                            } else {
                              updatedTiers[editingTierIndex] = { ...tierForm, id: updatedTiers[editingTierIndex].id };
                            }
                            setNewAppBusinessModel({ ...newAppBusinessModel, tiers: updatedTiers });
                            setEditingTierIndex(null);
                          }}
                          className="flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white bg-indigo-600 shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {newAppBusinessModel.tiers.map((tier, tIdx) => (
                      <div key={tier.id} className="bg-gray-50/50 border border-gray-100 rounded-2xl p-5 relative group">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-[8px] font-black text-indigo-400 uppercase tracking-widest mb-1">{tier.name}</p>
                            <div className="flex items-baseline gap-1">
                              <span className="text-xl font-black text-gray-900">{tier.currency || '$'}{tier.price}</span>
                              <span className="text-[9px] text-gray-400 font-bold">/{tier.cycle}</span>
                            </div>
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={() => {
                                setEditingTierIndex(tIdx);
                                setTierForm({ ...tier });
                              }}
                              className="p-1.5 text-gray-400 hover:text-indigo-500 transition-colors"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                            <button 
                              onClick={() => {
                                const updatedTiers = newAppBusinessModel.tiers.filter((_, i) => i !== tIdx);
                                setNewAppBusinessModel({ ...newAppBusinessModel, tiers: updatedTiers });
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          {tier.benefits.split('\n').filter((b: string) => b.trim()).map((benefit: string, bIdx: number) => (
                            <div key={bIdx} className="flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3 text-indigo-500" />
                              <span className="text-[10px] text-gray-500 font-medium">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
                  if (!newAppName.trim() || !newAppCategory) {
                    alert('Product Name and Category are required!');
                    return;
                  }
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
                          hexColors: newAppHexColors,
                          bg: newAppHexColors.length > 0 ? `bg-[${newAppHexColors[0]}]` : 'bg-gray-900',
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
                      hexColors: newAppHexColors,
                      bg: newAppHexColors.length > 0 ? `bg-[${newAppHexColors[0]}]` : 'bg-gray-900',
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
                  setNewAppHexColors([]);
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
                        <Wallet className="w-5 h-5 text-indigo-400" />
                      </div>
                      <h3 className="text-lg font-black tracking-tight">Business Model</h3>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed mb-8 font-medium">
                      {selectedApp.businessModel?.description || 'No business model description provided.'}
                    </p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">
                        <Building2 className="w-3 h-3" /> Subscription Plans
                      </div>
                      <div className="space-y-4">
                        {selectedApp.businessModel?.tiers && selectedApp.businessModel.tiers.length > 0 ? (
                          selectedApp.businessModel.tiers.map((tier: any, i: number) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                              <div className="flex items-baseline gap-2 mb-4">
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{tier.name}</span>
                                <div className="flex items-baseline gap-1">
                                  <span className="text-2xl font-black">{tier.currency || '$'}{tier.price}</span>
                                  <span className="text-[10px] text-gray-500 font-bold">/{tier.cycle}</span>
                                </div>
                              </div>
                              <div className="space-y-2">
                                {tier.benefits.split('\n').filter((b: string) => b.trim()).map((item: string, j: number) => (
                                  <div key={j} className="flex items-center gap-2 text-[11px] text-gray-300 font-medium">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" /> {item}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="bg-white/5 border border-white/10 border-dashed rounded-2xl p-6 text-center text-gray-500 font-bold text-[10px]">
                            No subscription plans added yet.
                          </div>
                        )}
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
      {/* === 分類/組合預覽彈窗 (Group Preview Modal) === */}
      {previewingGroup && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white w-full max-w-[600px] rounded-[2.5rem] shadow-2xl p-10 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center shadow-sm">
                  <previewingGroup.icon className="w-10 h-10 text-indigo-600 stroke-[1.5]" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-gray-900 mb-1">{previewingGroup.name}</h2>
                  <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">
                    {activeTab === 'collections' ? 'Collection' : 'Category'} • {activeTab === 'collections' ? (groupCounts[`col_${previewingGroup.name}`] || 0) : (groupCounts[previewingGroup.name] || 0)} Apps
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setPreviewingGroup(null)}
                className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-gray-50 rounded-[2rem] p-8 mb-8 max-h-[500px] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 gap-4">
                {apps.filter(a => (activeTab === 'collections' ? a.collection : a.category) === previewingGroup.name).map(app => (
                  <div key={app.id} className="bg-white p-6 rounded-3xl flex items-center gap-6 shadow-sm border border-gray-100/50 hover:shadow-md transition-shadow">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white ${app.bg} overflow-hidden flex-shrink-0`}>
                      {app.logo ? (
                        <img src={app.logo} className="w-full h-full object-cover" alt={app.name} />
                      ) : (
                        <app.icon className="w-8 h-8" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-lg text-gray-900 mb-1">{app.name}</h4>
                      <p className="text-sm text-gray-400 font-medium line-clamp-1">{app.description}</p>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedApp(app);
                        setPreviewingGroup(null);
                      }}
                      className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                {apps.filter(a => (activeTab === 'collections' ? a.collection : a.category) === previewingGroup.name).length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-200">
                      <LayoutGrid className="w-8 h-8" />
                    </div>
                    <p className="text-sm text-gray-400 font-bold">No apps in this group yet</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => {
                  setEditingCategory(previewingGroup);
                  setNewCategoryName(previewingGroup.name);
                  setNewCategoryIcon(previewingGroup.icon);
                  setCategoryAppSearchQuery('');
                  const field = activeTab === 'collections' ? 'collection' : 'category';
                  const appIds = apps.filter(a => a[field] === previewingGroup.name).map(a => a.id);
                  setSelectedAppIdsForCategory(appIds);
                  setPreviewingGroup(null);
                }}
                className="flex-1 bg-gray-100 text-gray-900 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <Pencil className="w-4 h-4" /> Edit Group
              </button>
              <button 
                onClick={() => {
                  handleDeleteGroup(previewingGroup.name);
                  setPreviewingGroup(null);
                }}
                className="flex-1 bg-red-50 text-red-600 py-4 rounded-2xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> Delete Group
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === 分類管理彈窗 (Add/Edit Category Modal) === */}
      {(isAddingCategory || editingCategory) && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white w-full max-w-[900px] rounded-[2.5rem] shadow-2xl p-10 animate-in fade-in zoom-in-95 duration-200 flex gap-10">
            {/* Left Side: Name and Icon */}
            <div className="w-[350px] space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-gray-900">{isAddingCategory ? 'New ' + (activeTab === 'collections' ? 'Collection' : 'Category') : 'Edit Group'}</h2>
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
              </div>
              
              <button 
                onClick={isAddingCategory ? handleAddGroup : handleUpdateGroup}
                className="w-full bg-black text-white py-4 rounded-2xl font-bold hover:bg-gray-800 transition-colors mt-4 shadow-lg shadow-gray-200"
              >
                {isAddingCategory ? 'Create Group' : 'Save Changes'}
              </button>
            </div>

            {/* Right Side: Search and App Menu */}
            <div className="flex-1 space-y-6">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-gray-400 uppercase ml-4">Add Apps to Group</label>
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
              
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={categoryAppSearchQuery}
                  onChange={(e) => setCategoryAppSearchQuery(e.target.value)}
                  placeholder="Search apps to add..."
                  className="w-full bg-gray-50 rounded-xl pl-11 pr-4 py-3 text-sm outline-none border border-transparent focus:border-indigo-100 transition-all"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl max-h-[400px] overflow-y-auto custom-scrollbar space-y-2">
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
          </div>
        </div>
      )}
      {/* === Chatbot UI === */}
      <div className="fixed bottom-8 right-8 z-[60]">
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-16 h-16 bg-indigo-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Sparkles className="w-8 h-8 text-white relative z-10" />
          {/* Cute IP Avatar Indicator */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></div>
        </button>
      </div>

      {/* === Chatbot UI === */}
      <div className="fixed bottom-8 right-8 z-[60]">
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-16 h-16 bg-indigo-600 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <Sparkles className="w-8 h-8 text-white relative z-10" />
          {/* Cute IP Avatar Indicator */}
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></div>
        </button>

        {isChatOpen && (
          <div className="absolute bottom-20 right-0 w-[400px] max-h-[calc(100vh-160px)] bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
            <div className="bg-indigo-600 p-6 text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">App Discovery Bot</h3>
                  <p className="text-[10px] text-indigo-200">Online • AI Assistant</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/10 p-2 rounded-lg transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gray-50/50">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none'}`}>
                    {msg.content}
                    {msg.apps && (
                      <div className="mt-4 space-y-3">
                        {msg.apps.map(app => (
                          <div 
                            key={app.id} 
                            onClick={() => {
                              setSelectedApp(app);
                              setIsChatOpen(false);
                            }}
                            className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center gap-3 cursor-pointer hover:bg-indigo-50 hover:border-indigo-100 transition-all"
                          >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${app.bg} overflow-hidden`}>
                              {app.logo ? <img src={app.logo} className="w-full h-full object-cover" /> : <app.icon className="w-5 h-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-xs text-gray-900 truncate">{app.name}</p>
                              <p className="text-[10px] text-gray-400 truncate">{app.description}</p>
                            </div>
                            <ExternalLink className="w-3 h-3 text-gray-300" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isBotTyping && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-400 shadow-sm border border-gray-100 rounded-2xl rounded-tl-none p-4 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-200 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-gray-200 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-gray-200 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-100">
              <div className="relative">
                <input 
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleChatSubmit()}
                  placeholder="Tell me what app you need..."
                  className="w-full bg-gray-50 rounded-2xl pl-4 pr-12 py-3 text-sm outline-none border border-transparent focus:border-indigo-100 transition-all"
                />
                <button 
                  onClick={handleChatSubmit}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 transition-colors"
                >
                  <ArrowDownUp className="w-4 h-4 rotate-90" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      {showProModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md transition-all duration-300">
          <div className="bg-white w-full max-w-[700px] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-300 relative">
            <button 
              onClick={() => setShowProModal(false)}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left Side: Features */}
            <div className="flex-1 bg-indigo-600 p-10 text-white">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-white fill-current" />
              </div>
              <h2 className="text-3xl font-black mb-4 tracking-tight">Go Pro</h2>
              <p className="text-indigo-100 text-sm font-medium mb-10 leading-relaxed">
                Unlock full potential with our premium features designed for power users.
              </p>
              <div className="space-y-4">
                {[
                  'Unlimited App Additions',
                  'Advanced Color Analytics',
                  'Custom Collection Branding',
                  'Export Data to JSON/CSV',
                  'Priority AI Support'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-bold">
                    <CheckCircle2 className="w-5 h-5 text-indigo-300" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Plans & Payment */}
            <div className="flex-1 p-10 bg-white">
              <h3 className="text-xs font-black text-gray-300 uppercase tracking-widest mb-6">Select a Plan</h3>
              <div className="space-y-3 mb-8">
                {[
                  { id: 'Monthly', price: '$12', cycle: 'month' },
                  { id: '1 Year', price: '$99', cycle: 'year', discount: 'Save 30%' },
                  { id: '3 Years', price: '$199', cycle: '3 years', discount: 'Save 50%', popular: true }
                ].map((plan) => (
                  <div 
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all relative ${selectedPlan === plan.id ? 'border-indigo-600 bg-indigo-50/30' : 'border-gray-100 hover:border-indigo-100'}`}
                  >
                    {plan.popular && <div className="absolute -top-2 right-4 bg-red-500 text-white text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Best Value</div>}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-black text-gray-900">{plan.id}</p>
                        {plan.discount && <p className="text-[9px] text-indigo-600 font-bold">{plan.discount}</p>}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-gray-900">{plan.price}</p>
                        <p className="text-[9px] text-gray-400 font-bold">/{plan.cycle}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="text-xs font-black text-gray-300 uppercase tracking-widest mb-4">Payment Method</h3>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {['WeChat Pay', 'Alipay'].map(method => (
                  <button 
                    key={method}
                    onClick={() => setSelectedPaymentMethod(method)}
                    className={`py-3 rounded-xl border-2 text-[10px] font-black transition-all ${selectedPaymentMethod === method ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-gray-100 text-gray-400 hover:border-gray-200'}`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => {
                  setIsPro(true);
                  setShowProModal(false);
                }}
                className="w-full bg-black text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all active:scale-95 shadow-xl shadow-black/10"
              >
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
