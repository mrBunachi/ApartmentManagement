const {prisma} = require("../config/database")

// model NGUOIQUANLY {
//   id          Int     @id @default(autoincrement())
//   TENDANGNHAP String  @unique @db.VarChar(50)
//   HOTEN       String
//   MATKHAU     String  @db.VarChar(255)
//   SODIENTHOAI String  @unique @db.VarChar(10)
//   EMAIL       String? @unique @db.VarChar(50)
//   VAITRO      String? @db.VarChar(50)
//   ACTIVATE    Boolean @default(true)

//   DOTTHUPHIs DOTTHUPHI[] // Một quản lý có thể tạo nhiều đợt thu
// }
const userDataParse = (data) => {
  try {
    const parsed = { ...data }

    if ("id" in parsed) parsed.id = parseInt(parsed.id, 10)
    if ("ACTIVATE" in parsed) parsed.ACTIVATE = parsed.ACTIVATE === 'true'

    return parsed
  } catch (error) {
    throw error
  }
}

const createUser= async (data) => {
    try{

        const newUser = await prisma.nGUOIQUANLY.create({
            data:userDataParse(data)
        })
        return {newUser};
    }
    catch(error){
        if (error.code === 'P2025') { // Prisma not found error
            throw { status: 404, message: 'User not found' }
        }
            throw { status: 500, message: error.message }
    }
}
const getUsers = async (data, page = 1, limit = 20) => {
  try {
    const users = await prisma.nGUOIQUANLY.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where:userDataParse(data)
    });
    
    const count = await prisma.nGUOIQUANLY.count({
        skip: (page - 1) * limit,
        take: limit,
        where:userDataParse(data)
    })

    return {users, count};
  } catch (error) {
    if (error.code === 'P2025') { // Prisma not found error
            throw { status: 404, message: 'User not found' }
        }
            throw { status: 500, message: error.message }
  }
};

const getUserById = async (id) => {
    try{
        const where = {
            id:parseInt(id)
        };
        const user =await prisma.nGUOIQUANLY.findFirst({
            where
        });
        return {user}; 

    }
    catch(error){
        if (error.code === 'P2025') { // Prisma not found error
            throw { status: 404, message: 'User not found' }
        }
            throw { status: 500, message: error.message }
    }
}

const updateUser = async(id, updateData) => {
    try{
        const where = {
                id:parseInt(id)
        }
        const updateUser =await prisma.nGUOIQUANLY.update({
            where,
            data:userDataParse(updateData)
        })
        return {updateUser};
    }
    catch(error){
        if (error.code === 'P2025') { // Prisma not found error
            throw { status: 404, message: 'User not found' }
        }
            throw { status: 500, message: error.message }
    }

}

const deleteUser = async (id) => {
    try{
        const where = {
            id:parseInt(id)
        }
        console.log(id)
        const deleteUser =await prisma.nGUOIQUANLY.update({
            where, data:{ACTIVATE:false}
        })
        return {deleteUser};

    }
    catch(error){
        if (error.code === 'P2025') { // Prisma not found error
            throw { status: 404, message: 'User not found' }
        }
            throw { status: 500, message: error.message }
    }
};

module.exports = {
    deleteUser,
    updateUser,
    getUserById,
    getUsers,
    createUser
};