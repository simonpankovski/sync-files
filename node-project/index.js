const express = require("express");
const app = express();
const path = require("path");
const router = express.Router();
const config = require("./config");
const bodyParser = require("body-parser");
const fs = require("fs");
const request = require("request");
const rimraf = require("rimraf");
const fetch = require("node-fetch")
const AdmZip = require('adm-zip');
 
    // reading archives
    let zip = new AdmZip("./example.zip");
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());

const root = {
  root: path.join(__dirname, "./")
};

app.get("/", (req, res) => {
  res.sendFile("index.html", root);
});

app.post("/", (req, res) => {
  console.log("triggered");
  rimraf("./content/", function () { console.log("done"); });
    request
      .get("http://localhost:3000/get")
      .pipe(fs.createWriteStream("example.zip"))
      .on("close", function() {
        fetch("http://localhost:5000/update",{method:"GET"})
        res.send("ok");
      })
      .on("error", err => res.send(err));

  });

  
app.get("/update",(req,res)=>{
  console.log("File written!");
   zip = new AdmZip("./example.zip");
  zip.extractAllTo(/*target path*/"./", /*overwrite*/true);
  console.log("extracted")
  res.send("ok");
})


app.use("/", router);
app.listen(config.port);

console.log("Running at Port " + config.port);

function changeURl(param) {
  fs.readFile("./index.html", "utf8", (err, file) => {
    let s = "" + param + "";
    let re = new RegExp("^.*img.src.*$", "gm");
    let formatted = file.replace(re, 'img.src = "' + s + '"');
    fs.writeFile("./index.html", formatted, "utf8", err => console.log);
  });
}
