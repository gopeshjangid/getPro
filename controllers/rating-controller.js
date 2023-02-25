module.exports.rating = async (req, res) => {
    try {
       console.log("hiiiii")
       
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}