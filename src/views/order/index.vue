<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { getOrders, updateOrderStatus, type Order } from "@/api/order";

defineOptions({
  name: "Order"
});

const loading = ref(false);
const orderList = ref<Order[]>([]);
const total = ref(0);
const currentPage = ref(1);
const pageSize = ref(10);

const searchForm = ref({
  orderStatus: undefined as number | undefined,
  tableNo: ""
});

const orderStatusOptions = [
  { label: "待支付", value: 0 },
  { label: "已支付", value: 1 },
  { label: "已接单", value: 2 },
  { label: "已完成", value: 3 },
  { label: "已取消", value: 4 }
];

const payStatusOptions = [
  { label: "未支付", value: 0 },
  { label: "已支付", value: 1 }
];

const getOrderStatusLabel = (status: number) => {
  const map: Record<number, string> = {
    0: "待支付",
    1: "已支付",
    2: "已接单",
    3: "已完成",
    4: "已取消"
  };
  return map[status] || "未知";
};

const getOrderStatusType = (
  status: number
): "success" | "danger" | "warning" | "info" | "primary" => {
  const map: Record<
    number,
    "success" | "danger" | "warning" | "info" | "primary"
  > = {
    0: "warning",
    1: "primary",
    2: "success",
    3: "info",
    4: "danger"
  };
  return map[status] || "info";
};

const getPayStatusType = (status: number) => {
  return status === 1 ? "success" : "danger";
};

const getPayStatusLabel = (status: number) => {
  return status === 1 ? "已支付" : "未支付";
};

const fetchOrders = async () => {
  loading.value = true;
  try {
    const data = await getOrders({
      page: currentPage.value,
      pageSize: pageSize.value,
      orderStatus: searchForm.value.orderStatus,
      tableNo: searchForm.value.tableNo || undefined
    });
    orderList.value = data.list;
    total.value = data.total;
  } catch (error) {
    ElMessage.error("获取订单列表失败");
  } finally {
    loading.value = false;
  }
};

const handleSearch = () => {
  currentPage.value = 1;
  fetchOrders();
};

const handleReset = () => {
  searchForm.value = {
    orderStatus: undefined,
    tableNo: ""
  };
  currentPage.value = 1;
  fetchOrders();
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  fetchOrders();
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  fetchOrders();
};

const handleUpdateStatus = async (row: Order, newStatus: number) => {
  try {
    await ElMessageBox.confirm(
      `确定要将订单状态更新为"${getOrderStatusLabel(newStatus)}"吗？`,
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }
    );

    loading.value = true;
    await updateOrderStatus(row.orderNo, newStatus);
    ElMessage.success("状态更新成功");
    await fetchOrders();
  } catch (error: any) {
    if (error !== "cancel") {
      ElMessage.error(error.message || "状态更新失败");
    }
  } finally {
    loading.value = false;
  }
};

const getAvailableActions = (row: Order) => {
  const actions = [];
  if (row.orderStatus === 1) {
    actions.push({ label: "接单", status: 2, type: "primary" });
  }
  if (row.orderStatus === 2) {
    actions.push({ label: "完成", status: 3, type: "success" });
  }
  if (row.orderStatus === 0) {
    actions.push({ label: "取消", status: 4, type: "danger" });
  }
  return actions;
};

const formatDateTime = (datetime: string) => {
  if (!datetime) return "-";
  return new Date(datetime).toLocaleString();
};

onMounted(() => {
  fetchOrders();
});
</script>

<template>
  <div class="order-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>订单管理</span>
        </div>
      </template>

      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="桌号">
          <el-input
            v-model="searchForm.tableNo"
            placeholder="请输入桌号"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select
            v-model="searchForm.orderStatus"
            placeholder="请选择状态"
            clearable
            style="width: 200px"
          >
            <el-option
              v-for="item in orderStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="orderList" border>
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="tableNo" label="桌号" width="100" />
        <el-table-column label="菜品" min-width="200">
          <template #default="{ row }">
            <div class="dish-list">
              <div
                v-for="(item, index) in row.items"
                :key="index"
                class="dish-item"
              >
                {{ item.dishName }} x{{ item.num }}
                <span v-if="item.remark" class="remark"
                  >({{ item.remark }})</span
                >
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="总金额" width="100">
          <template #default="{ row }">
            ¥{{ row.totalAmount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="支付状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getPayStatusType(row.payStatus)">
              {{ getPayStatusLabel(row.payStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getOrderStatusType(row.orderStatus)">
              {{ getOrderStatusLabel(row.orderStatus) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="下单时间" width="180">
          <template #default="{ row }">
            {{ formatDateTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              v-for="action in getAvailableActions(row)"
              :key="action.status"
              :type="action.type"
              link
              @click="handleUpdateStatus(row, action.status)"
            >
              {{ action.label }}
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
  </div>
</template>

<style scoped>
.order-container {
  padding: 20px;
}

.card-header {
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

.dish-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.dish-item {
  font-size: 13px;
}

.remark {
  font-size: 12px;
  color: #999;
}
</style>
