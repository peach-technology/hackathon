import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { ArrowRightCircle, Mail } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { Button } from "@/components/ui/button";
import { OtpType, useTurnkey } from "@turnkey/react-wallet-kit";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.email({
    message: "유효한 이메일을 입력해 주세요.",
  }),
});

type Step = "closed" | "email" | "otp";

const LoginCompoent = () => {
  const {
    initOtp,
    completeOtp,
    fetchOrCreateP256ApiKeyUser,
    fetchUser,
    httpClient,
    logout,
  } = useTurnkey();

  const [otpId, setOtpId] = useState<string | null>(null);
  const [otpCode, setOtpCode] = useState("");
  const [dialog, setDialog] = useState<Step>("closed");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const otpId = await initOtp({
      contact: values.email,
      otpType: OtpType.Email,
    });
    setOtpId(otpId);
    setDialog("otp");
    toast("이메일로 OTP를 보냈습니다");
  };

  const handleCompleteOtp = async () => {
    if (!otpId) {
      toast("OTP 발급 오류");
      return;
    }

    try {
      await completeOtp({
        contact: form.getValues("email"),
        otpId,
        otpType: OtpType.Email,
        otpCode,
      });

      const freshUser = await fetchUser();

      const delegatedUser = await fetchOrCreateP256ApiKeyUser({
        publicKey: import.meta.env.VITE_TURNKEY_PUBLIC_KEY!,
        createParams: {
          userName: "Delegated Account",
          apiKeyName: "Delegated API Key",
        },
      });

      await httpClient?.updateRootQuorum({
        timestampMs: String(Date.now()),
        threshold: 1,
        userIds: [freshUser.userId, delegatedUser.userId],
      });

      toast("로그인 성공");
      setDialog("closed");
    } catch (e) {
      console.log(e);
      logout();
      toast("로그인 에러가 발생했습니다.");
    }
  };

  return (
    <>
      <Dialog
        open={dialog === "email"}
        onOpenChange={(o) => setDialog(o ? "email" : "closed")}
      >
        <DialogTrigger asChild>
          <Button size="sm" className="inline-flex cursor-pointer text-white">
            Connect Wallet
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[90%] sm:max-w-[416px]">
          <DialogHeader>
            <DialogTitle className="text-center">Log in or sign up</DialogTitle>
            <DialogDescription />
          </DialogHeader>

          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter your email"
                            className="pr-12"
                            enterKeyHint="send"
                            {...field}
                          />
                          <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 "
                          >
                            <ArrowRightCircle />
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            <p className="mt-2 text-center text-xs">
              By continuing, you agree to our Terms of Service & Privacy Policy.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialog === "otp"}
        onOpenChange={(o) => setDialog(o ? "otp" : "closed")}
      >
        <DialogContent className="max-w-[90%] sm:max-w-[416px]">
          <DialogHeader>
            <DialogTitle className="text-center">EMAIL - OTP</DialogTitle>
            <DialogDescription />
          </DialogHeader>

          <div className="space-y-4 text-center">
            <div className="space-y-2">
              <Mail size={24} className="mx-auto" />
              <p className="text-lg">Enter the 6-digit code we sent to</p>
              <p className="text-sm">{form.getValues("email")}</p>
            </div>
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otpCode}
                onChange={setOtpCode}
                onComplete={handleCompleteOtp}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default LoginCompoent;
