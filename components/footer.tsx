"use client";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, MessageCircle } from "lucide-react";
export default function footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 p-2 rounded-xl bg-gradient-to-r from-yellow-400/20 via-yellow-400/10 to-yellow-400/20 backdrop-blur-sm border border-yellow-400/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <img
                  src="/logo.png"
                  alt="Radiocabs"
                  className="h-32 w-auto drop-shadow-lg"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) {
                      target.style.display = 'none';
                      fallback.style.display = 'flex';
                    }
                  }}
                />
              </Link>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Cổng Thông Tin Taxi Hàng Đầu Việt Nam, Kết Nối Công Ty Taxi, Tài Xế Và Khách Hàng Một Cách Hiệu Quả Nhất.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-yellow-400">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-yellow-400">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-yellow-400">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-yellow-400">
                <Linkedin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-yellow-400">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-yellow-400">Dịch Vụ</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/listing" className="hover:text-yellow-400 transition-colors">
                  Đăng Ký Công Ty Taxi
                </Link>
              </li>
              <li>
                <Link href="/drivers" className="hover:text-yellow-400 transition-colors">
                  Đăng Ký Tài Xế
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-yellow-400 transition-colors">
                  Tìm Kiếm Taxi
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="hover:text-yellow-400 transition-colors">
                  Phản Hồi Dịch Vụ
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-yellow-400">Hỗ Trợ</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/help" className="hover:text-yellow-400 transition-colors">
                  Trung Tâm Trợ Giúp
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-yellow-400 transition-colors">
                  Điều Khoản Sử Dụng
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-yellow-400 transition-colors">
                  Chính Sách Bảo Mật
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-yellow-400 transition-colors">
                  Câu Hỏi Thường Gặp
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-yellow-400 transition-colors">
                  Liên Hệ
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-yellow-400">Liên Hệ</h3>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-yellow-400" />
                <div>
                  <p className="font-medium">Hotline</p>
                  <p className="text-sm">1900 1234</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-yellow-400" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm">info@radiocabs.in</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-yellow-400" />
                <div>
                  <p className="font-medium">Địa Chỉ</p>
                  <p className="text-sm">Hà Nội, Việt Nam</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="h-4 w-4 text-yellow-400" />
                <div>
                  <p className="font-medium">Zalo</p>
                  <p className="text-sm">@radiocabs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 Radiocabs - All Right Reserved!
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <Link href="/terms" className="hover:text-yellow-400 transition-colors">
                Điều Khoản
              </Link>
              <Link href="/privacy" className="hover:text-yellow-400 transition-colors">
                Bảo Mật
              </Link>
              <Link href="/cookies" className="hover:text-yellow-400 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}