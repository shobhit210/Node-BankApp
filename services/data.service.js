//This file can be named anything. Only extension should be .js

const db = require('./db')

user = {
    1001: { acno: 1001, uname: "shobhit", password: "userone", balance: 5000, transaction: [] },
    1002: { acno: 1002, uname: "gargi", password: "usertwo", balance: 8000, transaction: [] },
    1003: { acno: 1003, uname: "akash", password: "userthree", balance: 4000, transaction: [] },
    1004: { acno: 1004, uname: "vijay", password: "userfour", balance: 2000, transaction: [] }
}


const register = (acno, uname, password) => {

    console.log("Register called");

    return db.User.findOne({
        acno
    }).then(user => {
        console.log(user);
        if (user) {
            return {
                statusCode: 422,
                status: false,
                message: "User already exists... Please log in..."
            }
        } else {
            const newUser = new db.User({
                acno,
                uname,
                password,
                balance: 0,
                transaction: []
            })
            newUser.save()
            return {
                statusCode: 200,
                status: true,
                message: "Registration successful..."
            }
        }
    })

    // if (acno in user) {
    //     return {
    //         statusCode: 422,
    //         status: false,
    //         message: "User already exists... Please log in..."
    //     }
    // } else {
    //     user[acno] = {
    //         acno,
    //         uname,
    //         password,
    //         balance: 0,
    //         transaction: []
    //     }
    //     return {
    //         statusCode: 200,
    //         status: true,
    //         message: "Registration successful..."
    //     }
    // }
}



const login = (req, acno, pswd) => {

    return db.User.findOne({
        acno,
        password: pswd
    }).then(user => {
        if (user) {
            req.session.currentAcc = user.acno
            return {
                statusCode: 200,
                status: true,
                message: "Succesfully logged in",
                userName: user.uname,
                currentAcc: user.acno
            }
        }
        return {
            statusCode: 422,
            status: false,
            message: "No user exists"
        }
    })

    // if (acno in user) {
    //     if (pswd == user[acno]["password"]) {
    //         currentUser = user[acno]["uname"]
    //         req.session.currentAcc = acno;
    //         return {
    //             statusCode: 200,
    //             status: true,
    //             message: "Succesfully logged in"
    //         }
    //     } else {
    //         return {
    //             statusCode: 422,
    //             status: false,
    //             message: "Incorrect password"
    //         }
    //     }
    // } else {
    //     return {
    //         statusCode: 422,
    //         status: false,
    //         message: "Invalid account number"
    //     }
    // }
}



const deposit = (acno, pswd, amt) => {
    var amount = parseInt(amt);
    return db.User.findOne({
        acno,
        password: pswd
    }).then(user => {
        if (!user) {
            return {
                statusCode: 422,
                status: false,
                message: "Invalid User"
            }
        }
        user.balance += amount
        user.transaction.push({
            amount: amount,
            type: "CREDIT"
        })
        user.save()
        return {
            statusCode: 200,
            status: true,
            message: amount + " deposited successfully and new balance is: " + user.balance
        }
    })


    // if (acno in user) {
    //     if (pswd == user[acno]["password"]) {
    //         user[acno]["balance"] += amount;
    //         user[acno].transaction.push({
    //             amount: amount,
    //             type: "CREDIT"
    //         })
    //         return {
    //             statusCode: 200,
    //             status: true,
    //             message: amount + " deposited successfully and new balance is: " + user[acno]["balance"]
    //         }

    //     } else {
    //         return {
    //             statusCode: 422,
    //             status: false,
    //             message: "Incorrect Password"
    //         }
    //     }
    // } else {
    //     return {
    //         statusCode: 422,
    //         status: false,
    //         message: "Invalid User"
    //     }
    // }
}



const withdrawal = (req, acno, pswd, amt) => {
    var amount = parseInt(amt);

    return db.User.findOne({
        acno,
        password: pswd
    }).then(user => {
        if (!user) {
            return {
                statusCode: 422,
                status: false,
                message: "Invalid User"
            }
        }
        if (req.session.currentAcc != user.acno){
            return {
                statusCode: 422,
                status: false,
                message: "Operation Denied"
            }
        }
        if (user.balance < amount) {
            return {
                statusCode: 422,
                status: false,
                message: "Insufficient Balance"
            }
        }
        user.balance -= amount
        user.transaction.push({
            amount: amount,
            type: "DEBIT"
        })
        user.save()
        return {
            statusCode: 200,
            status: true,
            message: amount + " withdrawn successfully and new balance is: " + user.balance
        }
    })

    // if (acno in user) {
    //     if (pswd == user[acno]["password"]) {
    //         if (user[acno]["balance"] > amount) {
    //             user[acno]["balance"] -= amount
    //             user[acno].transaction.push({
    //                 amount: amount,
    //                 type: "DEBIT"
    //             })
    //             return {
    //                 statusCode: 200,
    //                 status: true,
    //                 message: amount + " debited successfully and new balance is: " + user[acno]["balance"]
    //             }

    //         } else {
    //             return {
    //                 statusCode: 422,
    //                 status: false,
    //                 message: "Insufficient balance"
    //             }
    //         }
    //     } else {
    //         return {
    //             statusCode: 422,
    //             status: false,
    //             message: "Incorrect Password"
    //         }
    //     }
    // } else {
    //     return {
    //         statusCode: 422,
    //         status: false,
    //         message: "Invalid User"
    //     }
    // }
}



const getTransaction = (acno) => {
    return db.User.findOne({
        acno
    }).then(user => {
        if (user) {
            return {
                statusCode: 200,
                status: true,
                transaction: user.transaction
            }
        } else {
            return {
                statusCode: 422,
                status: false,
                message: "Invalid Operation"
            }
        }
    })

}



const deleteAcc = (acno) => {
    return db.User.deleteOne({
        acno:acno
    }).then(user => {
        if(!user){
            return{
                statusCode: 422,
                status: false,
                message: "Invalid Operation"
            }
        }
        return {
            statusCode: 200,
            status: true,
            message: "Account Number "+ acno + "successfully deleted"
        }
    })
}

module.exports = {
    register,
    login,
    deposit,
    withdrawal,
    getTransaction,
    deleteAcc
}