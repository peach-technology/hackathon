import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTokenListQuery, type TokenType } from "@/hooks/api/token";
import useTokenStore from "@/store/useTokenStore";
import { Check, ChevronRight, Loader2Icon } from "lucide-react";
import { useState } from "react";

const TokenSelect = () => {
  const { data, isPending } = useTokenListQuery();
  const { token: selectToken, setToken } = useTokenStore();

  const [open, setOpen] = useState(false);

  const handleSelect = (token: TokenType) => {
    setToken(token);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-auto rounded-full justify-between items-center gap-5">
          <div className="flex text-left items-center gap-2">
            <div className="size-6 rounded-full overflow-hidden">
              <img src={selectToken.logo} />
            </div>
            <div>
              <p className="text-muted-foreground">{selectToken.name}</p>
              <p className="text-muted-foreground">{selectToken.network}</p>
            </div>
          </div>
          <ChevronRight />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Token Select</DialogTitle>
          <DialogDescription />
        </DialogHeader>

        <ScrollArea className="max-h-[70vh]">
          {isPending && (
            <div className="text-center">
              <Loader2Icon />
            </div>
          )}
          {!isPending && (
            <div className="space-y-5">
              {data?.map((token) => {
                const activeToken = selectToken.id === token.id;
                return (
                  <Button
                    key={token.id}
                    className="w-full h-auto justify-start relative"
                    variant={activeToken ? "secondary" : "outline"}
                    onClick={() => (activeToken ? {} : handleSelect(token))}
                  >
                    <div className="space-x-2 flex items-center justify-start text-left">
                      <Avatar>
                        <AvatarImage src={token.logo} />
                      </Avatar>
                      <div>
                        <h4 className="text-lg">{token.name}</h4>
                        <div className="flex gap-2 text-muted-foreground text-xs">
                          <p>{token.network}</p>
                          <p>{`${token.contract_address.slice(0, 8)}...${token.contract_address.slice(-8)}`}</p>
                        </div>
                      </div>
                    </div>

                    {activeToken && <Check className="absolute right-2.5 top-1/2 -translate-y-1/2" />}
                  </Button>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TokenSelect;
