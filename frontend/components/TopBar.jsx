import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icons } from './Icons';
import { UserModal } from './UserModal';
import { useMobileMenu } from '../contexts/MobileMenuContext';
import { api } from '../src/api/axios';

export const TopBar = ({ title }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  
  const navigate = useNavigate();
  const { toggle } = useMobileMenu();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Fetch user profile
    const fetchUser = async () => {
      try {
        const res = await api.get("api/users/me", { withCredentials: true });
        setUser(res.data);
      } catch (err) {
        console.log("User not logged in");
      }
    };

    // Fetch notifications
    const fetchNotifications = async () => {
      try {
        const res = await api.get("api/notifications/all");
        setNotifications(res.data);
        setUnreadCount(res.data.filter(n => !n.isRead).length);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };

    fetchUser();
    fetchNotifications();

    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("api/users/logout");
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.put("api/notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleNotificationClick = async (notificationId) => {
    try {
      await api.put(`api/notifications/read/${notificationId}`);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'member_added':
        return { color: 'bg-blue-500', icon: '👤' };
      case 'subscription_expiring':
        return { color: 'bg-yellow-500', icon: '⚠️' };
      case 'subscription_expired':
        return { color: 'bg-red-500', icon: '❌' };
      case 'payment':
        return { color: 'bg-green-500', icon: '💰' };
      default:
        return { color: 'bg-gray-500', icon: 'ℹ️' };
    }
  };

  return (
    <>
      <header className="h-20 px-4 md:px-8 flex items-center justify-between bg-black/50 backdrop-blur-md border-b border-panda-border sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button 
            onClick={toggle}
            className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg border border-panda-border hover:bg-white/5 transition-colors"
          >
            <Icons.Menu className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">{title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          {/* Notifications Dropdown */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className={`relative text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5 ${isNotificationsOpen ? 'text-white bg-white/5' : ''}`}
            >
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-panda-red rounded-full shadow-[0_0_8px_rgba(230,0,0,0.8)] flex items-center justify-center text-[10px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
              <Icons.Notification className="w-6 h-6" />
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 bg-[#151515] border border-panda-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-50">
                <div className="px-4 py-3 border-b border-panda-border flex justify-between items-center bg-[#111]">
                  <h3 className="font-semibold text-white text-sm">
                    Notifications {unreadCount > 0 && `(${unreadCount})`}
                  </h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={handleMarkAllRead}
                      className="text-xs text-panda-red hover:text-red-400 transition-colors"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500 text-sm">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif) => {
                      const { color, icon } = getNotificationIcon(notif.type);
                      return (
                        <div 
                          key={notif.id} 
                          onClick={() => handleNotificationClick(notif.id)}
                          className={`px-4 py-3 border-b border-panda-border/30 hover:bg-white/5 transition-colors cursor-pointer group ${
                            !notif.isRead ? 'bg-white/5' : ''
                          }`}
                        >
                          <div className="flex gap-3">
                            <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${color}`} />
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm group-hover:text-white transition-colors ${
                                notif.isRead ? 'text-gray-400' : 'text-gray-300 font-medium'
                              }`}>
                                {notif.message}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-xs text-gray-600">{notif.time}</p>
                                {notif.createdByName && (
                                  <>
                                    <span className="text-gray-700">•</span>
                                    <p className="text-xs text-gray-600">by {notif.createdByName}</p>
                                  </>
                                )}
                              </div>
                            </div>
                            {!notif.isRead && (
                              <div className="w-2 h-2 bg-panda-red rounded-full flex-shrink-0 mt-2" />
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="px-4 py-2 bg-[#111] text-center border-t border-panda-border">
                    <button className="text-xs text-gray-400 hover:text-white transition-colors w-full py-1">
                      View All Notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 pl-3 pr-2 py-1.5 rounded-full border border-panda-border hover:bg-white/5 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-panda-red to-orange-600 flex items-center justify-center text-white text-sm font-bold shadow-neon">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <Icons.Down className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-48 bg-[#151515] border border-panda-border rounded-xl shadow-2xl py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-50">
                <div className="px-4 py-2 border-b border-panda-border mb-1">
                  <p className="text-sm text-white font-medium">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    setIsCreateUserOpen(true);
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-panda-red flex items-center gap-2 transition-colors"
                >
                  <Icons.CreateUser className="w-4 h-4" />
                  Create User
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-red-500 flex items-center gap-2 transition-colors"
                >
                  <Icons.Logout className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <UserModal isOpen={isCreateUserOpen} onClose={() => setIsCreateUserOpen(false)} mode="add" />
    </>
  );
};