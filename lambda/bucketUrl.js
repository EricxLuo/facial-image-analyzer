//import dotenv from 'dotenv';
const aws = require('aws-sdk');
const crypto = require('crypto');
const { promisify } = require('util');

const randomBytes = promisify(crypto.randomBytes);
//dotenv.config();

const region="us-east-1"
const bucketName="image-rekognition-useast-1"
//const accessKeyId= process.env.AWS_ACCESS_KEY_ID
//const secretAccessKey= process.env.AWS_SECRET_ACCESS_KEY


const s3=new aws.S3({
    region,
   // credentials: {
    //accessKeyId,
    //secretAccessKey,
 // },
    signatureVersion: 'v4'
})




exports.handler = async(event)=>{
    try{

        const fileType = event.queryStringParameters?.fileType;

        if(!fileType){
              return {
                statusCode: 400,
                headers:{ "Access-Control-Allow-Origin": "*"},
                body: JSON.stringify({error: "fileType query parameter is required"}),

              };
        }

        const randBytes = await randomBytes(16);
        const extension = fileType.split("/")[1];
        const imageName = `${randBytes.toString('hex')}.${extension}`; //encode so website link is more secure

        const params = {
            Bucket: bucketName,
            Key: imageName,
            Expires: 60,
            ContentType: fileType,
        };
        console.log("PARAMS",params);
        const uploadURL = await s3.getSignedUrlPromise('putObject', params);
        return {
            statusCode:200,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ url: uploadURL }),
        }
    }
    catch (error) {
        console.error('Error generating upload URL:', error);
        return{ 
            statusCode: 500,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ url: uploadURL }),
        };
    }
}