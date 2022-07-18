require('dotenv').config()

const api = require("./api/index");

api.listen(process.env.PORT, () => {

  console.log(`Politize-chatbot app listening at http://localhost:${process.env.PORT}`)
});
