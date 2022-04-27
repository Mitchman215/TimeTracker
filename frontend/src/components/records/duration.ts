function secondsToDuration(seconds: number): string {
  // calculate days
  const days = Math.floor(seconds / 86400)
  seconds -= days * 86400

  // calculate hours
  const hours = Math.floor(seconds / 3600) % 24
  seconds -= hours * 3600

  // calculate minutes
  const minutes = Math.ceil(seconds / 60) % 60

  let difference = ''
  if (days > 0) {
    difference += days === 1 ? `${days} day, ` : `${days} days, `
  }

  if (hours > 0) {
    difference += hours === 1 ? `${hours} hr, ` : `${hours} hrs, `
  }

  difference += hours === 1 ? `${minutes} min` : `${minutes} mins`

  return difference
}

/**
 * Computes a pretty string of the difference between two dates
 * @param startDate A date to start the time record
 * @param finishDate A date to finish the time record
 * @returns A string representing the time elapsed between the two dates in days, hrs, mins
 */
function datesToDuration(startDate: Date, finishDate: Date): string {
  const diffInSeconds =
    Math.abs(finishDate.getTime() - startDate.getTime()) / 1000
  return secondsToDuration(diffInSeconds)
}

export { datesToDuration, secondsToDuration }
