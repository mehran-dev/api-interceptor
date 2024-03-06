// <import packages
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { Request, Response } from "@/lib/types/services.types";

class ApiHandlersModel {
  async createApiCall(requestObj: Request) {
    const {
      method = "get",
      url,
      reqObj = null,
      params = null,
      contentType = "application/json",
    } = requestObj;

    const token = Cookies.get("token");

    const defaultReqObj = {
      method,
      url: `${process.env.NEXT_PUBLIC_BASE_ROOT}${url}`,
      headers: {
        accept: "application/json",
        "Content-Type": contentType,
        Authorization: token,
      },
      params,
    };

    const reqObjWithBody = { ...defaultReqObj, data: reqObj };

    return await axios(!reqObj ? defaultReqObj : reqObjWithBody);
  }

  async response(request: Request): Promise<Response | undefined> {
    try {
      const response = await this.createApiCall(request);

      if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 202
      ) {
        if (response.data) {
          return {
            type: true,
            message: response.data.message,
            data: response.data.data,
          };
        } else {
          return {
            type: false,
            message: "خطا در بر قراری ارتباط با سرور",
            data: null,
          };
        }
      }
    } catch (error: any) {
      return this.fail(error);
    }
  }

  async fail(e: any): Promise<Response> {
    const defaultErrorMessage = "خطا در بر قراری ارتباط با سرور";

    if (e.code === "ERR_NETWORK") {
      if (process.env.NODE_ENV === "production") {
        window.location.href = "/500";
      } else {
        toast.error(e.message ?? defaultErrorMessage);
      }
    }

    if ((e?.response?.status ?? 0) >= 500) {
      toast.error(e?.response?.data?.data);
    }

    if (e?.response?.status === 401) {
      Cookies.remove("token");

      window.location.href = "/login";
    }

    if (e?.response?.status === 403) {
      window.location.href = "/403";

      toast.error(e.response.data.data);
    }

    let message = e?.response?.data?.data;

    return {
      type: false,
      message: message || defaultErrorMessage,
      data: null,
    };
  }
}

const requestModel = new ApiHandlersModel();

export default requestModel;
