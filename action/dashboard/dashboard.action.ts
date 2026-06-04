import { DashboardResponse } from "@/types";
import { apiRequest } from "../_apiRequest";

export const GetDashboardAction = (token: string) =>
  apiRequest<DashboardResponse>({
    method: "get",
    url: "/dashboard/",
    token,
    errorMessage: "Failed to fetch dashboard data",
  });
