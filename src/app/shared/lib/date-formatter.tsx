import { useFormatter } from "next-intl";

export default function DateFormatter({ date }: { date: Date }) {
   const format = useFormatter();

  return format.dateTime(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}