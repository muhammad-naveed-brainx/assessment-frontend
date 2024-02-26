<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between dashboard-topbar">
      <label class="dashboard-text">Dashboard</label>
      <label class="text-muted cursor-pointer" @click="logout">Logout</label>
    </div>
    <router-view></router-view>
  </div>
</template>
<script setup>
import {apiClient} from "@/services/ApiRequest";
import {ElNotification} from "element-plus";
import router from "@/router";
const logout = () => {
  apiClient.get('/logout').then((response)=>{
    window.localStorage.removeItem('api_token');
    router.push({name: 'login'})
  }).catch((error)=>{
    if (error.response.status === 401) {
      window.localStorage.removeItem('api_token');
      router.push({name: 'login'})
    }
    throw new Error(error)
  })
}

</script>
<style scoped>
.dashboard-topbar {
  background-color: lightblue;
  padding: 10px;
}
.dashboard-text {
  font: normal normal 400 20px/28px Poppins;
  color: #141416;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
