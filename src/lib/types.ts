export type RemainingTime = {
  hours: number;
  minutes: number;
  isPast: boolean;
};

export type LeaveStatus = {
  leaveTime: string;
  remaining: RemainingTime;
};
