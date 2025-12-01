export const shiftStatus = {
  planned: 'PLANNED',
  on: 'ON',
  off: 'OFF',
  cancelled: 'CANCELLED',
  completed: 'COMPLETED'
} as const;
export type ShiftStatus = typeof shiftStatus[keyof typeof shiftStatus];
export const orderStatus = {
  new: 'NEW',
  assigned: 'ASSIGNED',
  ongoing: 'ONGOING',
  done: 'DONE',
  cancelled: 'CANCELLED',
  failed: 'FAILED'
} as const;
export type OrderStatus = typeof orderStatus[keyof typeof orderStatus];
export const paymentMethod = {
  cash: 'CASH',
  card: 'CARD',
  wallet: 'WALLET',
  bank: 'BANK'
} as const;
export type PaymentMethod = typeof paymentMethod[keyof typeof paymentMethod];
export const getShiftStatusLabel = (status: ShiftStatus): string => {
  switch (status) {
    case shiftStatus.planned:
      return 'Đã Lên Kế Hoạch';
    case shiftStatus.on:
      return 'Đang Làm Việc';
    case shiftStatus.off:
      return 'Nghỉ';
    case shiftStatus.cancelled:
      return 'Đã Hủy';
    case shiftStatus.completed:
      return 'Hoàn Thành';
    default:
      return 'Không Xác Định';
  }
};
export const getShiftStatusColor = (status: ShiftStatus): string => {
  switch (status) {
    case shiftStatus.planned:
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case shiftStatus.on:
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case shiftStatus.off:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    case shiftStatus.cancelled:
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case shiftStatus.completed:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
}