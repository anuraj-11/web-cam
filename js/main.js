let mediaRecorder;
let recordedBlobs;
let mediaStream;

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const downloadBtn = document.getElementById('downloadBtn');
const preview = document.getElementById('preview');

startBtn.addEventListener('click', startRecording);
stopBtn.addEventListener('click', stopRecording);
downloadBtn.addEventListener('click', downloadRecording);

async function startRecording() {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    preview.srcObject = mediaStream;

    recordedBlobs = [];
    const options = { mimeType: 'video/webm;codecs=vp9,opus' };
    mediaRecorder = new MediaRecorder(mediaStream, options);

    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;

    startBtn.disabled = true;
    stopBtn.disabled = false;
    downloadBtn.classList.add('d-none'); // Hide the download button
    downloadBtn.disabled = true; // Disable the download button

    mediaRecorder.start();
  } catch (error) {
    console.error('Error accessing webcam:', error);
  }
}

function handleDataAvailable(event) {
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function handleStop() {
  stopBtn.disabled = true;
  startBtn.disabled = false;
  downloadBtn.classList.remove('d-none'); // Show the download button
  downloadBtn.disabled = false; // Enable the download button

  // Stop the MediaRecorder
  if (mediaRecorder) {
    mediaRecorder.ondataavailable = null;
    mediaRecorder.onstop = null;
    mediaRecorder = null;
  }

  // Stop the tracks of the media stream
  if (mediaStream) {
    const tracks = mediaStream.getTracks();
    tracks.forEach(track => track.stop());
  }

  // Clear the preview
  preview.srcObject = null;
}

function stopRecording() {
  if (mediaRecorder) {
    mediaRecorder.stop();
  }
}

function downloadRecording() {
  const blob = new Blob(recordedBlobs, { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'recorded-video.webm';
  link.click();
}