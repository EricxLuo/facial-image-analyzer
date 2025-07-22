import boto3
import json
import base64


client = boto3.client('rekognition',region_name = "us-east-1")

def lambda_handler(event,context):
    
    try:
        body = json.loads(event.get("body", "{}"))
        image = body.get("image")

        if image.startswith("data:image"):
            image = image.split(",")[1]
        imageDecoded = base64.b64decode(image)




        response = client.detect_faces(Image={"Bytes": imageDecoded}, Attributes=["ALL"])
        print("FACE RESPONSE:", response)
        if not response["FaceDetails"]:
            
            return {
                "statusCode": 404,
                "body": json.dumps({"error": "No face detected"}),
                "headers": {
                    "Access-Control-Allow-Origin": "*" }
            }
        
        faceResult = response["FaceDetails"][0]
        emotion = max(faceResult.get("Emotions"), key=lambda confidence: confidence["Confidence"])
        
        finalResult = {
        "Gender": faceResult.get("Gender", {}).get("Value"),
        "AgeRange": faceResult.get("AgeRange"),
        "Emotion": f"{emotion['Type']} ({round(emotion['Confidence'],1)}%)" 
        } #emotion 'type (#%)'

        return {
            "statusCode": 200,
            "body": json.dumps(finalResult),
            "headers": {"Access-Control-Allow-Origin": "*"}
        }
    except Exception as e:
        return{
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
            "headers": {"Access-Control-Allow-Origin": "*"}
        }
   

