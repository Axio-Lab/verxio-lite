import React, { useState } from 'react';
import { Bell, ChevronLeft, ChevronRight } from 'lucide-react';

const NotificationSection = ({ notifications, clearAllNotifications }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 5;

  const unreadCount = notifications.filter(n => !n.read).length;
  const pageCount = Math.ceil(notifications.length / notificationsPerPage);

  const currentNotifications = notifications.slice(
    (currentPage - 1) * notificationsPerPage,
    currentPage * notificationsPerPage
  );

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-indigo-800">Notifications</h2>
          <div className="flex items-center space-x-4">
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Clear All
              </button>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-2 bg-indigo-100 rounded-full hover:bg-indigo-200 transition duration-300"
            >
              <Bell className="h-6 w-6 text-indigo-600" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
        {isOpen && (
          <>
            {notifications.length > 0 ? (
              <>
                <div className="mt-4 space-y-4">
                  {currentNotifications.map((notification, index) => (
                    <div key={index} className={`p-3 rounded-lg ${notification.read ? 'bg-gray-100' : 'bg-indigo-100'}`}>
                      <p className="text-sm text-gray-700">{notification.message}</p>
                    </div>
                  ))}
                </div>
                {pageCount > 1 && (
                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 bg-indigo-100 rounded-full hover:bg-indigo-200 transition duration-300 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-5 w-5 text-indigo-600" />
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {pageCount}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                      disabled={currentPage === pageCount}
                      className="p-2 bg-indigo-100 rounded-full hover:bg-indigo-200 transition duration-300 disabled:opacity-50"
                    >
                      <ChevronRight className="h-5 w-5 text-indigo-600" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-600 mt-4">No notifications at the moment.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NotificationSection;
