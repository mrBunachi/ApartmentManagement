const {prisma} = require("../config/database")

const createUser= async (data) => {
    try{
        const newUser = await prisma.nGUOIQUANLY.create({
            data
        })
        return {newUser};
    }
    catch(error){
        throw {error};
    }
}
const getUsers = async (name = null, page = 1, limit = 20) => {
  try {
    const where = name
      ? {
          HOTEN: {
            contains: name,
            mode: "insensitive"
          }
        }
      : {};

    const users = await prisma.nGUOIQUANLY.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where
    });
    const count = await prisma.nGUOIQUANLY.count({
        skip: (page - 1) * limit,
        take: limit,
        where
    })

    return {users, count};
  } catch (error) {
    throw {error};
  }
};

const getUserById = async (id) => {
    try{
        where = {
            TENDANGNHAP:{
                equals: id,
                mode: "default"
            }
        };
        const user =await prisma.nGUOIQUANLY.findUnique({
            where
        });
        return {user}; 

    }
    catch(error){
        throw {error};
    }
}

const updateUser = async(id, updataData) => {
    try{
        where = {
            TENDANGNHAP:{
                equals: id
            }
        }
        const updateUser =await prisma.nGUOIQUANLY.update({
            where,
            data:updataData
        })
        return {updateUser};
    }
    catch(error){
        throw {error};
    }

}

const deleteUser = async (id) => {
    try{
        where = {
            TENDANGNHAP:{
                equals:id
            }
        }
        const deleteUser =await prisma.nGUOIQUANLY.delete({
            where
        })
        return {deleteUser};

    }
    catch(error){
        throw {error};
    }
};

module.exports = {
    deleteUser,
    updateUser,
    getUserById,
    getUsers,
    createUser
};