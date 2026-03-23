import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

/** 店铺信息 */
export interface ShopInfo {
  _id: string;
  name: string;
  phone: string;
  notice: string;
  status: boolean;
  createdAt: string;
}

/** 后端API响应结构 */
interface BackendResponse<T> {
  code: number;
  message: string;
  data: T;
}

/** 获取店铺信息 */
export const getShopInfo = async () => {
  try {
    const response = await http.request<BackendResponse<ShopInfo>>(
      "get",
      baseUrlApi("shop")
    );
    return response.data;
  } catch (error) {
    console.error("获取店铺信息失败:", error);
    throw error;
  }
};

/** 更新店铺信息 */
export const updateShopInfo = async (data: Partial<ShopInfo>) => {
  try {
    const response = await http.request<BackendResponse<ShopInfo>>(
      "put",
      baseUrlApi("shop"),
      { data }
    );
    return response.data;
  } catch (error) {
    console.error("更新店铺信息失败:", error);
    throw error;
  }
};
