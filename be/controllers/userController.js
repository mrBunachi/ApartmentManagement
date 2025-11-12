const userServices = require("../services/userServices")



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
      const result = await userServices.getUsers(data=filters);
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
    deleteUserController,
    getUserController
}