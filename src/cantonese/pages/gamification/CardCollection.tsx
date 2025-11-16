import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useGamification } from '@/cantonese/hooks/useGamification';
import {
  ArrowLeft,
  Sparkles,
  Lock,
  Package,
  Star,
  Zap,
  Gift,
  Trophy,
  Crown,
  Loader2,
} from 'lucide-react';
import { useSession } from '@/cantonese/components/providers/SessionContextProvider';
import confetti from 'canvas-confetti';

interface VocabCard {
  id: string;
  hanzi: string;
  pinyin: string;
  meaning: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  collected: boolean;
}

interface CardPack {
  id: string;
  name: string;
  description: string;
  cost: number;
  cardCount: number;
  icon: string;
  color: string;
}

const rarityColors = {
  common: 'bg-gray-400',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-yellow-500',
};

const rarityEmojis = {
  common: '⚪',
  rare: '🔵',
  epic: '🟣',
  legendary: '🌟',
};

// Mock card database
const allCards: VocabCard[] = [
  // Common cards
  { id: '1', hanzi: '你好', pinyin: 'nǐ hǎo', meaning: 'Xin chào', rarity: 'common', collected: false },
  { id: '2', hanzi: '谢谢', pinyin: 'xiè xiè', meaning: 'Cảm ơn', rarity: 'common', collected: false },
  { id: '3', hanzi: '再见', pinyin: 'zài jiàn', meaning: 'Tạm biệt', rarity: 'common', collected: false },
  { id: '4', hanzi: '吃饭', pinyin: 'chī fàn', meaning: 'Ăn cơm', rarity: 'common', collected: false },
  { id: '5', hanzi: '喝水', pinyin: 'hē shuǐ', meaning: 'Uống nước', rarity: 'common', collected: false },

  // Rare cards
  { id: '6', hanzi: '学习', pinyin: 'xué xí', meaning: 'Học tập', rarity: 'rare', collected: false },
  { id: '7', hanzi: '朋友', pinyin: 'péng yǒu', meaning: 'Bạn bè', rarity: 'rare', collected: false },
  { id: '8', hanzi: '学校', pinyin: 'xué xiào', meaning: 'Trường học', rarity: 'rare', collected: false },
  { id: '9', hanzi: '老师', pinyin: 'lǎo shī', meaning: 'Giáo viên', rarity: 'rare', collected: false },

  // Epic cards
  { id: '10', hanzi: '聪明', pinyin: 'cōng míng', meaning: 'Thông minh', rarity: 'epic', collected: false },
  { id: '11', hanzi: '勇敢', pinyin: 'yǒng gǎn', meaning: 'Dũng cảm', rarity: 'epic', collected: false },
  { id: '12', hanzi: '美丽', pinyin: 'měi lì', meaning: 'Đẹp', rarity: 'epic', collected: false },

  // Legendary cards
  { id: '13', hanzi: '一帆风顺', pinyin: 'yī fān fēng shùn', meaning: 'Thuận buồm xuôi gió', rarity: 'legendary', collected: false },
  { id: '14', hanzi: '龙马精神', pinyin: 'lóng mǎ jīng shén', meaning: 'Tinh thần rồng ngựa', rarity: 'legendary', collected: false },
];

const cardPacks: CardPack[] = [
  {
    id: '1',
    name: 'Gói Cơ Bản',
    description: 'Chứa 3 thẻ từ vựng ngẫu nhiên',
    cost: 0,
    cardCount: 3,
    icon: '📦',
    color: 'from-gray-400 to-gray-600',
  },
  {
    id: '2',
    name: 'Gói Bạc',
    description: 'Chứa 5 thẻ, tăng tỷ lệ rare',
    cost: 100,
    cardCount: 5,
    icon: '🎁',
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: '3',
    name: 'Gói Vàng',
    description: 'Chứa 10 thẻ, đảm bảo ít nhất 1 epic',
    cost: 250,
    cardCount: 10,
    icon: '🎀',
    color: 'from-purple-400 to-purple-600',
  },
  {
    id: '4',
    name: 'Gói Kim Cương',
    description: 'Chứa 15 thẻ, đảm bảo 1 legendary',
    cost: 500,
    cardCount: 15,
    icon: '💎',
    color: 'from-yellow-400 to-yellow-600',
  },
];

export default function CantoneseCardCollection() {
  const { session } = useSession();
  const { userProgress, isLoading, addXP } = useGamification();
  const [collectedCards, setCollectedCards] = useState<VocabCard[]>([]);
  const [openingPack, setOpeningPack] = useState(false);
  const [revealedCards, setRevealedCards] = useState<VocabCard[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Simulate XP as currency (in real app would be separate)
  const playerXP = userProgress?.total_xp || 0;

  const getRandomCards = (count: number, guaranteedRarity?: 'rare' | 'epic' | 'legendary'): VocabCard[] => {
    const results: VocabCard[] = [];

    // Add guaranteed card if specified
    if (guaranteedRarity) {
      const guaranteedPool = allCards.filter(c => c.rarity === guaranteedRarity);
      if (guaranteedPool.length > 0) {
        const randomCard = guaranteedPool[Math.floor(Math.random() * guaranteedPool.length)];
        results.push({ ...randomCard });
        count--;
      }
    }

    // Fill remaining with weighted random
    for (let i = 0; i < count; i++) {
      const rand = Math.random();
      let rarity: 'common' | 'rare' | 'epic' | 'legendary';

      if (rand < 0.6) rarity = 'common';
      else if (rand < 0.85) rarity = 'rare';
      else if (rand < 0.97) rarity = 'epic';
      else rarity = 'legendary';

      const pool = allCards.filter(c => c.rarity === rarity);
      if (pool.length > 0) {
        const randomCard = pool[Math.floor(Math.random() * pool.length)];
        results.push({ ...randomCard });
      }
    }

    return results;
  };

  const handleOpenPack = (pack: CardPack) => {
    // Check if player has enough XP
    if (pack.cost > playerXP) {
      alert('Không đủ XP để mở gói này!');
      return;
    }

    setOpeningPack(true);
    setShowResults(false);

    // Deduct XP (in real app)
    // addXP?.(-pack.cost);

    // Generate cards based on pack type
    let cards: VocabCard[];
    if (pack.id === '4') {
      cards = getRandomCards(pack.cardCount, 'legendary');
    } else if (pack.id === '3') {
      cards = getRandomCards(pack.cardCount, 'epic');
    } else if (pack.id === '2') {
      cards = getRandomCards(pack.cardCount, 'rare');
    } else {
      cards = getRandomCards(pack.cardCount);
    }

    // Simulate pack opening animation
    setTimeout(() => {
      setRevealedCards(cards);
      setOpeningPack(false);
      setShowResults(true);

      // Add to collection
      setCollectedCards(prev => {
        const newCards = [...prev];
        cards.forEach(card => {
          if (!newCards.find(c => c.id === card.id)) {
            newCards.push(card);
          }
        });
        return newCards;
      });

      // Confetti for epic or legendary
      if (cards.some(c => c.rarity === 'legendary' || c.rarity === 'epic')) {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.6 }
        });
      }
    }, 2000);
  };

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto p-4 md:p-8 flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="text-center py-12">
              <Lock className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Yêu cầu đăng nhập</h2>
              <p className="text-muted-foreground mb-6">
                Vui lòng đăng nhập để xem bộ sưu tập thẻ
              </p>
              <Button asChild>
                <Link to="/cantonese/login">Đăng nhập ngay</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto p-4 md:p-8 flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  // Pack Opening Animation
  if (openingPack) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-950 to-background">
        <main className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <Package className="w-32 h-32 text-purple-500 mx-auto mb-6 animate-bounce" />
            <h2 className="text-4xl font-bold text-white mb-4">Đang mở gói...</h2>
            <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto" />
          </div>
        </main>
      </div>
    );
  }

  // Show Revealed Cards
  if (showResults && revealedCards.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <main className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-2">🎉 Bạn nhận được!</h2>
            <p className="text-muted-foreground">
              Tổng cộng {revealedCards.length} thẻ mới
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {revealedCards.map((card, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden hover-scale bg-gradient-to-br ${
                  card.rarity === 'legendary' ? 'from-yellow-500/20 to-orange-500/20 border-yellow-500' :
                  card.rarity === 'epic' ? 'from-purple-500/20 to-pink-500/20 border-purple-500' :
                  card.rarity === 'rare' ? 'from-blue-500/20 to-cyan-500/20 border-blue-500' :
                  'from-gray-500/20 to-gray-700/20 border-gray-500'
                }`}
                style={{ animation: `slideIn 0.5s ease-out ${index * 0.1}s both` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <Badge className={rarityColors[card.rarity]}>
                      {rarityEmojis[card.rarity]} {card.rarity.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-5xl mb-3">{card.hanzi}</div>
                  <div className="text-sm text-muted-foreground mb-2">{card.pinyin}</div>
                  <div className="font-semibold">{card.meaning}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button onClick={() => {
              setShowResults(false);
              setRevealedCards([]);
            }} size="lg">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </div>
        </main>

        <style>{`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateY(30px) scale(0.9);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}</style>
      </div>
    );
  }

  // Main Collection View
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon">
              <Link to="/cantonese/gamification">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-purple-500" />
                Sưu Tập Thẻ
              </h1>
              <p className="text-muted-foreground mt-1">
                Thu thập và mở khóa các thẻ từ vựng độc đáo
              </p>
            </div>
          </div>

          {userProgress && (
            <Badge variant="outline" className="text-lg px-4 py-2 hidden md:flex">
              <Zap className="w-4 h-4 mr-2 text-yellow-500" />
              {userProgress.total_xp} XP
            </Badge>
          )}
        </div>

        {/* Collection Stats */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Bộ Sưu Tập Của Bạn</CardTitle>
            <CardDescription>
              Đã thu thập {collectedCards.length} / {allCards.length} thẻ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress
              value={(collectedCards.length / allCards.length) * 100}
              className="h-3"
            />
          </CardContent>
        </Card>

        {/* Card Packs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Package className="w-6 h-6" />
            Mua Gói Thẻ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cardPacks.map(pack => (
              <Card key={pack.id} className={`hover-scale bg-gradient-to-br ${pack.color} text-white border-0`}>
                <CardHeader>
                  <div className="text-6xl mb-3 text-center">{pack.icon}</div>
                  <CardTitle className="text-white text-center">{pack.name}</CardTitle>
                  <CardDescription className="text-gray-200 text-center">
                    {pack.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-3xl font-bold mb-2">
                    {pack.cost === 0 ? 'MIỄN PHÍ' : `${pack.cost} XP`}
                  </div>
                  <div className="text-sm opacity-90">
                    {pack.cardCount} thẻ
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-white text-black hover:bg-gray-100"
                    onClick={() => handleOpenPack(pack)}
                    disabled={pack.cost > playerXP}
                  >
                    {pack.cost > playerXP ? (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Không đủ XP
                      </>
                    ) : (
                      <>
                        <Gift className="mr-2 h-4 w-4" />
                        Mở gói
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Collected Cards Gallery */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            Thẻ Đã Thu Thập ({collectedCards.length})
          </h2>

          {collectedCards.length === 0 ? (
            <Card>
              <CardContent className="text-center py-16">
                <Sparkles className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4 animate-pulse" />
                <p className="text-muted-foreground text-lg">
                  Bạn chưa có thẻ nào. Hãy mở gói để bắt đầu thu thập!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {collectedCards.map(card => (
                <Card
                  key={card.id}
                  className={`hover-scale bg-gradient-to-br ${
                    card.rarity === 'legendary' ? 'from-yellow-500/20 to-orange-500/20 border-yellow-500' :
                    card.rarity === 'epic' ? 'from-purple-500/20 to-pink-500/20 border-purple-500' :
                    card.rarity === 'rare' ? 'from-blue-500/20 to-cyan-500/20 border-blue-500' :
                    'from-gray-500/20 to-gray-700/20 border-gray-500'
                  }`}
                >
                  <CardHeader className="pb-2">
                    <Badge className={`${rarityColors[card.rarity]} text-xs`}>
                      {rarityEmojis[card.rarity]}
                    </Badge>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="text-4xl mb-2">{card.hanzi}</div>
                    <div className="text-xs text-muted-foreground mb-1">{card.pinyin}</div>
                    <div className="text-sm font-semibold">{card.meaning}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
