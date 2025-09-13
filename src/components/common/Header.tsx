import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";
import { Input } from "../ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
import { useTurnkey } from "@turnkey/react-wallet-kit";

const formSchema = z.object({
  email: z.email({ message: "Please enter a valid email address" }),
});

const Header = () => {
  const [openDialog, setOpenDialog] = useState<"connect" | "mail" | null>(null);
  const {
    user: turnkeyUser,
    session: turnkeySession,
    createEmbeddedKey,
    createSession,
    client,
    refreshSession,
    clearAllSessions,
    handleGoogleOAuth,
  } = useTurnkey();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <div className="flsex items-center space-x-2">
              <div className="h-8 w-16 bg-primary rounded-lg flex items-center justify-center">
                <span className="font-bold text-sm">Huam</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Dialog
              open={openDialog === "connect"}
              onOpenChange={(open) => setOpenDialog(open ? "connect" : null)}
            >
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="inline-flex cursor-pointer text-white"
                >
                  Connect Wallet
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader className="gap-5">
                  <DialogTitle className="text-center">
                    Log in or sign up
                  </DialogTitle>
                  <DialogDescription>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                      >
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <div className="relative w-full">
                                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                  <Input
                                    placeholder="Email"
                                    className="pl-9"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button className="w-full text-white" type="submit">
                          Submit
                        </Button>
                      </form>
                    </Form>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      <Dialog
        open={openDialog === "mail"}
        onOpenChange={(open) => setOpenDialog(open ? "mail" : null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader className="gap-5">
            <DialogTitle className="text-center">OTP</DialogTitle>
            <DialogDescription>
              <div className="flex justify-center">
                <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
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
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Header;
