const hello=async(req,res)=>{
    try{
        const accountSid = 'AC452d23b9e7cbc6d82a690d4a41a6a19b';
        const authToken = '39f0a96afc0dbe65dae0a37830e3c0fa';
        const client = require('twilio')(accountSid, authToken);
        const call = await client.calls.create({
            url: 'http://demo.twilio.com/docs/voice.xml', // TwiML URL or TwiML string for the call
            to: '+917439772170', // Replace with the recipient's phone number
            from: '+12407477054', // Replace with your Twilio phone number
          });
          console.log("call",call)
          console.log(`Call SID: ${call.sid}`);
          res.send(`Call SID: ${call.sid}`);
    }
    catch(error)
    {
        console.log(error);
    }
}

module.exports={hello};