import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, X, Check, AlertTriangle, Info, Package, Users, TrendingUp, Clock, Trash2 } from 'lucide-react';
import PropTypes from 'prop-types';

const mockNotifications = [
	{
		id: '1',
		type: 'warning',
		title: 'Low Stock Alert',
		message: 'Nike Air Max 270 is running low (8 units remaining)',
		timestamp: '5 minutes ago',
		isRead: false,
		actionUrl: 'products',
	},
	{
		id: '2',
		type: 'success',
		title: 'Order Completed',
		message: 'Order #ORD-2024-001 has been successfully delivered to TechStore NYC',
		timestamp: '1 hour ago',
		isRead: false,
		actionUrl: 'customers',
	},
	{
		id: '3',
		type: 'info',
		title: 'New Customer',
		message: 'Digital Depot has been added to your customer list',
		timestamp: '2 hours ago',
		isRead: true,
		actionUrl: 'customers',
	},
	{
		id: '4',
		type: 'analytics',
		title: 'Monthly Report Ready',
		message: 'Your January inventory report is now available for download',
		timestamp: '3 hours ago',
		isRead: true,
		actionUrl: 'analytics',
	},
	{
		id: '5',
		type: 'inventory',
		title: 'Stock Received',
		message: '150 units of iPhone 15 Pro have been added to Warehouse A',
		timestamp: '5 hours ago',
		isRead: true,
		actionUrl: 'stock-in',
	},
	{
		id: '6',
		type: 'error',
		title: 'Shipment Delayed',
		message: 'Shipment TRK-2024-003 to Electronics Plus has been delayed',
		timestamp: '1 day ago',
		isRead: true,
		actionUrl: 'stock-out',
	},
];

const notificationIcons = {
	info: Info,
	warning: AlertTriangle,
	success: Check,
	error: AlertTriangle,
	inventory: Package,
	customer: Users,
	analytics: TrendingUp,
};

const notificationColors = {
	info: 'bg-blue-500/20 text-blue-400',
	warning: 'bg-orange-500/20 text-orange-400',
	success: 'bg-green-500/20 text-green-400',
	error: 'bg-red-500/20 text-red-400',
	inventory: 'bg-purple-500/20 text-purple-400',
	customer: 'bg-indigo-500/20 text-indigo-400',
	analytics: 'bg-pink-500/20 text-pink-400',
};

export const Notification = ({ className = '' }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [notifications, setNotifications] = useState(mockNotifications);
	const menuRef = useRef(null);

	const unreadCount = notifications.filter((n) => !n.isRead).length;

	useEffect(() => {
		function handleClickOutside(event) {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleNotificationClick = (notification) => {
		// Mark as read
		setNotifications((prev) =>
			prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n))
		);

		// Navigate to action URL if provided
		if (notification.actionUrl) {
			window.dispatchEvent(new CustomEvent('navigate', { detail: notification.actionUrl }));
		}

		setIsOpen(false);
	};

	const markAllAsRead = () => {
		setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
	};

	const deleteNotification = (id, event) => {
		event.stopPropagation();
		setNotifications((prev) => prev.filter((n) => n.id !== id));
	};

	const clearAllNotifications = () => {
		setNotifications([]);
	};

	return (
		<div className={`relative ${className}`} ref={menuRef}>
			{/* Notification Bell Button */}
			<motion.button
				onClick={() => setIsOpen(!isOpen)}
				className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}
			>
				<Bell className="w-5 h-5" />
				{unreadCount > 0 && (
					<motion.span
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
					>
						{unreadCount > 9 ? '9+' : unreadCount}
					</motion.span>
				)}
			</motion.button>

			{/* Notification Dropdown */}
			{isOpen && (
				<motion.div
					initial={{ opacity: 0, scale: 0.95, y: -10 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.95, y: -10 }}
					transition={{ duration: 0.2 }}
					className="absolute -right-20 lg:right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden"
				>
					{/* Header */}
					<div className="p-4 border-b border-gray-200 dark:border-gray-700">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-2">
								<Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
								<h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
								{unreadCount > 0 && (
									<span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
										{unreadCount}
									</span>
								)}
							</div>
							<button
								onClick={() => setIsOpen(false)}
								className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
							>
								<X className="w-4 h-4 text-gray-500" />
							</button>
						</div>

						{/* Action Buttons */}
						{notifications.length > 0 && (
							<div className="flex items-center space-x-2 mt-3">
								{unreadCount > 0 && (
									<button
										onClick={markAllAsRead}
										className="text-xs text-blue-600 hover:text-blue-700 font-medium"
									>
										Mark all as read
									</button>
								)}
								<button
									onClick={clearAllNotifications}
									className="text-xs text-red-600 hover:text-red-700 font-medium"
								>
									Clear all
								</button>
							</div>
						)}
					</div>

					{/* Notification List */}
					<div className="max-h-80 overflow-y-auto">
						{notifications.length === 0 ? (
							<div className="p-8 text-center">
								<Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
								<p className="text-gray-500 dark:text-gray-400">No notifications</p>
								<p className="text-sm text-gray-400 dark:text-gray-500 mt-1">You're all caught up!</p>
							</div>
						) : (
							<div className="divide-y divide-gray-200 dark:divide-gray-700">
								{notifications.map((notification, index) => {
									const IconComponent = notificationIcons[notification.type];
									const colorClass = notificationColors[notification.type];

									return (
										<motion.div
											key={notification.id}
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ duration: 0.3, delay: index * 0.05 }}
											onClick={() => handleNotificationClick(notification)}
											className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors relative ${
												!notification.isRead ? 'bg-blue-50 dark:bg-blue-900/10' : ''
											}`}
										>
											<div className="flex items-start space-x-3">
												{/* Icon */}
												<div className={`p-2 rounded-lg ${colorClass} flex-shrink-0`}>
													<IconComponent className="w-4 h-4" />
												</div>

												{/* Content */}
												<div className="flex-1 min-w-0">
													<div className="flex items-start justify-between">
														<div className="flex-1">
															<p
																className={`text-sm font-medium ${
																	!notification.isRead
																		? 'text-gray-900 dark:text-white'
																		: 'text-gray-700 dark:text-gray-300'
																}`}
															>
																{notification.title}
															</p>
															<p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
																{notification.message}
															</p>
															<div className="flex items-center space-x-2 mt-2">
																<Clock className="w-3 h-3 text-gray-400" />
																<span className="text-xs text-gray-500 dark:text-gray-400">
																	{notification.timestamp}
																</span>
															</div>
														</div>

														{/* Actions */}
														<div className="flex items-center space-x-1 ml-2">
															{!notification.isRead && (
																<div className="w-2 h-2 bg-blue-500 rounded-full"></div>
															)}
															<button
																onClick={(e) => deleteNotification(notification.id, e)}
																className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
															>
																<Trash2 className="w-3 h-3 text-gray-400" />
															</button>
														</div>
													</div>
												</div>
											</div>
										</motion.div>
									);
								})}
							</div>
						)}
					</div>

					{/* Footer */}
					{notifications.length > 0 && (
						<div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
							<button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-1">
								View All Notifications
							</button>
						</div>
					)}
				</motion.div>
			)}
		</div>
	);
};

// NotificationList.propTypes = {
// 	className: PropTypes.string,
// };