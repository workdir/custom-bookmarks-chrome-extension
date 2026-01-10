import { createServer } from 'node:http'
import * as fs from 'node:fs/promises'
import path from 'node:path'

const hostname = '127.0.0.1'
const port = 3000

const serveFile = async (fileName, contentType, res) => {
  try {
    const filePath = path.join(process.cwd(), 'public', fileName)
    console.log({ filePath, contentType })
    const fileBuffer = await fs.readFile(filePath)

    res.writeHead(200, { 'Content-Type': contentType })
    res.end(fileBuffer)
  } catch (err) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found + ' + String(err.message))
  }
}

const server = createServer(async (req, res) => {
  console.log(req.url)
  if(req.url === '/' || req.url === '/preview.html') {
    return serveFile('preview.html', 'text/html; charset=utf-8', res) 
  }

  const ext = path.extname(req.url)

  const contentTypes = {
    ".css": "text/css",
    ".js": "text/javascript",
    ".html": "text/html"
  }

   if (contentTypes[ext]) {
    return serveFile(req.url, contentTypes[ext], res);
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found")
})

server.listen(port, hostname, () => {
  console.log(`server running at http://${hostname}:${port}/`)
})
