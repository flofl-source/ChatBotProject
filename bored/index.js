const config = require('../config')
const { default: axios } = require('axios');

let url = 'https://www.boredapi.com/api/'

//NOUS RELIE A WIT
const extractEntity = (nlp, entity) => {
    if(nlp.intents[0].confidence > 0.8){
        if(entity == 'intent'){
            //return giveAct
            console.log('Dans extractEntity :'+nlp.intents[0].name)
            return nlp.intents[0].name
        }
        else{ //POUR PARTICIPANT, PRICE, ACCESSIBILTY...
            try{
                console.log("-----------NLP ---------")
                console.log(nlp) // Ce que nous donne le wit
                console.log('Dans extractEntity :')
                val = nlp.entities[entity+':'+entity][0].value  //avant on avait body mais nous ca marche pas 
                                                                //pcq c'est "alone" ou "with my friend" donc on a mis value
                val = parseFloat(val)
                console.log(val)
                return val  //CA MARCHE, on a bien un int 
            }
            catch(e){//If entity does not exist
                return null
            }

        }
    }else{
        return null
    }
}

//Exemple
//https://www.boredapi.com/api/activity?participant=1
const getActData = (participants=null,price=null, accessibility=null) => {   //On récupère les valeurs de participants et price pour faire la recherche URL
    return new Promise(async (resolve, reject) => {
        //First find the movie
        req=''
        console.log("Je suis dans getActData")
        console.log('participants :'+participants)
        console.log('price :'+price)
        //POSSIBILITE
        // RIEN
        //PARTICIPANTS
        // ACCESS 
        //PARTICIPANTS + ACCESS
        // PRICE 
        //PRICE + ACCESS

        //PARTICIPANTS + PRICE
        //PARTICIPANTS + PRICE + ACCESS

        if(price==null){
            if(accessibility==null){
                if(participants==null)
                {
                    req = url+'activity?' //RIEN
                }
                else{
                    req = url+'activity?participants=' + participants //PARTICPANTS
                }              
            }
            else{
                if(participants==null){
                    req = url+'activity?accessibility=' + accessibility //ACCESS
                }
                else{
                    req = url+'activity?participants='+ participants+'&accessibility='+accessibility //PARTICPANTS +ACESS
                }
                
            }
        }   
        else if(participants==null){
            if(accessibility==null)
            {
                req = url+'activity?price='+price  //PRICE
            }
            else{
                req = url+'activity?price='+price+'&accessibility='+accessibility  //PRICE + ACCESS
            }
            
        }
        else if(accessibility==null){
            req = url+'activity?participants=' + participants+'&price='+price //PRTICIPANT + PRICE
        }
        else{
            req = url+'activity?participants='+ participants+'&price='+price+'&accessibility='+accessibility
        }
        console.log(req)
        axios.get(req).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}

/*
const getDirector = movieId => {
    return new Promise(async (resolve, reject) => {
        let req = url+'movie/' + movieId + '/credits?api_key=' + config.TMDB
        axios.get(req).then(res => {
            resolve(res.data)
        }).catch(err => {
            reject(err)
        })
    })
}
*/

module.exports = nlpData => {
    return new Promise(async (resolve, reject) => {
        let intent = extractEntity(nlpData, 'intent') //intent donc = giveAct
        if(intent){
            let participants = extractEntity(nlpData, 'participant') //return nb of participants
            let price = extractEntity(nlpData, 'price') // return price 
            let accessibility = extractEntity(nlpData, 'accessibility')
            console.log(participants)
            console.log(price)
            console.log(accessibility)
            try{
                let actData = await getActData(participants,price, accessibility)
                if(intent=='giveAct'){
                    let response=''
                    if (actData.activity==undefined)
                    {
                        response = `Sorry there's no correspondance for your request `
                    }
                    else{
                        response = `You can do the following activity : ${actData.activity} \nIt needs ${actData.participants} participants \nPrice level : ${actData.price}\nAccessibility level : ${actData.accessibility} `
                    }
                    resolve(response)
                }
                
            }
            catch (error){
                reject(error)
            }
        }
        
    })
}