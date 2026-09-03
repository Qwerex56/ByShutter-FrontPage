import { toRot, fromRot, toX, toY, fromX, fromY } from './config'

const randomAngle = () => {
  const raw = Math.random() * 360 - 180
  return raw * 0.08 // ~14 deg
}

const randomOffset = () => {
  return Math.random() * 16 - 8
}

const updateZIndex = (card: HTMLElement) => {
  let zIndex = parseInt(card.style.zIndex);
  zIndex = zIndex + 1 > 3 ? 1 : zIndex + 1

  card.style.zIndex = zIndex.toString();
}

const updateZIndexAll = (cards: HTMLElement[]) => {
  cards.forEach((card) => {
    updateZIndex(card)
  })
}

const isAnyAnimationPlaying = (cards: Iterable<HTMLElement>) =>
  [...cards].some((card) => card.classList.contains('animate'))

const isTopCard = (card: HTMLElement) => card.style.zIndex === '3'

// Init section

export const initializeCardsProperties = (cards: HTMLElement[]) => {
let z = 3;
  cards.forEach(card => {
  card.style.zIndex = (z--).toString()
  console.log(card.style.zIndex);

  card.style.setProperty(toRot, `${randomAngle()}deg`)
  card.style.setProperty(fromRot, `${randomAngle()}deg`)

  // Travel length
  card.style.setProperty(toX, `${200}px`)
  card.style.setProperty(toY, `${0}px`)

  // random offset on travel
  card.style.setProperty(fromX, `${randomOffset()}px`)
  card.style.setProperty(fromY, `${randomOffset()}px`)
});

}

// Events section
export const setupAnimationEvents = (cards: HTMLElement[]) => {
  cards.forEach((card) => {
    card.addEventListener('animationstart', (ev) => {})

    card.addEventListener('animationend', (ev) => {
      if (ev.animationName === 'shuffle') {
        card.style.setProperty(fromX, `${card.style.getPropertyValue(toX)}`)
        card.style.setProperty(fromY, `${card.style.getPropertyValue(toY)}`)
        card.style.setProperty(fromRot, `${card.style.getPropertyValue(toRot)}`)

        card.style.setProperty(toX, `${Math.random() * 32 - 16}px`)
        card.style.setProperty(toY, `${Math.random() * 32 - 16}px`)
        card.style.setProperty(toRot, `${Math.random() * 12 - 6}deg`)

        updateZIndexAll(cards)
      }

      if (ev.animationName === 'shuffle-back') {
        card.classList.remove('animate')

        const hX = card.style.getPropertyValue(fromX)
        const hY = card.style.getPropertyValue(fromY)
        const hR = card.style.getPropertyValue(fromRot)

        card.style.setProperty(fromX, `${card.style.getPropertyValue(toX)}`)
        card.style.setProperty(fromY, `${card.style.getPropertyValue(toY)}`)
        card.style.setProperty(fromRot, `${card.style.getPropertyValue(toRot)}`)

        card.style.setProperty(toX, `${hX}`)
        card.style.setProperty(toY, `${hY}`)
        card.style.setProperty(toRot, `${hR}`)
      }
    })

    card.addEventListener('click', (ev) => {
      if (isAnyAnimationPlaying(cards)) {
        return
      };
      if(!isTopCard(card)) {
        return;
      }

      card.classList.add('animate')
    })
  })
}
