const {prisma} = require("../config/database")

const createResident = async(data) => {
    try{
        const newRes = await prisma.nHANKHAU.create({
            data
        })
        return {newRes};
    }
    catch(error){
        throw {error};
    }
}

const getResById = async (id , active=true) => {
    try{
        where ={
            MANHANKHAU:{
                equals:id,
            },
            ACTIVE:{
                equals:active
            }
        };
        const resident = prisma.nHANKHAU.findFirst({where});
        return {resident}

    }
    catch(error){
        throw {error};
    }
}
const deleteResident = async(id) => {
    try{
        where = {
            MANHANKHAU:{
                equals:id
            }
        };
        data = {
            ACTIVE:{
                equals:false
            }
        }
        const deleteRes = prisma.nHANKHAU.update({where, data});
        return {deleteRes}
    }
    catch(error){
        throw (error);
    }
}
const updateResident = async (id,data) => {
    try{
        where={
            MANHANKHAU:{
                equals:id
            }
        }
        const updateRes = prisma.nHANKHAU.update({where, data});
        return {updateRes};
    }
    catch(error){
        throw(error);
    }
}

const getResidents = async (data, page=0, limit = 10) => {

    const residents = prisma.nHANKHAU.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where:data
    })
}
module.exports = {
    createResident,
    getResById,
    deleteResident,
    updateResident,
    getResidents
}