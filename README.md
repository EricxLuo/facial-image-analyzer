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

