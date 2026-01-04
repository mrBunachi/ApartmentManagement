const userServices = require("../services/userServices")



// Cập nhật thông tin user hiện tại (chính mình)
const updateUserController = async (req, res) =>{
    try{
        const user ={...req.user}
        const data = {...req.body}
        const updateUser =  await userServices.updateUser(user.id, data)
        if (!updateUser){
            return res.status(500).json({message: "Không cập nhật được user"})
        }
        else{
            res.status(200).json({message:"Cập nhật user thành công", updateUser:updateUser})
        }
    }
    catch(error){
        res.status(500).json({message:"Lỗi cập nhật user", error: error.message})
    }
}

// Cập nhật thông tin user khác (chỉ admin_1)
const updateUserByIdController = async (req, res) => {
    try{
        const { id } = req.params;
        const data = {...req.body}
        
        const updateUser = await userServices.updateUser(id, data)
        if (!updateUser){
            return res.status(500).json({message: "Không cập nhật được user"})
        }
        return res.status(200).json({message:"Cập nhật user thành công", updateUser:updateUser.updateUser})
    }
    catch(error){
        res.status(error.status || 500).json({message:"Lỗi cập nhật user", error: error.message})
    }
}

const deleteUserController = async (req, res) => {
    try{
        const id = req.params.id;
        if (id == req.user.id){
            return res.status(400).json({ message: "User không thể xóa chính mình" });
        }
        else{
            console.log(id)
            const deleteUser = await userServices.deleteUser(id)
            if (!deleteUser){
                return res.status(404).json({ message: "User không tồn tại" });
            }
            return res.status(200).json({ message: "Xóa user thành công", user: deleteUser });
        }
    }
    catch(error){
        res.status(error.status || 500).json({message:"Lỗi xóa user", error: error.message})
    }
}

// Lấy thông tin user hiện tại (đang đăng nhập)
const getMeController = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: "Không tìm thấy thông tin user trong token" });
    }
    
    const result = await userServices.getUserById(userId);
    
    if (!result || !result.user) {
      return res.status(404).json({ message: "Không tìm thấy user" });
    }
    
    // Xóa password trước khi trả về
    const { MATKHAU, ...userWithoutPassword } = result.user;
    
    return res.status(200).json({ 
      message: "Lấy thông tin thành công", 
      user: userWithoutPassword 
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi lấy thông tin user", error: error.message });
  }
};

const getUserController = async (req, res) => {
  try {
    const { id } = req.params; // lấy id từ params
  
    let users;

    if (id) {
      // lấy 1 user theo id
      
      const result = (await userServices.getUserById(id)).user;
      
      if (!result ) {
        return res.status(404).json({ message: "Không tìm thấy user" });
      }
      users = [result]; // để consistent với getUsers trả về mảng
    } else {
      // lấy danh sách user theo filter từ query hoặc body
      const filters = {...req.query} || {}; 
      const page = parseInt(filters.page) || 1;
      const limit = parseInt(filters.limit) || 20;
      delete filters.page;
      delete filters.limit;
      const result = await userServices.getUsers(data=filters, page, limit);
      if (!result || !result.users || result.users.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy user" });
      }
      users = result;
    }

    return res.status(200).json({ message: "Tìm user thành công", users });
  } 
  catch (error) {
    return res.status(500).json({ message: "Lỗi thông tin user", error: error.message });
  }
};


module.exports = {
    updateUserController,
    updateUserByIdController,
    deleteUserController,
    getUserController,
    getMeController
}