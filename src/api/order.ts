import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

/** 订单项 */
export interface OrderItem {
  dish: string;
  dishName: string;
  price: number;
  num: number;
  remark: string;
}

/** 订单 */
export interface Order {
  _id: string;
  orderNo: string;
  shop: string;
  user: string;
  table: string;
  tableNo: string;
  items: OrderItem[];
  totalAmount: number;
  payStatus: number;
  orderStatus: number;
  payType: string;
  payAt: string;
  servedAt: string;
  completedAt: string;
  remark: string;
  createdAt: string;
}

/** 分页响应结构 */
export interface PaginatedResponse<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** 后端API响应结构 */
interface BackendResponse<T> {
  code: number;
  message: string;
  data: T;
}

/** 获取订单列表 */
export const getOrders = async (params?: {
  orderStatus?: number;
  tableNo?: string;
  page?: number;
  pageSize?: number;
}) => {
  try {
    const response = await http.request<
      BackendResponse<PaginatedResponse<Order>>
    >("get", baseUrlApi("orders"), { params });
    return response.data;
  } catch (error) {
    console.error("获取订单列表失败:", error);
    throw error;
  }
};

/** 获取订单详情 */
export const getOrderDetail = async (orderNo: string) => {
  try {
    const response = await http.request<BackendResponse<Order>>(
      "get",
      baseUrlApi(`orders/${orderNo}`)
    );
    return response.data;
  } catch (error) {
    console.error("获取订单详情失败:", error);
    throw error;
  }
};

/** 更新订单状态 */
export const updateOrderStatus = async (
  orderNo: string,
  orderStatus: number
) => {
  try {
    const response = await http.request<
      BackendResponse<{
        orderNo: string;
        orderStatus: number;
        servedAt: string;
        completedAt: string;
      }>
    >("put", baseUrlApi(`orders/${orderNo}/status`), {
      data: { orderStatus }
    });
    return response.data;
  } catch (error) {
    console.error("更新订单状态失败:", error);
    throw error;
  }
};
