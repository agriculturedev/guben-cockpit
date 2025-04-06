/* eslint-disable no-extend-native */
import { format, formatISO } from "date-fns";

declare global {
  interface Date {
    /**
     * converts it to ISO date format.
     */
    toIsoDate(): string;

    /**
     * converts it to ISO timestamp format.
     */
    toIsoTimestamp(): string;

    /**
     * converts it to ISO time only format.
     */
    toIsoTimeOnly(): string;

    /**
     * format to dd/MM/yyyy
     */
    formatDate(): string;

    /**
     * format to dd/MM/yyyy HH:mm or dd/MM/yyyy HH:mm:ss
     * @param includeSeconds boolean
     */
    formatDateTime(includeSeconds?: boolean): string;

    /**
     * format to HH:mm or HH:mm:ss
     * @param includeSeconds boolean
     */
    formatTime(includeSeconds?: boolean): string;

    /**
     * Add minutes
     * @param amountOfMinutes number
     */
    addMinutes(amountOfMinutes: number): Date;

    /**
     * Add hours
     * @param amountOfHours number
     */
    addHours(amountOfHours: number): Date;

    /**
     * Add days
     * @param amountOfDays number
     */
    addDays(amountOfDays: number): Date;

    /**
     * Add months
     * @param amountOfMonths number
     */
    addMonths(amountOfMonths: number): Date;

    /**
     * Add years
     * @param amountOfYears number
     */
    addYears(amountOfYears: number): Date;

    /**
     * Add weeks
     * @param amountOfWeeks number
     */
    addWeeks(amountOfWeeks: number): Date;

    /**
     * Get the difference in days between this date and another date
     * @param otherDate Date
     */
    differenceInDays(otherDate: Date): number;

    /**
     * Get the start of the month of this date
     */
    startOfMonth(): Date;

    /**
     * Get the end of the month of this date
     */
    endOfMonth(): Date;
  }
}

Date.prototype.toIsoDate = function (): string {
  return formatISO(this, { representation: "date" });
};

Date.prototype.toIsoTimestamp = function (): string {
  return this.toISOString();
};

Date.prototype.toIsoTimeOnly = function (): string {
  return formatISO(this, { representation: "time" });
};

Date.prototype.formatDate = function (): string {
  return format(this, "dd.MM.yyyy");
};

Date.prototype.formatDateTime = function (includeSeconds: boolean = false): string {
  if (includeSeconds) {
    return format(this, "dd.MM.yyyy HH:mm:ss");
  }
  return format(this, "dd.MM.yyyy HH:mm");
};

Date.prototype.formatTime = function (includeSeconds: boolean = false): string {
  if (includeSeconds) {
    return format(this, "HH:mm:ss");
  }
  return format(this, "HH:mm");
};

Date.prototype.addMinutes = function (amountOfMinutes: number): Date {
  this.setMinutes(this.getMinutes() + amountOfMinutes);
  return this;
};

Date.prototype.addHours = function (amountOfHours: number): Date {
  this.setHours(this.getHours() + amountOfHours);
  return this;
};

Date.prototype.addDays = function (amountOfDays: number): Date {
  this.setDate(this.getDate() + amountOfDays);
  return this;
};

Date.prototype.addMonths = function (amountOfMonths: number): Date {
  this.setMonth(this.getMonth() + amountOfMonths);
  return this;
};

Date.prototype.addYears = function (amountOfYears: number): Date {
  this.setFullYear(this.getFullYear() + amountOfYears);
  return this;
};

Date.prototype.addWeeks = function (amountOfWeeks: number): Date {
  this.addDays(amountOfWeeks * 7);
  return this;
};

Date.prototype.differenceInDays = function (otherDate: Date): number {
  const oneDayInMs = 1000 * 60 * 60 * 24;
  const differenceInMs = Math.abs(this.getTime() - otherDate.getTime());
  return Math.floor(differenceInMs / oneDayInMs);
};

Date.prototype.startOfMonth = function (): Date {
  this.setDate(1);
  return this;
};

Date.prototype.endOfMonth = function (): Date {
  this.setMonth(this.getMonth() + 1);
  this.setDate(0); // the 0th day of the next month is the last day of the current month, because JS is weird
  return this;
};
