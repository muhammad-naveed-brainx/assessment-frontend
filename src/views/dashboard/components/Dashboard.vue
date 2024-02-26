<template>
  <div v-loading="loading">
    <div class="d-flex justify-content-end my-1">
      <el-button class="py-4 fw-bolder" type="success" @click="toFeedback">Add Feedback</el-button>
    </div>
    <el-table class="mt-4" :data="displayData" style="width: 100%">
      <el-table-column prop="title" label="Title" />
      <el-table-column prop="category" label="Category" />
      <el-table-column prop="user_name" label="User" />
      <el-table-column label="Details" >
        <template #default="{$index, row}">
          <span @click="handleDetail(row.id)" class="cursor-pointer"><i class="bi bi-eye-fill"></i></span>
        </template>
      </el-table-column>
    </el-table>
    <el-divider></el-divider>

    <div class="text-center">
      <el-pagination
          background
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :page-size="pageSize"
          :total="feedData.length">
      </el-pagination>
    </div>
  </div>
</template>
<script setup>
import {reactive, ref, onMounted, computed} from "vue";
import router from "@/router";
import {apiClient} from "@/services/ApiRequest";

const loading = ref(false)
const feedData = ref([])
const page = ref(1)
const pageSize = ref(5)
const handleDetail = (id) => {
  router.push({name: 'detail-feedback', params: {id:id}})
  console.log(id)
}
const toFeedback = () => {
  router.push({name: 'submit-feedback'})
}
const handleCurrentChange = (val) => {
  page.value = val
}

const displayData =  computed(()=>{
  if (feedData.value.length === 0) return []
  return feedData.value.slice(pageSize.value * page.value - pageSize.value, pageSize.value * page.value)
})

onMounted(()=>{
  loading.value = true
  apiClient.get('/feedback').then((response)=>{
    feedData.value = response.data.data
  }).catch((error)=>{
    throw new Error(error)
  }).finally(()=>{
    loading.value=false
  })
})
</script>
<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>

