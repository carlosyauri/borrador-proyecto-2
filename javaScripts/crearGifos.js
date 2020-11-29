let btnStart = document.getElementById('btnInicio');
let btnStop = document.getElementById('btnStop');
let btnRecord = document.getElementById('btnRecord');
let btnUpload = document.getElementById('btnUpload');
let form;
let video = document.getElementById("video")
let comenzar = document.getElementById("comenzar")
let h1 = document.getElementById("titulo")
let p = document.getElementById("parrafo")
let imagen = document.getElementById("imagen")
let divFondo = document.getElementById("div-fondo")
let pSubiendo = document.getElementById("p-subiendo")
let imgLoader = document.getElementById("imgLoader")


comenzar.addEventListener("click", () => {

    h1.innerHTML = "¿Nos das acceso a tu cámara?";
    p.innerHTML = "El acceso a tu camara será válido sólo por el tiempo en el que estés creando el GIFO.";
    comenzar.classList.add("sacar-texto")
  
})

//inicio
btnStart.addEventListener('click', () => {
    btnRecord.classList.remove("desaparecer")
    
   
    btnStart.src ="./assets/paso-a-paso-hover-1.svg";
    video.classList.add("video-activo")
    video.classList.remove("video")
    h1.classList.add("sacar-texto")
    p.classList.add("sacar-texto")
   
   

    btnStop.disabled = true;
    captureCamera((camera) => {
        //video.muted = true;
        //video.volume = 0;
        video.srcObject = camera;

        video.play();


        recorder = RecordRTC(camera, {
            type: 'gif',
            frameRate: 1,
            quality: 10,
            width: 360,
            hidden: 240,
            onGifRecordingStarted: function() {
                console.log('grabacion iniciada')
            },
        });
        recorder.camera = camera
      
    });
}); 

//grabo
    btnRecord.addEventListener('click', () => {

        btnRecord.classList.add("desaparecer")
        btnStop.classList.remove("desaparecer")
        recorder.startRecording();
        btnStop.disabled = false;
    });

//finalizo
    btnStop.addEventListener('click', () => {

        video.classList.add("desaparecer")
        imagen.classList.remove("desaparecer")


        btnStop.classList.add("desaparecer")
        btnUpload.classList.remove("desaparecer")
        btnStop.disabled = true;
        recorder.stopRecording(stopRecordingCallback);
        console.log("fin de grabacion")
    } )
    

function captureCamera(callback) {
    navigator.mediaDevices.getUserMedia({ 
        audio: false, 
        video: {
            height: { max: 480 }
        }
    }).then(function(camera) {
        callback(camera);
    }).catch(function(error) {
        alert('Unable to capture your camera. Please check console logs.');
        console.error(error);
    });
}

function stopRecordingCallback() {
    
   
    video.src = video.srcObject = null;
    video.muted = false;
    video.volume = 1;
    let blob = recorder.getBlob();
    video.src = URL.createObjectURL(blob);
  
    imagen.src = URL.createObjectURL(blob);
    console.log(video.src)
    
    form = new FormData();
    form.append('file', blob, 'myGif.gif');
    console.log("ESTE ES EL FILE!!!!", form.get('file'));
    
   
    recorder.camera.stop();
    recorder.destroy();
    recorder = null;
}

var recorder; // globally accessible

//subir gifo
btnUpload.addEventListener('click', () => {

    divFondo.classList.add("subiendo-gifo")
    divFondo.classList.remove("fondo-gifo")

    
   
    // enviar gifo.
    fetch("https://upload.giphy.com/v1/gifs?api_key=8YMF2nldhRgghMtWCUlXoxfY0hlGDFPL", 
    {
        method: 'POST',
        body: form
    })
    .then(res => res.json())
    .then(res => {

        localStorage.setItem("idGifos", res.data.id)
        console.log("fin del envio!!", res);
    })
    .catch(err => {
        console.log("error.!!!", err);
    })


} )