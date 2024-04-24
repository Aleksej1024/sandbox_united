import http.server
import socketserver
import urllib.parse
import os
import json

class HttpRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.path = 'index.html'
        return http.server.SimpleHTTPRequestHandler.do_GET(self)
    def do_POST(self):
        content_length = int(self.headers.get("Content-Length"))
        body = self.rfile.read(content_length)
        self.send_response(200)
        self.end_headers()
        post_content = urllib.parse.unquote_plus(body.decode("UTF-8"))[5:]     
path = "/sandbox"
os.chdir(path)
PORT = 8080
handler_object = HttpRequestHandler
httpd = socketserver.TCPServer(("", PORT), handler_object)
httpd.serve_forever()
