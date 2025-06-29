import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
  return (
    <header className="p-4 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Ôn tập HSK</h1>
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;