const imageForm = document.querySelector("#imageForm");
const imageInput = document.querySelector("#imageInput");
const imageResult = document.querySelector("#imageResult")

const video = document.querySelector("#video");
const result = document.querySelector("#result");








imageForm.addEventListener("submit", async event =>{
    event.preventDefault();
    const file = imageInput.files[0];
    
    const fileType = file.type;
    //get the unique url from the server
    //https://8v4l85wko7.execute-api.us-east-1.amazonaws.com/test / bucketUrl for API gateway
    // originally /bucketUrl
    const {url} = await fetch(`https://8v4l85wko7.execute-api.us-east-1.amazonaws.com/test/bucketUrl?fileType=${encodeURIComponent(file.type)}`).then (res=>res.json());
    console.log(url);


    //put image into the s3 bucket
    await fetch(url,{
        method: "PUT",
        headers:{
            "Content-Type": file.type,
        },
        body:file,
    });
    const imgUrl = url.split("?")[0];

    //originally http://localhost:5000
    const response = await fetch('https://8v4l85wko7.execute-api.us-east-1.amazonaws.com/test/URLtransfer',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({imgUrl,fileType})
    });


    console.log(imgUrl);
    const img = document.createElement("img")
    img.src = imgUrl
    document.body.appendChild(img)
    
    const imageResponse = await response.json();
    const imageOutputBox = document.getElementById("imageOutput")
    if (imageResponse.status == "success"){
        imageOutputBox.textContent = imageResponse.labels
    }
    else{
        imageOutputBox.textContent = "Error \n no labels detected"
    }

  


});


//Webcam capture image according to interval
function autoCapture (){
    setInterval(()=>{
       capture();
    },3000);
}
//create image from webcam and then send to python rekognition
//fetch and change outputbox with the emotions
async function capture(){
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height= video.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(video,0,0,canvas.width,canvas.height);

    const vidURL = canvas.toDataURL("image/jpeg");

    console.log("sending frame to /analyze");

    try {
        //originally http://localhost:5000/
        const response = await fetch("https://8v4l85wko7.execute-api.us-east-1.amazonaws.com/test/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: vidURL })
        });
        const result = await response.json();
        const outputBox = document.getElementById("faceOutput")


        if(result.error){
            outputBox.textContent = "No face detected";
        }
        else{
            const ageRange= result.AgeRange || { Low:'N/A', High: 'N/A'};
            outputBox.textContent = `Gender: ${result.Gender}\nAge: ${result.AgeRange.Low} - ${result.AgeRange.High}\nEmotion: ${result.Emotion}`;
        }
    }
    catch(err){
        
        console.error("Webcam analyze failed: ",err);
    }

    
}
async function startWebcam(){
    try{    
        const stream = await navigator.mediaDevices.getUserMedia({video:true});
        video.srcObject = stream;

        video.onloadedmetadata = () =>{
            autoCapture(); //wait for video and then consistently capture
        }
    }catch (err){
        console.error("Webcam Error: ",err);
    }
}

window.onload = startWebcam;







 
