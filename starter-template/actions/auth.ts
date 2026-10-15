"use server";

import {
  USERS_CHECK_PHONE_NUMBER,
  USERS_REGISTER,
  USERS_SEND_CODE,
  USERS_VERIFY,
} from "@/configs/api.config";
import axios from "axios";
import { signIn } from "next-auth/react";
import { z } from "zod";

export async function checkPhoneAction(phoneNumber: string) {
    console.log(phoneNumber);
  const phoneSchema = z.object({
    phoneNumber: z.string().regex(/^09\d{9}$/, "شماره موبایل معتبر نیست"),
  });

  const parsed = phoneSchema.safeParse({ phoneNumber });

  if (!parsed.success) {
    return { error: "شماره موبایل معتبر نیست" };
  }

  if (!process.env.APPOINTMENT_API_BASE_URL) {
    return { error: "Configure APPOINTMENT_API_BASE_URL to use the example appointment backend." };
  }

  try {
    const { data } = await axios.post(USERS_CHECK_PHONE_NUMBER, {
      phoneNumber,
    });

    if (data.data.exists) {
      if (data.data.isVerified) {
        return { redirect: `/auth/password?phone=${phoneNumber}` };
      } else {
        await axios.post(USERS_SEND_CODE, { identifier: phoneNumber });
        return { redirect: `/auth/verify-login?phone=${phoneNumber}` };
      }
    } else {
      return { redirect: `/auth/signup?phone=${phoneNumber}` };
    }
  } catch (error: any) {
    return {
      error: error.response?.data?.message || "خطای سرور در بررسی شماره",
    };
  }
}

export async function loginAction(phoneNumber: string, password: string) {
  const passwordSchema = z.object({
    password: z.string().min(3, "رمز عبور باید حداقل 3 کاراکتر باشد"),
  });

  const parsed = passwordSchema.safeParse({ password });

  if (!phoneNumber || !parsed.success) {
    return { error: "رمز عبور معتبر نیست" };
  }

  try {
    const res = await signIn("credentials", {
      phoneNumber,
      password,
      redirect: false,
    });

    if (res?.ok) {
      return { redirect: "/dashboard" };
    } else {
      return { error: "رمز عبور اشتباه است" };
    }
  } catch (error) {
    return { error: "خطای سرور در ورود" };
  }
}

export async function forgotPasswordAction(phoneNumber: string) {
  if (!phoneNumber) {
    return { error: "شماره موبایل نامعتبر است" };
  }

  try {
    await axios.post(USERS_SEND_CODE, { identifier: phoneNumber });
    return { redirect: `/auth/verify-login?phone=${phoneNumber}` };
  } catch (error: any) {
    return {
      error: error.response?.data?.message || "خطای سرور در ارسال کد",
    };
  }
}

export async function verifyLoginAction(
  phoneNumber: string,
  code: string,
  newPassword: string
) {
  const verifySchema = z.object({
    code: z.string().length(4, "کد باید 4 رقمی باشد"),
    newPassword: z.string().min(3, "رمز عبور باید حداقل 3 کاراکتر باشد"),
  });

  const parsed = verifySchema.safeParse({ code, newPassword });

  if (!phoneNumber || !parsed.success) {
    return { error: "داده‌ها معتبر نیستند" };
  }

  try {
    const response = await axios.post(USERS_VERIFY, {
      identifier: phoneNumber,
      verificationCode: code,
      password: newPassword,
    });

    await signIn("credentials", {
      phoneNumber,
      password: newPassword,
      redirect: false,
    });

    return { redirect: "/dashboard" };
  } catch (error: any) {
    return {
      error: error.response?.data?.message || "خطای سرور در تأیید",
    };
  }
}

export async function signupAction(
  phoneNumber: string,
  fullName: string,
  emailAddress: string,
  password: string,
  confirmPassword: string
) {
  const signupSchema = z
    .object({
      fullName: z.string().min(3, "نام باید حداقل 3 کاراکتر باشد"),
      emailAddress: z.string().email("ایمیل معتبر نیست"),
      password: z.string().min(3, "رمز عبور باید حداقل 3 کاراکتر باشد"),
      confirmPassword: z.string().min(3, "تأیید رمز عبور الزامی است"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "رمز عبور و تکرار آن مطابقت ندارند",
      path: ["confirmPassword"],
    });

  const parsed = signupSchema.safeParse({
    fullName,
    emailAddress,
    password,
    confirmPassword,
  });

  if (!phoneNumber || !parsed.success) {
    return { error: "داده‌ها معتبر نیستند" };
  }

  try {
    await axios.post(USERS_REGISTER, {
      fullName,
      password,
      phoneNumber,
      emailAddress,
    });

    await axios.post(USERS_SEND_CODE, { identifier: phoneNumber });
    return { redirect: `/auth/verify-signup?phone=${phoneNumber}` };
  } catch (error: any) {
    return {
      error: error.response?.data?.message || "خطای سرور در ثبت‌نام",
    };
  }
}

export async function verifySignupAction(phoneNumber: string, code: string) {
  const verifySchema = z.object({
    code: z.string().length(4, "کد باید 4 رقمی باشد"),
  });

  const parsed = verifySchema.safeParse({ code });

  if (!phoneNumber || !parsed.success) {
    return { error: "کد معتبر نیست" };
  }

  try {
    await axios.post(USERS_VERIFY, {
      identifier: phoneNumber,
      verificationCode: code,
    });

    // Never expect a backend to return a user's plaintext password.
    // After verification, let the user authenticate through the normal sign-in flow.
    return { redirect: "/auth/phone" };
  } catch (error: any) {
    return {
      error: error.response?.data?.message || "خطای سرور در تأیید",
    };
  }
}

export async function resendCodeAction(phoneNumber: string) {
  if (!phoneNumber) {
    return { error: "شماره موبایل نامعتبر است" };
  }

  try {
    await axios.post(USERS_SEND_CODE, { identifier: phoneNumber });
    return { success: "کد جدید ارسال شد" };
  } catch (error: any) {
    return {
      error: error.response?.data?.message || "خطای سرور در ارسال کد",
    };
  }
}
