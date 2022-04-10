import { useState, useEffect } from 'react';
import Card from './components/Card';
import Header from './components/Header';
import useAppBadge from './hooks/useAppBadge';
import shuffle from './utilities/shuffle';

function App() {
  const [wins, setWins] = useState(0); // Win streak
  const [cards, setCards] = useState(shuffle);
  const [pickOne, setPickOne] = useState(null); // First selection
  const [pickTwo, setPickTwo] = useState(null); // Second selection
  const [disabled, setDisabled] = useState(false); // Delay handler
  const [setBadge, clearBadge] = useAppBadge();

  const handleClick = (card) => {
    if (!disabled) {
      pickOne ? setPickTwo(card): setPickOne(card);
    }
  }

  const handleTurn = () => {
    setPickOne(null);
    setPickTwo(null);
    setDisabled(false);
  };

  const handleNewGame = () => {
    setWins(0);
    handleTurn();
    setCards(shuffle);
    clearBadge();
  };

  useEffect(() => {
    let pickTimer;

    if (pickOne && pickTwo) {
      // Check if the cards the same
      if (pickOne.image === pickTwo.image) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.image === pickOne.image) {
              return { ...card, matched: true }
            } else {
              // No match
              return card;
            }
          })
        })
        handleTurn();
      } else {
        setDisabled(true);

        pickTimer = setTimeout(() => {
          handleTurn();
        }, 1000);
      }
    }

    return () => {
      clearTimeout(pickTimer);
    }

  }, [cards, pickOne, pickTwo])

  // If player found all matches, handle accordingly
  useEffect(() => {
    // Check for any remaining cards matches
    const checkWin = cards.filter((card) => !card.matched);

    // All matches made, handle win/badge counters
    if (cards.length && checkWin.length < 1) {
      console.log('You win!');
      setWins(wins + 1);
      handleTurn();
      setBadge();
      setCards(shuffle);
    }
  }, [cards, wins, setBadge])

  return (
    <>
      <Header handleNewGame={handleNewGame} wins={wins} />

      <div className="grid">
        {cards.map((card, idx) => {
          const { image, matched } = card;

          return (
            <Card
              key={idx}
              card={card}
              image={image}
              selected={card === pickOne || card === pickTwo || matched}
              onClick={() => handleClick(card)}
            />
          )
        })}
      </div>

    </>
  );
}

export default App;
