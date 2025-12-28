const shogiPieces = [
    {
        name: "Король",
        kanji: "王/玉",
        reading: "Ōshō / Gyokushō",
        move: "Ходит на 1 клетку в любом направлении",
        value: "∞",
        image: "images/king_move.png"
    },
    {
        name: "Ладья",
        kanji: "飛車",
        reading: "Hisha",
        move: "По горизонтали и вертикали на любое количество клеток",
        value: "10",
        image: "images/rook_move.png"
    },
    {
        name: "Слон",
        kanji: "角行",
        reading: "Kakugyō",
        move: "По диагонали на любое количество клеток",
        value: "8",
        image: "images/bishop_move.png"
    },
    {
        name: "Золотой генерал",
        kanji: "金将",
        reading: "Kinshō",
        move: "На 1 клетку: прямо, по диагонали вперёд и в стороны",
        value: "6",
        image: "images/gold_general_move.png"
    },
    {
        name: "Серебряный генерал",
        kanji: "銀将",
        reading: "Ginshō",
        move: "На 1 клетку: по диагонали и прямо вперёд",
        value: "5",
        image: "images/silver_general_move.png"
    },
    {
        name: "Конь",
        kanji: "桂馬",
        reading: "Keima",
        move: "Ходит буквой 'Г' вперёд (2 клетки вперёд + 1 в сторону)",
        value: "4",
        image: "images/knight_move.png"
    },
    {
        name: "Копьё",
        kanji: "香車",
        reading: "Kyōsha",
        move: "По вертикали вперёд на любое количество клеток",
        value: "3",
        image: "images/lance_move.png"
    },
    {
        name: "Пешка",
        kanji: "歩兵",
        reading: "Fuhyō",
        move: "На 1 клетку вперёд",
        value: "1",
        image: "images/pawn_move.png"
    }
];
