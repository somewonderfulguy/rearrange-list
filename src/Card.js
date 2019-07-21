import React, {useRef} from 'react'
import {useDrag, useDrop} from 'react-dnd'

import ItemTypes from './constants/ItemTypes'
import styles from './Card.module.css'

const style = {
  border: '1px dashed gray',
  padding: '1.5rem 1rem',
  backgroundColor: 'white',
  cursor: 'move'
}

const Card = ({id, text, index, moveCard, preMove, arrangeIndex}) => {
  const ref = useRef(null)

  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop() {
      preMove(null)
    },
    hover(item, monitor) {
      if (!ref.current) {return}

      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {return}

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      // TODO - optimize checking
      if(dragIndex > hoverIndex) {
        // HOVER ABOVE!
        if(hoverClientY < hoverMiddleY) {
          preMove(hoverIndex - 1)
        } else {
          (hoverIndex + 1 === dragIndex) ? (
            preMove(null)
          ) : (
            preMove(hoverIndex)
          )
        }
        return
      } else {
        // HOVER BELOW!
        if(hoverClientY > hoverMiddleY) {
          preMove(hoverIndex)
        } else {
          (hoverIndex - 1 === dragIndex) ? (
            preMove(null)
          ) : (
            preMove(hoverIndex - 1)
          )
        }
        return
      }

      // Time to actually perform the action
      //moveCard(dragIndex, hoverIndex)
      //preMove(hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      //item.index = hoverIndex
    }
  })

  const [{isOver}, drop2] = useDrop({
    accept: ItemTypes.CARD,
    hover() {

    },
    drop() {
      preMove(null)
    },
    collect: monitor => ({
      isOver: monitor.isOver()
    })
  })

  const [{ isDragging }, drag] = useDrag({
    item: {type: ItemTypes.CARD, id, index},
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  // TODO - make more meaningful names
  const opacity = isDragging ? 0.3 : 1
  const height = isOver ? '35px' : '15px'

  drop(ref)

  //TODO - put separator in variable
  return (
    <>
      {(index === 0 && arrangeIndex === -1) && (
        <div ref={drop2} className={styles.separator} style={{height}}>
          <div />
        </div>
      )}

      <div ref={ref}>
        <div ref={drag} style={{...style, opacity}}>
          {text}
        </div>
      </div>

      {(index === arrangeIndex) && (
        <div ref={drop2} className={styles.separator} style={{height}}>
          <div />
        </div>
      )}
    </>
  )
}

export default Card