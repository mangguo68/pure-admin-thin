<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import {
  getTables,
  createTable,
  updateTable,
  deleteTable,
  type Table
} from "@/api/table";

defineOptions({
  name: "TableManage"
});

const loading = ref(false);
const tableList = ref<Table[]>([]);
const dialogVisible = ref(false);
const dialogTitle = ref("");
const formRef = ref();
const formData = ref<Partial<Table>>({
  tableNo: "",
  tableType: "大厅",
  status: "空闲"
});
const isEdit = ref(false);

const tableTypeOptions = [
  { label: "大厅", value: "大厅" },
  { label: "包厢", value: "包厢" },
  { label: "卡座", value: "卡座" }
];

const statusOptions = [
  { label: "空闲", value: "空闲" },
  { label: "占用", value: "占用" },
  { label: "预订", value: "预订" }
];

const rules = {
  tableNo: [{ required: true, message: "请输入桌号", trigger: "blur" }],
  tableType: [{ required: true, message: "请选择桌台类型", trigger: "change" }]
};

const fetchTables = async () => {
  loading.value = true;
  try {
    const data = await getTables();
    tableList.value = data;
  } catch (error) {
    ElMessage.error("获取桌台列表失败");
  } finally {
    loading.value = false;
  }
};

const handleAdd = () => {
  isEdit.value = false;
  dialogTitle.value = "新增桌台";
  formData.value = {
    tableNo: "",
    tableType: "大厅",
    status: "空闲"
  };
  dialogVisible.value = true;
};

const handleEdit = (row: Table) => {
  isEdit.value = true;
  dialogTitle.value = "编辑桌台";
  formData.value = { ...row };
  dialogVisible.value = true;
};

const handleDelete = async (row: Table) => {
  try {
    await ElMessageBox.confirm(`确定要删除桌台 "${row.tableNo}" 吗？`, "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });

    loading.value = true;
    await deleteTable(row._id);
    ElMessage.success("删除成功");
    await fetchTables();
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
          await updateTable(formData.value._id, {
            tableNo: formData.value.tableNo,
            tableType: formData.value.tableType
          });
          ElMessage.success("更新成功");
        } else {
          await createTable({
            tableNo: formData.value.tableNo!,
            tableType: formData.value.tableType
          });
          ElMessage.success("创建成功");
        }
        dialogVisible.value = false;
        await fetchTables();
      } catch (error: any) {
        ElMessage.error(
          error.message || (isEdit.value ? "更新失败" : "创建失败")
        );
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

const getStatusType = (
  status: string
): "success" | "danger" | "warning" | "info" | "primary" => {
  const map: Record<
    string,
    "success" | "danger" | "warning" | "info" | "primary"
  > = {
    空闲: "success",
    占用: "danger",
    预订: "warning"
  };
  return map[status] || "info";
};

onMounted(() => {
  fetchTables();
});
</script>

<template>
  <div class="table-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>桌台管理</span>
          <el-button type="primary" @click="handleAdd">新增桌台</el-button>
        </div>
      </template>

      <el-table v-loading="loading" :data="tableList" border>
        <el-table-column prop="tableNo" label="桌号" />
        <el-table-column prop="tableType" label="桌台类型" />
        <el-table-column label="状态">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="二维码" width="100">
          <template #default="{ row }">
            <el-image
              v-if="row.qrCode"
              :src="row.qrCode"
              style="width: 50px; height: 50px"
              fit="contain"
              preview-teleported
              :preview-src-list="[row.qrCode]"
            />
            <span v-else>-</span>
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
        <el-form-item label="桌号" prop="tableNo">
          <el-input
            v-model="formData.tableNo"
            placeholder="请输入桌号，如：A1"
          />
        </el-form-item>

        <el-form-item label="桌台类型" prop="tableType">
          <el-select v-model="formData.tableType" placeholder="请选择桌台类型">
            <el-option
              v-for="item in tableTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
.table-container {
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
