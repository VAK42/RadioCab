"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
interface VehicleDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingVehicle: any | null;
  companyId: number;
  models: any[];
}
export default function VehicleDialog({ open, onClose, onSuccess, editingVehicle, companyId, models }: VehicleDialogProps) {
  const [formData, setFormData] = useState({
    modelId: '',
    plateNumber: '',
    vin: '',
    color: '',
    yearManufactured: new Date().getFullYear().toString(),
    inServiceFrom: new Date().toISOString().split('T')[0],
    odometerKm: '0',
    status: 'ACTIVE'
  });
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    if (editingVehicle) {
      setFormData({
        modelId: editingVehicle.modelId?.toString() || '',
        plateNumber: editingVehicle.plateNumber || '',
        vin: editingVehicle.vin || '',
        color: editingVehicle.color || '',
        yearManufactured: editingVehicle.yearManufactured?.toString() || new Date().getFullYear().toString(),
        inServiceFrom: editingVehicle.inServiceFrom || new Date().toISOString().split('T')[0],
        odometerKm: editingVehicle.odometerKm?.toString() || '0',
        status: editingVehicle.status || 'ACTIVE'
      });
    } else {
      setFormData({
        modelId: '',
        plateNumber: '',
        vin: '',
        color: '',
        yearManufactured: new Date().getFullYear().toString(),
        inServiceFrom: new Date().toISOString().split('T')[0],
        odometerKm: '0',
        status: 'ACTIVE'
      });
    }
  }, [editingVehicle, open]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const apiService = (await import('../lib/api')).apiService;
      const payload = {
        companyId: companyId,
        modelId: parseInt(formData.modelId),
        plateNumber: formData.plateNumber,
        vin: formData.vin || null,
        color: formData.color || null,
        yearManufactured: parseInt(formData.yearManufactured),
        inServiceFrom: formData.inServiceFrom,
        odometerKm: parseInt(formData.odometerKm),
        status: formData.status
      };
      if (editingVehicle) {
        await apiService.updateVehicle(editingVehicle.vehicleId, payload);
      } else {
        await apiService.createVehicle(payload);
      }
      onSuccess();
      onClose();
    } catch (error) {
      alert('Lỗi: Không Thể Lưu Xe!');
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-yellow-400">
            {editingVehicle ? 'Sửa Thông Tin Xe' : 'Thêm Xe Mới'}
          </DialogTitle>
          <DialogDescription>
            {editingVehicle ? 'Cập Nhật Thông Tin Xe' : 'Thêm Xe Mới Vào Đội'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="modelId">Mẫu Xe *</Label>
              <Select value={formData.modelId} onValueChange={(value) => setFormData({ ...formData, modelId: value })} required>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn Mẫu Xe" />
                </SelectTrigger>
                <SelectContent>
                  {models.map((model) => (
                    <SelectItem key={model.modelId} value={model.modelId.toString()}>
                      {model.brand} {model.modelName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plateNumber">Biển Số *</Label>
                <Input id="plateNumber" value={formData.plateNumber} onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value.toUpperCase() })} placeholder="Vd: 29A-12345" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vin">Vin</Label>
                <Input id="vin" value={formData.vin} onChange={(e) => setFormData({ ...formData, vin: e.target.value.toUpperCase() })} placeholder="Vd: 1Hgbh41Jxmn109186" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">Màu Sắc</Label>
                <Input id="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} placeholder="Vd: Trắng, Đen, Bạc" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yearManufactured">Năm Sản Xuất</Label>
                <Input id="yearManufactured" type="number" value={formData.yearManufactured} onChange={(e) => setFormData({ ...formData, yearManufactured: e.target.value })} min="1990" max={new Date().getFullYear() + 1} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inServiceFrom">Ngày Vào Hoạt Động *</Label>
                <Input id="inServiceFrom" type="date" value={formData.inServiceFrom} onChange={(e) => setFormData({ ...formData, inServiceFrom: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="odometerKm">Số Km Đã Chạy</Label>
                <Input id="odometerKm" type="number" value={formData.odometerKm} onChange={(e) => setFormData({ ...formData, odometerKm: e.target.value })} min="0" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Trạng Thái *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Hoạt Động</SelectItem>
                  <SelectItem value="INACTIVE">Ngừng Hoạt Động</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black" disabled={submitting}>
              {submitting ? 'Đang Lưu...' : (editingVehicle ? 'Cập Nhật' : 'Tạo Mới')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}