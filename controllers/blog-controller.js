const Blog = require("../model/blog")

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