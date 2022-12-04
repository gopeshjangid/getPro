const Blog = require("../model/blog")


module.exports.readMoreBlog = async (req, res) => {
    try {
        const id= req.params.id
        const BlogData = await Blog.findById(id)
        res.status(200).json({
            data: BlogData
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}




module.exports.getBlog = async (req, res) => {
    try {
        const blogData = await Blog.find()
        res.status(200).json({
            data: blogData
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}