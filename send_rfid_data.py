import requests

# Example RFID UID from your RFID module
data = "[65, 66, 49, 66, 50, 67, 51, 68, 52]"  # Simulated: this represents "AB1B2C3D4"
status = "Check In"  # Or "Check Out", based on context

# Step 1: Clean and convert array of ASCII codes to RFID string
if data.startswith("[") and data.endswith("]"):
    data = data[1:-1]  # Remove brackets
    data_list = list(map(int, data.split(", ")))  # Convert to list of integers
    rfidUid = ''.join([chr(x) for x in data_list])  # Convert ASCII to characters

    print("RFID UID:", rfidUid)

    # Step 2: Prepare the payload to send to backend
    payload = {
        "rfidUid": rfidUid,
        "status": status
    }

    # Step 3: POST to your backend
    url = "http://localhost:5000/api/attendance/log"
# Replace with actual IP

    try:
        response = requests.post(url, json=payload)
        print("✅ Sent to server. Response:", response.status_code)
        print("Server says:", response.json())
    except Exception as e:
        print("❌ Error sending data:", e)
