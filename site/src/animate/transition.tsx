import React from 'react';
import createSCC from 'react-scc'

enum ANIMATE_POS {
  UNMOUNTED = 'unmounted',
  ENTERING = 'entering',
  ENTERED = 'entered',
  EXITING = 'exiting'
}

export interface TransitionProps {
  /**
   * control visibility of component
   */
  in: boolean;
  /**
   * set animation duration (in milliseconds)
   */
  duration?: number;
  /**
   * enter transition
   */
  enterTransition?: string;
  /**
   * enter transition
   */
  exitTransition?: string;
  /**
   * className
   */
  className?: string;
}

interface State {
  duration: number;
  pos: ANIMATE_POS;
}

const Transition = createSCC<TransitionProps, State, { ref: (el: HTMLDivElement) => void }>({
  state: {
    duration: 300,
    pos: ANIMATE_POS.UNMOUNTED
  },
  displayName: 'Transition',
  defaultProps: {
    enterTransition: 'fadeIn',
    exitTransition: 'fadeOut',
  },
  controller: ({ props, state, onMount, afterUpdate, onDestroy }) => {
    let timer: any;
    let el: HTMLDivElement;

    state.set({
      duration: props.duration || 300,
      pos: ANIMATE_POS.UNMOUNTED,
    })

    onMount(() => {
      if (props.in) {
        state.update(curr => ({ ...curr, pos: ANIMATE_POS.ENTERING }))
        timer = setTimeout(() => {
          state.update(curr => ({ ...curr, pos: ANIMATE_POS.ENTERED }))
        }, state.currentValue.duration)
      }
    })

    afterUpdate((nextProps) => {
      if (!nextProps.in) {
        state.update(curr => ({ ...curr, pos: ANIMATE_POS.EXITING }))
        timer = setTimeout(() => {
          state.update(curr => ({ ...curr, pos: ANIMATE_POS.UNMOUNTED }))
        }, state.currentValue.duration)
      }
    })

    onDestroy(() => {
      clearTimeout(timer)
    })

    return {
      ref: (elm) => {
        el = elm
      },
    }
  },
  component: ({ children, enterTransition, exitTransition, state, ctrlValue, className }) => {
    if (state.pos === ANIMATE_POS.UNMOUNTED || !children) {
      return null
    }

    let transitionClass = state.pos === ANIMATE_POS.ENTERING ?
      enterTransition : state.pos === ANIMATE_POS.EXITING ?
      exitTransition : ''

    const combineClassNames = `${className || ''} ${transitionClass || ''}`.trim()

    return <div ref={ctrlValue.ref} className={combineClassNames === '' ? undefined : combineClassNames}>{React.cloneElement(children as any, { transitionState: state.pos })}</div>
  }
})

export default Transition