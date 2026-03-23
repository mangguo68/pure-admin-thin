import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

/** 桌台 */
export interface Table {
  _id: string;
  shop: string;
  tableNo: string;
  tableType: string;
  status: string;
  qrCode: string;
  createdAt: string;
}

/** 后端API响应结构 */
interface BackendResponse<T> {
  code: number;
  message: string;
  data: T;
}

/** 获取桌台列表 */
export const getTables = async () => {
  try {
    const response = await http.request<BackendResponse<Table[]>>(
      "get",
      baseUrlApi("tables")
    );
    return response.data;
  } catch (error) {
    console.error("获取桌台列表失败:", error);
    throw error;
  }
};

/** 创建桌台 */
export const createTable = async (data: {
  tableNo: string;
  tableType?: string;
}) => {
  try {
    const response = await http.request<BackendResponse<Table>>(
      "post",
      baseUrlApi("tables"),
      { data }
    );
    return response.data;
  } catch (error) {
    console.error("创建桌台失败:", error);
    throw error;
  }
};

/** 更新桌台 */
export const updateTable = async (id: string, data: Partial<Table>) => {
  try {
    const response = await http.request<BackendResponse<Table>>(
      "put",
      baseUrlApi(`tables/${id}`),
      { data }
    );
    return response.data;
  } catch (error) {
    console.error("更新桌台失败:", error);
    throw error;
  }
};

/** 删除桌台 */
export const deleteTable = async (id: string) => {
  try {
    const response = await http.request<BackendResponse<null>>(
      "delete",
      baseUrlApi(`tables/${id}`)
    );
    return response.data;
  } catch (error) {
    console.error("删除桌台失败:", error);
    throw error;
  }
};
