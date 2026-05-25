"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatDate } from "@/lib/utils";
import { Briefcase, Calendar, Clock, FileText, Mail, Phone } from "lucide-react";

const STATUS_MAP = {
  pending: { label: "Pending", className: "bg-amber-500/10 text-amber-600" },
  approved: { label: "Approved", className: "bg-green-500/10 text-green-600" },
  rejected: { label: "Rejected", className: "bg-destructive/10 text-destructive" },
};

export default function ApplicationDetailSheet({ application, open, onOpenChange, onApprove, onReject }) {
  if (!application) return null;

  const statusStyle = STATUS_MAP[application.status] || STATUS_MAP.pending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent open={open} className="sm:max-w-125 overflow-y-auto px-4">
        <SheetHeader className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <SheetTitle className="text-xl">{application.name}</SheetTitle>
            <Badge className={statusStyle.className}>{statusStyle.label}</Badge>
          </div>
          <SheetDescription>Job application details</SheetDescription>
        </SheetHeader>

        <div className="space-y-6">
          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Contact Information</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{application.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{application.phone || "—"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Applied {formatDate(application.createdAt)}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Position & Experience */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Position Details</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium capitalize">{application.position}</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                <span>{application.experience || "Not specified"}</span>
              </div>
            </div>
          </div>

          {/* Skills */}
          {application.skills?.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {application.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary" className="capitalize">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Cover Letter */}
          {application.coverLetter && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Cover Letter</h4>
                <p className="text-sm whitespace-pre-wrap">{application.coverLetter}</p>
              </div>
            </>
          )}

          {/* Resume */}
          {application.resumeUrl && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Resume</h4>
                <Button variant="outline" size="sm" asChild>
                  <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer">
                    <FileText className="h-4 w-4 mr-2" />
                    View Resume
                  </a>
                </Button>
              </div>
            </>
          )}

          {/* Admin Notes */}
          {application.notes && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Admin Notes</h4>
                <p className="text-sm whitespace-pre-wrap">{application.notes}</p>
              </div>
            </>
          )}

          {/* Reviewed By */}
          {application.reviewedBy && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">Reviewed By</h4>
                <p className="text-sm">{application.reviewedBy.name}</p>
              </div>
            </>
          )}

          {/* Actions */}
          {application.status === "pending" && (
            <>
              <Separator />
              <div className="flex gap-3 pt-2">
                <Button className="flex-1" onClick={() => onApprove?.(application)}>
                  Approve
                </Button>
                <Button variant="destructive" className="flex-1" onClick={() => onReject?.(application)}>
                  Reject
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
