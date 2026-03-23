<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category
} from "@/api/category";

defineOptions({
  name: "Category"
});

const loading = ref(false);
const categoryList = ref<Category[]>([]);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const formRef = ref();
const formData = ref<Partial<Category>>({
  name: "",
  sort: 0,
  status: true
});
const isEdit = ref(false);

const rules = {
  name: [{ required: true, message: "请输入分类名称", trigger: "blur" }]
};

const fetchCategories = async () => {
  loading.value = true;
  try {
    const data = await getCategories();
    categoryList.value = data;
  } catch (error) {
    ElMessage.error("获取分类列表失败");
  } finally {
    loading.value = false;
  }
};

const handleAdd = () => {
  isEdit.value = false;
  dialogTitle.value = "新增分类";
  formData.value = {
    name: "",
    sort: 0,
    status: true
  };
  dialogVisible.value = true;
};

const handleEdit = (row: Category) => {
  isEdit.value = true;
  dialogTitle.value = "编辑分类";
  formData.value = { ...row };
  dialogVisible.value = true;
};

const handleDelete = async (row: Category) => {
  try {
    await ElMessageBox.confirm(`确定要删除分类 "${row.name}" 吗？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });

    loading.value = true;
    await deleteCategory(row._id);
    ElMessage.success("删除成功");
    await fetchCategories();
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error(error.message || "删除失败");
    }
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        loading.value = true;
        if (isEdit.value && formData.value._id) {
          await updateCategory(formData.value._id, formData.value);
          ElMessage.success("更新成功");
        } else {
          await createCategory({
            name: formData.value.name!,
            sort: formData.value.sort
          });
          ElMessage.success("创建成功");
        }
        dialogVisible.value = false;
        await fetchCategories();
      } catch (error) {
        ElMessage.error(isEdit.value ? "更新失败" : "创建失败");
      } finally {
        loading.value = false;
      }
    }
  });
};

const handleDialogClose = () => {
  formRef.value?.resetFields();
  dialogVisible.value = false;
};

onMounted(() => {
  fetchCategories();
});
</script>

<template>
  <div class="category-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>菜品分类管理</span>
          <el-button type="primary" @click="handleAdd">新增分类</el-button>
        </div>
      </template>

      <el-table v-loading="loading" :data="categoryList" border>
        <el-table-column prop="name" label="分类名称" />
        <el-table-column prop="sort" label="排序" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'">
              {{ row.status ? "启用" : "禁用" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入分类名称" />
        </el-form-item>

        <el-form-item label="排序">
          <el-input-number v-model="formData.sort" :min="0" />
        </el-form-item>

        <el-form-item v-if="isEdit" label="状态">
          <el-switch
            v-model="formData.status"
            active-text="启用"
            inactive-text="禁用"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="handleDialogClose">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleSubmit">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.category-container {
  padding: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  font-weight: bold;
}
</style>
