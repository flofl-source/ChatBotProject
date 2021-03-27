const { default: axios } = require('axios');
const  crypto = require('crypto');

class FBeamer{
    constructor({pageAccessToken, verifyToken}){
        if(pageAccessToken == null | verifyToken == null){
            throw new Error("Null argument in FBeamer")
        }else{
            this.pageAccessToken = pageAccessToken
            this.verifyToken = verifyToken
        }
    }

    incoming(req, res, cb){
        res.sendStatus(200)
        if(req.body.object == 'page' && req.body.entry){
            let data = req.body
            data.entry.forEach(entry => {
                entry.messaging.forEach(messageObj => {
                    return cb(this.messageHandler(messageObj))
                });
            });
        }
    }

    messageHandler(obj){//Here
        let nlp = obj.message.nlp
        let sender = obj.sender.id
        let message = obj.message
        if(message.text){
            let obj = {
                sender,
                type: 'text',
                content: message.text,
                nlp: nlp
            }
        }
        return obj
    }

    sendMessage(payload){
        return new Promise((resolve, reject) => {
            axios.post('https://graph.facebook.com/v9.0/me/messages?access_token=' + this.pageAccessToken, payload).then(response => {
                resolve({
                    mid: response.data.message_id
                })
            }).catch(error => {
                console.log(error.request)
                reject(error)
            })
        })
    }

    txt(id, text, messaging_type = 'RESPONSE'){
        id = id.id
        let obj = {
            messaging_type,
            recipient: {id},
            message: {text}
        }
        return this.sendMessage(obj)
    }

    img(id, image){
        id = id.id
        let obj={
            recipient:{id},
            message:{
                attachment: {
                    type: "image",
                    payload: {
                        url: image,
                        is_reusable: true
                    }
                }
            }
        }
        return this.sendMessage(obj)
    }

    registerHook(req, res){
        const params = req.query
        const mode = params['hub.mode']
        const token = params['hub.verify_token']
        const challenge = params['hub.challenge']
        try{
            if(mode == 'subscribe' || token == this.VerifyToken){
                console.log('WebHook registered')
                return res.send(challenge)
            } else {
                throw "Could not register webhook !"
                return res.sendStatus(200)
            }
        } catch (e){
            console.log(e)
        }
    }

    verifySignature(req, res, buf){
        return (req, res, buf) => {
            if(req.method === 'POST'){
                try{
                    let tempo_hash = crypto.createHmac('sha1', 'b23211664e4add1632d5ae1572eaa8ce').update(buf, 'utf-8')
                    let hash = tempo_hash.digest('hex')
                    if('sha1='+hash == req.header('x-hub-signature')){
                        return true
                    }
                    else{
                        return false
                    }
                } catch(e) {
                    console.log(e)
                }
            }
        }
    }
}

module.exports = FBeamer;