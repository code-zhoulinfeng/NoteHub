import type { Metadata } from "next";
import { LoginView } from "@/features/auth/components/login-view";

export const metadata: Metadata = {
  title: "登录",
};

/** GitHub OAuth 登录入口（PRD 5.1） */
export default function LoginPage() {
  return <LoginView />;
}
