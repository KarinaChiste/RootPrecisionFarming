from flask import Flask, jsonify
import serial
import threading
import json
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
SERIAL_PORT = "COM4"
BAUD = 115200

latest_data = {}

ser = serial.Serial(SERIAL_PORT, BAUD, timeout=1)

def read_serial():
    global latest_data

    while True:
        try:
            line = ser.readline().decode("utf-8").strip()

            if line:
                print(line)
                data = json.loads(line)
                latest_data = data

        except Exception:
            pass

threading.Thread(target=read_serial, daemon=True).start()


@app.route("/api/data")
def get_data():
    data = {"moisture": (5 - latest_data[0]) * 10, "voltage": latest_data[1]}
    return jsonify(data)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)