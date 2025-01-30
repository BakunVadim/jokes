let path = require('path')
let fs = require('fs')
let http = require('http');
const url = require('url');

let dataPath = path.join(__dirname, 'data');


let server = http.createServer((request, response)=>{
    if(request.url == '/jokes' && request.method == 'GET'){
        getAllJokes(request, response);
    }
    if(request.url == '/jokes' && request.method == 'POST'){
        addJokes(request, response);
    }
   
});

server.listen(3000);

function getAllJokes(req, res){
    let dir = fs.readdirSync(dataPath);
    let AllJokes = [];
    for (let i = 0; i < dir.length; i++){
        let file = fs.readFileSync(path.join(dataPath, i+'.json'));
        let jokeJson = Buffer.from(file).toString();
        let joke = JSON.parse(jokeJson);
        joke.id = i;

        AllJokes.push(joke);
    }

    res.end(JSON.stringify(AllJokes));
}


function addJokes(req, res){
    let data = '';
    req.on('data', function(chunk){
        data += chunk;
    });
    req.on('end', function(){
        let joke = JSON.parse(data);
        joke.likes = 0;
        joke.dislikes = 0;

        let dir = fs.readdirSync(dataPath);
        let fileName = dir.length + '.json';
        let filePath = path.join(dataPath, fileName);

        fs.writeFileSync(filePath, JSON.stringify(joke));

        res.end();
    });                  
}