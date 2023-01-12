const functions = require('../utils/functions')

const salesChooseWhs = async (req,res) => {
    if(req.session.loggedin)
    {
        res.render('whs')
    }else{
        res.redirect('/')
    }
}

const salesReportPage = async (req,res) => {
    if(req.session.loggedin)
    {
        res.render('salesReport')
    }else{
        res.redirect('/')
    }
}

const salesReportData = async (req,res) => {
    const { start, end, whs } = req.params
    if(req.session.loggedin)
    {
        functions.getSalesReportData(whs,start,end)
        .then(response => {
            let total = 0;
            response.data.forEach(rec => {
                total = total + parseFloat(rec.Amount)
            })
            total = parseFloat(total).toFixed(2)
            if(response.msg == 'done'){
                res.render('partials/salesReportTable',{results:response.data,total})
            }else{
                res.send('error')
            }
        })
    }else{
        res.redirect('/')
    }
}

module.exports = {
    salesReportPage,
    salesReportData,
    salesChooseWhs
}