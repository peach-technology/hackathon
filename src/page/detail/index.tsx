import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogDescription } from "@radix-ui/react-dialog";
import { ChevronRight } from "lucide-react";
import { useState, type ChangeEvent } from "react";
import { Bar, BarChart, XAxis } from "recharts";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig;

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const DetailPage = () => {
  const [val, setVal] = useState("0");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, "");
    digits = digits.replace(/^0+/, "");

    if (digits === "") digits = "0";

    setVal(digits);
  };

  return (
    <div className="flex gap-8 relative items-start">
      <div className="flex-2 space-y-16">
        <Card>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
              <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
          </ChartContainer>
        </Card>

        <Separator />

        <div className="grid gap-5">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Risk
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <Card>
              <ChartContainer config={chartConfig}>
                <BarChart accessibilityLayer data={chartData}>
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <Bar
                    dataKey="desktop"
                    fill="var(--color-desktop)"
                    radius={4}
                  />
                  <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                </BarChart>
              </ChartContainer>
            </Card>
            <Card>
              <ChartContainer config={chartConfig}>
                <BarChart accessibilityLayer data={chartData}>
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <Bar
                    dataKey="desktop"
                    fill="var(--color-desktop)"
                    radius={4}
                  />
                  <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                </BarChart>
              </ChartContainer>
            </Card>
          </div>
        </div>
      </div>
      <div className="flex-1 max-w-sm sticky top-18">
        <Tabs defaultValue="buy" className="w-[400px]">
          <TabsList className="bg-transparent">
            <TabsTrigger value="buy" className="cursor-pointer">
              Buy
            </TabsTrigger>
            <TabsTrigger value="sell" className="cursor-pointer">
              Sell
            </TabsTrigger>
          </TabsList>

          <TabsContent value="buy" className="space-y-5">
            <div className="text-4xl border rounded-xl py-12 px-4 flex flex-col items-center">
              <div className="flex w-full justify-center items-center gap-1 min-w-0">
                <p className="flex-none">US$</p>
                <input
                  value={val}
                  onChange={onChange}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="outline-0 bg-transparent w-6"
                  style={{ width: `${Math.max(1, val.length) * 24}px` }}
                />
              </div>
              <div className="flex gap-2 items-center mt-8">
                <Button variant="outline" onClick={() => setVal("100")}>
                  $100
                </Button>
                <Button variant="outline" onClick={() => setVal("300")}>
                  $300
                </Button>
                <Button variant="outline" onClick={() => setVal("1000")}>
                  $1000
                </Button>
              </div>
            </div>

            <Dialog>
              <DialogTrigger className="w-full">
                <div className="p-4 border rounded-xl bg-neutral-900 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                      </Avatar>
                      <p>Token Name</p>
                    </div>
                    <ChevronRight />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Token</DialogTitle>
                  <DialogDescription>Token List</DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="sell" className="space-y-5">
            <div className="text-4xl border rounded-xl py-12 px-4 flex flex-col items-center">
              <div className="flex w-full justify-center items-center gap-1 min-w-0">
                <p className="flex-none">US$</p>
                <input
                  value={val}
                  onChange={onChange}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="outline-0 bg-transparent w-6"
                  style={{ width: `${Math.max(1, val.length) * 24}px` }}
                />
              </div>
              <div className="flex gap-2 items-center mt-8">
                <Button variant="outline" onClick={() => setVal("100")}>
                  25%
                </Button>
                <Button variant="outline" onClick={() => setVal("300")}>
                  50%
                </Button>
                <Button variant="outline" onClick={() => setVal("1000")}>
                  75%
                </Button>
                <Button variant="outline" onClick={() => setVal("1000")}>
                  100%
                </Button>
              </div>
            </div>

            <Dialog>
              <DialogTrigger className="w-full">
                <div className="p-4 border rounded-xl bg-neutral-900 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                      </Avatar>
                      <p>Token Name</p>
                    </div>
                    <ChevronRight />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Token</DialogTitle>
                  <DialogDescription>Token List</DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DetailPage;
