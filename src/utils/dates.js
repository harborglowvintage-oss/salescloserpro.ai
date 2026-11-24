/**
 * SalesCloserPro - date helpers
 * Copyright (c) 2026 LLMadvisor ai LLC
 * Licensed under Apache-2.0
 *
 * Calendar dates (valid-until, follow-ups) are stored as local 'yyyy-MM-dd' strings so a
 * date never shifts across time zones; timestamps (createdAt, sentAt) stay ISO strings.
 */

import { format, parseISO, addDays as addDaysFns, differenceInCalendarDays } from 'date-fns'

const toDate = (d) => (typeof d === 'string' && d.length === 10 ? parseISO(d) : d ? new Date(d) : new Date())

/** 'yyyy-MM-dd' or ISO timestamp → "March 4, 2026" */
export const longDate = (d) => format(toDate(d), 'MMMM d, yyyy')

/** "Mar 4" */
export const shortDate = (d) => format(toDate(d), 'MMM d')

/** Local calendar date as 'yyyy-MM-dd'. */
export const isoDay = (d = new Date()) => format(toDate(d), 'yyyy-MM-dd')

export const addDays = (d, n) => isoDay(addDaysFns(toDate(d), n))

/** Whole calendar days from today to d (negative = in the past). */
export const daysFromToday = (d) => differenceInCalendarDays(toDate(d), new Date())
