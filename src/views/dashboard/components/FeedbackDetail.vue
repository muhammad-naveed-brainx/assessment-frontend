<template>
  <div class="mt-2">
    <div class="row">
      <div class="col-lg-1">
        <p><span @click="$router.go(-1)" class="back-icon"><i class="bi bi-chevron-left"></i></span><span class="back-heading">Back</span></p>
      </div>
      <div class="col-lg-11">
        <p class="feedback-title mt-3">Feedback Title: {{ feedback.title }}</p>
        <p class="feedback-submitted">Submitted by: {{ feedback.user_name }}</p>
        <p class="feedback-submitted">Submitted at: {{ feedback.created_at }}</p>
        <p>Description: {{feedback.description}}</p>
        <div class="timeline">
          <div class="comment-container" v-for="comment in comments">
            <div class="comment-content">
              <span class="comment-user">{{comment.user_name}}</span>
              <span class="comment-date-time">{{comment.created_at}}</span>
              <p class="comment-text" v-if="comment.content !== '<p><br></p>'" v-html="comment.content"></p>
            </div>
          </div>
        </div>
        <div class="my-4">
          <QuillEditor placeholder="Write your comment" :matchVisual="false" ref="quillEditor" theme="snow" v-model:content="commentInput" contentType="html" toolbar="essential"/>
          <el-button :loading="loadingButton" @click="sendComment" class="comment-btn text-white mt-3" color="#C4A662">Send</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue";
import {useRoute} from "vue-router";
import {apiClient} from "@/services/ApiRequest";
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

const loadingButton = ref(false)
const commentInput = ref('')
const comments = ref([])
const feedback = ref({})
const users = ref([])
const route = useRoute()
const id = route.params.id
const quillEditor = ref(null)

const sendComment = () => {
  if ((commentInput.value === '' || commentInput.value === '<p><br></p>')) return
  const comment = {
    content: commentInput.value
  }
  loadingButton.value = true
  apiClient.post(`comment/${id}`, comment).then((response)=>{
    comments.value.push(response.data.data)
    commentInput.value = null
    if (quillEditor.value) {
      quillEditor.value.setContents([]);
      quillEditor.value.setText('');
    }
  }).catch((error)=>{
    throw new Error(error)
  }).finally(()=>{
    loadingButton.value = false
  })
}
onMounted(()=>{
  apiClient.get(`feedback/${id}`).then((response)=>{
    const recieved = response.data.data
    comments.value = recieved.comments
    feedback.value = recieved.feedback
  }).catch((error)=>{
    throw new Error(error)
  })
  apiClient.get('user').then((response)=>{
    users.value = response.data.data
  }).catch((error)=>{
    throw new Error(error)
  })
})

</script>

<style scoped>
/* The actual timeline (the vertical ruler) */
.timeline {
  position: relative;
}
.scrollable-div {
  max-height: 550px; /* Adjust this value to your desired maximum height */
  overflow-y: auto;
}

/* The actual timeline (the vertical ruler) */
.timeline::after {
  content: '';
  position: absolute;
  width: 2px;
  background-color: #DCDCDC;
  top: 15px;
  bottom: 0;
  margin-left: 17px;
}
/* Container around content */
.comment-container {
  padding: 10px 40px;
  position: relative;
}

/* The circles on the timeline */
.comment-container::after {
  content: url("@/assets/images/people-fill.svg");
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: #DCDCDC;
  top: 15px;
  border-radius: 50%;
  z-index: 1;
  text-align: center;
  padding-top: 3px;
  margin-left: 17px;
}

/* Fix the circle for containers on the right side */
.comment-container::after {
  left: -16px;
}
/* The actual content */
.comment-content {
  width: 80%;
}
.comment-user {
  font-family: Lato, sans-serif;
  font-size: 16px;
  font-weight: bold;
  color: #000B1F;
  display: block;
}
.comment-date-time {
  font-family: Lato, sans-serif;
  font-size: 12px;
  font-weight: bold;
  color: #000B1F;
  opacity: 0.65;
  display: block;
}
.comment-text {
  font-family: Lato, sans-serif;
  font-size: 12px;
  color: #141416;
  display: block;
}
.comment-input {
  padding: 15px 20px;
}
.comment-btn {
  width: 98px;
  height: 35px;
  border-radius: 9px;
}
.feedback-title {
  font: normal normal 400 22px/20px Poppins;
  color: #182B4E;
}
.feedback-submitted {
  font-family: Lato, sans-serif;
  font-size: 18px;
  font-weight: bold;
}
</style>
<style>
.back-icon {
  padding: 6px 7px;
  border: 1px solid #DCDCDC;
  border-radius: 50%;
  font-size: 18px;
  margin-right: 18px;
  cursor: pointer;
}
.back-heading {
  font: normal normal bold 20px/24px Lato;
  letter-spacing: 0px;
  color: #141416;
}
</style>
