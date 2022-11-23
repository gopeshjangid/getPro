const adminRouter = require('express').Router()
const User = require('../model/user')
const Query = require('../model/query')
const Worksample = require('../model/worksample')
const Authors = require('../model/authors')
const Faqs = require('../model/faqs')
const Blog= require("../model/blog")
const Admin= require("../model/admin")
const multer = require("multer")
const bcrypt = require('bcrypt');
const httpMsgs = require("http-msgs")
const jwt= require('jsonwebtoken')


const checkLogin=(req,res,next)=>{
     if(req.cookies.adminToken===undefined){
        res.redirect("/getproadmin")
     }else{
        next()
     }
}



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




const adminLogin = async(req, res) => {
    
    res.render('adminLogin.ejs')
}

const adminLoginSubmit = async(req, res) => {
    const reqEmail = req.body.email
    const reqPass = req.body.password
    try {
      const adminData=await  Admin.findOne({email:reqEmail})
        if (adminData !== null) {
            if (adminData.password === reqPass) {
                let Id= adminData._id
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

const blog = async (req, res) => {

    try {
 
     const BlogData =await Blog.find()
      res.render("blog.ejs",{BlogData})
      
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

const addblog = async (req, res) => {

    try {
      res.render("blog-add.ejs")
      
    } catch (error) {
        res.status(500).json({
            error:error.message
        })
    }
}

const addblogSubmit = async (req, res) => {
    try {
       const Title= req.body.title
       const Dec= req.body.dec
       const Image= req.file.filename
       const Name=req.body.name
       const blogData=  new Blog({title:Title,name:Name,dec:Dec,image:Image})
       await blogData.save()
       res.redirect("/blog")
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }

}

const updateBLog = async(req, res) => {
    const id= req.params.id
    const idData=await Blog.findById(id)
    res.render('blog-edit.ejs',{idData})
 }
 
 const updateBLogSubmit = async (req, res) => {
     try {
        const NewTitle= req.body.title
        const NewDec= req.body.dec
        const NewImage= req.file.filename
        const NewName=req.body.name
        const id=req.params.id
        await Blog.findByIdAndUpdate(id,{title:NewTitle,name:NewName,dec:NewDec,image:NewImage})
        res.redirect("/blog")
      
     } catch (error) {
         res.status(500).json({
             error: error.message
         })
     }
 
 }

const logout = async(req, res) => {
   
    res.clearCookie('adminToken');
    res.redirect('/getproadmin')
 }






adminRouter
    .route('/getproadmin')
    .get(adminLogin);
adminRouter
    .route('/adminLogin')
    .post(adminLoginSubmit);
adminRouter
    .route('/dashboard')
    .get(checkLogin, dashboard);
adminRouter
    .route('/users')
    .get(checkLogin,users);
adminRouter
    .route('/updateUser/:id')
    .get(checkLogin,updateUser)
    .post(updateUserSubmit)
adminRouter
    .route('/delete/:id')
    .get(checkLogin,deleteteUser)

adminRouter
    .route('/query')
    .get(checkLogin,query);
adminRouter
    .route('/contact-us')
    .post(queryAdd);
adminRouter
    .route('/workSample')
    .get(checkLogin,worksample);
adminRouter
    .route('/addworksample')
    .get(checkLogin,addworksample)
    .post(upload.single('img'), addworksampleSubmit)
adminRouter
    .route('/updateworksample/:id')
    .get(checkLogin,updateworksample)
    .post(upload.single('img'), updateworksampleSubmit)
adminRouter
    .route('/deleteworksample/:id')
    .get(checkLogin,deleteworksampleSubmit)
adminRouter
    .route('/authors')
    .get(checkLogin,authors)
adminRouter
    .route('/addAuthors')
    .get(checkLogin,addAuthors)
    .post(upload.single('img'),addAuthorsSubmit)
adminRouter
    .route('/updateAuthors/:id')
    .get(checkLogin,updateAuthors)
    .post(upload.single('img'),updateAuthorsSubmit)
adminRouter
    .route('/faqs')
    .get(checkLogin,faqs)
adminRouter
    .route('/addFaqs')
    .get(checkLogin,addFaqs)
    .post(addFaqsSubmit)
adminRouter
    .route('/updateFaqs/:id')
    .get(checkLogin,updateFaqs)
    .post(updateFaqsSubmit)
adminRouter
    .route('/blog')
    .get(checkLogin,blog)
adminRouter
    .route('/addblog')
    .get(checkLogin,addblog)
    .post(upload.single('img'),addblogSubmit)
adminRouter
    .route('/updateblog/:id')
    .get(checkLogin,updateBLog)
    .post(upload.single('img'),updateBLogSubmit)
adminRouter
    .route('/logout')
    .get(checkLogin,logout)
   


module.exports = adminRouter;