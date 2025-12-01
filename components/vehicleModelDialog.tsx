"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
interface VehicleModelDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingModel: any | null;
  companyId: number;
  segments: any[];
}
export default function VehicleModelDialog({ open, onClose, onSuccess, editingModel, companyId, segments }: VehicleModelDialogProps) {
  const [formData, setFormData] = useState({
    brand: '',
    modelName: '',
    segmentId: '',
    fuelType: 'GASOLINE',
    seatCategory: 'SEDAN_5',
    imageUrl: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    if (editingModel) {
      setFormData({
        brand: editingModel.brand || '',
        modelName: editingModel.modelName || '',
        segmentId: editingModel.segmentId?.toString() || '',
        fuelType: editingModel.fuelType || 'GASOLINE',
        seatCategory: editingModel.seatCategory || 'SEDAN_5',
        imageUrl: editingModel.imageUrl || '',
        description: editingModel.description || ''
      });
    } else {
      setFormData({
        brand: '',
        modelName: '',
        segmentId: '',
        fuelType: 'GASOLINE',
        seatCategory: 'SEDAN_5',
        imageUrl: '',
        description: ''
      });
    }
  }, [editingModel, open]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const apiService = (await import('../lib/api')).apiService;
      const payload = {
        companyId: companyId,
        brand: formData.brand,
        modelName: formData.modelName,
        segmentId: formData.segmentId ? parseInt(formData.segmentId) : null,
        fuelType: formData.fuelType,
        seatCategory: formData.seatCategory,
        imageUrl: formData.imageUrl || null,
        description: formData.description || null
      };
      if (editingModel) {
        await apiService.updateVehicleModel(editingModel.modelId, payload);
      } else {
        await apiService.createVehicleModel(payload);
      }
      onSuccess();
      onClose();
    } catch (error) {
      alert('Lỗi: Không Thể Lưu Mẫu Xe!');
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900 dark:text-yellow-400">
            {editingModel ? 'Sửa Mẫu Xe' : 'Thêm Mẫu Xe Mới'}
          </DialogTitle>
          <DialogDescription>
            {editingModel ? 'Cập Nhật Thông Tin Mẫu Xe' : 'Tạo Mẫu Xe Mới Cho Công Ty'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Hãng Xe *</Label>
                <Input id="brand" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} placeholder="Vd: Toyota, Honda, Bmw" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modelName">Tên Model *</Label>
                <Input id="modelName" value={formData.modelName} onChange={(e) => setFormData({ ...formData, modelName: e.target.value })} placeholder="Vd: Vios, City, Innova" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="segmentId">Phân Khúc</Label>
              <Select value={formData.segmentId} onValueChange={(value) => setFormData({ ...formData, segmentId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn Phân Khúc" />
                </SelectTrigger>
                <SelectContent>
                  {segments.map((seg) => (
                    <SelectItem key={seg.segmentId} value={seg.segmentId.toString()}>
                      {seg.name} ({seg.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fuelType">Loại Nhiên Liệu *</Label>
                <Select value={formData.fuelType} onValueChange={(value) => setFormData({ ...formData, fuelType: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GASOLINE">Xăng</SelectItem>
                    <SelectItem value="DIESEL">Dầu</SelectItem>
                    <SelectItem value="EV">Điện</SelectItem>
                    <SelectItem value="HYBRID">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="seatCategory">Loại Ghế *</Label>
                <Select value={formData.seatCategory} onValueChange={(value) => setFormData({ ...formData, seatCategory: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SEDAN_5">Sedan 5 Chỗ</SelectItem>
                    <SelectItem value="HATCHBACK_5">Hatchback 5 Chỗ</SelectItem>
                    <SelectItem value="SUV_5">Suv 5 Chỗ</SelectItem>
                    <SelectItem value="SUV_7">Suv 7 Chỗ</SelectItem>
                    <SelectItem value="MPV_7">Mpv 7 Chỗ</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Url Hình Ảnh</Label>
              <Input id="imageUrl" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://example.com/image.jpg" type="url" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô Tả</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Mô Tả Về Mẫu Xe..." rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black" disabled={submitting}>
              {submitting ? 'Đang Lưu...' : (editingModel ? 'Cập Nhật' : 'Tạo Mới')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}