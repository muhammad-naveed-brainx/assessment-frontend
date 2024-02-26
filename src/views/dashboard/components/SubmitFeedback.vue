<template>
  <p class="mt-2"><span @click="$router.go(-1)" class="back-icon"><i class="bi bi-chevron-left"></i></span><span class="back-heading">Back</span></p>
  <div class="d-flex justify-content-center align-items-center height-100-vh">
    <div class="signup-container text-center" v-loading="loading">
      <label class="sign-in">Feedback Form</label>
      <el-form hide-required-asterisk label-position="top" size="large" ref="formRef" :model="form" :rules="rules">
        <el-form-item required size="large" prop="title" label="Title">
          <el-input type="text" placeholder="Enter title of your feedback" size="large" v-model="form.title" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item required size="large" prop="category" label="Category">
          <el-select
              v-model="form.category"
              class="m-2"
              placeholder="Select a category"
              size="large"
          >
            <el-option
                v-for="item in CATEGORIES"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item required size="large" prop="description" label="Description">
          <el-input type="textarea" :rows="5" placeholder="Enter detailed description about the feedback" size="large" maxlength="300" v-model="form.description"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="submitForm" color="#C4A662" class="text-white w-100">Submit Feedback</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup>
import {reactive, ref} from "vue";
import router from "@/router";
import { ElNotification } from 'element-plus'
import {CATEGORIES} from "@/constants";
import {apiClient} from "@/services/ApiRequest";

const formRef = ref(null);
const loading = ref(false)
const form = reactive({
  title: '',
  category: '',
  description: '',
})
const rules = reactive({
  title: [{
    required: true,
    trigger: 'blur',
    message: "Title field is required",
  }],
  category: [{
    required: true,
    trigger: 'blur',
    message: "Category field is required",
  }],
  description: [{
    required: true,
    trigger: 'blur',
    message: "Description field is required",
  }],
})
const resetFields = () => {
  form.title = ""
  form.category = ""
  form.description = ""
  formRef.value.resetFields();
}
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const payload = JSON.parse(JSON.stringify(form)); //this will deep copy object
      apiClient.post('/feedback', payload).then((response)=>{
        console.log('success feedback')
        console.log(response)
        successFeedback()
        router.push({name: 'dashboard'})
      }).catch((error)=>{
        const errorMessage = error.response.data.message ?? "An error occurred";
        showErrorMessage(errorMessage)
        throw new Error(error)
      })
    }
  })
}
const successFeedback = () => {
  ElNotification({
    title: 'Success',
    message: "Feedback submitted successfully",
    type: "success",
    offset: 60
  })
}
const showErrorMessage = (message) => {
  ElNotification({
    title: 'Error',
    message: message,
    type: 'error',
    offset:85
  })
}

</script>
<style scoped>
.signup-container {
  border: 1px solid #DCDCDC;
  border-radius: 10px;
  background-color: #FFFFFF;
  width: 70%;
  max-width: 760px;
  padding: 10px 100px;
}
.sign-in {
  font: normal normal 600 30px/48px Poppins;
  color: #141416;
}
.forgot-password {
  font: normal normal 400 14px/16px Poppins;
  letter-spacing: -0.14px;
  color: #182B4E;
}
.cursor-pointer {
  cursor: pointer;
}
.signup-link {
  color: blue;
  text-decoration: underline;
}
.height-100-vh {
  height: 100vh;
}

@media screen and (max-width: 768px) {
  .signup-container {
    width: 100% !important;
    padding: 10px;
  }
}
</style>
<style>
.el-select.el-select--large.m-2 {
  width: 100%;
  margin-left: 0 !important;
  margin-right: 0 !important;
}
</style>
