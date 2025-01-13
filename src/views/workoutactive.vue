<template>
  <div class="camera-container">
    <button @click="startCamera">Open Camera</button>
    <video
      id="video"
      ref="video"
      autoplay
      playsinline
      style="display: none"
    ></video>
    <canvas ref="canvas" id="output_canvas"></canvas>
    <button v-if="isCameraOn" @click="stopCamera">Stop Camera</button>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const exerciseType = route.query.exercise;
console.log(exerciseType);

const video = ref(null);
const canvas = ref(null);
const stream = ref(null);
const isCameraOn = ref(false);

let pose;
const pushUpCount = ref(0);
let isDownPosition = false;

const startCamera = async () => {
  if (isCameraOn.value) return;
  try {
    isCameraOn.value = true;
    initPoseDetection(); // Let MediaPipe handle the camera
  } catch (err) {
    console.error("Error accessing camera:", err);
    alert("Camera access was denied or not available.");
  }
};

const stopCamera = () => {
  if (stream.value) {
    stream.value.getTracks().forEach((track) => track.stop());
    isCameraOn.value = false;
  }
  if (pose) pose.close();
};

const calculateDistance = (pointA, pointB) => {
  const dx = pointA.x - pointB.x;
  const dy = pointA.y - pointB.y;
  const dz = pointA.z - pointB.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
};

const initPoseDetection = async () => {
  const { Pose } = await import("@mediapipe/pose");
  const { Camera } = await import("@mediapipe/camera_utils");
  const { drawLandmarks } = await import("@mediapipe/drawing_utils");

  pose = new Pose({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
  });

  pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
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
      drawLandmarks(canvasCtx, results.poseLandmarks, {
        color: "#FF0000",
        lineWidth: 2,
      });
      if (exerciseType === "pushup") {
        detectPushUp(results.poseLandmarks);
      }
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

const detectPushUp = (landmarks) => {
  const leftShoulder = landmarks[11];
  const rightShoulder = landmarks[12];
  const leftWrist = landmarks[15];
  const rightWrist = landmarks[16];

  const leftDistance = calculateDistance(leftShoulder, leftWrist);
  const rightDistance = calculateDistance(rightShoulder, rightWrist);

  const threshold = 0.5;

  if (leftDistance < threshold && rightDistance < threshold) {
    if (!isDownPosition) {
      isDownPosition = true;
    }
  } else {
    if (isDownPosition) {
      pushUpCount.value++;
      isDownPosition = false;
    }
  }
};

onBeforeUnmount(() => {
  stopCamera();
});
</script>
