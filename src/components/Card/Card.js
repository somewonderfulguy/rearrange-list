import React, {useRef} from 'react'
import {useDrag, useDrop} from 'react-dnd'

import ItemTypes from '../../constants/ItemTypes'
import styles from './Card.module.css'

// TODO move to css module
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

      const hoverBoundingRect = ref.current.getBoundingClientRect()
      const rectWidth = hoverBoundingRect.right - hoverBoundingRect.left

      const hoverLeftQuarter = rectWidth / 4
      const hoverRightQuarter = rectWidth - rectWidth / 4
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      const clientOffset = monitor.getClientOffset()

      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      const hoverClientX = clientOffset.x - hoverBoundingRect.left

      // hover left
      if(hoverClientX < hoverLeftQuarter) {
        return
      }

      // hover right
      if(hoverClientX > hoverRightQuarter) {
        return
      }

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

  // TODO - separator as separate component?
  const [{separatorIsOver}, separatorDrop] = useDrop({
    accept: ItemTypes.CARD,
    drop: () => preMove(null),
    collect: monitor => ({separatorIsOver: monitor.isOver()})
  })

  const [{ isDragging }, drag] = useDrag({
    item: {type: ItemTypes.CARD, id, index},
    collect: monitor => ({
      isDragging: monitor.isDragging()
    })
  })

  // TODO - fix, when hover on separator immediately the animation is jumpy
  // TODO - fix, separator closes jumpy
  const horizontalSeparator = (
    <div ref={separatorDrop} className={styles.separator} style={{height: separatorIsOver ? '35px' : '15px'}}>
      <div />
    </div>
  )

  drop(ref)

  return (
    <>
      {(index === 0 && arrangeIndex === -1) && horizontalSeparator}

      <div ref={ref}>
        <div ref={drag} style={{...style, opacity: isDragging ? 0.3 : 1}}>
          {text}
        </div>
      </div>

      {(index === arrangeIndex) && horizontalSeparator}
    </>
  )
}

export default Card