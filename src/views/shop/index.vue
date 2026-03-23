<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getShopInfo, updateShopInfo, type ShopInfo } from "@/api/shop";

defineOptions({
  name: "Shop"
});

const loading = ref(false);
const shopForm = ref<Partial<ShopInfo>>({});
const formRef = ref();

const rules = {
  name: [{ required: true, message: "请输入店铺名称", trigger: "blur" }],
  phone: [{ required: true, message: "请输入联系电话", trigger: "blur" }]
};

const fetchShopInfo = async () => {
  loading.value = true;
  try {
    const data = await getShopInfo();
    shopForm.value = { ...data };
  } catch (error) {
    ElMessage.error("获取店铺信息失败");
  } finally {
    loading.value = false;
  }
};

const handleSave = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await ElMessageBox.confirm("确定要保存店铺信息吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        });

        loading.value = true;
        await updateShopInfo(shopForm.value);
        ElMessage.success("保存成功");
        await fetchShopInfo();
      } catch (error: any) {
        if (error !== "cancel") {
          ElMessage.error("保存失败");
        }
      } finally {
        loading.value = false;
      }
    }
  });
};

onMounted(() => {
  fetchShopInfo();
});
</script>

<template>
  <div class="shop-container">
    <el-card v-loading="loading" class="shop-card">
      <template #header>
        <div class="card-header">
          <span>店铺信息</span>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="shopForm"
        :rules="rules"
        label-width="100px"
        class="shop-form"
      >
        <el-form-item label="店铺名称" prop="name">
          <el-input v-model="shopForm.name" placeholder="请输入店铺名称" />
        </el-form-item>

        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="shopForm.phone" placeholder="请输入联系电话" />
        </el-form-item>

        <el-form-item label="店铺公告">
          <el-input
            v-model="shopForm.notice"
            type="textarea"
            :rows="4"
            placeholder="请输入店铺公告"
          />
        </el-form-item>

        <el-form-item label="店铺状态">
          <el-switch
            v-model="shopForm.status"
            active-text="营业中"
            inactive-text="休息中"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSave">保存</el-button>
          <el-button @click="fetchShopInfo">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.shop-container {
  padding: 20px;
}

.card-header {
  font-size: 16px;
  font-weight: bold;
}

.shop-form {
  margin-top: 20px;
}
</style>
