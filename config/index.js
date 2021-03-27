if(process.env.NODE_ENV == "production"){
    module.exports = {
        FB: {
            pageAccessToken: rocess.env.pageAccessToken,
            VerifyToken: process.env.VerifyToken    
        },
        TMDB: process.env.TMDB
    }
}
else{
    module.exports = require('./development.json')
}