import { http } from "@/utils/http";
import { baseUrlApi } from "./utils";
import type { UserResult, RefreshTokenResult } from "./user";

/** 后端API登录接口 */
export const backendLogin = async (data: {
  username: string;
  password: string;
}) => {
  try {
    // 调用后端API
    const response = await http.request<any>("post", baseUrlApi("login"), {
      data
    });

    // 后端返回 {code, message, data}，前端期望 {success, data}
    // 这里进行简单的结构转换
    const adaptedResponse: UserResult = {
      success: response.code === 200,
      data: response.data
    };

    return adaptedResponse;
  } catch (error) {
    console.error("登录接口调用失败:", error);
    throw error;
  }
};

/** 获取动态路由 */
export const getBackendRoutes = async () => {
  try {
    const response = await http.request<any>(
      "get",
      baseUrlApi("get-async-routes")
    );

    // 返回后端原始数据，由路由处理逻辑自行解析
    return response;
  } catch (error) {
    console.error("获取动态路由失败:", error);
    throw error;
  }
};

/** 刷新Token */
export const refreshBackendToken = async (data?: object) => {
  try {
    const response = await http.request<any>(
      "post",
      baseUrlApi("refresh-token"), // 根据实际接口调整
      { data }
    );

    const adaptedResponse: RefreshTokenResult = {
      success: response.code === 200,
      data: response.data
    };

    return adaptedResponse;
  } catch (error) {
    console.error("刷新Token失败:", error);
    throw error;
  }
};
