const adminRouter = require('express').Router()
const adminController = require("../controllers/admin-controller")




adminRouter
    .route('/getproadmin')
    .get(adminController.adminLogin);
adminRouter
    .route('/adminLogin')
    .post(adminController.adminLoginSubmit);
adminRouter
    .route('/dashboard')
    .get(adminController.checkLogin, adminController.dashboard);
adminRouter
    .route('/users')
    .get(adminController.checkLogin, adminController.users);
adminRouter
    .route('/updateUser/:id')
    .get(adminController.checkLogin, adminController.updateUser)
    .post(adminController.updateUserSubmit)
adminRouter
    .route('/delete/:id')
    .get(adminController.checkLogin, adminController.deleteteUser)
adminRouter
    .route('/query')
    .get(adminController.checkLogin, adminController.query);
adminRouter
    .route('/contact-us')
    .post(adminController.queryAdd);
adminRouter
    .route('/workSample')
    .get(adminController.checkLogin, adminController.worksample);
adminRouter
    .route('/addworksample')
    .get(adminController.checkLogin, adminController.addworksample)
    .post(adminController.upload.fields([{ name: 'img' }, { name: 'pdf' }]), adminController.addworksampleSubmit)
adminRouter
    .route('/updateworksample/:id')
    .get(adminController.checkLogin, adminController.updateworksample)
    .post(adminController.upload.fields([{ name: 'img' }, { name: 'pdf' }]), adminController.updateworksampleSubmit)
adminRouter
    .route('/deleteworksample/:id')
    .get(adminController.checkLogin, adminController.deleteworksampleSubmit)
adminRouter
    .route('/authors')
    .get(adminController.checkLogin, adminController.authors)
adminRouter
    .route('/addAuthors')
    .get(adminController.checkLogin, adminController.addAuthors)
    .post(adminController.upload.fields([{ name: 'img' }, { name: 'pdf' }]), adminController.addAuthorsSubmit)
adminRouter
    .route('/updateAuthors/:id')
    .get(adminController.checkLogin, adminController.updateAuthors)
    .post(adminController.upload.fields([{ name: 'img' }, { name: 'pdf' }]), adminController.updateAuthorsSubmit)
adminRouter
    .route('/deleteAuthors/:id')
    .get(adminController.checkLogin, adminController.deleteAuthor)
adminRouter
    .route('/faqs')
    .get(adminController.checkLogin, adminController.faqs)
adminRouter
    .route('/addFaqs')
    .get(adminController.checkLogin, adminController.addFaqs)
    .post(adminController.addFaqsSubmit)
adminRouter
    .route('/updateFaqs/:id')
    .get(adminController.checkLogin, adminController.updateFaqs)
    .post(adminController.updateFaqsSubmit)
adminRouter
    .route('/blog')
    .get(adminController.checkLogin, adminController.blog)
adminRouter
    .route('/addblog')
    .get(adminController.checkLogin, adminController.addblog)
    .post(adminController.upload.fields([{ name: 'img' }, { name: 'pdf' }]), adminController.addblogSubmit)
adminRouter
    .route('/updateblog/:id')
    .get(adminController.checkLogin, adminController.updateBLog)
    .post(adminController.upload.fields([{ name: 'img' }, { name: 'pdf' }]), adminController.updateBLogSubmit)
adminRouter
    .route('/deleteBlog/:id')
    .get(adminController.checkLogin, adminController.deleteBlog)
    
adminRouter
    .route('/logout')
    .get(adminController.checkLogin, adminController.logout)
adminRouter
    .route('/services')
    .get(adminController.checkLogin, adminController.services)
adminRouter
    .route('/addservices')
    .get(adminController.checkLogin, adminController.addServices)
    .post(adminController.addServicesSubmit)
adminRouter
    .route('/updateservices/:id')
    .get(adminController.checkLogin, adminController.updateServices)
    .post(adminController.updateServicesSubmit)
adminRouter
    .route('/coupon')
    .get(adminController.checkLogin, adminController.coupon)
adminRouter
    .route('/addcoupon')
    .get(adminController.checkLogin, adminController.addcoupon)
    .post(adminController.addCouponSubmit)
adminRouter
    .route('/updateCoupon/:id')
    .get(adminController.checkLogin, adminController.updateCoupon)
    .post(adminController.updateCouponSubmit)
adminRouter
    .route('/deleteCoupon/:id')
    .get(adminController.checkLogin, adminController.deleteCoupon)
adminRouter
    .route('/career')
    .get(adminController.checkLogin, adminController.career)
adminRouter
    .route('/addcareer')
    .get(adminController.checkLogin, adminController.addCareer)
    .post(adminController.addCareerSubmit)
adminRouter
    .route('/updateCareer/:id')
    .get(adminController.checkLogin, adminController.updateCareer)
    .post(adminController.updateCareerSubmit)
adminRouter
    .route('/deleteCareer/:id')
    .get(adminController.checkLogin, adminController.deleteCareer)
adminRouter
    .route('/chats')
    .get(adminController.checkLogin, adminController.chats)




module.exports = adminRouter;