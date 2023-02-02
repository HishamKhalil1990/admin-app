const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const createRecords = async (records,user) => {
    const mappedRecs = records.map((rec) => {
        return {
            ItemCode:rec.ItemCode != null? rec.ItemCode : 'Null',
            ItemName:rec.ItemName != null? rec.ItemName : 'Null',
            CodeBars:rec.BarCode != null? rec.BarCode : undefined,
            WhsCode:rec.WhsCode != null? rec.WhsCode : 'Null',
            BuyUnitMsr:rec.UgpName != null? rec.UgpName : undefined,
            Price:rec.Price != null? rec.Price : parseFloat(1),
            ScaleType:rec.U_ScaleType != null? rec.U_ScaleType : undefined,
            WhsName:rec.WhsName != null? rec.WhsName : 'Null',
            PartnerName:rec.PartnerName != null? rec.PartnerName : 'Null',
            ItmsGrpCod:rec.ItmsGrpCod != null? rec.ItmsGrpCod : 0,
            ItmsGrpNam:rec.ItmsGrpNam != null? rec.ItmsGrpNam : 'Null',
            PrchseItem:rec.PrchseItem != null? rec.PrchseItem : 'Null',
            SellItem:rec.SellItem != null? rec.SellItem : 'Null',
            InvntItem:rec.InvntItem != null? rec.InvntItem : 'Null',
            UgpEntry:rec.UgpEntry != null? rec.UgpEntry : 0,
            NewFamily:rec.U_O_NewFamily != null? rec.U_O_NewFamily : 'Null',
            Division:rec.U_O_Division != null? rec.U_O_Division : 'Null',
            Category:rec.U_O_Category != null? rec.U_O_Category : 'Null',
            SubCategory:rec.U_O_SubCategory != null? rec.U_O_SubCategory : 'Null',
            Brand:rec.U_O_Brand != null? rec.U_O_Brand : 'Null',
            Group:rec.U_O_Group != null? rec.U_O_Group : 'Null',
            Segement:rec.U_O_Segement != null? rec.U_O_Segement : 'Null',
            SubSegment:rec.U_O_SubSegment != null? rec.U_O_SubSegment : 'Null',
            WhsLocked:rec.U_WhsLocked != null? rec.U_WhsLocked : 'Null',
            User:user
        }
    })
    return await create(mappedRecs)
    .catch((e) => {
        console.log(e)
        return 'error'
      })
      .finally(async () => {
        // await prisma.$disconnect()
        return 'created'
      })
}

const deleteAll = async (user) => {
    return await prisma.countRequest.deleteMany({
        where:{
            User:user
        }
    })
    .catch((e) => {
        console.log(e)
        return 'error'
    })
    .finally(async () => {
        // await prisma.$disconnect()
        return 'deleted'
    })
}

const findAll = async (user) => {
    return await prisma.countRequest.findMany({
        where:{
            User:user
        }
    })
            .catch((e) => {
                console.log(e)
                return 'error'
            })
            .finally(async () => {
                // await prisma.$disconnect()
                return 'deleted'
            })
}

const create = async (records) => {
    return await prisma.countRequest.createMany({
        data: records,
        skipDuplicates: true,
    })
}

const updateSelect = async (id,status,counter) => {
    return await update(id,status,counter)
                .catch((e) => {
                    console.log(e)
                    return 'error'
                })
                .finally(async () => {
                    // await prisma.$disconnect()
                    return 'done'
                })
}

const updateAllSelect = async (status) => {
    return await updateAll(status)
                .catch((e) => {
                    console.log(e)
                    return 'error'
                })
                .finally(async () => {
                    // await prisma.$disconnect()
                    return 'done'
                })
}

const updateSelectBulk = async (id,status,counter,arr) => {
    return await update(id,status,counter)
                .finally(async () => {
                    // await prisma.$disconnect()
                    arr.push('added')
                })
}

const update = async (id,status,counter) => {
    return await prisma.countRequest.update({
        where:{
            id:parseInt(id)
        },
        data:{
            Selected:status,
            counter:parseInt(counter)
        }
    })
}

const updateAll = async (status) => {
    return await prisma.countRequest.updateMany({
        where:{
            Selected:!status
        },
        data:{
            Selected:status,
        }
    })
}

const findReport = async(user) =>{
    return await prisma.countRequest.findMany({
                orderBy:{
                    counter : 'desc'
                },
                where : {
                    Selected : true,
                    User:user
                }
            })
            .catch((e) => {
                console.log(e)
                return 'error'
            })
            .finally(async () => {
                // await prisma.$disconnect()
                return 'deleted'
            })
}

module.exports = {
    createRecords,
    deleteAll,
    findAll,
    updateSelect,
    findReport,
    updateSelectBulk,
    updateAllSelect
}