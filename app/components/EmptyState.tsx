interface EmptyStateProps {
  icon?: string;
  message?: string;
}

export default function EmptyState({ icon = '📭', message = 'No items found' }: EmptyStateProps) {
  return (
    <div className="text-center py-16 animate-scale-in">
      <div className="text-4xl mb-4">{icon}</div>
      <p className="text-gray-500">{message}</p>
    </div>
  );
}