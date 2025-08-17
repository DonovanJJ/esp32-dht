export const SelectedTimeRangeConfig = {
  FifteenMinutes: {
    timeInterval: 60 * 1000,
    timeRange: 15 * 60 * 1000,
    columnCount: 15,
    display: "15 Minutes"
  },
  OneHour: {
    timeInterval: 60 * 1000,
    timeRange: 60 * 60 * 1000,
    columnCount: 60,
    display: "1 Hour"
  },
  OneDay: {
    timeInterval: 60 * 60 * 1000,
    timeRange: 24 * 60 * 60 * 1000,
    columnCount: 24,
    display: "1 Day"
  },
  SevenDays: {
    timeInterval: 24 * 60 * 60 * 1000,
    timeRange: 7 * 24 * 60 * 60 * 1000,
    columnCount: 7,
    display: "7 Days"
  }
}