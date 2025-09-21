/* eslint-disable @typescript-eslint/no-explicit-any */
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import useTokenStore from "@/store/useTokenStore";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";

const SwapPage = () => {
  const [loading, setLoading] = useState(true);
  const token = useTokenStore((state) => state.token);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    const scriptId = "debridge-widget-script";
    const containerId = "debridgeWidgetContainer";

    function initWidget() {
      if (!token) return;

      if (!window.deBridge || !window.deBridge.widget) {
        console.error("deBridge widget script not loaded yet");
        return;
      }
      const stylesObj = {
        appBackground: "#171717",
      };

      const initObj = {
        element: containerId,
        v: "1",
        mode: "deswap",
        title: "",
        width: "600",
        height: "800",
        inputChain: 56,
        outputChain: 1,
        inputCurrency: "",
        outputCurrency: "",
        address: "",
        amount: "",
        lang: "en",
        theme: "dark",
        styles: btoa(JSON.stringify(stylesObj)),
        r: null,
      };

      window.deBridge
        .widget(initObj)
        .then((widget: any) => {
          widgetRef.current = widget;
          setLoading(false);
        })
        .catch((e: any) => {
          console.error("deBridge widget init error:", e);
        });
    }

    // 스크립트 로드
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://app.debridge.finance/assets/scripts/widget.js";
      script.async = true;
      script.onload = initWidget;
      document.body.appendChild(script);
    } else {
      initWidget();
    }
  }, [token]);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {loading && <Spinner variant="default" />}
      <div
        id="debridgeWidgetContainer"
        className={clsx("w-full h-full  items-center justify-center", loading ? "hidden" : "flex")}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default SwapPage;
