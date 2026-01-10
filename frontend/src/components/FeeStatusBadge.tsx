import type { DotThuPhi } from '../api/dotThuPhi.service';
import { getFeeStatus } from '../utils/feeStatus';

interface FeeStatusBadgeProps {
  dotThuPhi: DotThuPhi;
  isPaid?: boolean;
}

export const FeeStatusBadge = ({ dotThuPhi, isPaid = false }: FeeStatusBadgeProps) => {
  const statusInfo = getFeeStatus(dotThuPhi, isPaid);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
      {statusInfo.label}
    </span>
  );
};

export default FeeStatusBadge;
