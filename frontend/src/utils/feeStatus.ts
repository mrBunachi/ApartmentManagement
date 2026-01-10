import type { DotThuPhi } from '../api/dotThuPhi.service';

export type FeeStatus = 'upcoming' | 'active' | 'overdue' | 'closed';

export interface FeeStatusInfo {
  status: FeeStatus;
  label: string;
  color: string;
  bgColor: string;
  daysRemaining?: number;
  daysOverdue?: number;
}

/**
 * Tính trạng thái của đợt thu phí dựa vào NGAYBATDAU và NGAYKETTHUC
 */
export const getFeeStatus = (dotThuPhi: DotThuPhi, isPaid: boolean = false): FeeStatusInfo => {
  const now = new Date();
  
  // Nếu đã đóng phí thì luôn là closed
  if (isPaid) {
    return {
      status: 'closed',
      label: 'Đã đóng',
      color: 'text-green-700',
      bgColor: 'bg-green-100',
    };
  }

  // Nếu không có thời gian thì coi là đang hoạt động
  if (!dotThuPhi.NGAYBATDAU || !dotThuPhi.NGAYKETTHUC) {
    return {
      status: 'active',
      label: 'Đang mở',
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
    };
  }

  const startDate = new Date(dotThuPhi.NGAYBATDAU);
  const endDate = new Date(dotThuPhi.NGAYKETTHUC);

  // Sắp tới: chưa đến ngày bắt đầu
  if (now < startDate) {
    const daysUntilStart = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return {
      status: 'upcoming',
      label: `Sắp mở (còn ${daysUntilStart} ngày)`,
      color: 'text-gray-700',
      bgColor: 'bg-gray-100',
      daysRemaining: daysUntilStart,
    };
  }

  // Đang mở: trong khoảng thời gian thu
  if (now >= startDate && now <= endDate) {
    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return {
      status: 'active',
      label: daysRemaining > 0 ? `Đang mở (còn ${daysRemaining} ngày)` : 'Đang mở (hết hạn hôm nay)',
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      daysRemaining,
    };
  }

  // Quá hạn: đã qua ngày kết thúc
  const daysOverdue = Math.ceil((now.getTime() - endDate.getTime()) / (1000 * 60 * 60 * 24));
  return {
    status: 'overdue',
    label: `Quá hạn (${daysOverdue} ngày)`,
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    daysOverdue,
  };
};

/**
 * Format ngày theo định dạng Việt Nam
 */
export const formatVietnameseDate = (dateString: string | undefined): string => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Kiểm tra đợt thu có đang trong thời gian cho phép đóng không
 */
export const canPayFee = (dotThuPhi: DotThuPhi): boolean => {
  if (!dotThuPhi.NGAYBATDAU) return true; // Không giới hạn thời gian thì luôn cho phép

  const now = new Date();
  const startDate = new Date(dotThuPhi.NGAYBATDAU);
  
  // Đã đến ngày bắt đầu thì cho phép đóng (kể cả quá hạn)
  return now >= startDate;
};
