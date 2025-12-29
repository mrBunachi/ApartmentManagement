const lichsuServices = require("../services/lichsucutruServices");

const getHistoryController = async (req, res) => {
  try {
    const { id } = req.params; // Lấy id từ params (nếu có)
    
    // Kiểm tra include: ?include=true
    const include = req.query.include !== undefined;

    let resultData; // Biến chứa kết quả trả về

    if (id) {
      // --- TRƯỜNG HỢP 1: LẤY CHI TIẾT THEO ID ---
      const result = (await lichsuServices.gethistoryById(id, include)).hisData;

      if (!result) {
        return res.status(404).json({ message: "Không tìm thấy lịch sử cư trú này" });
      }
      
      // Trả về mảng 1 phần tử để nhất quán format với FE (tùy chọn)
      resultData = [result]; 

    } else {
      // --- TRƯỜNG HỢP 2: LẤY DANH SÁCH (FILTER & PAGING) ---
      const filters = { ...req.query };
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 20;

      // Xóa các field điều khiển để lại data filter sạch
      delete filters.page;
      delete filters.limit;
      delete filters.include;

      const result = await lichsuServices.getHistories(filters, page, limit, include);

      if (!result || !result.hisData || result.countHisData === 0) {
        return res.status(404).json({ message: "Không tìm thấy dữ liệu lịch sử nào" });
      }
      
      // Trả về object { hisData: [], countHisData: ... }
      resultData = result;
    }

    return res
      .status(200)
      .json({ 
        message: "Tra cứu lịch sử thành công", 
        data: resultData 
      });

  } catch (error) {
    return res
      .status(error.status || 500)
      .json({ 
        message: "Lỗi tra cứu lịch sử", 
        error: error.message 
      });
  }
};

module.exports = {
    getHistoryController
};