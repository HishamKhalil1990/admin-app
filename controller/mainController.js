const hana = require('../utils/hana')
const functions = require('../utils/functions')
const prisma = require('../utils/prismaDB')
const file = require('../utils/readAndWriteFiles')

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
        req.session.roles = user[0].Roles.split('-').map(role => {
            if(role == '1'){
                return true
            }else{
                return false
            }
        })
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
        const roles = req.session.roles
        res.render('choose',{roles})
    }else{
        res.redirect('/')
    }
}

const countPage = async (req,res) => {
    const user = req.session.username
    if(req.session.loggedin)
    {
        await prisma.deleteAll(user)
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
    if(req.session.loggedin)
    {
        const whs = await hana.getwarehouseList()
        if(whs != 'error'){
            res.send(whs)
        }else{
            res.send('error')
        }
    }else{
        res.redirect('/')
    }
}

const getUsers = async (req,res) => {
    if(req.session.loggedin)
    {
        const { id } = req.params
        const users = await functions.getUseres(id)
        if(users != 'error'){
            req.session.users = users
            res.send(users)
        }else{
            res.send('error')
        }
    }else{
        res.redirect('/')
    }
}

const getWhsOnfo = async (req,res) => {
    if(req.session.loggedin)
    {
        const info = await functions.getWhsInfo()
        if(info){
            res.send(info)
        }else{
            res.send('error')
        }
    }else{
        res.redirect('/')
    }
}

const getTable = async (req,res) => {
    if(req.session.loggedin)
    {
        const {id} = req.params
        const user = req.session.username
        const data = await functions.getItems(id,user)
        if((data != "error") && (data != "noData")){
            res.render('partials/table',{results:data})
        }else{
            res.send(data)
        }
    }else{
        res.redirect('/')
    }
}

const changeStatus = async (req,res) => {
    if(req.session.loggedin)
    {
        const {id,status,counter} = req.params
        let msg;
        if(status == 'true'){
            msg = await prisma.updateSelect(id,true,counter)
        }else{
            msg = await prisma.updateSelect(id,false,counter)
        }
        res.send(msg)
    }else{
        res.redirect('/')
    }
}

const getReport = async(req,res) => {
    if(req.session.loggedin)
    {
        const user = req.session.username
        const data = await prisma.findReport(user)
        res.render('partials/report',{results:data})
    }else{
        res.redirect('/')
    }
}

const sendData = async (req,res) => {
    if(req.session.loggedin)
    {
        const adminUser = req.session.username
        const {date,name,note,user} = req.params
        const time = new Date(date).toISOString()
        const docNo = await file.getDocNo(user)
        try{
            const data = await prisma.findReport(adminUser)
            if(data.length > 0){
                await functions.sendToSql(name,time,data,note,user,docNo)
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
    }else{
        res.redirect('/')
    }
}

const changeAllStatus = async (req,res) => {
    if(req.session.loggedin)
    {
        const {status} = req.params
        const user = req.session.username
        let msg;
        if(status == 'true'){
            msg = await prisma.updateAllSelect(true)
        }else{
            msg = await prisma.updateAllSelect(false)
        }
        if(msg != 'error'){
            const data = await prisma.findAll(user)
            res.render('partials/table',{results:data})
        }else{
            res.send('error')
        }
    }else{
        res.redirect('/')
    }
}

const routing = (req,res) => {
    if(req.session.loggedin)
    {
        res.render('routing')
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
    getUsers,
    routing
}