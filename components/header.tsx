"use client";
import { Button } from "../components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Menu, User, UserPlus, Building2, LogOut, FileText } from "lucide-react";
import { ThemeToggle } from "../components/themeToggle";
import LanguageToggle from "../components/languageToggle";
import { useLanguage } from "./languageContext";
import { getCurrentUser, isAuthenticated, isAdmin, isManager, isDriver, isAccountant, isDispatcher, isCustomer, logout } from "../lib/auth";
import { useEffect, useState } from "react";
export default function Header() {
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoggedIn(isAuthenticated());
  }, []);
  const handleLogout = () => {
    logout();
    setUser(null);
    setIsLoggedIn(false);
    window.location.href = "/";
  };
  return (
    <header className="sticky top-0 z-50 w-full bg-background shadow-lg border-b border-primary/20">
      <div className="w-full flex items-center h-24 px-4 md:px-8">
        <div className="flex items-center flex-shrink-0">
          <Link href="/" className="flex items-center">
            <Image src="/Logo.png" alt="Radiocabs Logo" width={200} height={75} className="h-32 w-auto" />
          </Link>
        </div>
        <nav className="flex items-center gap-4 md:gap-6 lg:gap-8 flex-1 max-w-4xl mx-4 md:mx-8 overflow-x-auto hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {!isLoggedIn && (
            <>
              <Link href="/" className="px-2 md:px-3 text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                Trang Chủ
              </Link>
              <Link href="/booking" className="px-2 md:px-3 text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                Đặt Xe
              </Link>
              <Link href="/listing" className="px-2 md:px-3 text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                Công Ty Taxi
              </Link>
              <Link href="/contact" className="px-2 md:px-3 text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                Liên Hệ
              </Link>
            </>
          )}
          {isLoggedIn && isCustomer() && (
            <>
              <Link href="/" className="px-2 md:px-3 text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                Trang Chủ
              </Link>
              <Link href="/booking" className="px-2 md:px-3 text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                Lịch Sử Đặt Xe
              </Link>
              <Link href="/listing" className="px-2 md:px-3 text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                Đăng Ký Công Ty
              </Link>
              <Link href="/contact" className="px-2 md:px-3 text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                Liên Hệ
              </Link>
              <Link href="/feedback" className="px-2 md:px-3 text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                Góp Ý
              </Link>
              <Link href="/profile" className="px-2 md:px-3 text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                <User className="w-4 h-4 inline mr-1" />
                Tài Khoản
              </Link>
            </>
          )}
          {isLoggedIn && (isManager() || isDispatcher() || isAccountant()) && (
            <>
              <Link href="/" className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                Trang Chủ
              </Link>
              <Link href="/company" className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                <Building2 className="w-4 h-4 inline mr-1" />
                Công Ty Taxi
              </Link>
              <Link href="/profile" className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                <User className="w-4 h-4 inline mr-1" />
                Tài Khoản
              </Link>
            </>
          )}
          {isLoggedIn && isDriver() && (
            <>
              <Link href="/" className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                Trang Chủ
              </Link>
              <Link href="/driver/orders" className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                <FileText className="w-4 h-4 inline mr-1" />
                Đơn Hàng Của Tôi
              </Link>
              <Link href="/profile" className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                <User className="w-4 h-4 inline mr-1" />
                Tài Khoản
              </Link>
            </>
          )}
          {isLoggedIn && isAdmin() && (
            <>
              <Link href="/" className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                Trang Chủ
              </Link>
              <Link href="/admin/overview" className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                <Building2 className="w-4 h-4 inline mr-1" />
                Tổng Quan Hệ Thống
              </Link>
              <Link href="/profile" className="text-xs md:text-sm font-medium text-primary hover:text-primary/80 transition-all duration-300 hover:scale-105 whitespace-nowrap">
                <User className="w-4 h-4 inline mr-1" />
                Tài Khoản
              </Link>
            </>
          )}
        </nav>
        <div className="flex items-center gap-3 flex-shrink-0">
          <ThemeToggle />
          {!isLoggedIn && (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/20 hover:text-primary hover:shadow-lg hover:shadow-primary/50 hover:border-primary/80 font-medium px-4 py-2 transition-all duration-300 bg-transparent hover:scale-105">
                  <User className="h-4 w-4 mr-2" />
                  {t.login}
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-4 py-2 shadow-lg hover:shadow-xl transition-all duration-300">
                  <UserPlus className="h-4 w-4 mr-2" />
                  {t.register}
                </Button>
              </Link>
            </>
          )}
          {isLoggedIn && user && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-primary/80">
                  Xin Chào, {user.fullName}
                </span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {user.role === 'ADMIN' && 'Admin'}
                  {user.role === 'MANAGER' && 'Manager'}
                  {user.role === 'DRIVER' && 'Driver'}
                  {user.role === 'ACCOUNTANT' && 'Accountant'}
                  {user.role === 'DISPATCHER' && 'Dispatcher'}
                  {user.role === 'CUSTOMER' && 'Customer'}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout} className="border-red-500/30 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-500/50 dark:border-red-400/30 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300 dark:hover:border-red-400/50 transition-all duration-300">
                <LogOut className="h-4 w-4 mr-1" />
                Đăng Xuất
              </Button>
            </div>
          )}
          <LanguageToggle />
          <Button variant="ghost" size="sm" className="md:hidden text-yellow-400 hover:bg-yellow-400/10">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}