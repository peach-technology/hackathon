import { AuthState, useTurnkey } from "@turnkey/react-wallet-kit";
import { Avatar, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Link } from "react-router";
import LoginCompoent from "./LoginCompoent";

const Header = () => {
  const { authState, user, logout } = useTurnkey();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div className="flsex items-center space-x-2">
            <Link to="/">
              <div className="h-8 w-16 bg-primary rounded-lg flex items-center justify-center">
                <span className="font-bold text-sm text-white">Huam</span>
              </div>
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {authState === AuthState.Authenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex gap-2 items-center">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                  </Avatar>
                  <p className="text-sm">{user?.userName}</p>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => logout()}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <LoginCompoent />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
