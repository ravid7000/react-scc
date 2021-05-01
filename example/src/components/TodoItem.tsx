interface TotoItemProps {
  done: boolean;
  title: string;
  onClick?: () => void;
  onDelete?: () => void;
}

const TodoItem: React.FC<TotoItemProps> = ({ done, title, onClick, onDelete }) => {
  return (
    <div className={`todo-item${done ? ' done' : ''}`}>
      <div className="todo-checkbox" onClick={onClick} />
      <div className="todo-title">{title}</div>
      <button className="todo-btn" onClick={onDelete}>D</button>
    </div>
  )
}

export default TodoItem
