const express = require("express");
const app = express();
const config = require("./config");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const fetch = require("node-fetch");
var archiver = require("archiver");

app.use(bodyParser.json());
const root = {
  root: path.join(__dirname, "./")
};
app.use(express.static("content"));

function readFiles(dirname, fileObject) {
  let arr = [];
}


app.get("/", (req, res) => res.sendFile("index.html", root));

app.get("/zip",(req,res)=>{
  console.log("zip")
  var output = fs.createWriteStream(__dirname + "/example.zip");


  var archive = archiver("zip", {
    zlib: { level: 9 } 
  });
  output.on('close', async function() {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
    await fetch("http://localhost:5000/",{method:"post",mode:"no-cors"});
    res.send("OK");
  });
  
  archive.on('error', function(err) {
    res.send(err);
  });
  archive.pipe(output);
  archive.directory("content/", "content");
  archive.finalize();
});

app.get("/get",(req,res)=>{
  console.log("triggr")
  var stat = fs.statSync('example.zip');

  res.writeHead(200, {
      'Content-Type': 'application/zip',
      'Content-Length': stat.size
  });
  
    var readStream = fs.createReadStream('example.zip');
    
    try {
      readStream.pipe(res);

    } catch(e) {
      console.log("Errpr ", e);
    }
})

app.listen(config.port, () =>
  console.log(`Example app listening on port ${config.port}!`)
);
