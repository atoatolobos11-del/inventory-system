/** Tiny className joiner — keeps conditional classes readable. */
export default function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}