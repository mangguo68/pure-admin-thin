import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";

/** 后端API返回的路由数据结构 */
export interface BackendRouteResponse {
  code: number;
  message: string;
  data: Array<any>;
}

/** 前端期望的路由数据结构 */
type Result = {
  success: boolean;
  data: Array<any>;
};

export const getAsyncRoutes = async () => {
  try {
    // 调用后端API获取动态路由
    const response = await http.request<BackendRouteResponse>(
      "get",
      baseUrlApi("get-async-routes")
    );

    // 将后端返回的数据结构转换为前端期望的格式
    const adaptedResponse: Result = {
      success: response.code === 200,
      data: response.data
    };

    return adaptedResponse;
  } catch (error) {
    console.error("获取动态路由失败:", error);
    // 返回空的路由数据
    return {
      success: false,
      data: []
    };
  }
};
