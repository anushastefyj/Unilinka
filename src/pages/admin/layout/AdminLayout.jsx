import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Layers, 
  AlertCircle, 
  BarChart3, 
  GitMerge, 
  Bell, 
  Users,
  LogOut
} from 'lucide-react';

const AdminLayout = () => {
  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Resources', path: '/admin/resources', icon: FolderOpen },
    { name: 'Taxonomy', path: '/admin/taxonomy', icon: Layers },
    { name: 'Reported Issues', path: '/admin/issues', icon: AlertCircle },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Merge Manager', path: '/admin/merge', icon: GitMerge },
    { name: 'Announcements', path: '/admin/notifications', icon: Bell },
    { name: 'Users', path: '/admin/users', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-[#FAF7F0] text-gray-900 font-body">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1F4D3A] text-white flex flex-col">
        <div className="p-6 border-b border-[#1F4D3A]/20 bg-[#153a2b]">
          <h1 className="text-2xl font-heading font-bold text-[#FAF7F0]">UNILINKA Admin</h1>
          <p className="text-sm text-[#EFE7D8] opacity-80">Super Admin Panel</p>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  end={item.path === '/admin'}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#EFE7D8] text-[#1F4D3A]'
                        : 'text-white/80 hover:bg-[#1F4D3A]/50 hover:text-white'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-white/80 rounded-lg hover:bg-[#1F4D3A]/50 hover:text-white transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-semibold text-[#1F4D3A] mr-2">Status:</span> All systems operational
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-[#1F4D3A] text-white flex items-center justify-center font-bold text-sm">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
