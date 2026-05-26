"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardCheck, LogIn, LogOut } from "lucide-react";

export function WorkerCard({ worker, onCheckIn, onCheckOut }) {
  const att = worker.attendance;
  const isCheckedIn = att && !att.outTime;
  const isComplete = att && att.inTime && att.outTime;

  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">{worker.workerName}</CardTitle>
          {isComplete ? (
            <Badge variant="secondary" className="text-xxs">
              <ClipboardCheck size={12} className="mr-1" />
              Done
            </Badge>
          ) : isCheckedIn ? (
            <Badge className="bg-green-500/10 text-green-600 border-none text-xxs">Active</Badge>
          ) : (
            <Badge variant="outline" className="text-xxs">Pending</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-1.5 text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Phone</span>
          <span className="font-medium text-foreground">{worker.phone || "\u2014"}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>NID</span>
          <span className="font-medium text-foreground">{worker.nid || "\u2014"}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Blood</span>
          <span className="font-medium text-foreground">{worker.bloodGroup || "\u2014"}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Salary</span>
          <span className="font-medium text-foreground">
            {worker.salary ? `\u09F3${worker.salary.toLocaleString()}` : "\u2014"}
          </span>
        </div>
        {att && (
          <>
            <hr className="my-2 border-border/60" />
            <div className="flex justify-between text-muted-foreground">
              <span>In Time</span>
              <span className="font-medium text-foreground">{att.inTime || "\u2014"}</span>
            </div>
            {att.outTime && (
              <div className="flex justify-between text-muted-foreground">
                <span>Out Time</span>
                <span className="font-medium text-foreground">{att.outTime}</span>
              </div>
            )}
            {att.location && (
              <div className="flex justify-between text-muted-foreground">
                <span>Location</span>
                <span className="font-medium text-foreground truncate max-w-[140px]">{att.location}</span>
              </div>
            )}
          </>
        )}
        <div className="pt-3">
          {isComplete ? (
            <Button variant="outline" size="sm" className="w-full" disabled>
              <ClipboardCheck size={14} className="mr-1.5" />
              Completed
            </Button>
          ) : isCheckedIn ? (
            <Button size="sm" className="w-full" onClick={() => onCheckOut(worker)}>
              <LogOut size={14} className="mr-1.5" />
              Check Out
            </Button>
          ) : (
            <Button size="sm" className="w-full" onClick={() => onCheckIn(worker)}>
              <LogIn size={14} className="mr-1.5" />
              Check In
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
