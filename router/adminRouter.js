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
    .route('/workSampleReadMore/:id')
    .get(adminController.checkLogin, adminController.workSampleReadMore);
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
    .route('/authoreReadMore/:id')
    .get(adminController.checkLogin, adminController.AuthorReadMore)
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
    .route('/faqReadMore/:id')
    .get(adminController.checkLogin, adminController.FaqReadMore)
adminRouter
    .route('/addFaqs')
    .get(adminController.checkLogin, adminController.addFaqs)
    .post(adminController.addFaqsSubmit)
adminRouter
    .route('/updateFaqs/:id')
    .get(adminController.checkLogin, adminController.updateFaqs)
    .post(adminController.updateFaqsSubmit)
 adminRouter
    .route('/deleteFaqs/:id')
    .get(adminController.checkLogin, adminController.deleteFaqs)

adminRouter
    .route('/blog')
    .get(adminController.checkLogin, adminController.blog)
adminRouter
    .route('/blogReadMore/:id')
    .get(adminController.checkLogin, adminController.BlogReadMore)
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
    .route('/servicesReadMore/:id')
    .get(adminController.checkLogin, adminController.servicesReadMore)
adminRouter
    .route('/addservices')
    .get(adminController.checkLogin, adminController.addServices)
    .post(adminController.addServicesSubmit)
adminRouter
    .route('/updateservices/:id')
    .get(adminController.checkLogin, adminController.updateServices)
    .post(adminController.updateServicesSubmit)
adminRouter
    .route('/deleteServices/:id')
    .get(adminController.checkLogin, adminController.deleteServices)
   
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
adminRouter
    .route('/adminWalletHistory')
    .get(adminController.checkLogin, adminController.adminWalletTransactionHistory)
adminRouter
    .route('/adminOrderHistory')
    .get(adminController.checkLogin, adminController.adminOrderHistory)
adminRouter
    .route('/viewOrderDetails/:id')
    .get(adminController.checkLogin, adminController.viewOrderDetails)
adminRouter
    .route('/findupdatemessage/:id')
    .get(adminController.checkLogin, adminController.findupdatemessage)
adminRouter
    .route('/edit-message/:id')
    .post(adminController.checkLogin, adminController.findupdatemessagesubmit)
adminRouter
    .route('/extraCredit')
    .get(adminController.checkLogin, adminController.extraCredit)
adminRouter
    .route('/AddextraCredit')
    .get(adminController.checkLogin, adminController.AddextraCredit)
adminRouter
    .route('/AddextraCrsedit')
    .post(adminController.checkLogin, adminController.AddextraCreditSubmit)
adminRouter
    .route('/editExtraCredit/:id')
    .get(adminController.checkLogin, adminController.editExtraCredit)
adminRouter
    .route('/editExtraCredit/:id')
    .post(adminController.checkLogin, adminController.editExtraCreditSubmit)
adminRouter
    .route('/getOrderDetailsInChat/:id')
    .get(adminController.checkLogin, adminController.getOrderDetailsInChat)
adminRouter
    .route('/contentType')
    .get(adminController.checkLogin, adminController.contentType)
adminRouter
    .route('/addcontentType')
    .get(adminController.checkLogin, adminController.AddContentType)
adminRouter
    .route('/addContentTypeSubmit')
    .post(adminController.checkLogin, adminController.AddContentTypeSubmit)
adminRouter
    .route('/deleteContentType/:id')
    .get(adminController.checkLogin, adminController.DeleteContentType)
adminRouter
    .route('/expertLevel')
    .get(adminController.checkLogin, adminController.expertLevel)
adminRouter
    .route('/addexpertLevel')
    .get(adminController.checkLogin, adminController.AddExpertLevel)
adminRouter
    .route('/addexpertLevelSubmit')
    .post(adminController.checkLogin, adminController.AddExpertLevelSubmit)
    adminRouter
    .route('/updateExpertLevel/:id')
    .get(adminController.checkLogin, adminController.updateExpertLevel)
adminRouter
    .route('/updateExpertLevelSubmit/:id')
    .post(adminController.checkLogin, adminController.updateExpertLevelSubmit)
adminRouter
    .route('/updateContentType/:id')
    .get(adminController.checkLogin, adminController.updateContentType)
adminRouter
    .route('/updateContentTypeSubmit/:id')
    .post(adminController.checkLogin, adminController.updateContentTypeSubmit)
adminRouter
    .route('/deleteExpertLevel/:id')
    .get(adminController.checkLogin, adminController.DeleteExpertLevelSubmit)
adminRouter
    .route('/addPermission')
    .get(adminController.checkLogin, adminController.AddPermission)
adminRouter
    .route('/addPermissionSubmit')
    .post(adminController.checkLogin, adminController.AddPermissionSubmit)
adminRouter
    .route('/role')
    .get(adminController.checkLogin, adminController.role)
adminRouter
    .route('/addRole')
    .get(adminController.checkLogin, adminController.addRole)
adminRouter
    .route('/addRoleSubmit')
    .post(adminController.checkLogin, adminController.addRoleSubmit)




module.exports = adminRouter;