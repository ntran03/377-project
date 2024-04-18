const http = require('http')

const hostname = '127.0.0.1'
const port = 3000

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        res.writeHead(200, headers = {'Content-Type': 'application/json'});
        var word = {
            "phrase": "Hello World"
        }
        res.write(JSON.stringify(word))
        res.end()
    } else if (req.url == '/contact') {
        if (req.method == 'POST') {
            res.writeHead(200, headers = {'Content-Type': 'application/json'});
        var word = {
            "phrase": "Hello Contact"
        }
        res.write(JSON.stringify(word))
        res.end()
        }
        res.writeHead(200, {'Content-Type': "text/html"});
        res.write('<html><body><p>this is the contact page</p></body></html>')
    } else{

    }
    
    //else {
        //res.writeHead(404, {'Content-Type': "text/html"});
        //res.end('Invalid Request')
    //}
})

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`)
})