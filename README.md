# Face & Image Analyzer


This application is fully serverless and can use AI to detect images, facial emotions, guess age, and gender


### AWS services used:  
**S3** - Hosts frontend  
**Cloudfront** - Provides HTTPS support   
**Lambda** - Hosts backend   
**API Gateway** - Routing  
**Amazon Rekognition** - AI analysis  

### How it works
1. Frontend files are placed into an S3 Bucket with Static website hosting enabled.
2. CloudFront provides HTTPS support for the website, so the webcam can be used
3. The user either interacts with the webcam or uploads an image
4. The frontend JavaScript will send the data through the API Gateway
5. API Gateway will trigger a lambda function and utilize Amazon Rekognition to process the image
6. The final results will return and display to the user

## How to set it up

### Setup Frontend
* Create two S3 buckets, one for the web, one to hold images
* Both should allow public access, the web S3 should have static website hosting enabled
* Upload the files from *frontend* to the web S3
* Create a new distribution within CloudFront using the web S3 link

### Setup Lambda functions
* Create new Lambda functions with matching names with the files
* For the two Rekognition handlers, create roles that give full access to Rekognition
* For bucketUrl, create a role that gives full S3 access
* import each file in except for *BucketUrl*
* Import the node modules along with BucketUrl by running:
```
npm install aws-sdk
```


### Setup API Gateways
* Create a new HTTP API Gateway
* Configure CORS:
* **Access-Controll-Allow-Origin** place the CloudFront URL
* **Access-Control-Allow-Methods** GET, POST, OPTIONS
* **Access-Control-Allow-Headers** content-type
* Create three routes, /URLtransfer POST, /analyze POST, /bucketUrl GET
* Create integrations:
*  URLtransfer &rarr; imageRekognitionHandler
*  bucketUrl &rarr; bucketUrl
*  analyze &rarr; rekognitionHandler
*  Deploy

   
