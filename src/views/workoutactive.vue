<template>
  <div class="camera-container relative h-full max-h-full">
    <div
      v-if="showModal"
      class="fixed inset-0 bg-[rgba(0, 0, 0, 0.4)] flex items-center justify-center z-[9999]"
    >
      <div class="bg-white p-8 rounded-lg shadow-lg w-96 text-center">
        <div class="mb-4">
          <p class="text-xl font-semibold">Performing {{ exerciseType }}</p>
          <p class="text-sm text-gray-600">
            Prepare to perform {{ exerciseType }} effectively.
            <video
              src="../../public/pushups.mp4"
              autoplay
              muted
              loop
              class="w-full h-40"
            >
              Your browser does not support the video tag.
            </video>
          </p>
        </div>

        <div class="border-t border-blue-60 my-4"></div>
        <p class="text-xl font-semibold">Position</p>

        <p v-if="exerciseType === 'pushups'" class="text-sm text-gray-600">
          Place your mobile device half a meter in front of you pointing your
          way.
        </p>
        <div class="border-t border-blue-60 my-4"></div>

        <div class="mb-4">
          <p class="text-xl font-semibold">Tips</p>
          <p v-if="exerciseType === 'pushups'" class="text-sm text-gray-600">
            Keep hands aligned with shoulder, elbows against waist and slowly
            push down
          </p>
        </div>

        <button
          @click="closeModalAndStartCountdown"
          class="mt-4 px-4 py-2 bg-blue-60 text-white rounded hover:bg-blue-42"
        >
          I understand.
        </button>
      </div>
    </div>

    <p
      class="absolute right-0 bottom-0 bg-blue-60 bg-opacity-20 px-10 p-5 rounded-md text-3xl"
    >
      {{ pushUpCount }}
    </p>
    <p
      v-if="countdown > 0"
      class="absolute top-10 left-1/2 transform -translate-x-1/2 bg-blue-42 text-white px-4 py-2 rounded-md text-3xl"
    >
      Starting exercise in {{ countdown }}...
    </p>

    <video
      id="video"
      ref="video"
      autoplay
      playsinline
      class="hidden"
      :style="{ height: videoHeight + 'px', width: 'auto' }"
    ></video>
    <canvas ref="canvas" id="output_canvas" class="mt-4"></canvas>

    <button
      v-if="isCameraOn"
      @click="stopCamera"
      class="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Stop Camera
    </button>
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
const showModal = ref(true);
const countdown = ref(0);
const countdownInterval = ref(null);

const videoHeight = ref(window.innerHeight);

let pose;
const pushUpCount = ref(0);
let isDownPosition = false;

const closeModalAndStartCountdown = () => {
  showModal.value = false;
  countdown.value = 3;

  countdownInterval.value = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(countdownInterval.value);
      startCamera();
    }
  }, 1000);
};

const startCamera = async () => {
  if (isCameraOn.value) return;
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { width: 1000, height: videoHeight },
      audio: false,
    });

    video.value.srcObject = stream.value;
    isCameraOn.value = true;

    initPoseDetection();
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
      if (exerciseType === "pushups") {
        detectPushUp(results.poseLandmarks);
      }
    }
    canvasCtx.restore();
  });

  const camera = new Camera(video.value, {
    onFrame: async () => {
      await pose.send({ image: video.value });
    },
    width: window.innerWidth,
    height: videoHeight.value,
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
      console.log("pushed down");

      isDownPosition = true;
    }
  } else {
    if (isDownPosition) {
      console.log("pushed up");

      pushUpCount.value++;
      isDownPosition = false;
    }
  }
};

onBeforeUnmount(() => {
  stopCamera();
});
</script>
