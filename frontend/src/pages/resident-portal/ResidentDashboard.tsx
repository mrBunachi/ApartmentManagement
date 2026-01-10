import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import feeListService from '../../api/feeList.service';
import toast from 'react-hot-toast';
import { API_URL } from '../../utils/constants';
import { getFeeStatus } from '../../utils/feeStatus';
import type { FeeStatus } from '../../utils/feeStatus';

interface FeeItem {
  MADOTTHU: string;
  MAHOKHAU: string;
  TIENNHA: number;
  TIENDICHVU: number;
  TIENXEMAY?: number;
  TIENOTO?: number;
  TIENDIEN: number;
  TIENNUOC: number;
  TIENINTERNET?: number;
  TRANGTHAI: string;
  SOTIENDADONG: number;
  DOTTHUPHI: {
    TEN: string;
    BATBUOC: boolean;
    NGAYTAO: string;
    NGAYBATDAU?: string;
    NGAYKETTHUC?: string;
    MOTA: string | null;
  };
}

export default function ResidentDashboard() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const identifier = searchParams.get('id') || '';
  
  const [loading, setLoading] = useState(true);
  const [upcomingFees, setUpcomingFees] = useState<FeeItem[]>([]);
  const [activeFees, setActiveFees] = useState<FeeItem[]>([]);
  const [overdueFees, setOverdueFees] = useState<FeeItem[]>([]);
  const [householdInfo, setHouseholdInfo] = useState<any>(null);
  const [customAmounts, setCustomAmounts] = useState<Record<string, number>>({});
  const [_showPaymentResult, setShowPaymentResult] = useState(false);

  useEffect(() => {
    if (!identifier) {
      navigate('/resident/login');
      return;
    }
    
    // Kiểm tra kết quả thanh toán từ URL params
    const paymentStatus = searchParams.get('payment');
    const paymentMessage = searchParams.get('message');
    
    if (paymentStatus) {
      setShowPaymentResult(true);
      
      if (paymentStatus === 'success') {
        toast.success(paymentMessage || 'Thanh toán thành công!', {
          duration: 5000,
          icon: '✅'
        });
      } else if (paymentStatus === 'fail') {
        toast.error(paymentMessage || 'Thanh toán thất bại!', {
          duration: 5000,
          icon: '❌'
        });
      } else if (paymentStatus === 'error') {
        toast.error(paymentMessage || 'Lỗi xử lý thanh toán!', {
          duration: 5000,
          icon: '⚠️'
        });
      }
      
      // Xóa payment params khỏi URL sau khi hiển thị
      const newUrl = `/resident/dashboard?id=${identifier}`;
      window.history.replaceState({}, '', newUrl);
    }
    
    fetchResidentFees();
  }, [identifier]);

  const fetchResidentFees = async () => {
    try {
      setLoading(true);
      // Call API to get unpaid fees by phone number or ID card
      const response = await feeListService.getUnpaidFeesByIdentifier(identifier);
      
      if (response.data) {
        const { household, fees } = response.data;
        setHouseholdInfo(household);
        
        // Categorize fees by status: upcoming, active, overdue
        const upcoming: FeeItem[] = [];
        const active: FeeItem[] = [];
        const overdue: FeeItem[] = [];
        
        fees.forEach((fee: FeeItem) => {
          const statusInfo = getFeeStatus(fee.DOTTHUPHI, false);
          const isVoluntary = !fee.DOTTHUPHI.BATBUOC;
          
          // Ẩn các khoản phí TỰ NGUYỆN đã QUÁ HẠN
          if (statusInfo.status === 'overdue' && isVoluntary) {
            return; // Skip - không hiển thị
          }
          
          if (statusInfo.status === 'upcoming') {
            upcoming.push(fee);
          } else if (statusInfo.status === 'active') {
            active.push(fee);
          } else if (statusInfo.status === 'overdue') {
            overdue.push(fee);
          }
        });
        
        setUpcomingFees(upcoming);
        setActiveFees(active);
        setOverdueFees(overdue);
      }
    } catch (error: any) {
      console.error('Error fetching resident fees:', error);
      toast.error(error.response?.data?.message || 'Không tìm thấy thông tin. Vui lòng kiểm tra lại số căn cước.');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const calculateTotal = (fee: FeeItem) => {
    // KHÔNG TÍNH TIỀN NHÀ - Chỉ tính điện nước dịch vụ và xe
    return (
      Number(fee.TIENDICHVU || 0) + 
      Number(fee.TIENXEMAY || 0) + 
      Number(fee.TIENOTO || 0) + 
      Number(fee.TIENDIEN || 0) + 
      Number(fee.TIENNUOC || 0) +
      Number(fee.TIENINTERNET || 0)
    );
  };

  const calculateRemaining = (fee: FeeItem) => {
    return calculateTotal(fee) - Number(fee.SOTIENDADONG || 0);
  };

  const handlePayment = async (fee: FeeItem, isVoluntary: boolean = false) => {
    try {
      let amount;
      
      if (isVoluntary) {
        // Đóng góp tự nguyện: dùng số tiền người dùng nhập
        const customKey = `${fee.MADOTTHU}`;
        amount = customAmounts[customKey] || 0;
        
        if (amount <= 0) {
          toast.error('Vui lòng nhập số tiền muốn đóng góp');
          return;
        }
      } else {
        // Phí bắt buộc: tính từ hóa đơn
        amount = calculateRemaining(fee);
        if (amount <= 0) {
          toast.error('Khoản phí này đã được thanh toán đầy đủ');
          return;
        }
      }

      // id_order format: "madotthu-mahokhau-loaiphi"
      // loaiphi: 0 = bắt buộc (DANHSACHTHUPHI), 1 = tự nguyện (DONGGOP)
      const loaiphi = isVoluntary ? 1 : 0;
      const id_order = `${fee.MADOTTHU}-${fee.MAHOKHAU}-${loaiphi}`;
      
      const response = await fetch(`${API_URL}/vnpay`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          des: `Thanh toán ${fee.DOTTHUPHI.TEN}`,
          id_order: id_order,
          identifier: identifier // Thêm identifier để redirect về đúng trang
        })
      });

      const data = await response.json();
      
      if (data.link) {
        // Redirect to VNPay payment page
        window.location.href = data.link;
      } else {
        toast.error('Không thể tạo link thanh toán');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error('Lỗi khi tạo thanh toán');
    }
  };

  // Helper function to render a fee card
  const renderFeeCard = (fee: FeeItem, statusType: FeeStatus) => {
    const statusInfo = getFeeStatus(fee.DOTTHUPHI, false);
    const isVoluntary = !fee.DOTTHUPHI.BATBUOC;
    
    // Determine border and badge colors based on status
    let borderColor = 'border-blue-500';
    let badgeColor = 'bg-blue-100 text-blue-700';
    
    if (statusType === 'upcoming') {
      borderColor = 'border-gray-400';
      badgeColor = 'bg-gray-100 text-gray-700';
    } else if (statusType === 'overdue') {
      borderColor = 'border-red-500';
      badgeColor = 'bg-red-100 text-red-700';
    }

    return (
      <div key={fee.MADOTTHU} className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${borderColor}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800">{fee.DOTTHUPHI.TEN}</h3>
            <p className="text-sm text-gray-500">
              {new Date(fee.DOTTHUPHI.NGAYTAO).toLocaleDateString('vi-VN')}
            </p>
            {fee.DOTTHUPHI.NGAYBATDAU && fee.DOTTHUPHI.NGAYKETTHUC && (
              <p className="text-xs text-gray-600 mt-1">
                🗓️ {new Date(fee.DOTTHUPHI.NGAYBATDAU).toLocaleDateString('vi-VN')} 
                {' - '}
                {new Date(fee.DOTTHUPHI.NGAYKETTHUC).toLocaleDateString('vi-VN')}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`px-3 py-1 ${badgeColor} rounded-full text-xs font-semibold`}>
              {statusInfo.label}
            </span>
            {isVoluntary && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                Tự nguyện
              </span>
            )}
          </div>
        </div>
        
        {fee.DOTTHUPHI.MOTA && (
          <p className="text-sm text-gray-600 mb-3">{fee.DOTTHUPHI.MOTA}</p>
        )}
        
        {!isVoluntary && (
          <div className="space-y-2 mb-4">
            {fee.TIENDICHVU > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Dịch vụ:</span>
                <span className="font-semibold">{formatCurrency(fee.TIENDICHVU)}</span>
              </div>
            )}
            {fee.TIENDIEN > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Điện:</span>
                <span className="font-semibold">{formatCurrency(fee.TIENDIEN)}</span>
              </div>
            )}
            {fee.TIENNUOC > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Nước:</span>
                <span className="font-semibold">{formatCurrency(fee.TIENNUOC)}</span>
              </div>
            )}
            {fee.TIENINTERNET && fee.TIENINTERNET > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Internet:</span>
                <span className="font-semibold">{formatCurrency(fee.TIENINTERNET)}</span>
              </div>
            )}
            {fee.TIENXEMAY && fee.TIENXEMAY > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Gửi xe máy:</span>
                <span className="font-semibold">{formatCurrency(fee.TIENXEMAY)}</span>
              </div>
            )}
            {fee.TIENOTO && fee.TIENOTO > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Gửi ô tô:</span>
                <span className="font-semibold">{formatCurrency(fee.TIENOTO)}</span>
              </div>
            )}
          </div>
        )}
        
        <div className="pt-4 border-t space-y-3">
          {isVoluntary ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số tiền muốn đóng góp:
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  placeholder="Nhập số tiền (VNĐ)"
                  value={customAmounts[`${fee.MADOTTHU}`] || ''}
                  onChange={(e) => setCustomAmounts({
                    ...customAmounts,
                    [`${fee.MADOTTHU}`]: Number(e.target.value)
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {customAmounts[`${fee.MADOTTHU}`] > 0 && (
                  <p className="text-sm text-blue-600 mt-1">
                    = {formatCurrency(customAmounts[`${fee.MADOTTHU}`])}
                  </p>
                )}
              </div>
              <button
                onClick={() => handlePayment(fee, true)}
                disabled={!customAmounts[`${fee.MADOTTHU}`] || customAmounts[`${fee.MADOTTHU}`] <= 0 || statusType === 'upcoming'}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                {statusType === 'upcoming' ? 'Chưa đến hạn' : 'Đóng góp qua VNPay'}
              </button>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700 font-medium">Còn phải đóng:</span>
                <span className={`text-2xl font-bold ${statusType === 'overdue' ? 'text-red-600' : 'text-blue-600'}`}>
                  {formatCurrency(calculateRemaining(fee))}
                </span>
              </div>
              <button
                onClick={() => handlePayment(fee, false)}
                disabled={statusType === 'upcoming'}
                className={`w-full ${statusType === 'overdue' ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'} disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                {statusType === 'upcoming' ? 'Chưa đến hạn' : 'Thanh toán qua VNPay'}
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-purple-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 font-medium">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Cổng thông tin Cư dân
                </h1>
                <p className="text-sm text-gray-600">Tra cứu: {identifier}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/resident/login')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Tra cứu khác
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Household Info */}
        {householdInfo && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin hộ khẩu</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Mã hộ khẩu</p>
                <p className="font-semibold text-gray-900">{householdInfo.MAHOKHAU}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Chủ hộ</p>
                <p className="font-semibold text-gray-900">{householdInfo.CHUHO}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phòng</p>
                <p className="font-semibold text-gray-900">{householdInfo.TENPHONG}</p>
              </div>
            </div>
          </div>
        )}

        {/* Overdue Fees - Quá hạn */}
        {overdueFees.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-red-700">Phí quá hạn chưa đóng ({overdueFees.length})</h2>
                <p className="text-sm text-red-600">Các khoản phí đã quá hạn thanh toán</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {overdueFees.map((fee) => renderFeeCard(fee, 'overdue'))}
            </div>
          </div>
        )}

        {/* Active Fees - Đang trong đợt */}
        {activeFees.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue-700">Đang trong đợt đóng ({activeFees.length})</h2>
                <p className="text-sm text-blue-600">Các khoản phí đang mở để thanh toán</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeFees.map((fee) => renderFeeCard(fee, 'active'))}
            </div>
          </div>
        )}

        {/* Upcoming Fees - Sắp đến đợt */}
        {upcomingFees.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-700">Sắp đến đợt đóng ({upcomingFees.length})</h2>
                <p className="text-sm text-gray-600">Các khoản phí sắp mở trong thời gian tới</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {upcomingFees.map((fee) => renderFeeCard(fee, 'upcoming'))}
            </div>
          </div>
        )}

        {/* No fees message */}
        {upcomingFees.length === 0 && activeFees.length === 0 && overdueFees.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-semibold text-gray-800">Tuyệt vời!</p>
            <p className="text-gray-600">Bạn đã hoàn thành tất cả các khoản phí</p>
          </div>
        )}
      </main>
    </div>
  );
}
