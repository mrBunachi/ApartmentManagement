const contributionServices = require("../services/dongGopServices");

// GET /dong-gop và GET /dong-gop/:id
const getContributionController = async (req, res) => {
  try {
    const { id } = req.params;

    if (id) {
      // Lấy chi tiết
      const result = await contributionServices.getContributionById(id);
      return res.status(200).json({ 
        message: "Lấy thông tin đóng góp thành công", 
        data: result.contribution 
      });
    } else {
      // Lấy danh sách
      const filters = { ...req.query };
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 20;

      delete filters.page;
      delete filters.limit;

      const result = await contributionServices.getContributions(filters, page, limit);

      if (!result || result.count === 0) {
        return res.status(404).json({ message: "Không tìm thấy khoản đóng góp nào" });
      }

      return res.status(200).json({
        message: "Lấy danh sách đóng góp thành công",
        data: result.contributions,
        pagination: {
            total: result.count,
            page: page,
            limit: limit,
            totalPages: Math.ceil(result.count / limit)
        }
      });
    }
  } catch (error) {
    return res.status(error.status || 500).json({ 
      message: "Lỗi lấy thông tin đóng góp", 
      error: error.message 
    });
  }
};

// POST /dong-gop
const createContributionController = async (req, res) => {
  try {
    const data = { ...req.body };
    const result = await contributionServices.createContribution(data);
    return res.status(201).json({ 
        message: "Tạo khoản đóng góp thành công", 
        data: result.newContribution 
    });
  } catch (error) {
    return res.status(error.status || 500).json({ 
        message: "Lỗi tạo khoản đóng góp", 
        error: error.message 
    });
  }
};

// PUT /dong-gop/:id
const updateContributionController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    const result = await contributionServices.updateContribution(id, data);
    return res.status(200).json({ 
        message: "Cập nhật khoản đóng góp thành công", 
        data: result.updatedContribution 
    });
  } catch (error) {
    return res.status(error.status || 500).json({ 
        message: "Lỗi cập nhật khoản đóng góp", 
        error: error.message 
    });
  }
};

// DELETE /dong-gop/:id
const deleteContributionController = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await contributionServices.deleteContribution(id);
    return res.status(200).json({ 
        message: "Xóa khoản đóng góp thành công", 
        data: result.deletedContribution 
    });
  } catch (error) {
    return res.status(error.status || 500).json({ 
        message: "Lỗi xóa khoản đóng góp", 
        error: error.message 
    });
  }
};

module.exports = {
  getContributionController,
  createContributionController,
  updateContributionController,
  deleteContributionController
};