// app/admin/login/page.tsx
"use client";

import { Suspense } from "react";
import AdminLoginForm from "@/features/Admin/adminLoginForm";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white/60">Loading...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}