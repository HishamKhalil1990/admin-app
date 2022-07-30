const prisma = require('./prismaDB')
const hana = require('./hana')
const sql = require('./sql')

const getItems = async (id) => {
    await prisma.deleteAll()
    const records = await hana.getItems(id)
    if(records != 'error'){
        const status = await prisma.createRecords(records)
        if(status != "error"){
            return prisma.findAll()
        }else{
            return "error"
        }
    }else{
        return 'noData'
    }
}

const sendToSql = async (name,time,data,note) => {
    return new Promise((resolve,reject) => {
        const start = async () => {
            try{
                const pool = await sql.getSQL()
                const length = data.length
                const arr = []
                const quit = false
                for(let i = 0; i < data.length; i++){
                    const rec = data[i]
                    startTransaction(pool,rec,length,arr,name,time,note)
                    .then(() => {
                        resolve()
                    })
                    .catch((err) => {
                        quit = true
                    })
                    if(quit){
                        reject()
                    }
                }
            }catch(err){
                reject()
            }
        }
        start()
    })
}

const startTransaction = async (pool,rec,length,arr,name,time,note) => {
    const transaction = await sql.getTransaction(pool);
    return new Promise((resolve,reject) => {
        transaction.begin((err) => {
            if(err){
                console.log(err)
                reject()
            }
            pool.request()
            .input("CountingName",name)
            .input("CountingDate",time)
            .input("ItemCode",rec.ItemCode)
            .input("ItemName",rec.ItemName)
            .input("UnitMsr",rec.BuyUnitMsr)
            .input("WhsCode",rec.WhsCode)
            .input("CodeBars",rec.CodeBars)
            .input("Note",note)
            .execute("Sp_Add_InventoryCountingRequest",(err,result) => {
                if(err){
                    console.log('excute',err)
                    reject()
                }
                transaction.commit((err) => {
                    if(err){
                        console.log('transaction error : ',err)
                        reject()
                    }
                    console.log("Transaction committed.");
                    prisma.updateSelectBulk(rec.id,false,0,arr)
                    .then(() => {
                        if(arr.length == length){
                            pool.close();
                            resolve();
                        }
                    })
                    .catch(err => {
                        reject()
                    })
                });
            })
        })
    })
}

module.exports = {
    getItems,
    sendToSql
}