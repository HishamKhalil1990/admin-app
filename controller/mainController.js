const hana = require('../utils/hana')
const functions = require('../utils/functions')
const prisma = require('../utils/prismaDB')

const mainPage = async (req,res) => {
    await prisma.deleteAll()
    res.render('main')
}

const getWhs = async (req,res) => {
    const whs = await hana.getwarehouseList()
    if(whs != 'error'){
        res.send(whs)
    }else{
        res.send('error')
    }
}

const getTable = async (req,res) => {
    const {id} = req.params
    const data = await functions.getItems(id)
    if((data != "error") && (data != "noData")){
        res.render('partials/table',{results:data})
    }else{
        res.send(data)
    }
}

const changeStatus = async (req,res) => {
    const {id,status,counter} = req.params
    let msg;
    if(status == 'true'){
        msg = await prisma.updateSelect(id,true,counter)
    }else{
        msg = await prisma.updateSelect(id,false,counter)
    }
    res.send(msg)
}

const getReport = async(req,res) => {
    const data = await prisma.findReport()
    res.render('partials/report',{results:data})
}

const sendData = async (req,res) => {
    const {date,name,note} = req.params
    const time = new Date(date).toISOString()
    try{
        const data = await prisma.findReport()
        if(data.length > 0){
            await functions.sendToSql(name,time,data,note)
            .then(() => {
                res.send('done')
            })
            .catch(() => {
                res.send('error')
            })
        }else{
            res.send('noData')
        }
    }catch(err){
        res.send('error')
    }
}

const changeAllStatus = async (req,res) => {
    const {status} = req.params
    let msg;
    if(status == 'true'){
        msg = await prisma.updateAllSelect(true)
    }else{
        msg = await prisma.updateAllSelect(false)
    }
    if(msg != 'error'){
        const data = await prisma.findAll()
        res.render('partials/table',{results:data})
    }else{
        res.send('error')
    }
}

module.exports = {
    mainPage,
    getWhs,
    getTable,
    changeStatus,
    getReport,
    sendData,
    changeAllStatus
}