const User = require('../model/user')
const Query = require('../model/query')
const Worksample = require('../model/worksample')
const Authors = require('../model/authors')
const Faqs = require('../model/faqs')
const Blog = require("../model/blog")
const Services = require("../model/services")
const Admin = require("../model/admin")
const Coupon = require("../model/coupon")
const Career = require("../model/career")
const Wallet = require("../model/wallet")
const Order = require("../model/order")
const multer = require("multer")
const bcrypt = require('bcrypt');
const httpMsgs = require("http-msgs")
const jwt = require('jsonwebtoken')
const path = require('path')
const { Console } = require('console')


module.exports.checkLogin = (req, res, next) => {
    if (req.cookies.adminToken === undefined) {
        res.redirect("/getproadmin")
    } else {
        next()
    }
}

const Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        let a = file.originalname
        let extname = path.extname(a)
        if (extname === ".jpg" || extname === ".png") {
            callback(null, './public/image')
        } else if (extname === ".pdf") {
            callback(null, './public/upload-pdf')
        }
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + Date.now() + file.originalname)
    }
})

module.exports.upload = multer({
    storage: Storage,
})
module.exports.adminLogin = async (req, res) => {

    res.render('adminLogin.ejs')
}

module.exports.adminLoginSubmit = async (req, res) => {
    const reqEmail = req.body.email
    const reqPass = req.body.password
    try {
        const adminData = await Admin.findOne({ email: reqEmail })
        if (adminData !== null) {
            if (adminData.password === reqPass) {
                let Id = adminData._id
                var token = jwt.sign({ Id }, 'shhhhh');
                res.cookie('adminToken', token)
                res.redirect("/dashboard")
            } else {
                httpMsgs.send500(req, res, "your password is inccorect")
            }
        } else {
            httpMsgs.send500(req, res, "your account dose not exist")
        }

    } catch (error) {

    }

}

module.exports.dashboard = (req, res) => {

    res.render('dashboard.ejs')
}


module.exports.users = async (req, res) => {
    try {
        const userData = await User.find()
        res.render('users.ejs', { userData })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}

module.exports.updateUser = async (req, res) => {
    try {
        const id = req.params.id
        idUserData = await User.findById(id)
        res.render("userupdate.ejs", { idUserData })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}


module.exports.updateUserSubmit = async (req, res) => {
    try {
        const newUser = req.body.username
        const newEmail = req.body.email
        const newPassword = req.body.password
        let password = await bcrypt.hash(req.body.password, 10)
        const id = req.params.id
        let existUsername = await User.findOne({ username: newUser })
        if (existUsername === null) {
            await User.findByIdAndUpdate(id, { username: newUser, password: password })
            res.redirect("/users")
        } else {
            httpMsgs.send500(req, res, "username is already exist")
        }

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}

module.exports.deleteteUser = async (req, res) => {
    try {
        const id = req.params.id
        await User.findByIdAndDelete(id)
        res.redirect("/users")
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}

module.exports.query = async (req, res) => {
    const queryData = await Query.find()
    res.render('query.ejs', { queryData })
}
module.exports.queryAdd = async (req, res) => {

    let fullname = req.body.fullName;
    let email = req.body.email;
    let subject = req.body.subject;
    let message = req.body.message;

    try {
        const userData = new Query({ fullName: fullname, email: email, subject: subject, message: message })
        await userData.save()
        res.status(201).json({
            data: userData
        })

    } catch (error) {
        res.json({
            error: error.message
        })
    }
};


module.exports.worksample = async (req, res) => {
    try {
        const workSampleData = await Worksample.find()
        res.render('workSample.ejs', { workSampleData })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}

module.exports.addworksample = (req, res) => {
    res.render('worksample-add.ejs')
}

module.exports.addworksampleSubmit = async (req, res) => {

    try {
        // const img = req.file.filename
        const title = req.body.title
        const dec = req.body.dec
        var img;
        var pdf;
        await req.files.img.forEach(element => {
            img = element.filename
        })
        await req.files.pdf.forEach(element => {
            pdf = element.filename
        })


        const workSample = new Worksample({ title: title, dec: dec, image: img, pdf: pdf })
        await workSample.save()
        res.redirect("/workSample")
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.updateworksample = async (req, res) => {
    const id = req.params.id
    const idData = await Worksample.findById(id)
    // const workSampleData = await Worksample.find()
    res.render('worksample-edit.ejs', { idData })
}

module.exports.updateworksampleSubmit = async (req, res) => {
    try {
        const newTitle = req.body.title
        const newDec = req.body.dec
        const id = req.params.id
        var img;
        var pdf;
        if(req.files.img){
            await req.files.img.forEach(element => {
                img = element.filename
            })
            await Worksample.findByIdAndUpdate(id, { title: newTitle, dec: newDec, image: img})
        res.redirect("/workSample")
        }; 
        if(req.files.pdf){
            await req.files.pdf.forEach(element => {
                pdf = element.filename
            })
            await Worksample.findByIdAndUpdate(id, { title: newTitle, dec: newDec,pdf:pdf})
            res.redirect("/workSample")
        }else{
            await Worksample.findByIdAndUpdate(id, { title: newTitle, dec: newDec,image: img,pdf:pdf})
            res.redirect("/workSample") 
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}


module.exports.deleteworksampleSubmit = async (req, res) => {
    try {
        const id = req.params.id
        await Worksample.findByIdAndDelete(id)
        res.redirect("/workSample")
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.authors = async (req, res) => {
    try {
        const AuthorData = await Authors.find()
        res.render("authors.ejs", { AuthorData })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.addAuthors = async (req, res) => {

    try {
        res.render("authors-add.ejs")

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.addAuthorsSubmit = async (req, res) => {

    try {
        const title = req.body.title
        const dec = req.body.dec
        const lognDec = req.body.longDec
        var img;
        var pdf;
        await req.files.img.forEach(element => {
            img = element.filename
        })
        const auther = new Authors({ title: title, dec: dec, longDec: lognDec, image: img})
        await auther.save()
        res.redirect("/authors")
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.updateAuthors = async (req, res) => {
    try {
        const id = req.params.id
        const AuthorData = await Authors.findById(id)
      
        res.render("authors-edit.ejs", { AuthorData })

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.updateAuthorsSubmit = async (req, res) => {
    try {
        const newTitle = req.body.title
        const newDec = req.body.dec
        const newlongDec = req.body.longDec
        var img;
        var pdf;
        const id = req.params.id
       if(req.files.img){
        await req.files.img.forEach(element => {
            img = element.filename
        })
        await Authors.findByIdAndUpdate(id, { title: newTitle, dec: newDec, longDec: newlongDec, image: img})
        res.redirect("/authors")
    }else{
        await Authors.findByIdAndUpdate(id, { title: newTitle, dec: newDec, longDec: newlongDec})
        res.redirect("/authors")
    }
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}


module.exports.deleteAuthor = async (req, res) => {
    try {
        const id = req.params.id
        await Authors.findByIdAndDelete(id)
        res.redirect("/authors")
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}



module.exports.faqs = async (req, res) => {

    try {
        const FaqsData = await Faqs.find()
        res.render("faq.ejs", { FaqsData })

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}
module.exports.addFaqs = async (req, res) => {

    try {

        res.render("faq-add.ejs")

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.addFaqsSubmit = async (req, res) => {

    try {
        const title = req.body.title
        const dec = req.body.dec
        const FaqData = new Faqs({ title: title, dec: dec })
        await FaqData.save()
        res.redirect("/faqs")
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}
module.exports.updateFaqs = async (req, res) => {

    try {
        const id = req.params.id
        const FaqsData = await Faqs.findById(id)
        res.render("faq-edit.ejs", { FaqsData })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}


module.exports.updateFaqsSubmit = async (req, res) => {
    try {
        const newTitle = req.body.title
        const newDec = req.body.dec
        const id = req.params.id
        await Faqs.findByIdAndUpdate(id, { title: newTitle, dec: newDec })
        res.redirect("/faqs")
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}

module.exports.blog = async (req, res) => {

    try {

        const BlogData = await Blog.find()
        res.render("blog.ejs", { BlogData })

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.addblog = async (req, res) => {

    try {
        res.render("blog-add.ejs")

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.addblogSubmit = async (req, res) => {
    try {
        const Title = req.body.title
        const Dec = req.body.dec
        const Name = req.body.name
        var img;
        var pdf;
        await req.files.img.forEach(element => {
            img = element.filename
        })
        const blogData = new Blog({ title: Title, name: Name, dec: Dec, image: img, pdf: pdf })
        await blogData.save()
        res.redirect("/blog")
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}

module.exports.updateBLog = async (req, res) => {
    try {
        const id = req.params.id
        const idData = await Blog.findById(id)
        res.render('blog-edit.ejs', { idData })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.updateBLogSubmit = async (req, res) => {
    try {
        const NewTitle = req.body.title
        const NewDec = req.body.dec
        const NewName = req.body.name
        const id = req.params.id
        var img;
        var pdf;
      
        if(req.files.img){
            await req.files.img.forEach(element => {
                img = element.filename
            })
            await Blog.findByIdAndUpdate(id, { title: NewTitle, name: NewName, dec: NewDec, image: img})
            res.redirect("/blog")
        }else{
            await Blog.findByIdAndUpdate(id, { title: NewTitle, name: NewName, dec: NewDec})
            res.redirect("/blog")
        }
       

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}


module.exports.deleteBlog = async (req, res) => {
    try {
        const id = req.params.id
        await Blog.findByIdAndDelete(id)
        res.redirect("/blog")
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}

module.exports.services = async (req, res) => {

    try {
        const servicesData = await Services.find()
        res.render('services.ejs', { servicesData })

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}

module.exports.addServices = async (req, res) => {

    try {

        res.render("services-add.ejs")

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.addServicesSubmit = async (req, res) => {

    try {
        const title = req.body.title
        const shortTitle = req.body.shortTitle
        const dec = req.body.dec
        const price = req.body.price

        const servicesData = new Services({ title: title, shortTitle: shortTitle, dec: dec, price: price })
        await servicesData.save()
        res.redirect("/services")
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}
module.exports.updateServices = async (req, res) => {

    try {
        const id = req.params.id
        const servicesData = await Services.findById(id)
        res.render("services-edit.ejs", { servicesData })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}


module.exports.updateServicesSubmit = async (req, res) => {
    try {
        const newTitle = req.body.title
        const newShortTitle = req.body.shortTitle
        const newDec = req.body.dec
        const newPrice = req.body.price
        const id = req.params.id
        await Services.findByIdAndUpdate(id, { title: newTitle, shortTitle: newShortTitle, dec: newDec, price: newPrice })
        res.redirect("/services")
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}

module.exports.logout = async (req, res) => {
    res.clearCookie('adminToken');
    res.redirect('/getproadmin')
}

module.exports.coupon = async (req, res) => {

    try {
        const CouponData = await Coupon.find()
        res.render("coupon.ejs", { CouponData })

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.addcoupon = async (req, res) => {

    try {

        res.render("coupon-add.ejs")

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.addCouponSubmit = async (req, res) => {

    try {

        const couponName = req.body.couponName
        const couponType = req.body.couponType
        const couponAmount = req.body.couponAmount
        const couponStatus = req.body.couponStatus
        const CouponData = await Coupon.findOne({ couponName: couponName })
        if (CouponData == null) {
            const couponData = new Coupon({ couponName: couponName, couponType: couponType, offAmount: couponAmount, status: couponStatus })
            await couponData.save()
            res.redirect("/coupon")
        } else {
           httpMsgs.send500(req, res, "coupon name is already exist")
        }

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.updateCoupon = async (req, res) => {

    try {
        const id = req.params.id
        const CouponData = await Coupon.findById(id)
        res.render("Coupon-edit.ejs", { CouponData })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.updateCouponSubmit = async (req, res) => {
    try {
        const newcouponNamee = req.body.couponName
        const newcouponType = req.body.coupontype
        const newoffAmount = req.body.couponAmount
        const couponStatus = req.body.couponStatus
        const id = req.params.id
        const CouponData = await Coupon.findOne({ couponName: newcouponNamee })
        if (CouponData == null) {
            await Coupon.findByIdAndUpdate(id, { couponName: newcouponNamee, couponType: newcouponType, offAmount: newoffAmount, status: couponStatus })
            res.redirect("/coupon")
        } else {
           httpMsgs.send500(req, res, "coupon name is already exist")
        }
        
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}

module.exports.deleteCoupon = async (req, res) => {
    try {
        const id = req.params.id
        await Coupon.findByIdAndDelete(id)
        res.redirect("/coupon")
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}

module.exports.career = async (req, res) => {

    try {
        const CareerData = await Career.find()
        res.render("career.ejs", { CareerData })

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.addCareer = async (req, res) => {

    try {
        res.render("career-add.ejs")

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.addCareerSubmit = async (req, res) => {

    try {
        const careerName = req.body.careerName
        const careerData = new Career({ careerName: careerName })
        await careerData.save()
        res.redirect("/career")
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.updateCareer = async (req, res) => {

    try {
        const id = req.params.id
        const CareerData = await Career.findById(id)
        res.render("career-edit.ejs", { CareerData })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.updateCareerSubmit = async (req, res) => {
    try {
        const newcareerName = req.body.careerName
        const id = req.params.id
        await Career.findByIdAndUpdate(id, { careerName: newcareerName })
        res.redirect("/career")
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}

module.exports.deleteCareer = async (req, res) => {
    try {
        const id = req.params.id
        await Career.findByIdAndDelete(id)
        res.redirect("/career")
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}

module.exports.chats = async (req, res) => {
    try {
        res.render("chats.ejs")
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}


module.exports.adminWalletTransactionHistory = async (req, res) => {

    try {
        const creditHistory = await Wallet.find({ pay_type: "credited" })
        const debitHistory = await Wallet.find({ pay_type: "debited" })
        res.render("wallethistory.ejs", { creditHistory, debitHistory })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports.adminOrderHistory = async (req, res) => {

    try {
        const OrderHistory = await Order.find()
        res.render("orderHistory.ejs", { OrderHistory })
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}


module.exports.viewOrderDetails = async (req, res) => {
    try {
        const id = req.params.id
       let OrderData= await Order.findById(id)
       console.log(OrderData)
       let Products=OrderData.products
        res.render("viewOrderDetails.ejs",{OrderData,Products})
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}

