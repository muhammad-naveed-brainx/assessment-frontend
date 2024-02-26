<template>
  <div class="d-flex justify-content-center align-items-center height-100-vh">
      <div class="signup-container text-center" v-loading="loading">
        <label class="sign-in">Sign Up</label>
        <el-form hide-required-asterisk label-position="top" size="large" ref="formRef" :model="form" :rules="rules">
          <el-form-item required size="large" prop="name" label="Name">
            <el-input type="text" placeholder="Enter full name" size="large" v-model="form.name" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item required size="large" prop="mobile_no" label="Mobile No">
            <el-input type="text" placeholder="Enter 11 digit mobile no" size="large" v-model="form.mobile_no" maxlength="11"></el-input>
          </el-form-item>
          <el-form-item required size="large" prop="email" label="Email">
            <el-input type="email" placeholder="Email" size="large" v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item required size="large" prop="password" label="Password">
            <el-input type="password" placeholder="Password" size="large" v-model="form.password" show-password></el-input>
          </el-form-item>
          <el-form-item required size="large" prop="password_confirmation" label="Confirm Password">
            <el-input type="password" placeholder="Confirm your password" size="large" v-model="form.password_confirmation" show-password @keyup.enter="submitForm"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="submitForm" color="#C4A662" class="text-white w-100">Sign Up</el-button>
          </el-form-item>
        </el-form>
        <label @click="toLogin" class="forgot-password">Already Registered? <span class="cursor-pointer signup-link">Back to login</span></label>
      </div>
  </div>
</template>
<script setup>
import {reactive, ref} from "vue";
import router from "@/router";
import {apiClient} from "@/services/ApiRequest";
import { ElNotification } from 'element-plus'
import { onUnmounted } from 'vue'


const formRef = ref(null);
const loading = ref(false)
const form = reactive({
  name: '',
  mobile_no: '',
  email: '',
  password: "",
  password_confirmation: ""
})
const validatePassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('Please input the new password again'))
  } else if (value !== form.password) {
    callback(new Error("Password don't match!"))
  } else {
    callback()
  }
}
const rules = reactive({
  name: [{
    required: true,
    trigger: 'blur',
    message: "Name field is required",
  }],
  mobile_no: [{
    required: true,
    min:11,
    max:11,
    trigger: 'blur',
    message: "Please enter 11 digit mobile number",
  }],
  email: [{
    required: true,
    type: 'email',
    trigger: 'blur',
    message: "Please enter valid email address",
  }],
  password: [{
      required: true,
      message: "Minimum length 8 required",
      trigger: 'blur',
      min: 8,
    }],
  password_confirmation: [{validator: validatePassword, trigger: 'blur'}]
})
const resetFields = () => {
  form.name = ""
  form.mobile_no = ""
  form.email = ""
  form.password= ""
  form.password_confirmation=""
}
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const payload = JSON.parse(JSON.stringify(form)); //this will deep copy object
      delete payload['password_confirmation'];
      apiClient.post('/register', payload).then((response)=>{
        router.push({name: 'signup-success'})
      }).catch((error)=>{
        const errorMessage = error.response.data.message ?? "An error occurred";
        showErrorMessage(errorMessage)
        throw new Error(error)
      })
    }
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

const toLogin = () => {
  router.push({name: 'login'})
}
onUnmounted(()=>{
  resetFields()
})
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
