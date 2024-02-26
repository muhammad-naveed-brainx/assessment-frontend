<template>
  <div class="d-flex justify-content-center align-items-center height-100-vh">
      <div class="login-container text-center" v-loading="loading">
        <label class="sign-in">Sign In</label>
        <el-form hide-required-asterisk label-position="top" size="large" ref="formRef" :model="form" :rules="rules">
            <el-form-item required size="large" prop="email">
              <el-input type="email" placeholder="Email" size="large" v-model="form.email"></el-input>
            </el-form-item>
            <el-form-item required size="large" prop="password">
              <el-input type="password" placeholder="Password" size="large" v-model="form.password" show-password @keyup.enter="submitForm"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="submitForm" color="#C4A662" class="text-white w-100">Sign In</el-button>
            </el-form-item>
          </el-form>
        <label @click="toRegister" class="forgot-password">Not Registered? <span class="cursor-pointer signup-link">Signup</span></label>
      </div>
  </div>
</template>
<script setup>
import {reactive, ref} from "vue";
import router from "@/router";
import {apiClient} from "@/services/ApiRequest";
import {ElNotification} from "element-plus";
const formRef = ref(null);
const loading = ref(false)
const form = reactive({
  email: '',
  password: "",
})
const rules = reactive({
  email: [{
    required: true,
    type: 'email',
    trigger: 'blur',
    message: "Please enter valid email address",
  }],
  password: [
    {
      required: true,
      trigger: 'blur',
      min: 8,
      message: "Minimum 8 length password is required",
    }
  ]
})
const resetFields = () => {
  form.email = ""
  form.password= ""
}
const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      const payload = JSON.parse(JSON.stringify(form)); //this will deep copy object
      loading.value = true
      apiClient.post('/login', payload).then((response)=>{
        window.localStorage.setItem("api_token", response.data.data.token)
        loading.value = false
        router.push({name: 'dashboard'})
      }).catch((error)=>{
        const errorMessage = error.response.data.message ?? "An error occurred"
        showErrorMessage(errorMessage)
        loading.value = false
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

const toRegister = () => {
  router.push({name: 'signup'})
}
</script>
<style scoped >
.login-container {
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
  .login-container {
    width: 100% !important;
    padding: 10px;
  }
}
</style>
