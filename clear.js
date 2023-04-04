const express =  require('express')
const cron = require('node-cron')
const app = express()
const moment = require('moment')
//app.use(express.json())

const transactions = []
const customers= {"101": {
    "customerID": 101,
    "balance": 0,
    "totalExpenses": 0,
    "totalEarnings": 0,
    "lastTransactionDate": null
},
"102": {
    "customerID": 102,
    "balance": 0,
    "totalExpenses": 0,
    "totalEarnings": 0,
    "lastTransactionDate": null
},
"103": {
    "customerID": 103,
    "balance": 0,
    "totalExpenses": 0,
    "totalEarnings": 0,
    "lastTransactionDate": null
},
"104": {
    "customerID": 104,
    "balance": 0,
    "totalExpenses": 0,
    "totalEarnings": 0,
    "lastTransactionDate": null
},
}


cron.schedule('*/10 * * * * *',()=>{
   startTransaction()
}
)
let lastTransId = 0;

function startTransaction(){
    console.log("Transaction started ....")
    const customerIDs = Object.keys(customers)
    const noOfCustomers = customerIDs.length
    const custId =customerIDs[ Math.floor(Math.random()*noOfCustomers)]
    const amount = Math.floor(Math.random()*10000-2500)
   const date = moment().format()
    const Rn = Math.random()
    let source ;
    if (Rn < 0.5){
         source = "offline"
    }else{
         source = "online"
    }
   const transaction = {
    transid : ++lastTransId,
    amount,
    custId,
    source,
    date
   }
   transactions.push(transaction)
   
   if(amount<0){
    customers[custId].totalExpenses -= amount  
   }else{
    customers[custId].totalEarnings += amount
   }
   customers[custId].balance += amount
  customers[custId].lastTransactionDate = date
}

cron.schedule('*/30 * * * * *',()=>{
    cleanUpTransactions()
})

function cleanUpTransactions(){
    console.log("Clearing the old transactions data");
    const targetTime = moment().subtract(30,"seconds")
    const targetTrans = transactions.filter((transaction)=>{
        return moment(transaction.date).isAfter(targetTime)
    })
    transactions.length = 0
    transactions.push(...targetTrans)
}

app.get('/customers',(req,res)=>{
res.json(customers)
})

app.get('/transactions',(req,res)=>{
res.json(transactions)
})

app.listen(3000,(err)=>{
  if(!err){
    console.log("server connected");
  }  
}
)