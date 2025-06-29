import { BookMarked, MessageSquareQuote } from "lucide-react";

const HeroIllustration = () => {
  return (
    <div className="relative w-full max-w-md mx-auto lg:mx-0">
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full filter blur-2xl opacity-70 animate-blob"></div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-secondary/20 rounded-full filter blur-2xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="relative bg-card p-8 rounded-2xl shadow-lg border">
        <div className="flex flex-col items-center text-center">
          <BookMarked className="w-16 h-16 text-primary mb-4" />
          <h3 className="text-2xl font-bold mb-2">Học Từ Vựng</h3>
          <p className="text-muted-foreground">
            "学而时习之，不亦说乎？"
          </p>
          <p className="text-sm text-muted-foreground/80 mt-1">
            (Học mà thường xuyên ôn tập, chẳng cũng vui lắm sao?)
          </p>
        </div>
        <div className="absolute -top-5 -right-5 bg-card p-4 rounded-full shadow-md border">
            <MessageSquareQuote className="w-8 h-8 text-primary/80" />
        </div>
      </div>
    </div>
  );
};

export default HeroIllustration;