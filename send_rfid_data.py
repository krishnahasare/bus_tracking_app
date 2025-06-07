import requests
import json

# Example received data (simulate actual RFID scan payload)
data = '{"uid":"95E1AE02","student_id":"2023025089","name":"Shreyash Mane"}'
status = "Check In"  # Or "Check Out"

try:
    parsed_data = json.loads(data)

    # Construct the correct payload
    payload = {
        "uid": parsed_data["uid"].strip(),
        "student_id": parsed_data["student_id"].strip(),
        "name": parsed_data["name"].strip(),
        "status": status
    }

    # POST to backend
    url = "http://localhost:5000/api/attendance/log"
    response = requests.post(url, json=payload)

    print("✅ Sent to server. Response:", response.status_code)
    print("Server:", response.json())

except json.JSONDecodeError as e:
    print("❌ JSON error:", e)
except Exception as e:
    print("❌ Sending failed:", e)
