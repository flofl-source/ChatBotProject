# ChatBotProject

This a chatbot made in my final projet of ChatBot and Recommandation System, in the 4th year at ESILV.

## Goal of my ChatBot
This ChatBot has been designed in JS connected to the Bored Api : http://www.boredapi.com/ and to Facebook Messenger.
When having a conversation on Messenger with it, the bot propose us different activites to do when we are bored.
Exemple : 
- What can I do alone and for free ? > You can do the following activity : Learn how the internet works 
                                        It needs 1 participants 
                                        Price level : 0
                                        Accessibility level : 0.1
You can ask it to propose an activity depending on the 3 following criterias : number of participants ("alone", "with Sarah", "with my 2 friends"...), price level ("for free","without paying","expensive","rich"...) and accessibility level ("challenge","easy","simple","complicated"...)
The bot is connected to the wit.ai plateforme, that make it recognizing the key words of these 3 criterias and make th right search on the API.

## How it should be tested
To test all the fonctionalities of the chatbot you can try the folowing messages : 
- Hello
- I am bored. Suggest me an acitivity
- What can I do alone?
- What can I do with Sarah
- What can I do as a challenge ?
- What can I do for free?
- What can I do with my 2 friends easily ? 
- What can I do alone without paying ?
- What can I do for free and easily ? 
To these questions, the chatbot should answer an activity well corresponding to the criterias asked.

Sometime, the API does not have  activites corresponding to the criteria and the chatbot will reponse to you "Sorry there's no correspondence for your request". You can try it by the following question :
- What can i do with my 2 friends for free and as a challenge ? 

In the same idea, if you ask a question that has not link with the goal of this chatbot, it will reponse to you "Sorry, I didn't understand your request". You can try it by saying for example :
- What is your name ?
