const express = require('express')
const bodyparser = require('body-parser')

const FBeamer = require('./FBeamer')
const conf = require('./config')

const server = express()
const PORT = 3000

let f = new FBeamer(conf.FB)

const actData = require('./tmdb')


server.get('/', (req, res) => f.registerHook(req, res))

server.post('/', bodyparser.json({
    verify: f.verifySignature.call(f)
}))

server.post('/', (req, res, next) => {
    if(f.verifySignature(req, res, next)){
            return f.incoming(req, res, async data => {
            try{
                if(data.message.text == 'Hey' || data.message.text == 'Hello' ){
                    await f.txt(data.sender, 'Welcome ! if you are bored, I can give you some ideas of awesome activities')
                    await f.img(data.sender, 'https://rachels-esl.weebly.com/uploads/8/9/8/9/8989149/street-activity-mar-2016-e1459253231907_orig.jpg')
                }
                else if(data.message.text == 'Bye'){
                    await f.txt(data.sender, 'It was nice to talk with you ! Come back soon <3' )
                }
                else if(data.message.nlp.intents.length != 0){
                    actData(data.message.nlp).then(response => {
                        f.txt(data.sender, response)
                    })
                }
                else{
                    f.txt(data.sender, "Sorry, I didn't understand your request")
                }
            }
            catch(e){
                console.log(e)
            }
        })
    }
    else{
        
    }

})

server.listen(PORT, () => {
    console.log("The server is running on port " + PORT)
})

