import { formatDistanceToNow, format } from 'date-fns';

export const formatTimeAgo = (dateString: string) => {
  try {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  } catch (error) {
    return 'just now';
  }
};

export const formatShortTime = (dateString: string) => {
  try {
    return format(new Date(dateString), 'h:mm a');
  } catch (error) {
    return '';
  }
};

export const formatCount = (count: number) => {
  if (count < 1000) return count.toString();
  if (count < 1000000) return `${(count / 1000).toFixed(1)}k`;
  return `${(count / 1000000).toFixed(1)}m`;
};
