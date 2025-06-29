import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
  return (
    <header className="p-4 border-b sticky top-0 bg-background/95 backdrop-blur-sm z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">HSK Master</h1>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;