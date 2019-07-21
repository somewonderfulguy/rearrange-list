import React, {useState, useCallback} from 'react'
import update from 'immutability-helper'

import Card from './Card'
import List from './constants/List'

const style = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '90%'
}

const App = () => {
  const [cards, setCards] = useState(List)
  const [arrangeIndex, setArrangeIndex] = useState(null)

  const moveCard = useCallback(
    (dragIndex, hoverIndex) => {
      // copy/paste rearrange in state - do not trust this code
      const dragCard = cards[dragIndex]
      setCards(
        update(cards, {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]]
        })
      )
    }, [cards]
  )

  const preMove = (hoverIndex) => {
    setArrangeIndex(hoverIndex)
  }

  return (
    <div style={style}>
      <div style={{width: 400}}>
        {cards.map((card, i) => (
          <Card
            key={card.id}
            id={card.id}
            text={card.text}
            index={i}
            moveCard={moveCard}
            preMove={preMove}
            arrangeIndex={arrangeIndex}
          />
        ))}
      </div>
    </div>
  )
}

export default App