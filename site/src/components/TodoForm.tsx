import React from 'react';
import { createSCC, writable } from 'react-scc';

interface TodoFormProps {
  onSubmit?: (value: string) => void
}

interface ControllerValue {
  handleChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (evt: React.FormEvent<HTMLFormElement>) => void;
}

const state = writable('')

const TodoForm = createSCC<TodoFormProps, ControllerValue>({
  state,
  displayName: 'TodoForm',
  controller: ({ props }) => {
    return {
      handleChange: (evt) => {
        state.update(() => evt.target.value);
      },
      handleSubmit: (evt) => {
        evt.preventDefault();
        if (state.currentValue && props.onSubmit) {
          props.onSubmit(state.currentValue);
          state.set('');
        }
      }
    }
  },
  component: ({ ctrlValue }) => {
    return (
      <form className="todo-form" onSubmit={ctrlValue.handleSubmit}>
        <input type="text" placeholder="Type and press enter" value={state.currentValue} onChange={ctrlValue.handleChange} />
      </form>
    )
  }
})

export default TodoForm
