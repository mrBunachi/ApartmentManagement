const userServices = require("../services/userServices")


const updateUserController = async (req, res) =>{
    try{
        user =req.user
        data = req.body
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
        
    }
}