<template>
  <div class="camera-container">
    <button @click="startCamera">Open Camera</button>
    <video id="video" ref="video" autoplay playsinline></video>
    <canvas ref="canvas" id="output_canvas"></canvas>
    <button v-if="isCameraOn" @click="stopCamera">Stop Camera</button>
    <h2>Push-Ups Count: {{ pushUpCount }}</h2>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from "vue";

const video = ref(null);
const canvas = ref(null);
const stream = ref(null);
const isCameraOn = ref(false);

let pose;
const pushUpCount = ref(0); // 🔢 Push-Up Counter
let isDownPosition = false; // ⬇️ Track down position

// 🟢 Start Camera
const startCamera = async () => {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 },
      audio: false,
    });

    video.value.srcObject = stream.value;
    await video.value.play();
    isCameraOn.value = true;

    initPoseDetection();
  } catch (err) {
    console.error("Error accessing camera:", err);
    alert("Camera access was denied or not available.");
  }
};

// 🔴 Stop Camera
const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach((track) => track.stop());
    isCameraOn.value = false;
  }
  if (pose) pose.close();
};

// 📐 Helper: Calculate Angle Between Joints
const calculateAngle = (a, b, c) => {
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = (radians * 180.0) / Math.PI;
  if (angle < 0) angle += 360;
  return angle;
};

// 🧠 Pose Detection Logic
const initPoseDetection = async () => {
  const { Pose } = await import("@mediapipe/pose");
  const { Camera } = await import("@mediapipe/camera_utils");
  const { drawLandmarks, drawConnectors, POSE_CONNECTIONS } = await import(
    "@mediapipe/drawing_utils"
  );

  pose = new Pose({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
  });

  pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: false,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  pose.onResults((results) => {
    const canvasCtx = canvas.value.getContext("2d");
    canvas.value.width = video.value.videoWidth;
    canvas.value.height = video.value.videoHeight;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvas.value.width, canvas.value.height);

    canvasCtx.drawImage(
      results.image,
      0,
      0,
      canvas.value.width,
      canvas.value.height
    );

    if (results.poseLandmarks) {
      // 🟢 Draw Skeleton
      drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
        color: "#00FF00",
        lineWidth: 4,
      });

      drawLandmarks(canvasCtx, results.poseLandmarks, {
        color: "#FF0000",
        lineWidth: 2,
      });

      detectPushUp(results.poseLandmarks);
    }
    canvasCtx.restore();
  });

  const camera = new Camera(video.value, {
    onFrame: async () => {
      await pose.send({ image: video.value });
    },
    width: 640,
    height: 480,
  });

  camera.start();
};

// 🤖 Detect Push-Ups
const detectPushUp = (landmarks) => {
  const leftShoulder = landmarks[11];
  const leftElbow = landmarks[13];
  const leftWrist = landmarks[15];

  const rightShoulder = landmarks[12];
  const rightElbow = landmarks[14];
  const rightWrist = landmarks[16];

  const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);

  const avgElbowAngle = (leftElbowAngle + rightElbowAngle) / 2;

  if (avgElbowAngle < 90) {
    isDownPosition = true;
  }

  if (avgElbowAngle > 160 && isDownPosition) {
    pushUpCount.value += 1;
    isDownPosition = false;
    console.log("Push-Up Count:", pushUpCount.value);
  }
};

onBeforeUnmount(() => {
  stopCamera();
});
</script>
