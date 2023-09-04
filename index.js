var sid = "AC4a37cbb25969f12214469943147c24f5";
var auth_token = "7b0eb33c9c6c564750ebf800cc0e3158";

var twilio = require("twilio")(sid, auth_token);
twilio.messages
  .create({
    from: "+16562233020",
    to: "+21656609671",
    body: "Bonjour Jenny Mando, je vous souhaite une bonne journée.",
  })
  .then((res) => {
    console.log("Message sent");
  })
  .catch((e) => {
    console.log(e);
  });
