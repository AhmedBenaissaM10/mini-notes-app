const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export const formatDate = (iso: string) => dateFormatter.format(new Date(iso));
