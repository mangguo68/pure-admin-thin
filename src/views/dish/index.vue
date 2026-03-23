<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getDishes,
  createDish,
  updateDish,
  deleteDish,
  type Dish
} from "@/api/dish";
import { getCategories, type Category } from "@/api/category";

defineOptions({
  name: "Dish"
});

const loading = ref(false);
const dishList = ref<Dish[]>([]);
const categoryList = ref<Category[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

const searchForm = ref({
  keyword: "",
  categoryId: undefined as string | undefined
});

const dialogVisible = ref(false);
const dialogTitle = ref("");
const formRef = ref();
const formData = ref<Partial<Dish>>({
  name: "",
  price: 0,
  image: "",
  category: "",
  stock: -1,
  sort: 0,
  status: true
});
const isEdit = ref(false);

const rules = {
  name: [{ required: true, message: "请输入菜品名称", trigger: "blur" }],
  price: [{ required: true, message: "请输入菜品价格", trigger: "blur" }],
  category: [{ required: true, message: "请选择分类", trigger: "change" }]
};

const categoryOptions = computed(() => {
  return categoryList.value.map(item => ({
    label: item.name,
    value: item._id
  }));
});

const getCategoryName = (category: string | { name: string }) => {
  if (typeof category === "string") {
    const cat = categoryList.value.find(item => item._id === category);
    return cat?.name || "-";
  }
  return category?.name || "-";
};

const fetchCategories = async () => {
  try {
    const data = await getCategories();
    categoryList.value = data;
  } catch (error) {
    console.error("获取分类列表失败", error);
  }
};

const fetchDishes = async () => {
  loading.value = true;
  try {
    const data = await getDishes({
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: searchForm.value.keyword || undefined,
      categoryId: searchForm.value.categoryId || undefined
    });
    dishList.value = data.list;
    total.value = data.total;
  } catch (error) {
    ElMessage.error("获取菜品列表失败");
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchDishes();
};

const handleReset = () => {
  searchForm.value = {
    keyword: "",
    categoryId: undefined
  };
  currentPage.value = 1;
  fetchDishes();
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  fetchDishes();
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  fetchDishes();
};

const handleAdd = () => {
  isEdit.value = false;
  dialogTitle.value = "新增菜品";
  formData.value = {
    name: "",
    price: 0,
    image: "",
    category: "",
    stock: -1,
    sort: 0,
    status: true
  };
  dialogVisible.value = true;
};

const handleEdit = (row: Dish) => {
  isEdit.value = true;
  dialogTitle.value = "编辑菜品";
  formData.value = {
    ...row,
    category: typeof row.category === "string" ? row.category : row.category._id
  };
  dialogVisible.value = true;
};

const handleDelete = async (row: Dish) => {
  try {
    await ElMessageBox.confirm(`确定要删除菜品 "${row.name}" 吗？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });

    loading.value = true;
    await deleteDish(row._id);
    ElMessage.success("删除成功");
    await fetchDishes();
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
        const submitData = {
          name: formData.value.name!,
          price: formData.value.price!,
          image: formData.value.image,
          categoryId: formData.value.category as string,
          stock: formData.value.stock,
          sort: formData.value.sort
        };

        if (isEdit.value && formData.value._id) {
          await updateDish(formData.value._id, {
            ...submitData,
            status: formData.value.status
          });
          ElMessage.success("更新成功");
        } else {
          await createDish(submitData);
          ElMessage.success("创建成功");
        }
        dialogVisible.value = false;
        await fetchDishes();
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
  fetchDishes();
});
</script>

<template>
  <div class="dish-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>菜品管理</span>
          <el-button type="primary" @click="handleAdd">新增菜品</el-button>
        </div>
      </template>

      <el-form :model="searchForm" :inline="true" class="search-form">
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="请输入菜品名称"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="分类">
          <el-select
            v-model="searchForm.categoryId"
            placeholder="请选择分类"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
            <template #empty>
              <span style="color: #999">暂无分类数据</span>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="dishList" border>
        <el-table-column prop="name" label="菜品名称" />
        <el-table-column label="分类">
          <template #default="{ row }">
            {{ getCategoryName(row.category) }}
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格">
          <template #default="{ row }"> ¥{{ row.price.toFixed(2) }} </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存">
          <template #default="{ row }">
            {{ row.stock === -1 ? "无限" : row.stock }}
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'">
              {{ row.status ? "上架" : "下架" }}
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

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="菜品名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入菜品名称" />
        </el-form-item>

        <el-form-item label="所属分类" prop="category">
          <el-select v-model="formData.category" placeholder="请选择分类">
            <el-option
              v-for="item in categoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="菜品价格" prop="price">
          <el-input-number
            v-model="formData.price"
            :min="0"
            :precision="2"
            :step="0.1"
          />
        </el-form-item>

        <el-form-item label="库存">
          <el-input-number v-model="formData.stock" :min="-1" />
          <span class="tip">-1表示无限库存</span>
        </el-form-item>

        <el-form-item label="排序">
          <el-input-number v-model="formData.sort" :min="0" />
        </el-form-item>

        <el-form-item v-if="isEdit" label="状态">
          <el-switch
            v-model="formData.status"
            active-text="上架"
            inactive-text="下架"
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
.dish-container {
  padding: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  font-weight: bold;
}

.search-form {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.tip {
  margin-left: 10px;
  font-size: 12px;
  color: #999;
}
</style>
