import { AuthState, useTurnkey } from "@turnkey/react-wallet-kit";
import { Avatar, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Link } from "react-router";
import Login from "./Login";
import useLoadStore from "@/store/useLoadStore";

const Header = () => {
  const { authState, user, logout } = useTurnkey();
  const setLoading = useLoadStore((state) => state.setLoading);

  const logoutHandler = () => {
    try {
      setLoading(true);
      logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-neutral-900">
      <div className="mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <div className="flsex items-center space-x-2">
            <Link to="/">
              <span className="font-bold text-xl text-white">Huam</span>
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
                <DropdownMenuItem variant="destructive" onClick={logoutHandler}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Login />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
