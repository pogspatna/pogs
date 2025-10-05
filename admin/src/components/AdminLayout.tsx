'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  UserCheck,
  MessageSquare,
  LogOut,
  Menu,
  X,
  Stethoscope,
  Crown,
  ChevronDown,
  ChevronRight,
  Download,
  Image,
  Building2
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavigationItem[];
}

const navigation: NavigationItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Members', href: '/dashboard/members', icon: Users },
  { name: 'Events', href: '/dashboard/events', icon: Calendar },
  { name: 'Office Bearers', href: '/dashboard/office-bearers', icon: Crown },
  { name: 'Committees', href: '/dashboard/committees', icon: Building2 },
  { name: 'Newsletters', href: '/dashboard/newsletters', icon: FileText },
  { name: 'Gallery', href: '/dashboard/gallery', icon: Image },
  { 
    name: 'Applications', 
    href: '/dashboard/applications', 
    icon: UserCheck,
    children: [
      { name: 'Review Applications', href: '/dashboard/applications', icon: UserCheck },
      { name: 'Offline Form', href: '/dashboard/applications/offline-form', icon: Download }
    ]
  },
  { name: 'Contact Inquiries', href: '/dashboard/contacts', icon: MessageSquare },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['Applications']);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const isActive = pathname === item.href;
    const isExpanded = expandedItems.includes(item.name);
    const hasChildren = item.children && item.children.length > 0;
    const isParentActive = hasChildren && item.children?.some(child => pathname === child.href);

    return (
      <div key={item.name}>
        {hasChildren ? (
          <button
            onClick={() => toggleExpanded(item.name)}
            className={`w-full admin-sidebar-item ${
              isActive || isParentActive ? 'admin-sidebar-item-active' : 'admin-sidebar-item-inactive'
            } flex items-center justify-between`}
          >
            <div className="flex items-center">
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ) : (
          <Link
            href={item.href}
            className={`admin-sidebar-item ${
              isActive ? 'admin-sidebar-item-active' : 'admin-sidebar-item-inactive'
            } ${level > 0 ? 'pl-12' : ''}`}
            onClick={() => setSidebarOpen(false)}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </Link>
        )}
        
        {hasChildren && isExpanded && (
          <div className="ml-4">
            {item.children?.map(child => renderNavigationItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 admin-sidebar transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Stethoscope className="text-white w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-gray-900">POGS Admin</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 admin-sidebar-nav">
            {navigation.map(item => renderNavigationItem(item))}
          </nav>

          {/* User info and logout */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-medium text-gray-700">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.email}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full admin-sidebar-item admin-sidebar-item-inactive text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <header className="admin-header">
          <div className="admin-header-content">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="w-5 h-5 text-gray-500" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 lg:ml-0 ml-2">
                {pathname.includes('/applications/offline-form') ? 'Offline Form Management' :
                 navigation.find(item => item.href === pathname)?.name || 
                 navigation.find(item => item.children?.some(child => child.href === pathname))?.name || 
                 'Admin Panel'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Welcome, {user?.email?.split('@')[0]}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="admin-container admin-section">
          {children}
        </main>
      </div>
    </div>
  );
} 