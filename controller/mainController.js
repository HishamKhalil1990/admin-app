const hana = require('../utils/hana')
const functions = require('../utils/functions')
const prisma = require('../utils/prismaDB')

const loginPage = async (req,res) => {
    res.render('login')
}

const validate = async (req,res) => {
    const {username,password} = req.body;
    const user = await functions.getUser(username,password)
    if(user == undefined){
        res.send({msg: 'error'})
    }
    else if(user.length != 0){
        req.session.loggedin = true
        req.session.username = user[0].Username
        res.send({msg : 'validate'})
    }else if (user.length == 0){
        res.send({msg : 'not validate'})
    }
}

const logOut = (req,res) => {
    // req.session.loggedin = false
    // req.session.username = undefined
    // res.redirect('/')
    req.session.destroy(function(err) {
        res.redirect('/')
    })
}

const changeAllow = async (req,res) => {
    const {type,id,email} = req.params
    if(req.session.loggedin)
    {
        const msg = await functions.updateWhsInfo(type,id,email)
        res.send(msg)
    }else{
        res.send('error')
    }
}

const choosePage = async (req,res) => {
    if(req.session.loggedin)
    {
        res.render('choose')
    }else{
        res.redirect('/')
    }
}

const countPage = async (req,res) => {
    if(req.session.loggedin)
    {
        await prisma.deleteAll()
        res.render('count')
    }else{
        res.redirect('/')
    }
}

const openReqPage = async (req,res) => {
    if(req.session.loggedin)
    {
        res.render('openReq')
    }else{
        res.redirect('/')
    }
}

const getWhs = async (req,res) => {
    const whs = await hana.getwarehouseList()
    if(whs != 'error'){
        res.send(whs)
    }else{
        res.send('error')
    }
}

const getUsers = async (req,res) => {
    const { id } = req.params
    const users = await functions.getUseres(id)
    if(users != 'error'){
        req.session.users = users
        res.send(users)
    }else{
        res.send('error')
    }
}

const getWhsOnfo = async (req,res) => {
    const info = await functions.getWhsInfo()
    if(info){
        res.send(info)
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
    const {date,name,note,user} = req.params
    const time = new Date(date).toISOString()
    try{
        const data = await prisma.findReport()
        if(data.length > 0){
            await functions.sendToSql(name,time,data,note,user)
            .then(() => {
                res.send('done')
                const users = req.session.users
                for(let i = 0; i < users.length; i++){
                    if(users[i].Username == user){
                        const value = parseInt(users[i].CountingAvailable) + 1
                        functions.updateWhsInfo('count',user,value);
                        break;
                    }
                }
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
    countPage,
    getWhs,
    getTable,
    changeStatus,
    getReport,
    sendData,
    changeAllStatus,
    loginPage,
    openReqPage,
    choosePage,
    validate,
    logOut,
    getWhsOnfo,
    changeAllow,
    getUsers
}