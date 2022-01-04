import { useEffect, useRef, useState } from 'react'
import Card from './Card'
import '../scss/board.scss'


type BoardProps = {
  setMoves: React.Dispatch<React.SetStateAction<number>>
  finishGameCallback: () => void
  cardIds: Array<number>
}

function Board(props: BoardProps) {
  const [openCards, setOpenCards] = useState<Array<number>>([]);
  const [clearedCards, setClearedCards] = useState<Array<number>>([]);
  const [shouldDisableAllCards, setShouldDisableAllCards] = useState<boolean>(false);
  const timeout = useRef<NodeJS.Timeout>(setTimeout(()=>{}));

  const disable = () => {
    setShouldDisableAllCards(true);
  };
  const enable = () => {
    setShouldDisableAllCards(false);
  };

  const checkCompletion = () => {
    if (clearedCards.length === props.cardIds.length) {
     props.finishGameCallback()
    }
  }

  const evaluate = () => {
    const [first, second] = openCards;
    enable();
    // Test if pour savoir si la premier carte est la meme que la deusieme
    if ((first % 6 + 1) === (second % 6 + 1)) {
      setClearedCards((prev) => [...prev, first, second]);
      setOpenCards([]);
      return;
    }
    // cacher la carte apres 500ms 
    timeout.current = setTimeout(() => {
      setOpenCards([]);
    }, 1000);
  }

  const handleCardClick = (id: number) => {
    if (openCards.length === 1) {
      // dans ce cas on selectionner une carte
      // le deplacement a terminer
      setOpenCards((prev) => [...prev, id]);
      props.setMoves((moves) => moves + 1)
      disable();
    } else {
      // en cas du premiere carte selectionner
      clearTimeout(timeout.current);
      setOpenCards([id]);
    }
  };

  useEffect(() => {
    let timeout: NodeJS.Timeout = setTimeout(()=>{});
    if (openCards.length === 2) {
      timeout = setTimeout(evaluate, 500);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [openCards]);

  useEffect(() => {
    checkCompletion();
  }, [clearedCards]);

  const checkIsFlipped = (id: number) => {
    return clearedCards.includes(id) || openCards.includes(id);
  };

  const checkIsInactive = (id: number) => {
    return clearedCards.includes(id)
  };

  return (
    <div className={'board'}>
      {props.cardIds.map(i => {
        return <Card
          key={i}
          image={`/images/${i % 6 + 1}.png`}
          id={i}
          isDisabled={shouldDisableAllCards}
          isInactive={checkIsInactive(i)}
          isFlipped={checkIsFlipped(i)}
          onClick={handleCardClick}
        />
      })}
    </div>
  )
}

export default Board