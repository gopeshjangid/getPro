const adminRouter = require('express').Router()
const User = require('../model/user')
const Query = require('../model/query')
const Worksample = require('../model/worksample')
const Authors = require('../model/authors')
const Faqs = require('../model/faqs')
const multer = require("multer")
const bcrypt = require('bcrypt');




const Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './public/image')
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + file.originalname)
    }
})

var upload = multer({
    storage: Storage,
    limits: { fileSize: 1024 * 1024 * 10 }
})




const adminLogin = (req, res) => {
    res.render('adminLogin.ejs', { message: "" })
}

const adminLoginSubmit = (req, res) => {
    const reqEmail = req.body.email
    const reqPass = req.body.password
    const email = "getproadmin000@gmail.com"
    const password = "getproadmin@000"
    
    try {
        if (reqEmail === email) {
            if (reqPass === password) {
                res.redirect("/dashboard")
            } else {
                res.render('adminLogin.ejs', { message: "your password is incorrect" })
            }
        } else {
            res.render('adminLogin.ejs', { message: "your account does not exist" })
        }

    } catch (error) {

    }

}


const dashboard = (req, res) => {
    res.render('dashboard.ejs')
}

const users = async (req, res) => {
    try {
        const userData = await User.find()
        res.render('users.ejs', { userData })
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
    
}

const updateUser = async (req, res) => {
    try {
       const id=req.params.id
      idUserData=await User.findById(id)
      res.render("userupdate.ejs",{idUserData})
      } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}


const updateUserSubmit = async (req, res) => {
    try {
        const newUser= req.body.username
        const newEmail= req.body.email
        const newPassword= req.body.password
        let password = await bcrypt.hash(req.body.password, 10)
        const id=req.params.id
        let existUsername = await User.findOne({ username: newUser })
        if (existUsername === null){
            await User.findByIdAndUpdate(id,{username:newUser,email:newEmail,password:password})
            res.redirect("/users")
        }else{
            res.status(404).json({
                message: "username is already taken"
            }) 
        }
       
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}

const deleteteUser = async (req, res) => {
    try {
       const id=req.params.id
       await User.findByIdAndDelete(id)
       res.redirect("/users")
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}

const query = async(req, res) => {
    const queryData = await Query.find()
    res.render('query.ejs',{queryData})
}
const queryAdd = async (req, res) => {

    let fullname = req.body.fullName;
    let email = req.body.email;
    let subject = req.body.subject;
    let message = req.body.message;

    try {
        const userData = new Query({ fullName: fullname, email: email, subject: subject, message:message})
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


const worksample = async (req, res) => {
    try {
        const workSampleData = await Worksample.find()
        res.render('workSample.ejs', { workSampleData })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}

const addworksample = (req, res) => {
    res.render('worksample-add.ejs')
}

const addworksampleSubmit = async (req, res) => {

    try {
        const img = req.file.filename
        const title = req.body.title
        const dec = req.body.dec
        const image = new Worksample({ title: title, dec: dec, image: img })
        await image.save()
        res.redirect("/workSample")
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

const updateworksample = async(req, res) => {
   const id= req.params.id
   const idData=await Worksample.findById(id)
   // const workSampleData = await Worksample.find()
    res.render('worksample-edit.ejs',{idData})
}

const updateworksampleSubmit = async (req, res) => {
    try {
       const newTitle= req.body.title
       const newDec= req.body.dec
       const newImage= req.file.filename
       const id=req.params.id
       await Worksample.findByIdAndUpdate(id,{title:newTitle,dec:newDec,image:newImage})
       res.redirect("/workSample")
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}


const deleteworksampleSubmit = async (req, res) => {
    try {
       const id=req.params.id
       await Worksample.findByIdAndDelete(id)
       res.redirect("/workSample")
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const authors = async (req, res) => {
    try {
       const AuthorData = await Authors.find()
       res.render("authors.ejs",{AuthorData})
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const addAuthors = async (req, res) => {

    try {
       res.render("authors-add.ejs")
      
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

const addAuthorsSubmit = async (req, res) => {

    try {
        const img = req.file.filename
        const title = req.body.title
        const dec = req.body.dec
        const image = new Authors({ title: title, dec: dec, image: img })
        await image.save()
        res.redirect("/authors")
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

const updateAuthors = async (req, res) => {
    try {
        const id= req.params.id
        const AuthorData=await Authors.findById(id)
        res.render("authors-edit.ejs",{AuthorData})
   
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const updateAuthorsSubmit = async (req, res) => {
    try {
       const newTitle= req.body.title
       const newDec= req.body.dec
       const newImage= req.file.filename
       const id=req.params.id
       console.log(req.body,req.file.filename)
       await Authors.findByIdAndUpdate(id,{title:newTitle,dec:newDec,image:newImage})
       res.redirect("/authors")
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}


const faqs = async (req, res) => {

    try {
    const FaqsData =await Faqs.find()
    res.render("faq.ejs",{FaqsData})
      
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}
const addFaqs = async (req, res) => {

    try {
        
        res.render("faq-add.ejs")
      
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

const addFaqsSubmit = async (req, res) => {

    try {
        const title = req.body.title
        const dec = req.body.dec
        const image = new Faqs({ title: title, dec: dec})
        await image.save()
        res.redirect("/faqs")
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}
const updateFaqs = async (req, res) => {

    try {
        const id= req.params.id
        const FaqsData=await Faqs.findById(id)
        res.render("faq-edit.ejs",{FaqsData})
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}


const updateFaqsSubmit = async (req, res) => {
    try {
       const newTitle= req.body.title
       const newDec= req.body.dec
       const id=req.params.id
       await Faqs.findByIdAndUpdate(id,{title:newTitle,dec:newDec})
       res.redirect("/faqs")
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}







adminRouter
    .route('/getproadmin')
    .get(adminLogin);
adminRouter
    .route('/adminLogin')
    .post(adminLoginSubmit);
adminRouter
    .route('/dashboard')
    .get(dashboard);
adminRouter
    .route('/users')
    .get(users);
adminRouter
    .route('/updateUser/:id')
    .get(updateUser)
    .post(updateUserSubmit)
adminRouter
    .route('/delete/:id')
    .get(deleteteUser)
    
adminRouter
    .route('/query')
    .get(query);
adminRouter
    .route('/contact-us')
    .post(queryAdd);
adminRouter
    .route('/workSample')
    .get(worksample);
adminRouter
    .route('/addworksample')
    .get(addworksample)
    .post(upload.single('img'), addworksampleSubmit)
adminRouter
    .route('/updateworksample/:id')
    .get(updateworksample)
    .post(upload.single('img'), updateworksampleSubmit)
adminRouter
    .route('/deleteworksample/:id')
    .get(deleteworksampleSubmit)
adminRouter
    .route('/authors')
    .get(authors)
adminRouter
    .route('/addAuthors')
    .get(addAuthors)
    .post(upload.single('img'),addAuthorsSubmit)
adminRouter
    .route('/updateAuthors/:id')
    .get(updateAuthors)
    .post(upload.single('img'),updateAuthorsSubmit)
adminRouter
    .route('/faqs')
    .get(faqs)
adminRouter
    .route('/addFaqs')
    .get(addFaqs)
    .post(addFaqsSubmit)
adminRouter
    .route('/updateFaqs/:id')
    .get(updateFaqs)
    .post(updateFaqsSubmit)
    
    


module.exports = adminRouter;