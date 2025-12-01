"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Shield, User, Building2, Car, Calculator, Navigation, CheckCircle } from "lucide-react";
interface RoleSelectorProps {
  currentRole: "ADMIN" | "MANAGER" | "DRIVER" | "ACCOUNTANT" | "DISPATCHER" | "CUSTOMER";
  onRoleChange: (role: "ADMIN" | "MANAGER" | "DRIVER" | "ACCOUNTANT" | "DISPATCHER" | "CUSTOMER") => void;
}
export default function RoleSelector({ currentRole, onRoleChange }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState(currentRole);
  const roles = [
    {
      id: "ADMIN",
      name: "Quản Trị Viên",
      description: "Xem Toàn Bộ Hệ Thống (Chỉ Đọc)",
      icon: Shield,
      color: "from-red-200/80 to-red-300/80 dark:from-red-900/20 dark:to-black border-red-500/30",
      permissions: [
        "Xem Tất Cả Công Ty",
        "Xem Tất Cả Nhân Viên",
        "Xem Tất Cả Xe",
        "Xem Tất Cả Dịch Vụ",
        "Xem Báo Cáo Toàn Hệ Thống",
        "Xem Phản Hồi (Không Giải Quyết)"
      ]
    },
    {
      id: "MANAGER",
      name: "Quản Lý",
      description: "Quản Lý Đầy Đủ Công Ty Của Bạn",
      icon: Building2,
      color: "from-blue-200/80 to-blue-300/80 dark:from-blue-900/20 dark:to-black border-blue-500/30",
      permissions: [
        "Quản Lý Hồ Sơ Công Ty",
        "Quản Lý Nhân Viên",
        "Quản Lý Xe",
        "Cấu Hình Dịch Vụ",
        "Quản Lý Đơn Hàng",
        "Xem Báo Cáo Đầy Đủ",
        "Giải Quyết Phản Hồi"
      ]
    },
    {
      id: "DRIVER",
      name: "Tài Xế",
      description: "Xem Đơn Hàng Được Giao",
      icon: Car,
      color: "from-green-200/80 to-green-300/80 dark:from-green-900/20 dark:to-black border-green-500/30",
      permissions: [
        "Xem Đơn Hàng Của Mình",
        "Cập Nhật Trạng Thái Đơn Hàng"
      ]
    },
    {
      id: "ACCOUNTANT",
      name: "Kế Toán",
      description: "Xem Báo Cáo Doanh Thu",
      icon: Calculator,
      color: "from-purple-200/80 to-purple-300/80 dark:from-purple-900/20 dark:to-black border-purple-500/30",
      permissions: [
        "Xem Báo Cáo Doanh Thu",
        "Xuất Báo Cáo Tài Chính"
      ]
    },
    {
      id: "DISPATCHER",
      name: "Người Điều Phối",
      description: "Điều Phối Đơn Hàng Và Tài Xế",
      icon: Navigation,
      color: "from-orange-200/80 to-orange-300/80 dark:from-orange-900/20 dark:to-black border-orange-500/30",
      permissions: [
        "Xem Đơn Hàng",
        "Điều Phối Tài Xế",
        "Phân Công Đơn Hàng"
      ]
    },
    {
      id: "CUSTOMER",
      name: "Khách Hàng",
      description: "Đặt Xe Và Sử Dụng Dịch Vụ",
      icon: User,
      color: "from-cyan-200/80 to-cyan-300/80 dark:from-cyan-900/20 dark:to-black border-cyan-500/30",
      permissions: [
        "Đặt Xe Taxi",
        "Xem Lịch Sử Đặt Xe",
        "Đánh Giá Dịch Vụ"
      ]
    }
  ];
  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId as typeof currentRole);
  };
  const handleConfirm = () => {
    onRoleChange(selectedRole);
  };
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-900 dark:text-yellow-400 flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Chọn Vai Trò
          </CardTitle>
          <CardDescription className="text-yellow-200">
            Chọn Vai Trò Để Xem Các Chức Năng Tương Ứng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => (
              <Card
                key={role.id}
                className={`bg-gradient-to-br ${role.color} shadow-2xl cursor-pointer transition-all duration-300 hover:shadow-lg ${selectedRole === role.id ? 'ring-2 ring-primary' : ''}`}
                onClick={() => handleRoleSelect(role.id)}
              >
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900 dark:text-yellow-400 flex items-center gap-2">
                    <role.icon className="w-5 h-5" />
                    {role.name}
                  </CardTitle>
                  <CardDescription className="text-yellow-200">
                    {role.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900 dark:text-yellow-400">Quyền Hạn:</p>
                    <ul className="text-xs text-gray-600 dark:text-yellow-200 space-y-1">
                      {role.permissions.map((permission, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {permission}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-6">
            <Button
              onClick={handleConfirm}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Xác Nhận Vai Trò
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}