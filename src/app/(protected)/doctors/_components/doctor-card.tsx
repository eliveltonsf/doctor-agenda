"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { doctorsTable } from "@/db/schema";
import { formatCurrencyInCents } from "@/helpers/currency";
import { Calendar1Icon, Clock, DollarSignIcon } from "lucide-react";
import { getAvailability } from "../_helpers/availability";
interface DoctorCardProps {
  doctor: typeof doctorsTable.$inferSelect;
}

function DoctorCard({ doctor }: DoctorCardProps) {
  const doctorInitials = doctor.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const availability = getAvailability(doctor);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Avatar size="lg">
            <AvatarFallback>{doctorInitials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{doctor.name}</CardTitle>
            <CardDescription>{doctor.specialty}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-1">
        <Badge variant="outline">
          <Calendar1Icon className="mr-1" />
          {availability.from.format("dddd")} - {availability.to.format("dddd")}
        </Badge>
        <Badge variant="outline">
          <Clock className="mr-1" />
          {availability.from.format("HH:mm")} -{" "}
          {availability.to.format("HH:mm")}
        </Badge>
        <Badge variant="outline">
          <DollarSignIcon className="mr-1" />
          {formatCurrencyInCents(doctor.appointmentPriceInCents)}
        </Badge>
      </CardContent>
      <Separator />
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Ver detalhes</Button>
          </DialogTrigger>
        </Dialog>
      </CardFooter>
    </Card>
  );
}

export default DoctorCard;
