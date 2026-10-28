import http.server
import json
import datetime
import os

PORT = 8765
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

TARGETS = {
    "coach": "coach-mode-data.json",
    "cheatsheet": "cheat-sheet-data.json",
    "scorecard": "readiness-scorecard-data.json",
}


class Handler(http.server.BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_POST(self):
        parts = self.path.strip("/").split("/")
        if len(parts) == 2 and parts[0] == "save" and parts[1] in TARGETS:
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length)
            try:
                data = json.loads(body)
            except Exception:
                self.send_response(400)
                self._cors()
                self.end_headers()
                self.wfile.write(b'{"ok":false,"error":"bad json"}')
                return
            path = os.path.join(BASE_DIR, TARGETS[parts[1]])
            with open(path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
            ts = datetime.datetime.now().isoformat()
            print("SAVED " + parts[1] + " " + ts, flush=True)
            self.send_response(200)
            self._cors()
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"ok":true}')
        else:
            self.send_response(404)
            self._cors()
            self.end_headers()

    def log_message(self, format, *args):
        pass


if __name__ == "__main__":
    server = http.server.ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    print("save_server listening on http://127.0.0.1:" + str(PORT), flush=True)
    server.serve_forever()
