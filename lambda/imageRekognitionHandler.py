import json
import boto3



def detect_labels(photo, bucket):

    client = boto3.client('rekognition',region_name = "us-east-1")

    response = client.detect_labels(Image={'S3Object':{'Bucket': bucket,'Name':photo}}, MaxLabels=5)

    print('Detected labels for ' + photo) 
    print()   
    

    return response


#for image upload

def lambda_handler(event,context):
    try:
        data = json.loads(event.get("body", "{}"))
        imgUrl = data.get('imgUrl')
        fileType = data.get('fileType')
        
        if not imgUrl or not fileType:
           return {
                'statusCode': 400,
                'body': json.dumps({"status" : "error", "error" : "imgUrl or fileType not provided"})
            }
        


        photo = imgUrl.split("/")[-1]
        bucket='image-rekognition-useast-1'

        label_count=detect_labels(photo, bucket)
       
        print("NUMBER OF LABELS FOR THING: " + str(len(label_count['Labels'])))
        formattedLabels = ""
        for label in label_count['Labels']:
            name = label['Name']
            confidence = label['Confidence']
            formattedLabels += f"Label: {name}: {confidence:.2f}%\n"

        print(formattedLabels)
        return {
            'statusCode': 200,
            'body': json.dumps({"status" : "success", "labels": formattedLabels.strip()})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({"status" : "error", "error" : str(e)})
        }









