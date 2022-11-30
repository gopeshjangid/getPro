const Authors = require('../model/authors')

module.exports.getAuthor = async (req, res) => {
    try {
        const id= req.params.id
        const authorsData = await Authors.findById(id)
        res.status(200).json({
            data: authorsData
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}


module.exports.getAuthors = async (req, res) => {
    try {
        const authorsData = await Authors.find()
        res.status(200).json({
            data: authorsData
        })
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}
