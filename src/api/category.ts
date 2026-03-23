import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

/** 菜品分类 */
export interface Category {
  _id: string;
  shop: string;
  name: string;
  sort: number;
  status: boolean;
  createdAt: string;
}

/** 后端API响应结构 */
interface BackendResponse<T> {
  code: number;
  message: string;
  data: T;
}

/** 获取菜品分类列表 */
export const getCategories = async () => {
  try {
    const response = await http.request<BackendResponse<Category[]>>(
      "get",
      baseUrlApi("categories")
    );
    return response.data;
  } catch (error) {
    console.error("获取菜品分类列表失败:", error);
    throw error;
  }
};

/** 创建菜品分类 */
export const createCategory = async (data: { name: string; sort?: number }) => {
  try {
    const response = await http.request<BackendResponse<Category>>(
      "post",
      baseUrlApi("categories"),
      { data }
    );
    return response.data;
  } catch (error) {
    console.error("创建菜品分类失败:", error);
    throw error;
  }
};

/** 更新菜品分类 */
export const updateCategory = async (id: string, data: Partial<Category>) => {
  try {
    const response = await http.request<BackendResponse<Category>>(
      "put",
      baseUrlApi(`categories/${id}`),
      { data }
    );
    return response.data;
  } catch (error) {
    console.error("更新菜品分类失败:", error);
    throw error;
  }
};

/** 删除菜品分类 */
export const deleteCategory = async (id: string) => {
  try {
    const response = await http.request<BackendResponse<null>>(
      "delete",
      baseUrlApi(`categories/${id}`)
    );
    return response.data;
  } catch (error) {
    console.error("删除菜品分类失败:", error);
    throw error;
  }
};
