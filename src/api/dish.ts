import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

/** 菜品分类信息（嵌套在菜品中） */
export interface DishCategory {
  _id: string;
  name: string;
}

/** 菜品 */
export interface Dish {
  _id: string;
  shop: string;
  category: DishCategory | string;
  name: string;
  price: number;
  image: string;
  stock: number;
  status: boolean;
  sort: number;
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

/** 获取菜品列表 */
export const getDishes = async (params?: {
  categoryId?: string;
  keyword?: string;
  page?: number;
  pageSize?: number;
}) => {
  try {
    const response = await http.request<
      BackendResponse<PaginatedResponse<Dish>>
    >("get", baseUrlApi("dishes"), { params });
    return response.data;
  } catch (error) {
    console.error("获取菜品列表失败:", error);
    throw error;
  }
};

/** 创建菜品 */
export const createDish = async (data: {
  name: string;
  price: number;
  image?: string;
  categoryId: string;
  stock?: number;
  sort?: number;
}) => {
  try {
    const response = await http.request<BackendResponse<Dish>>(
      "post",
      baseUrlApi("dishes"),
      { data }
    );
    return response.data;
  } catch (error) {
    console.error("创建菜品失败:", error);
    throw error;
  }
};

/** 更新菜品 */
export const updateDish = async (id: string, data: Partial<Dish>) => {
  try {
    const response = await http.request<BackendResponse<Dish>>(
      "put",
      baseUrlApi(`dishes/${id}`),
      { data }
    );
    return response.data;
  } catch (error) {
    console.error("更新菜品失败:", error);
    throw error;
  }
};

/** 删除菜品 */
export const deleteDish = async (id: string) => {
  try {
    const response = await http.request<BackendResponse<null>>(
      "delete",
      baseUrlApi(`dishes/${id}`)
    );
    return response.data;
  } catch (error) {
    console.error("删除菜品失败:", error);
    throw error;
  }
};
